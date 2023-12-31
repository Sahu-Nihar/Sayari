import * as crypto from 'crypto';
import * as fs from 'fs';

// Function generates two asymmetric encryption keys of using pkcs1 algorithm
const generateKeyPair = () => {
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1', // * Public key Cryptography standards 1
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1', // * Public key Cryptography standards 1
            format: 'pem'
        }
    });

    // * Create the public key file
    fs.writeFileSync(__dirname + '/publicKey.pem', keyPair.publicKey);

    // * Create the private key file
    fs.writeFileSync(__dirname + '/privateKey.pem', keyPair.privateKey);
};

// * Generate key_pair
generateKeyPair();