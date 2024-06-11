document.addEventListener("DOMContentLoaded", () => {
  const dropZone = document.getElementById("drop-zone");
  const dropZoneDecrypt = document.getElementById("drop-zone-decrypt");
  const fileInput = document.getElementById("fileInput");
  const decryptFileInput = document.getElementById("decryptFileInput");
  const encryptButton = document.getElementById("encryptButton");
  const encryptionPasswordInput = document.getElementById("encryptionPassword");
  const decryptionKeyInput = document.getElementById("decryptionKey");
  const decryptButton = document.getElementById("decryptButton");
  const modeSwitch = document.getElementById("modeSwitch");

  let filesToEncrypt = [];
  let filesToDecrypt = [];

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

  dropZoneDecrypt.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZoneDecrypt.classList.add("dragover");
  });

  dropZoneDecrypt.addEventListener("dragleave", () => {
    dropZoneDecrypt.classList.remove("dragover");
  });

  dropZoneDecrypt.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZoneDecrypt.classList.remove("dragover");
    filesToDecrypt = event.dataTransfer.files;
  });

  dropZoneDecrypt.addEventListener("click", () => {
    decryptFileInput.click();
  });

  decryptFileInput.addEventListener("change", () => {
    filesToDecrypt = decryptFileInput.files;
  });

  encryptButton.addEventListener("click", async () => {
    if (filesToEncrypt.length === 0) {
      alert("Please select files to encrypt");
      return;
    }

    const password = encryptionPasswordInput.value;
    if (!password) {
      alert("Please enter an encryption password");
      return;
    }

    const keyMaterial = await getKeyMaterial(password);
    const key = await getKey(keyMaterial);

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
    const password = decryptionKeyInput.value;
    if (filesToDecrypt.length === 0 || !password) {
      alert("Please select files to decrypt and enter the encryption password");
      return;
    }

    const keyMaterial = await getKeyMaterial(password);
    const key = await getKey(keyMaterial);

    for (const file of filesToDecrypt) {
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
        alert("Decryption failed. Please check the password and try again.");
      }
    }
  });

  // Mode switch functionality
  modeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", modeSwitch.checked);
  });

  // Set dark mode by default
  document.body.classList.add("dark-mode");
  modeSwitch.checked = true;

  // Helper functions
  async function getKeyMaterial(password) {
    const enc = new TextEncoder();
    return window.crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
  }

  async function getKey(keyMaterial) {
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new TextEncoder().encode("some-salt"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }
});
