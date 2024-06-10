$(document).ready(function () {
  $("#encryptButton").click(function () {
    var customKey = $("#customKey").val();
    var textToEncrypt = $("#textToEncrypt").val();

    if (customKey === "" || textToEncrypt === "") {
      alert("Veuillez remplir les deux champs.");
      return;
    }

    var encryptedText = CryptoJS.AES.encrypt(textToEncrypt, customKey).toString();
    $("#encryptedText").val(encryptedText);
    $("#encryptedTextLabel").text("Texte encrypté:");
    $("#encryptedTextContainer").show();

    try {
      navigator.clipboard.writeText(customKey);
      alert("Texte encrypté avec succès et clé custom copiée dans le presse-papier !");
    } catch (error) {
      console.error("Erreur lors de la copie de la clé custom dans le presse-papier:", error);
      alert("Texte encrypté avec succès, mais erreur lors de la copie de la clé custom dans le presse-papier. Veuillez la copier manuellement.");
    }
  });

  $("#decryptButton").click(function () {
    var customKey = $("#customKey").val();
    var encryptedText = $("#encryptedText").val();

    if (customKey === "" || encryptedText === "") {
      alert("Veuillez remplir les deux champs.");
      return;
    }

    var decryptedText = CryptoJS.AES.decrypt(encryptedText, customKey).toString(CryptoJS.enc.Utf8);
    if (decryptedText) {
      $("#encryptedTextLabel").text("Texte décrypté:");
      $("#encryptedText").val(decryptedText);
    } else {
      alert("La clé custom ne correspond pas au texte encrypté.");
    }
  });
});
