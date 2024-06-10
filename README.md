
# Basic File Encryptor

Welcome to the GitHub repository for our Encryptor. This project allows users to upload files and receive an encrypted version along with an encryption key. The tool also supports decryption of the encrypted files using the provided key.

## Features

- **File Encryption**: Upload a file to get an encrypted version along with an encryption key.
- **File Decryption**: Upload an encrypted file along with the encryption key to get the original file back.
- **Secure**: Uses robust encryption algorithms to ensure the security of your files.

## Getting Started

### Prerequisites

- Python 3.x
- `cryptography` library

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/emlncvsr/encryptor.git
    cd encryptor
    ```

2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

### Usage

1. **Encrypt a File**:
    ```bash
    python encrypt.py --input yourfile.txt --output encryptedfile.enc --keyfile keyfile.key
    ```
    - `--input`: Path to the file to be encrypted.
    - `--output`: Path where the encrypted file will be saved.
    - `--keyfile`: Path where the encryption key will be saved.

2. **Decrypt a File**:
    ```bash
    python decrypt.py --input encryptedfile.enc --output decryptedfile.txt --keyfile keyfile.key
    ```
    - `--input`: Path to the encrypted file.
    - `--output`: Path where the decrypted file will be saved.
    - `--keyfile`: Path to the encryption key file.

## Technologies Used

- **Backend**: Python
- **Encryption Library**: cryptography

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions!

---

© 2023 Your Company. All Rights Reserved.
