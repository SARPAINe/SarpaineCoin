import { Blockchain, Transaction } from "./blockchain";
import { ec as EC } from "elliptic";
import { getPublicAddress } from "./utils";
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate(
    "a8725b2319f938938f566b587cfc51c70bd5802e577fda11a7c0b9067eeeaeab"
);

const publicAddress = getPublicAddress(myKey);
console.log("🚀 ~ Public Address:", publicAddress);

// Example Usage
const sarpaineCoin = new Blockchain();

const tx1 = new Transaction(
    publicAddress,
    "0xfEc0c677955472E5EcDD3Fb6F3DeeD33D7FB1FB4",
    10,
    myKey.getPublic("hex").toString()
);

tx1.signTransaction(myKey);
sarpaineCoin.addTransaction(tx1);

const tx2 = new Transaction(
    publicAddress,
    "0xfEc0c677955472E5EcDD3Fb6F3DeeD33D7FB1FB4",
    23,
    myKey.getPublic("hex").toString()
);
tx2.signTransaction(myKey);
sarpaineCoin.addTransaction(tx2);

console.log("Starting the miner...");
sarpaineCoin.minePendingTransactions(
    publicAddress,
    myKey.getPublic("hex").toString()
);

console.log("Starting the miner again...");
sarpaineCoin.minePendingTransactions(
    publicAddress,
    myKey.getPublic("hex").toString()
);

console.log(
    `Balance of ${publicAddress} is ${sarpaineCoin.getBalanceOfAddress(
        publicAddress
    )}`
);

// console.log(JSON.stringify(sarpaineCoin, null, 1));

console.log("Is chain valid?", sarpaineCoin.isChainValid());

// Tampering with the blockchain
sarpaineCoin.chain[1].transactions[0].amount = 1;
console.log("Is chain valid?", sarpaineCoin.isChainValid());
