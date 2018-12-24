/**
 * Copyright 2018 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------------------
 */

//works in strict mode
'use strict'

//require the handler module.
//declaring a constant variable.
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')


const {
  InvalidTransaction,
  InternalError
} = require('sawtooth-sdk/processor/exceptions')
const crypto = require('crypto')
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')

const _hash = (x) => crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 64)
var encoder = new TextEncoder('utf8')
var decoder = new TextDecoder('utf8')
const MIN_VALUE = 0
const CJ_FAMILY = 'energy'
const CJ_NAMESPACE = _hash(CJ_FAMILY).substring(0, 6)

//function to obtain the payload obtained from the client
const _decodeRequest = (payload) =>
  new Promise((resolve, reject) => {
    payload = payload.toString().split('~')
    if (payload.length === 2) {
      resolve({
        action: payload[0],
        quantity: payload[1]
      })
    }
   
    else {
      let reason = new InvalidTransaction('Invalid payload serialization')
      reject(reason)
    }
})

//function to display the errors
const _toInternalError = (err) => {
  console.log(" in error message block")
  let message = err.message ? err.message : err
  throw new InternalError(message)
}

//function to set the entries in the block using the "SetState" function
const _setEntry = (context, address, stateValue) => {
  let dataBytes = encoder.encode(stateValue)
  let entries = {
    [address]: dataBytes 
  }
  console.log("Going to set State = " + entries);
  return context.setState(entries)
}

//function to bake a cookie
const updateEnergyUnit =(context, address, quantity, userPK, tariffAddress)  => (possibleAddressValues) => {
  let stateValueRep = possibleAddressValues[address]
  let tariffState = possibleAddressValues[tariffAddress];
  const decodedTariff = decoder.decode(tariffState);
  console.log("Tariff = " + decodedTariff);
  let newCount = 0
  let count
  if (stateValueRep == null || stateValueRep == ''){
    console.log("No previous Energy data, creating new ... ")
    newCount = quantity
  }
  else{
    count = decoder.decode(stateValueRep);
    count = JSON.parse(count);
    console.log("Existing count "+ count.energyunit);
    console.log("Generated count "+ quantity.energyunit);
    quantity = JSON.parse(quantity);
    if(count.energyunit === null || count.energyunit === undefined || count.energyunit ===''){
      count.energyunit = "0";
    }

    if(quantity.energyunit === null || quantity.energyunit === undefined || quantity.energyunit ===''){
      quantity.energyunit = "0";
    }
    let balanceEnergy = parseInt(count.energyunit) + parseInt(quantity.energyunit);
    quantity.energyunit = balanceEnergy;
    //newCount = parseInt(count) + quantity;
    newCount = JSON.stringify(quantity);
    console.log("Energy balance in the account:"+newCount)
  }
  
  let strNewCount = newCount.toString()
  
  return _setEntry(context, address, strNewCount)
}

const updateTariff =(context, address, tariff, userPK)  => (possibleAddressValues) => {
  let tariffString = JSON.stringify(tariff);
  console.log("Update Tariff = " + tariffString);
  return _setEntry(context, address, tariffString)
}


class EnergyUnitHandler extends TransactionHandler{
  constructor(){
    super(CJ_FAMILY,['1.0'],[CJ_NAMESPACE])
  }
  apply(transactionProcessRequest, context){
    return _decodeRequest(transactionProcessRequest.payload)
    .catch(_toInternalError)
    .then((update) => {
    let header = transactionProcessRequest.header
    let userPublicKey = header.signerPublicKey
    let action = update.action
    if (!update.action) {
      throw new InvalidTransaction('Action is required')
    }
    let quantity = update.quantity
    let energyJson = JSON.parse(quantity);
    console.log("Generated Energy " + quantity);
    if (quantity === null || quantity === undefined) {
      throw new InvalidTransaction('Value is required')
    }
   

    // Select the action to be performed
    console.log("Action EnergyHandler =" + update.action);
    let actionFn
    if (update.action === 'update') { 
      actionFn = updateEnergyUnit
    }else if(update.action === 'consume'){

    }else if(update.action === 'tariff'){
      console.log("Going to update Tariff");
      actionFn = updateTariff;
    }
    
    else {	
      throw new InvalidTransaction(`Action must be update or consume `)		
    }

    // Get the current state, for the key's address:
    let Address = CJ_NAMESPACE + _hash(userPublicKey).slice(-64)
    //let tariffAddress = "79436d7c155b74af84209c0713a145f99ce4fa55dd8b7054162100b7b7bbf0870d8d73";
    let addressList = [Address];
    if(energyJson.tariffAddress !== undefined){
      addressList.push(energyJson.tariffAddress);
    }
    let getPromise = context.getState(addressList);
    // if (update.action == 'bake')
    //   getPromise = context.getState([Address])
    // else
    //   getPromise = context.getState([Address])
    let actionPromise = getPromise.then(
      actionFn(context,Address, quantity, userPublicKey, energyJson.tariffAddress)
      )
    
    return actionPromise.then(addresses => {
      if (addresses.length === 0) {
        throw new InternalError('State Error!')
      }  
    })

   
   
  })
 }
}

module.exports = EnergyUnitHandler
