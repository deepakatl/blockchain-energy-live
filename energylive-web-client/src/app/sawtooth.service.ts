import { Injectable } from '@angular/core';
import { createHash } from 'crypto-browserify';
import { CryptoFactory, createContext } from "sawtooth-sdk/signing";
import * as protobuf from 'sawtooth-sdk/protobuf';
import { Secp256k1PrivateKey } from 'sawtooth-sdk/signing/secp256k1';
import { TextEncoder, TextDecoder } from "text-encoding/lib/encoding";
import { Buffer } from 'buffer/';

@Injectable({
  providedIn: 'root'
})

export class SawtoothService {

  private signer: any;
  private publicKey: any;
  private address: any;
  public loggedInStatus: any;

  private FAMILY_NAME = 'cookiejar';
  private FAMILY_VERSION = '1.0';

  private encoder = new TextEncoder('utf8');
  private REST_API_BASE_URL = 'http://localhost:4200/api';
  private privateKeyHex = '66ad89d0ff29b0267fba72ea8d40ef7975e10f8acde8d50d20cdf56ba9599c5e';

  constructor() {
    this.loggedInStatus = this.setCurrentTransactor(this.privateKeyHex);
  }

  public clearLogin(): boolean {
    console.log("Cleared the login credentials");
    this.loggedInStatus = false;
    this.signer = null;
    this.publicKey = null;
    this.address = null;
    return true;
  }

  public setLogin(keyFileName, pkData): boolean {
    return this.setCurrentTransactor(pkData);
  }

  private hash(v) {
    return createHash('sha512').update(v).digest('hex');
  }


  public async sendData(action, value) {
    // Encode the payload
    const payload = this.getEncodedPayload(action, value);

    const transactionsList = this.getTransactionsList(payload);
    
    const batchList = this.getBatchList(transactionsList);

    // Send the batch to REST API
    await this.sendToRestAPI(batchList)
      .then((resp) => {
        console.log("sendToRestAPI response", resp);
      })
      .catch((error) => {
        console.log("error here", error);
      })
  }

  public async sendToRestAPI(batchListBytes): Promise<any> {
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
      return this.postBatchList(batchListBytes)
    }
  }

  private getDecodedData(responseJSON): string {
    const dataBytes = responseJSON.data;
    const decodedData = new Buffer(dataBytes, 'base64').toString();
    return decodedData;
  }

  // Get state of address from rest api
  private async getState(address): Promise<any> {
    const getStateURL = 'http://localhost:4200/api/state/' + address;
    const fetchOptions = { method: 'GET' };
    return window.fetch(getStateURL, fetchOptions);
  }

  // Post batch list to rest api
  private postBatchList(batchListBytes): Promise<any> {
    const postBatchListURL = 'http://localhost:4200/api/batches';
    const fetchOptions = {
      method: 'POST',
      body: batchListBytes,
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    }
    return window.fetch(postBatchListURL, fetchOptions);
  }


  private getEncodedPayload(action, values): any {
    const data = action + "," + values;
    console.log("data ="+data)
    return new TextEncoder('utf8').encode(data);
  }


  /*---Signing & Addressing-------------------------*/
  private setCurrentTransactor(pkInput): boolean {
    try {
      const context = createContext('secp256k1');
      const secp256k1pk = this.getSecp256k1pk(pkInput);

      this.signer = this.getSignerInstanceForPrivateKey(context, secp256k1pk);
      this.publicKey = this.getPublicKeyAsHex(this.signer);
      this.address = this.getAddressOfCurrentUser(this.FAMILY_NAME, this.publicKey);
    }
    catch (e) {
      console.log("Error in reading the key details", e);
      return false;
    }
    return true;
  }

  private getSecp256k1pk(pkInput: String): Secp256k1PrivateKey {
    let secp256k1pk;
    if(pkInput instanceof ArrayBuffer) {
      secp256k1pk = new Secp256k1PrivateKey(Buffer.from(pkInput, 0, 32));
    } else if(typeof(pkInput) == 'string') {
      secp256k1pk = Secp256k1PrivateKey.fromHex(pkInput);
    }
    return secp256k1pk;
  }

  private getSignerInstanceForPrivateKey(context, secp256k1pk): any {
    return new CryptoFactory(context).newSigner(secp256k1pk);
  }

  private getPublicKeyAsHex(signer): any {
    return signer.getPublicKey().asHex();
  }

  private getAddressOfCurrentUser(familyName, publicKey): any {
    let nameSpace = this.hash(familyName).substr(0, 6);
    let publicKeySpace = this.hash(publicKey).substr(0, 64);
    return (nameSpace + publicKeySpace);
  }

  /*------------------------------------*/

  /*-------------Creating transactions & batches--------------------*/
  private getTransactionsList(payload): any {
    // Create transaction header
    const transactionHeader = this.getTransactionHeaderBytes([this.address], [this.address], payload);
    // Create transaction
    const transaction = this.getTransaction(transactionHeader, payload);
    // Transaction list
    const transactionsList = [transaction];

    return transactionsList;
  }

  private getBatchList(transactionsList): any {
    // List of transaction signatures
    const transactionSignatureList = transactionsList.map((tx) => tx.headerSignature);

    // Create batch header
    const batchHeader = this.getBatchHeaderBytes(transactionSignatureList);
    // Create the batch
    const batch = this.getBatch(batchHeader, transactionsList);
    // Batch List
    const batchList = this.getBatchListBytes([batch]);

    return batchList;
  }

  private getTransactionHeaderBytes(inputAddressList, outputAddressList, payload): any {
    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
      familyName: this.FAMILY_NAME,
      familyVersion: this.FAMILY_VERSION,
      inputs: inputAddressList,
      outputs: outputAddressList,
      signerPublicKey: this.publicKey,
      batcherPublicKey: this.publicKey,
      dependencies: [],
      payloadSha512: this.hash(payload),
      nonce: (Math.random() * 1000).toString()
    }).finish();

    return transactionHeaderBytes;
  }

  private getTransaction(transactionHeaderBytes, payloadBytes): any {
    const transaction = protobuf.Transaction.create({
      header: transactionHeaderBytes,
      headerSignature: this.signer.sign(transactionHeaderBytes),
      payload: payloadBytes
    });

    return transaction;
  }

  private getBatchHeaderBytes(transactionSignaturesList): any {
    const batchHeader = protobuf.BatchHeader.encode({
      signerPublicKey: this.publicKey,
      transactionIds: transactionSignaturesList
    }).finish();

    return batchHeader;
  }

  private getBatch(batchHeaderBytes, transactionsList): any {
    const batch = protobuf.Batch.create({
      header: batchHeaderBytes,
      headerSignature: this.signer.sign(batchHeaderBytes),
      transactions: transactionsList
    });

    return batch;
  }

  private getBatchListBytes(batchesList): any {
    const batchListBytes = protobuf.BatchList.encode({
      batches: batchesList
    }).finish();

    return batchListBytes;
  }
  /*--------------------------------------*/

}
