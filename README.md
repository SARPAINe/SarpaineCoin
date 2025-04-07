# 🪙 SarpaineCoin - A Simple Blockchain Implementation

This project is a minimal blockchain implementation written in TypeScript. It demonstrates the core concepts of how blockchains work, including block creation, hashing, mining with proof-of-work, and chain validation.

## 🚀 Features

-   SHA-256 hashing algorithm for block hashes
-   Block mining with configurable difficulty
-   Genesis block initialization
-   Blockchain validity verification
-   Transaction signing and verification using elliptic curve cryptography
-   Example usage demonstrating block creation, mining, and transactions

## 📦 Technologies Used

-   TypeScript
-   Node.js (Crypto module)
-   Elliptic (for cryptographic operations)

## 📂 Project Structure

```bash
.
├── src/
│   ├── blockchain.ts   # Core blockchain and transaction logic
│   ├── keygenerator.ts # Utility to generate public/private key pairs
│   ├── main.ts         # Example usage of the blockchain
│   ├── utils.ts        # Utility functions (e.g., public address generation)
├── README.md           # Project documentation
├── package.json        # Project metadata and dependencies
├── tsconfig.json       # TypeScript configuration
```

## 🛠️ How It Works

1. **Block Structure**: Each block contains:

    - `timestamp`: Time of creation
    - `transactions`: List of transactions in the block
    - `previousHash`: Hash of the previous block
    - `hash`: The current block's hash
    - `nonce`: Used for proof-of-work

2. **Transaction Structure**: Each transaction consists of:

    - `fromAddress`: Sender's public address
    - `toAddress`: Recipient's public address
    - `amount`: Amount to be transferred
    - `publicKey`: Sender's public key
    - `signature`: Digital signature used for transaction verification

3. **Proof-of-Work (Mining)**:
   The `mineBlock(difficulty)` method hashes the block repeatedly until it finds a hash with a specified number of leading zeroes.

4. **Blockchain Validation**:
   The chain can be validated using `isChainValid()`, which ensures no data tampering or broken hashes has occurred.

5. **Key Generation**:
   Use keygenerator.ts to generate public/private key pairs for transactions.

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
