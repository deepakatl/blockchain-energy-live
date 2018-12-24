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
const CJ_FAMILY = 'user'
const CJ_NAMESPACE = _hash(CJ_FAMILY).substring(0, 6)

//function to obtain the payload obtained from the client
const _decodeRequest = (payload) =>
  new Promise((resolve, reject) => {
    payload = payload.toString().split('~')
    if (payload.length === 2) {
      resolve({
        action: payload[0],
        user: payload[1]
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
const createUser =(context, address, user, userPK)  => (possibleAddressValues) => {
  let stateValueRep = possibleAddressValues[address]
  if (stateValueRep == null || stateValueRep == ''){
    console.log("No previous user, creating new user ")
    //newCount = user
  }
  else{
    let existingUser = decoder.decode(stateValueRep);
    console.log("Existing User "+ JSON.stringify(existingUser));
    console.log("Modified to User "+ user);
  }
  
  return _setEntry(context, address, user)
}

const authenticate =(context, address, user, userPK)  => (possibleAddressValues) => {
  let stateValueRep = possibleAddressValues[address]
  if (stateValueRep == null || stateValueRep == ''){
    console.log("No previous user, failed to authenticate");
    //newCount = user
  }
  else{
    let existingUser = decoder.decode(stateValueRep);
    console.log("Existing User "+ existingUser);
  }
  
  return address;
}


class UserHandler extends TransactionHandler{
  constructor(){
    super(CJ_FAMILY,['1.0'],[CJ_NAMESPACE])
  }
  apply(transactionProcessRequest, context){
    console.log("PayLoad = " + transactionProcessRequest.payload);
    return _decodeRequest(transactionProcessRequest.payload)
    .catch(_toInternalError)
    .then((update) => {
    let header = transactionProcessRequest.header
    let userPublicKey = header.signerPublicKey
    let action = update.action
    if (!update.action) {
      throw new InvalidTransaction('Action is required')
    }
    let user = update.user
    if (user === null || user === undefined) {
      throw new InvalidTransaction('Value is required')
    }


    // Select the action to be performed
    console.log("UserHandler action =" + update.action);
    let actionFn
    if (update.action === 'create') { 
      actionFn = createUser
    }else if(update.action === 'authenticate'){
      actionFn = authenticate;
    }
    else {	
      throw new InvalidTransaction(`Action must be create or authenticate`)		
    }

    // Get the current state, for the key's address:
    let Address = CJ_NAMESPACE + _hash(userPublicKey).slice(-64)
    let getPromise = context.getState([Address]);
    // if (update.action == 'bake')
    //   getPromise = context.getState([Address])
    // else
    //   getPromise = context.getState([Address])
    let actionPromise = getPromise.then(
      actionFn(context,Address, user, userPublicKey)
      )
    
    return actionPromise.then(addresses => {
      if (addresses.length === 0) {
        throw new InternalError('State Error!')
      }  
    })
  })
 }
}

module.exports = UserHandler
