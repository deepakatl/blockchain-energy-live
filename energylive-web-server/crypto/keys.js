const crypto = require('libp2p-crypto-secp256k1')

const msg = Buffer.from('Hello World')

crypto.generateKeyPair('secp256k1', 256, (err, key) => {
  // assuming no error, key will be an instance of Secp256k1PrivateKey
  // the public key is available as key.public
  key.sign(msg, (err, sig) => {
    key.public.verify(msg, sig, (err, valid) => {
      assert(valid, 'Something went horribly wrong')
    })
  })
})