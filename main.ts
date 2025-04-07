import * as crypto from "crypto";

const sha256Hash = (data: string): string => {
    return crypto.createHash("sha256").update(data).digest("hex");
};

class Block {
    index: number;
    timestamp: string;
    data: any;
    previousHash: string;
    hash: string;
    nonce: number;

    constructor(
        index: number,
        timestamp: string,
        data: any,
        previousHash: string = ""
    ) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(): string {
        return sha256Hash(
            this.index +
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.data) +
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
        console.log(
            `Block mined: ${hash} with nonce: ${this.nonce} at index: ${this.index}`
        );
    }
}

class Blockchain {
    chain: Block[];
    difficulty: number;

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; // Difficulty should be dynamic in a real-world scenario based on average block time
    }

    createGenesisBlock(): Block {
        return new Block(0, new Date().toISOString(), "Genesis Block", "0");
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock: Block): void {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
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
console.log("Mining block 1... with difficulty: ", sarpaineCoin.difficulty);
sarpaineCoin.addBlock(new Block(1, new Date().toISOString(), { amount: 4 }));
console.log("Mining block 2... with difficulty: ", sarpaineCoin.difficulty);
sarpaineCoin.addBlock(new Block(2, new Date().toISOString(), { amount: 10 }));

// Blockchain validation
// console.log("Is blockchain valid? ", sarpaineCoin.isChainValid());
// sarpaineCoin.chain[1].data = { amount: 100 };
// sarpaineCoin.chain[1].hash = sarpaineCoin.chain[1].calculateHash();
// console.log("Is blockchain valid? ", sarpaineCoin.isChainValid());

console.log(JSON.stringify(sarpaineCoin, null, 1));
