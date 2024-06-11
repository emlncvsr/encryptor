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
  const sliderIcon = $("ion-icon");

  let filesToEncrypt = [];
  let filesToDecrypt = [];

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
  });

  dropZone.on("click", function () {
    fileInput.click();
  });

  fileInput.on("change", function () {
    filesToEncrypt = this.files;
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
  });

  dropZoneDecrypt.on("click", function () {
    decryptFileInput.click();
  });

  decryptFileInput.on("change", function () {
    filesToDecrypt = this.files;
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
      const link = $("<a></a>")
        .attr("href", URL.createObjectURL(encryptedBlob))
        .attr("download", file.name + ".encrypted");
      link[0].click();
    }
  });

  decryptButton.on("click", async function () {
    const password = decryptionKeyInput.val();
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
        const link = $("<a></a>").attr("href", URL.createObjectURL(decryptedBlob)).attr("download", file.name.replace(".encrypted", ""));
        link[0].click();
      } catch (error) {
        alert("Decryption failed. Please check the password and try again.");
      }
    }
  });

  // Mode switch functionality
  modeSwitch.on("change", function () {
    $("body").toggleClass("dark-mode", this.checked);
    updateSliderIcon();
  });

  // Set dark mode by default
  $("body").addClass("dark-mode");
  modeSwitch.prop("checked", true);
  updateSliderIcon();

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

  function updateSliderIcon() {
    if (modeSwitch.is(":checked")) {
      sliderIcon.attr("name", "contrast-outline");
    } else {
      sliderIcon.attr("name", "contrast");
    }
  }
});
