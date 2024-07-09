$(document).ready(function () {
  const dropZone = $("#drop-zone");
  const dropZoneDecrypt = $("#drop-zone-decrypt");
  const fileInput = $("#fileInput");
  const decryptFileInput = $("#decryptFileInput");
  const encryptButton = $("#encryptButton");
  const encryptionPasswordInput = $("#encryptionPassword");
  const decryptionKeyInput = $("#decryptionKey");
  const decryptButton = $("#decryptButton");
  const modeSwitch = $("#modeSwitch");
  const switchIcon = $("#switchIcon");

  let filesToEncrypt = [];
  let filesToDecrypt = [];

  if (!window.crypto || !window.crypto.subtle) {
    alert("Web Crypto API is not supported in this browser");
    return;
  }

  dropZone.on("dragover", function (event) {
    event.preventDefault();
    $(this).addClass("dragover");
  });

  dropZone.on("dragleave", function () {
    $(this).removeClass("dragover");
  });

  dropZone.on("drop", function (event) {
    event.preventDefault();
    $(this).removeClass("dragover");
    filesToEncrypt = event.originalEvent.dataTransfer.files;
    updateDropZoneText($(this), "Files uploaded");
  });

  dropZone.on("click", function () {
    if (!fileInput.data("triggered")) {
      fileInput.data("triggered", true);
      fileInput.trigger("click");
    }
  });

  fileInput.on("change", function () {
    filesToEncrypt = this.files;
    updateDropZoneText(dropZone, "Files uploaded");
    fileInput.data("triggered", false);
  });

  dropZoneDecrypt.on("dragover", function (event) {
    event.preventDefault();
    $(this).addClass("dragover");
  });

  dropZoneDecrypt.on("dragleave", function () {
    $(this).removeClass("dragover");
  });

  dropZoneDecrypt.on("drop", function (event) {
    event.preventDefault();
    $(this).removeClass("dragover");
    filesToDecrypt = event.originalEvent.dataTransfer.files;
    updateDropZoneText($(this), "Files uploaded");
  });

  dropZoneDecrypt.on("click", function () {
    if (!decryptFileInput.data("triggered")) {
      decryptFileInput.data("triggered", true);
      decryptFileInput.trigger("click");
    }
  });

  decryptFileInput.on("change", function () {
    filesToDecrypt = this.files;
    updateDropZoneText(dropZoneDecrypt, "Files uploaded");
    decryptFileInput.data("triggered", false);
  });

  encryptButton.on("click", async function () {
    if (filesToEncrypt.length === 0) {
      alert("Please select files to encrypt");
      return;
    }

    const password = encryptionPasswordInput.val();
    if (!password) {
      alert("Please enter an encryption password");
      return;
    }

    try {
      const key = await deriveKey(password);

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

        const encryptedBlob = new Blob([iv, new Uint8Array(encryptedContent)], {
          type: "application/octet-stream",
        });
        const link = $("<a></a>")
          .attr("href", URL.createObjectURL(encryptedBlob))
          .attr("download", file.name + ".encrypted")
          .appendTo("body");
        link[0].click();
        link.remove();
      }
    } catch (error) {
      console.error("Encryption failed", error);
      alert("Encryption failed. Please check the console for more details.");
    }
  });

  decryptButton.on("click", async function () {
    const password = decryptionKeyInput.val();
    if (filesToDecrypt.length === 0 || !password) {
      alert("Please select files to decrypt and enter the encryption password");
      return;
    }

    try {
      const key = await deriveKey(password);

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

          const decryptedBlob = new Blob([decryptedContent], {
            type: "application/octet-stream",
          });
          const link = $("<a></a>").attr("href", URL.createObjectURL(decryptedBlob)).attr("download", file.name.replace(".encrypted", "")).appendTo("body");
          link[0].click();
          link.remove();
        } catch (error) {
          alert("Decryption failed. Please check the password and try again.");
        }
      }
    } catch (error) {
      console.error("Decryption failed", error);
      alert("Decryption failed. Please check the console for more details.");
    }
  });

  // Helper functions
  async function deriveKey(password) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);

    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: enc.encode("some-salt"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }

  function updateSwitchIcon() {
    if (modeSwitch.is(":checked")) {
      switchIcon.attr("name", "moon-outline");
    } else {
      switchIcon.attr("name", "sunny-outline");
    }
  }

  function updateDropZoneText(dropZoneElement, message) {
    dropZoneElement.find("p").text(message).css("color", "green");
    dropZoneElement.css("border-color", "green");
  }
});
