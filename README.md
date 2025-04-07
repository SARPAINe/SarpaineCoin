# 🪙 SarpaineCoin - A Simple Blockchain Implementation

This project is a minimal blockchain implementation written in TypeScript. It demonstrates the core concepts of how blockchains work, including block creation, hashing, mining with proof-of-work, and chain validation.

## 🚀 Features

-   SHA-256 hashing algorithm for block hashes
-   Block mining with configurable difficulty
-   Genesis block initialization
-   Blockchain validity verification
-   Example usage demonstrating block creation and mining

## 📦 Technologies Used

-   TypeScript
-   Node.js (Crypto module)

## 📂 Project Structure

```bash
.
├── index.ts        # Main blockchain implementation and usage example
├── README.md       # Project documentation
```

## 🛠️ How It Works

1. **Block Structure**: Each block contains:

    - `index`: Position in the chain
    - `timestamp`: Time of creation
    - `data`: Arbitrary transaction data
    - `previousHash`: Hash of the previous block
    - `hash`: The current block's hash
    - `nonce`: Used for proof-of-work

2. **Proof-of-Work (Mining)**:
   The `mineBlock(difficulty)` method hashes the block repeatedly until it finds a hash with a specified number of leading zeroes.

3. **Blockchain Validation**:
   The chain can be validated using `isChainValid()`, which ensures no data tampering or broken hashes has occurred.

## 🧪 Example Usage

```ts
const sarpaineCoin = new Blockchain();
sarpaineCoin.addBlock(new Block(1, new Date().toISOString(), { amount: 4 }));
sarpaineCoin.addBlock(new Block(2, new Date().toISOString(), { amount: 10 }));

console.log(JSON.stringify(sarpaineCoin, null, 2));
```

## ✅ Output

Example output:

```
Mining block 1... with difficulty: 2
Block mined: 00a3f9... with nonce: 421 at index: 1
Mining block 2... with difficulty: 2
Block mined: 00b71d... with nonce: 289 at index: 2
```

## 📋 Chain Validation

Uncomment the validation section in `index.ts` to check for tampering:

```ts
console.log("Is blockchain valid? ", sarpaineCoin.isChainValid());
```

## 🧰 Prerequisites

-   Node.js installed
-   TypeScript installed globally or locally

## 🏃‍♂️ Getting Started

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd your-project-directory
    ```

2. Install dependencies (if any):

    ```bash
    npm install
    ```

3. Compile and run:
    ```bash
    npx ts-node index.ts
    ```

## 📄 License

This project is open-source and free to use for educational purposes.
