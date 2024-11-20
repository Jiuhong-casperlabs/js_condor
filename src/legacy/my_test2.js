/**
 * @fileOverview CSPR JS SDK demo: Native transfers.
 */
// import { DeployUtil } from "casper-js-sdk";
const casperClientSDK = require('casper-js-sdk')
const { BigNumber } = require("@ethersproject/bignumber")
const { MaxUint256, NegativeOne, One, Zero } = require('@ethersproject/constants');
const { arrayify, concat } = require('@ethersproject/bytes');
const { DeployUtil, CLPublicKey,
    CasperClient,
    RuntimeArgs,
    CLAccountHash, CLKey, decodeBase16,
    CLU256, Keys } = casperClientSDK

const toBytesNumber = (bitSize, signed) => (
    value
) => {
    const val = BigNumber.from(value);

    // Check bounds are safe for encoding
    const maxUintValue = MaxUint256.mask(bitSize);

    if (signed) {
        const bounds = maxUintValue.mask(bitSize - 1); // 1 bit for signed
        if (val.gt(bounds) || val.lt(bounds.add(One).mul(NegativeOne))) {
            throw new Error('value out-of-bounds, value: ' + value);
        }
    } else if (val.lt(Zero) || val.gt(maxUintValue.mask(bitSize))) {
        throw new Error('value out-of-bounds, value: ' + value);
    }

    const valTwos = val.toTwos(bitSize).mask(bitSize);

    const bytes = arrayify(valTwos);

    if (valTwos.gte(0)) {
        // for positive number, we had to deal with paddings
        if (bitSize > 64) {
            // if zero just return zero
            if (valTwos.eq(0)) {
                return bytes;
            }
            // for u128, u256, u512, we have to and append extra byte for length
            return concat([bytes, Uint8Array.from([bytes.length])])
                .slice()
                .reverse();
        } else {
            // for other types, we have to add padding 0s
            const byteLength = bitSize / 8;
            return concat([
                bytes.slice().reverse(),
                new Uint8Array(byteLength - bytes.length)
            ]);
        }
    } else {
        return bytes.reverse();
    }
};
const { blake2b } = require('@noble/hashes/blake2b')
// import { blake2b } from '@noble/hashes/blake2b';
const main = async () => {
    let deploy = DeployUtil.deployFromJson({
        deploy: {
            "hash": "6ca0f9d59827b45920a43937a044949d3bfe67f08c9b740375f1816ff9785c0e",
            "header": {
                "account": "010068920746ecf5870e18911ee1fc5db975e0e97fffcbbf52f5045ad6c9838d2f",
                "timestamp": "2024-11-17T23:22:15.313Z",
                "ttl": "30m",
                "gas_price": 1,
                "body_hash": "557c9c0149aeb4fc886e0f9d361ef23103a12c86dd04a81845d178d09d872e67",
                "dependencies": [],
                "chain_name": "casper-test"
            },
            "payment": {
                "ModuleBytes": {
                    "module_bytes": "",
                    "args": [
                        [
                            "amount",
                            {
                                "cl_type": "U512",
                                "bytes": "04005ed0b2",
                                "parsed": "3000000000"
                            }
                        ]
                    ]
                }
            },
            "session": {
                "StoredContractByHash": {
                    "hash": "16def1f26e22235bfb8d58fa1fcea580a9f1eba68706a7d88bee1c659006a01d",
                    "entry_point": "store_key",
                    "args": [
                        [
                            "name",
                            {
                                "cl_type": "String",
                                "bytes": "0d0000006d795f7075626c69635f6b6579",
                                "parsed": "my_public_key"
                            }
                        ],
                        [
                            "value",
                            {
                                "cl_type": "Key",
                                "bytes": "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20",
                                "parsed": {
                                    "Account": "account-hash-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20"
                                }
                            }
                        ]
                    ]
                }
            },
            "approvals": [
                {
                    "signer": "010068920746ecf5870e18911ee1fc5db975e0e97fffcbbf52f5045ad6c9838d2f",
                    "signature": "01e14d4188bfde0733fbedca16cd7335ed82c0c739a9ba127ea1d406164cb4cc6cf182ae1153560d499445c09fd7a76319523b27f723f2920579d7ef344de93207"
                }
            ]
        },
    }).unwrap();

    let deploy_serialize = Buffer.from(DeployUtil.deployToBytes(deploy)).toString(
        "hex"
    );
    console.log("deploy_serialize  is \n", deploy_serialize);

    let session_serialize = Buffer.from(deploy.session.toBytes().val).toString(
        "hex"
    );
    console.log("session_serialize  is \n", session_serialize);

    let header_serialize = Buffer.from(deploy.header.toBytes().val).toString(
        "hex"
    );
    console.log(" deploy.header.json", deploy.header)
    console.log("header:", deploy.header.toBytes().val)
    console.log("header_serialize  is \n", header_serialize);

    const toBytesU64 = toBytesNumber(64, false)
    const h = toBytesU64(1731856935313) // Sunday, November 17, 2024 3:22:15.313 PM
    //                   1731885735313     Sunday, November 17, 2024 11:22:15.313 PM
    console.log("h", Buffer.from(h).toString(
        "hex"
    ))
    const h1 = toBytesU64(1800000)
    console.log("h1", Buffer.from(h1).toString(
        "hex"
    ))

    // deployHash = byteHash(header_serialize);
    // console.log("deployHash", deployHash)
    // const a = Buffer.from(deployHash).toString(
    //     "hex"
    // )
    // console.log("a:", a)
};

function byteHash(x) {
    return blake2b(x, {
        dkLen: 32
    });
}
main();
