var fs = require('fs');
var {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1');
var { CryptoFactory, createContext } = require("sawtooth-sdk/signing");


class PrivateKeyUtil{
    
    constructor(file){
	if(file === null){
		this.file = "privatekey.pem";
	}else{
        	this.file = file;
	}
    }

    static getPrivateKeyFromString(content){
        let privateKey =  Secp256k1PrivateKey.fromHex(content);
        return privateKey;
    }

    getPrivateKey(){
        let contents = fs.readFileSync(this.file , 'hex');
        console.log(contents);
        //var keyBuffer = new Buffer(contents, 'hex');
        let privateKey =  Secp256k1PrivateKey.fromHex(contents);
        return privateKey;
    }
    getRandomPK(){
        const context = createContext('secp256k1');
        const privateKey = context.newRandomPrivateKey();
        console.log(privateKey);
	    let privateKeyHex = Secp256k1PrivateKey.fromHex(privateKey.asBytes());
	    console.log("Hex =" + privateKeyHex);
        return privateKey;
    }

    writeRandomPK(){
        const context = createContext('secp256k1');
        const privateKey = context.newRandomPrivateKey();
        console.log(privateKey);
	let privateKeyHex = Secp256k1PrivateKey.fromHex(privateKey.asBytes());
	console.log("Hex =" + privateKeyHex);
        fs.writeFile(this.file, privateKey.asBytes() , function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        }); 
        
        
    }
}
// var pkr = new PrivateKeyReader();
// let key = pkr.getRandomPK();
// //let key = pkr.getPrivateKey();
// console.log(key);
// const context = createContext('secp256k1');
// let signer = new CryptoFactory(context).newSigner(key);
// let publicKey = signer.getPublicKey().asHex();

module.exports = PrivateKeyUtil;