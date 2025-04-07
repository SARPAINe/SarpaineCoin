import * as crypto from "crypto";

const sha256Hash = (data: string): string => {
    return crypto.createHash("sha256").update(data).digest("hex");
};

class Transaction {
    fromAddress: string;
    toAddress: string;
    amount: number;
    constructor(fromAddress: string, toAddress: string, amount: number) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
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
}

class Blockchain {
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
    minePendingTransactions(miningRewardAddress: string): void {
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
                this.miningReward
            ),
        ];
    }

    createTransaction(transaction: Transaction): void {
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

// Example Usage
const sarpaineCoin = new Blockchain();

sarpaineCoin.createTransaction(new Transaction("address1", "address2", 100));
sarpaineCoin.createTransaction(new Transaction("address2", "address1", 50));

console.log("Starting the miner...");
sarpaineCoin.minePendingTransactions("shaharin@address");

console.log("Starting the miner again...");
sarpaineCoin.minePendingTransactions("shaharin@address");

console.log(
    `Balance of shaharin@address is ${sarpaineCoin.getBalanceOfAddress(
        "shaharin@address"
    )}`
);

console.log(JSON.stringify(sarpaineCoin, null, 1));
