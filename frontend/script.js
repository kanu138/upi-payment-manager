console.log("JavaScript file loaded!");

const upiIdInput = document.getElementById("upiId");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const noteInput = document.getElementById("note");
const generateBtn = document.getElementById("generateBtn");
const qrContainer = document.getElementById("qrcode");

generateBtn.addEventListener("click", function () {

    const upiId = upiIdInput.value.trim();
    const name = nameInput.value.trim();
    const amount = amountInput.value.trim();
    const note = noteInput.value.trim();

    const upiUrl =
        `upi://pay?pa=${encodeURIComponent(upiId)}` +
        `&pn=${encodeURIComponent(name)}` +
        `&am=${encodeURIComponent(amount)}` +
        `&cu=INR` +
        `&tn=${encodeURIComponent(note)}`;

    console.log("UPI URL:", upiUrl);

    qrContainer.innerHTML = "";

    const canvas = document.createElement("canvas");
    qrContainer.appendChild(canvas);

    QRCode.toCanvas(canvas, upiUrl, function (error) {

        if (error) {
            console.error(error);
            return;
        }

        console.log("UPI QR code generated successfully!");

    });
});