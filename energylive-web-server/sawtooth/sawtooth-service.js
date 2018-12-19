var fetch = require('node-fetch');
var { CryptoFactory, createContext } = require("sawtooth-sdk/signing");

var { createHash } = require('crypto-browserify');

var protobuf  = require("sawtooth-sdk/protobuf");
var { TextEncoder, TextDecoder} =require("text-encoding/lib/encoding");
const cbor = require('cbor')
var {Buffer} =require('buffer/');
var {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1');



class SawtoothRestService{

    //REST_API_BASE_URL = 'http://localhost:4200/api';

    constructor(url) { 
        //const http =new HttpClient();
        this.REST_API_BASE_URL = url;
        this.FAMILY_NAME = 'user';
        this.FAMILY_VERSION = '1.0';
        
      }
    
     clearLogin(){
        console.log("Cleared the login credentials");
        this.signer = null;
        this.publicKey = null;
        this.userKeyAddress = null;
        return true;
      }
    
      hash(v) {
        return createHash('sha512').update(v).digest('hex');
      }
    
      async sendData(action, values, address, privateKey) {
        const context = createContext('secp256k1');
        //const privateKey = pkr.getPrivateKey();
        const signer = new CryptoFactory(context).newSigner(privateKey);
        const publicKey = signer.getPublicKey().asHex();
        // Creating address
        const userKeyAddress =  address + this.hash(publicKey).substr(0, 64);
        console.log("Address =" + userKeyAddress);
        // Encode the payload
        const payload = this.getEncodedData(action, values);
    
        const transactionsList = this.getTransactionsList(payload, userKeyAddress, signer, publicKey);
        const batchList = this.getBatchList(transactionsList, signer, publicKey);
    
        // Send the batch to REST API
        await this.sendToRestAPI(batchList)
          .then((resp) => {
            console.log("response here", resp);
          })
          .catch((error) => {
            console.log("error here", error);
          })
      }
    
      async sendToRestAPI(batchListBytes) {
        if (batchListBytes == null) {
          return this.getState(this.address)
            .then((response) => {
              return response.json();
            })
            .then((responseJson) => {
              return this.getDecodedData(responseJson)
            })
            .catch((error) => {
              console.error(error);
            });
        }
        else {
          console.log("new code");
          return this.postBatchList(batchListBytes)
        }
      }
    
      // Get state of address from rest api
      async getState(address){
        let getStateURL = this.REST_API_BASE_URL + '/state/' + address;
        const fetchOptions = { method: 'GET' };
        return fetch(getStateURL, fetchOptions);
      }
    
      // Post batch list to rest api
      postBatchList(batchListBytes){
        const postBatchListURL = this.REST_API_BASE_URL + '/batches';
        const fetchOptions = {
          method: 'POST',
          body: batchListBytes,
          headers: {
            'Content-Type': 'application/octet-stream'
          }
        }
        return fetch(postBatchListURL, fetchOptions);
      }
    
    
       getEncodedData(action, values) {
        const data = action + "~" + values[0];
        return new TextEncoder('utf8').encode(data);
        //return cbor.encode(data)
      }
    
       getDecodedData(responseJSON) {
        const dataBytes = responseJSON.data;
        const decodedData = new Buffer(dataBytes, 'base64').toString();
        return decodedData;
      }
    
      /*---Signing & Addressing-------------------------*/
       setCurrentTransactor(pkInput) {
        try {
          const context = createContext('secp256k1');
          const secp256k1pk = this.getSecp256k1pk(pkInput);
    
          this.signer = this.getSignerInstanceForKey(context, secp256k1pk);
          this.publicKey = this.getPublicKeyAsHex(this.signer);
          //this.address = this.getAddressOfCurrentUser(this.publicKey);
        }
        catch (e) {
          console.log("Error in reading the key details", e);
          return false;
        }
        return true;
      }
    
       getSecp256k1pk(pkInput) {
        let secp256k1pk;
        if(typeof(pkInput) == typeof(ArrayBuffer)) {
          secp256k1pk = new Secp256k1Key(Buffer.from(pkInput, 0, 32));
        } else if(typeof(pkInput) == typeof(String)) {
          secp256k1pk = new Secp256k1Key().fromHex(pkInput);
        }
        return secp256k1pk;
      }
    
       getSignerInstanceForKey(context, secp256k1pk) {
        return new CryptoFactory(context).newSigner(secp256k1pk);
      }
    
       getPublicKeyAsHex(signer) {
        return signer.getPublicKey().asHex();
      }
    
       getAddressOfCurrentUser(publicKey) {
        //let nameSpace = this.hash(familyName).substr(0, 6);
        let publicKeySpace = this.hash(publicKey).substr(0, 64);
        return (nameSpace + publicKeySpace);
      }
    
      /*------------------------------------*/
    
      /*-------------Creating transactions & batches--------------------*/
       getTransactionsList(payload, sawtoothAddress, signer, publicKey) {
        // Create transaction header
        //let sawtoothAddress = address + this.userKeyAddress;
        const transactionHeader = this.getTransactionHeaderBytes([sawtoothAddress], [sawtoothAddress], payload, publicKey);
        // Create transaction
        const transaction = this.getTransaction(transactionHeader, payload, signer);
        // Transaction list
        const transactionsList = [transaction];
    
        return transactionsList
      }
    
       getBatchList(transactionsList, signer, publicKey) {
        // List of transaction signatures
        const transactionSignatureList = transactionsList.map((tx) => tx.headerSignature);
    
        // Create batch header
        const batchHeader = this.getBatchHeaderBytes(transactionSignatureList, publicKey);
        // Create the batch
        const batch = this.getBatch(batchHeader, transactionsList, signer);
        // Batch List
        const batchList = this.getBatchListBytes([batch]);
    
        return batchList;
      }
    
       getTransactionHeaderBytes(inputAddressList, outputAddressList, payload, publicKey) {
        const transactionHeaderBytes = protobuf.TransactionHeader.encode({
          familyName: this.FAMILY_NAME,
          familyVersion: this.FAMILY_VERSION,
          payloadEncoding: 'application/json',
          inputs: inputAddressList,
          outputs: outputAddressList,
          signerPublicKey: publicKey,
          batcherPublicKey: publicKey,
          dependencies: [],
          payloadSha512: this.hash(payload),
          nonce: (Math.random() * 1000).toString()
        }).finish();
    
        return transactionHeaderBytes;
      }
    
       getTransaction(transactionHeaderBytes, payloadBytes, signer) {
        const transaction = protobuf.Transaction.create({
          header: transactionHeaderBytes,
          headerSignature: signer.sign(transactionHeaderBytes),
          payload: payloadBytes
        });
    
        return transaction;
      }
    
       getBatchHeaderBytes(transactionSignaturesList, publicKey) {
        const batchHeader = protobuf.BatchHeader.encode({
          signerPublicKey: publicKey,
          transactionIds: transactionSignaturesList
        }).finish();
    
        return batchHeader;
      }
    
       getBatch(batchHeaderBytes, transactionsList, signer) {
        const batch = protobuf.Batch.create({
          header: batchHeaderBytes,
          headerSignature: signer.sign(batchHeaderBytes),
          transactions: transactionsList
        });
    
        return batch;
      }
    
       getBatchListBytes(batchesList) {
        const batchListBytes = protobuf.BatchList.encode({
          batches: batchesList
        }).finish();
    
        return batchListBytes;
      }
}

module.exports = SawtoothRestService;

