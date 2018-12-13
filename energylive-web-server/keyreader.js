var fs = require('fs');
var {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1');
var { CryptoFactory, createContext } = require("sawtooth-sdk/signing");


class PrivateKeyReader{
    constructor(file){
        this.file = file;
    }

    getPrivateKey(){
        var contents = fs.readFileSync(this.file , 'hex');
        console.log(contents);
        //var keyBuffer = new Buffer(contents, 'hex');
        let privateKey =  Secp256k1PrivateKey.fromHex(contents);
        return privateKey;
    }
    writeRandomPK(){
        const context = createContext('secp256k1');
        const privateKey = context.newRandomPrivateKey();
        
        fs.writeFile("pk1.pem", privateKey.asBytes() , function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        }); 
        
        
    }
}
var pkr = new PrivateKeyReader('pk1.pem');
//pkr.writeRandomPK();
let key = pkr.getPrivateKey();
console.log(key);
const context = createContext('secp256k1');
let signer = new CryptoFactory(context).newSigner(key);
let publicKey = signer.getPublicKey().asHex();

module.exports = PrivateKeyReader;