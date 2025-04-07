import * as crypto from "crypto";
import { ec as EC, utils } from "elliptic";
import { getPublicAddress } from "./utils";
const ec = new EC("secp256k1");

const sha256Hash = (data: string): string => {
    return crypto.createHash("sha256").update(data).digest("hex");
};

export class Transaction {
    fromAddress: string;
    toAddress: string;
    amount: number;
    signature: string;
    publicKey: string;
    constructor(
        fromAddress: string,
        toAddress: string,
        amount: number,
        publicKey: string
    ) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.publicKey = publicKey;
        this.signature = "";
    }

    calculateHash(): string {
        return sha256Hash(
            this.fromAddress + this.toAddress + this.amount
        ).toString();
    }

    signTransaction(signingKey: EC.KeyPair): void {
        if (this.fromAddress === null) {
            throw new Error("Transaction must be signed");
        }

        if (getPublicAddress(signingKey) !== this.fromAddress) {
            throw new Error("You cannot sign transactions for other wallets");
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, "base64");
        this.signature = sig.toDER("hex");
    }

    isValid() {
        if (this.fromAddress === "0x0000000000000000000000000000000000000000")
            return true;

        if (!this.signature || this.signature.length === 0) {
            throw new Error("No signature in this transaction");
        }

        const publicKey = ec.keyFromPublic(this.publicKey, "hex");
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

export class Block {
    timestamp: string;
    transactions: any;
    previousHash: string;
    hash: string;
    nonce: number;

    constructor(
        timestamp: string,
        transactions: any,
        previousHash: string = ""
    ) {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(): string {
        return sha256Hash(
            this.previousHash +
                this.timestamp +
                JSON.stringify(this.transactions) +
                this.nonce
        ).toString();
    }

    mineBlock(difficulty: number): void {
        let hash = this.hash;

        while (
            hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
        ) {
            this.nonce++;
            hash = this.calculateHash();
        }

        this.hash = hash;
        console.log(`Block mined: ${hash} with nonce: ${this.nonce}}`);
    }

    hasValidTransactions(): boolean {
        for (const tx of this.transactions) {
            if (!tx.isValid()) {
                return false;
            }
        }
        return true;
    }
    getTransactions(): Transaction[] {
        return this.transactions;
    }
}

export class Blockchain {
    chain: Block[];
    difficulty: number;
    pendingTransactions: Transaction[];
    miningReward: number;

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; // Difficulty should be dynamic in a real-world scenario based on average block time
        this.pendingTransactions = [];
        this.miningReward = 100; // Reward for mining a block
    }

    createGenesisBlock(): Block {
        return new Block(new Date().toISOString(), "Genesis Block", "0");
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    // addBlock(newBlock: Block): void {
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }
    minePendingTransactions(
        miningRewardAddress: string,
        publicKey: string
    ): void {
        const block = new Block(
            new Date().toISOString(),
            this.pendingTransactions
        );
        block.previousHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(
                "0x0000000000000000000000000000000000000000",
                miningRewardAddress,
                this.miningReward,
                publicKey
            ),
        ];
    }

    addTransaction(transaction: Transaction): void {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error("Transaction must include from and to address");
        }

        if (transaction.isValid() === false) {
            throw new Error("Cannot add invalid transaction to chain");
        }
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address: string): number {
        let balance = 0;

        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount;
                }
                if (transaction.toAddress === address) {
                    balance += transaction.amount;
                }
            }
        }

        return balance;
    }

    isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hasValidTransactions() === false) {
                return false;
            }

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}
