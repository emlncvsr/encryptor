document.addEventListener("DOMContentLoaded", () => {
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("fileInput");
  const encryptButton = document.getElementById("encryptButton");
  const encryptionKeyTextArea = document.getElementById("encryptionKey");
  const decryptFileInput = document.getElementById("decryptFileInput");
  const decryptionKeyInput = document.getElementById("decryptionKey");
  const decryptButton = document.getElementById("decryptButton");

  let filesToEncrypt = [];

  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragover");
    filesToEncrypt = event.dataTransfer.files;
  });

  dropZone.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    filesToEncrypt = fileInput.files;
  });

  encryptButton.addEventListener("click", async () => {
    if (filesToEncrypt.length === 0) {
      alert("Please select files to encrypt");
      return;
    }

    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    const exportedKey = await window.crypto.subtle.exportKey("raw", key);

    const keyString = Array.from(new Uint8Array(exportedKey))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    encryptionKeyTextArea.value = keyString;

    for (const file of filesToEncrypt) {
      const fileBuffer = await file.arrayBuffer();
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      const encryptedContent = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        fileBuffer
      );

      const encryptedBlob = new Blob([iv, new Uint8Array(encryptedContent)], { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(encryptedBlob);
      link.download = file.name + ".encrypted";
      link.click();
    }
  });

  decryptButton.addEventListener("click", async () => {
    const decryptionKeyString = decryptionKeyInput.value;
    if (decryptFileInput.files.length === 0 || !decryptionKeyString) {
      alert("Please select files to decrypt and enter the decryption key");
      return;
    }

    const decryptionKey = new Uint8Array(decryptionKeyString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

    const key = await window.crypto.subtle.importKey(
      "raw",
      decryptionKey,
      {
        name: "AES-GCM",
      },
      true,
      ["decrypt"]
    );

    for (const file of decryptFileInput.files) {
      const fileBuffer = await file.arrayBuffer();
      const iv = fileBuffer.slice(0, 12);
      const data = fileBuffer.slice(12);

      try {
        const decryptedContent = await window.crypto.subtle.decrypt(
          {
            name: "AES-GCM",
            iv: iv,
          },
          key,
          data
        );

        const decryptedBlob = new Blob([decryptedContent], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(decryptedBlob);
        link.download = file.name.replace(".encrypted", "");
        link.click();
      } catch (error) {
        alert("Decryption failed. Please check the key and try again.");
      }
    }
  });
});
