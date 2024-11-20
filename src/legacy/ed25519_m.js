// const { decodeBase64, Keys, encodeBase64 } = require("casper-js-sdk");
const ed25519 = require('@noble/ed25519')
// const { ed25519 } = ed25519_modules
// const * = ed25519
// import * as utils from "../utils";
const myfunc = () => {
    //     private_key: 7e140fc23035c790e355205c5ff3b862012e1c5c2f44c75c56e0182bb6e05d4c
    // 1274527d0a9fec2c3fc963f355e08ac388f5c2930b1816b7286d1c75f4d98371
    // const privateKey = ed25519.utils.randomPrivateKey();
    // Uint8Array.fromHex("123")
    // const hexString2 =
    //     "7e140fc23035c790e355205c5ff3b862012e1c5c2f44c75c56e0182bb6e05d4c";

    // const hex2 = Uint8Array.from(Buffer.from(hexString2, "hex"));
    // console.log(hex2)

    const a = [
        166, 52, 43, 1, 4, 57, 142, 132,
        205, 246, 31, 183, 182, 159, 124, 106,
        117, 251, 161, 175, 137, 94, 222, 85,
        64, 18, 78, 161, 224, 190, 124, 96
    ]

    console.log(Buffer.from(a))

    const b = Buffer.from(a).toString(
        "hex"
    )
    console.log("b", b)
    // const privateKey = Uint8Array.from(Buffer.from(hexString2, "hex"));
    const privateKey = Uint8Array.from(a);
    const publicKey = ed25519.sync.getPublicKey(privateKey);
    // return ({
    //     secretKey: privateKey,
    //     publicKey
    // });
}
console.log((myfunc()))
const main = async () => {

    // const keyPairOfContract = utils.getKeyPairOfContract("/home/jh/keys/test1");
    // const privateKeyBase64 = encodeBase64(keyPairOfContract.privateKey);
    // console.log(privateKeyBase64);
    // privateKeyBase64 is the one user has
    // example: v5LgwY9o8e30eIDPMo82OaYPZAPgkLzN+5AHV1CR9thSg2xR6sBCBbt/6+nZLaUHWBeLC/OIvQPh2hMUe5nixQ==

    // const privateKeyBase64 = process.argv[1];
    const privateKeyBase64 = "5367c98b2864b7f717b39eac261f97dffc8fe0c51fcf9b584db5159506948265"
    const rawPrivKeyBytes = decodeBase64(privateKeyBase64);
    const privKey = Keys.Ed25519.parsePrivateKey(rawPrivKeyBytes, "raw");
    const pubKey = Keys.Ed25519.privateToPublicKey(privKey);
    const keyPair = new Keys.Ed25519({ publicKey: pubKey, secretKey: privKey });
    console.log(keyPair);
    let privatePem = keyPair.exportPrivateKeyInPem();
    console.log(privatePem);
    console.log("pk", Buffer.from(pubKey).toString(
        "hex"
    ))

    // 5367c98b2864b7f717b39eac261f97dffc8fe0c51fcf9b584db5159506948265
    // f9f970a202badf244b2337168a67ab8f0f40b08386712b510c4cf0a504184127
};
// main();
