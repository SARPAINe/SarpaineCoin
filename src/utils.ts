import * as crypto from "crypto";
import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");

/**
 * Generates a public address from a private key.
 * @param privateKey - The private key in hexadecimal format.
 * @returns The public address in hexadecimal format.
 */
export const getPublicAddress = (privateKey: EC.KeyPair): string => {
    const key = ec.keyFromPrivate(privateKey);
    const publicKey = key.getPublic("hex");

    // Derive the public address
    const hash1 = crypto.createHash("sha256").update(publicKey).digest();
    const publicAddress =
        "0x" + crypto.createHash("ripemd160").update(hash1).digest("hex");

    return publicAddress;
};
