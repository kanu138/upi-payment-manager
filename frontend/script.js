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

    // Clear previous errors
    document.getElementById("upiIdError").textContent = "";
    document.getElementById("nameError").textContent = "";
    document.getElementById("amountError").textContent = "";

    upiIdInput.classList.remove("input-error");
    nameInput.classList.remove("input-error");
    amountInput.classList.remove("input-error");

    let hasError = false;

    if (upiId === "") {
        document.getElementById("upiIdError").textContent =
            "Please enter your UPI ID.";
        upiIdInput.classList.add("input-error");
        hasError = true;
    }

    if (name === "") {
        document.getElementById("nameError").textContent =
            "Please enter your name.";
        nameInput.classList.add("input-error");
        hasError = true;
    }

    if (amount === "" || Number(amount) <= 0 || Number(amount) > 100000) {
        document.getElementById("amountError").textContent =
            "Amount must be between ₹1 and ₹100,000.";
        amountInput.classList.add("input-error");
        hasError = true;
    }

    if (hasError) {
        return;
    }

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