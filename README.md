
# 🌙🔒 File Encryptor

This project is a simple file encryptor and decryptor that runs entirely in the browser. Users can drag and drop files to encrypt or decrypt them using a password they provide. The application supports both light and dark modes, and it uses the Web Cryptography API for secure encryption and decryption.

## Features

- 🌑 **Dark Mode by Default**: Toggle between dark and light modes with a simple switch.
- 🖱 **Drag and Drop**: Easily drag and drop files to encrypt or decrypt.
- 🔑 **Password Protection**: Enter a password to secure your files.
- 🔒 **Client-Side Encryption**: All encryption and decryption is done locally in the browser, ensuring your files never leave your device.

## Getting Started

To get started with the File Encryptor, follow these simple steps:

### Prerequisites

- A modern web browser that supports the Web Cryptography API.

### Installation

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/emlncvsr/encryptor.git
   ```
2. Navigate to the project directory:
   ```bash
   cd file-encryptor
   ```
3. Open the `index.html` file in your web browser to start using the encryptor.

### Usage

1. **Encrypt Files**:
   - Drag and drop files into the "Drag & Drop files here to encrypt" area.
   - Enter a password in the "Enter encryption password" field.
   - Click the "Encrypt" button.
   - Download the encrypted files.

2. **Decrypt Files**:
   - Drag and drop files into the "Drag & Drop files here to decrypt" area.
   - Enter the password used for encryption in the "Enter encryption password" field.
   - Click the "Decrypt" button.
   - Download the decrypted files.

## Project Structure

```
file-encryptor/
│
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── script.js
└── README.md
```

## Technologies Used

- HTML5
- CSS3
- JavaScript
- jQuery
- Ionicons
- Web Cryptography API

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you have any suggestions or improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the creators of [Ionicons](https://ionicons.com/) for the beautiful icons.
- Inspired by various file encryption tools and web applications.
