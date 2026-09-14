// ==========================================
// UPI Payment Manager - Main JavaScript
// ==========================================

console.log("UPI Payment Manager loaded");


// ==========================================
// DOM ELEMENTS
// ==========================================

// Navigation
const generateSection = document.getElementById("generateSection");
const accountSection = document.getElementById("accountSection");

const generateNav = document.getElementById("generateNav");
const accountNav = document.getElementById("accountNav");

// Generate form
const upiIdSelect = document.getElementById("upiId");
const amountInput = document.getElementById("amount");
const noteInput = document.getElementById("note");
const generateBtn = document.getElementById("generateBtn");
const addNewProfileBtn = document.getElementById("addNewProfileBtn");

// QR / payment card
const paymentCard = document.getElementById("paymentCard");
const qrContainer = document.getElementById("qrcode");
const qrActions = document.getElementById("qrActions");

const cardShopName = document.getElementById("cardShopName");
const cardAmount = document.getElementById("cardAmount");
const cardNote = document.getElementById("cardNote");
const cardUpiId = document.getElementById("cardUpiId");

// QR action buttons
const downloadQrBtn = document.getElementById("downloadQrBtn");
const shareQrBtn = document.getElementById("shareQrBtn");

// Shop/profile section
const shopNameInput = document.getElementById("shopNameInput");
const profilesList = document.getElementById("profilesList");
const profileCount = document.querySelector(".profile-count");

const profileForm = document.getElementById("profileForm");
const profileNameInput = document.getElementById("profileName");
const profileUpiIdInput = document.getElementById("profileUpiId");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const addProfileBtn = document.getElementById("addProfileBtn");


// ==========================================
// NAVIGATION
// ==========================================

// Show Generate page
function showGenerateSection() {

    if (generateSection) {
        generateSection.classList.remove("hidden");
    }

    if (accountSection) {
        accountSection.classList.add("hidden");
    }

    if (generateNav) {
        generateNav.classList.add("active");
    }

    if (accountNav) {
        accountNav.classList.remove("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Show My Account page
function showAccountSection() {

    if (generateSection) {
        generateSection.classList.add("hidden");
    }

    if (accountSection) {
        accountSection.classList.remove("hidden");
    }

    if (generateNav) {
        generateNav.classList.remove("active");
    }

    if (accountNav) {
        accountNav.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Navigation button events
if (generateNav) {
    generateNav.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showGenerateSection();

        }
    );
}


if (accountNav) {
    accountNav.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showAccountSection();

        }
    );
}

// ==========================================
// SHOP NAME
// ==========================================

function loadShopName() {
    const savedShopName = localStorage.getItem("shopName");

    if (savedShopName) {
        if (shopNameInput) {
            shopNameInput.value = savedShopName;
        }
    }
}


function updateShopNameTitle() {
    const shopNameTitle = document.getElementById("shopNameTitle");

    if (!shopNameTitle) {
        return;
    }

    const savedShopName = localStorage.getItem("shopName");

    shopNameTitle.textContent = savedShopName || "My Shop";
}


if (shopNameInput) {

    shopNameInput.addEventListener("input", function () {

        const shopName = shopNameInput.value.trim();

        if (shopName === "") {
            localStorage.removeItem("shopName");
        } else {
            localStorage.setItem("shopName", shopName);
        }

        updateShopNameTitle();

    });

}


// ==========================================
// UPI PROFILE STORAGE
// ==========================================

function getProfiles() {

    const savedProfiles = localStorage.getItem("upiProfiles");

    if (!savedProfiles) {
        return [];
    }

    try {
        const profiles = JSON.parse(savedProfiles);

        if (Array.isArray(profiles)) {
            return profiles;
        }

        return [];

    } catch (error) {

        console.error("Could not load profiles:", error);

        return [];
    }
}


function saveProfiles(profiles) {
    localStorage.setItem(
        "upiProfiles",
        JSON.stringify(profiles)
    );
}


// ==========================================
// UPI ID VALIDATION
// ==========================================

function isValidUpiId(upiId) {

    const upiRegex =
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;

    return upiRegex.test(upiId);
}


// ==========================================
// PROFILE DROPDOWN
// ==========================================

function updateProfileDropdown() {

    if (!upiIdSelect) {
        return;
    }

    const profiles = getProfiles();

    // Clear existing options
    upiIdSelect.innerHTML = "";

    // Default option
    const defaultOption = document.createElement("option");

    defaultOption.value = "";
    defaultOption.textContent = "Select a UPI profile";

    upiIdSelect.appendChild(defaultOption);


    // Add profiles
    profiles.forEach(function (profile) {

        const option = document.createElement("option");

        option.value = profile.upiId;

        option.textContent =
            `${profile.name} — ${profile.upiId}`;

        upiIdSelect.appendChild(option);

    });

}


// ==========================================
// DISPLAY PROFILES
// ==========================================

function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


function renderProfiles() {

    if (!profilesList) {
        return;
    }

    const profiles = getProfiles();

    profilesList.innerHTML = "";


    // Update profile count
    if (profileCount) {

        profileCount.textContent =
            `${profiles.length}/5 profiles`;

    }


    // No profiles
    if (profiles.length === 0) {

        profilesList.innerHTML = `
            <div class="empty-profile">
                <p>No UPI profiles added yet.</p>
                <p>Add a profile to generate payment QR codes.</p>
            </div>
        `;

        return;
    }


    // Display profiles
    profiles.forEach(function (profile, index) {

        const profileElement =
            document.createElement("div");

        profileElement.className = "profile-item";


        profileElement.innerHTML = `
            <div class="profile-info">

                <strong>
                    ${escapeHtml(profile.name)}
                </strong>

                <span>
                    ${escapeHtml(profile.upiId)}
                </span>

            </div>

            <button
                type="button"
                class="delete-profile-btn"
                data-index="${index}"
            >
                Delete
            </button>
        `;


        profilesList.appendChild(profileElement);

    });


    // Delete buttons
    const deleteButtons =
        profilesList.querySelectorAll(
            ".delete-profile-btn"
        );


    deleteButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const index =
                Number(button.dataset.index);

            deleteProfile(index);

        });

    });

}


// ==========================================
// DELETE PROFILE
// ==========================================

function deleteProfile(index) {

    const profiles = getProfiles();

    if (!profiles[index]) {
        return;
    }


    const profile = profiles[index];

    const confirmed = confirm(
        `Delete the profile "${profile.name}"?`
    );


    if (!confirmed) {
        return;
    }


    profiles.splice(index, 1);

    saveProfiles(profiles);

    renderProfiles();

    updateProfileDropdown();

}


// ==========================================
// PROFILE FORM
// ==========================================

function openProfileForm() {

    if (!profileForm) {
        return;
    }

    profileForm.classList.remove("hidden");

    if (profileNameInput) {
        profileNameInput.focus();
    }

}


function closeProfileForm() {

    if (!profileForm) {
        return;
    }

    profileForm.classList.add("hidden");

    if (profileNameInput) {
        profileNameInput.value = "";
    }

    if (profileUpiIdInput) {
        profileUpiIdInput.value = "";
    }

}


if (addProfileBtn) {

    addProfileBtn.addEventListener(
        "click",
        openProfileForm
    );

}


if (addNewProfileBtn) {

    addNewProfileBtn.addEventListener(
        "click",
        function () {

            showAccountSection();

            openProfileForm();

        }
    );

}


// ==========================================
// SAVE NEW PROFILE
// ==========================================

if (saveProfileBtn) {

    saveProfileBtn.addEventListener(
        "click",
        function () {

            const name =
                profileNameInput
                    ? profileNameInput.value.trim()
                    : "";

            const upiId =
                profileUpiIdInput
                    ? profileUpiIdInput.value.trim()
                    : "";


            // Validate name
            if (name === "") {

                alert("Please enter a profile name.");

                return;
            }


            // Validate UPI ID
            if (!isValidUpiId(upiId)) {

                alert(
                    "Please enter a valid UPI ID.\n\n" +
                    "Example: yourname@upi"
                );

                return;
            }


            const profiles = getProfiles();


            // Maximum 5 profiles
            if (profiles.length >= 5) {

                alert(
                    "You can add a maximum of 5 UPI profiles."
                );

                return;
            }


            // Check duplicate UPI ID
            const alreadyExists =
                profiles.some(function (profile) {

                    return profile.upiId.toLowerCase()
                        === upiId.toLowerCase();

                });


            if (alreadyExists) {

                alert(
                    "This UPI ID is already added."
                );

                return;
            }


            // Add profile
            profiles.push({
                name: name,
                upiId: upiId
            });


            saveProfiles(profiles);

            renderProfiles();

            updateProfileDropdown();

            closeProfileForm();


            alert("UPI profile added successfully.");

        }
    );

}


// ==========================================
// GENERATE UPI QR CODE
// ==========================================

if (generateBtn) {

    generateBtn.addEventListener(
        "click",
        function () {

            generateQRCode();

        }
    );

}


function generateQRCode() {

    // Check QR library
    if (typeof QRCode === "undefined") {

        alert(
            "QR code library could not be loaded."
        );

        console.error(
            "QRCode library is missing."
        );

        return;
    }


    // Get input values
    const upiId =
        upiIdSelect
            ? upiIdSelect.value.trim()
            : "";

    const amount =
        amountInput
            ? amountInput.value.trim()
            : "";

    const note =
        noteInput
            ? noteInput.value.trim()
            : "";


    // ======================================
    // VALIDATE UPI ID
    // ======================================

    if (upiId === "") {

        alert(
            "Please select a UPI profile."
        );

        return;
    }


    if (!isValidUpiId(upiId)) {

        alert(
            "Please select a valid UPI profile."
        );

        return;
    }


    // ======================================
    // VALIDATE AMOUNT
    // ======================================

    if (amount !== "") {

        const numericAmount =
            Number(amount);


        if (
            Number.isNaN(numericAmount) ||
            numericAmount <= 0
        ) {

            alert(
                "Amount must be greater than ₹0."
            );

            return;
        }


        if (numericAmount > 100000) {

            alert(
                "Maximum allowed amount is ₹1,00,000."
            );

            return;
        }

    }


    // ======================================
    // BUILD UPI PAYMENT URL
    // ======================================

    let upiUrl =
        `upi://pay?pa=${encodeURIComponent(upiId)}` +
        `&cu=INR`;


    if (amount !== "") {

        upiUrl +=
            `&am=${encodeURIComponent(amount)}`;

    }


    if (note !== "") {

        upiUrl +=
            `&tn=${encodeURIComponent(note)}`;

    }


    console.log(
        "Generated UPI URL:",
        upiUrl
    );


    // ======================================
    // CLEAR OLD QR
    // ======================================

    if (!qrContainer) {
        console.error(
            "QR container not found."
        );

        return;
    }

    qrContainer.innerHTML = "";


    // Create canvas
    const canvas =
        document.createElement("canvas");

    qrContainer.appendChild(canvas);


    // ======================================
    // GENERATE QR
    // ======================================

    QRCode.toCanvas(
        canvas,
        upiUrl,
        function (error) {

            if (error) {

                console.error(
                    "QR generation error:",
                    error
                );

                qrContainer.innerHTML = "";

                alert(
                    "Unable to generate QR code."
                );

                return;
            }


            // ==================================
            // UPDATE PAYMENT CARD
            // ==================================

            const shopName =
                localStorage.getItem("shopName")
                || "My Shop";


            if (cardShopName) {

                cardShopName.textContent =
                    shopName;

            }


            if (cardAmount) {

                if (amount !== "") {

                    cardAmount.textContent =
                        `₹${Number(amount).toFixed(2)}`;

                } else {

                    cardAmount.textContent =
                        "Pay any amount";

                }

            }


            if (cardNote) {

                cardNote.textContent =
                    note || "No note";

            }


            if (cardUpiId) {

                cardUpiId.textContent =
                    upiId;

            }


            // Show payment card
            if (paymentCard) {

                paymentCard.classList.remove(
                    "hidden"
                );

            }


            // Show actions
            if (qrActions) {

                qrActions.classList.remove(
                    "hidden"
                );

            }


            // Scroll to card
            if (paymentCard) {

                paymentCard.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

}


// ==========================================
// HELPER: ROUNDED RECTANGLE
// ==========================================

function roundedRect(
    ctx,
    x,
    y,
    width,
    height,
    radius
) {

    ctx.beginPath();

    ctx.moveTo(
        x + radius,
        y
    );

    ctx.lineTo(
        x + width - radius,
        y
    );

    ctx.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius
    );

    ctx.lineTo(
        x + width,
        y + height - radius
    );

    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );

    ctx.lineTo(
        x + radius,
        y + height
    );

    ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius
    );

    ctx.lineTo(
        x,
        y + radius
    );

    ctx.quadraticCurveTo(
        x,
        y,
        x + radius,
        y
    );

    ctx.closePath();

}


// ==========================================
// CREATE FULL PAYMENT CARD IMAGE
// ==========================================

function createPaymentImage() {

    const canvas =
        document.createElement("canvas");


    // Large enough for a good downloaded image
    canvas.width = 900;
    canvas.height = 1150;


    const ctx =
        canvas.getContext("2d");


    // ======================================
    // BACKGROUND
    // ======================================

    ctx.fillStyle = "#fff8f1";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ======================================
    // MAIN CARD
    // ======================================

    const cardX = 50;
    const cardY = 50;
    const cardWidth = 800;
    const cardHeight = 1050;
    const radius = 35;


    ctx.fillStyle = "#ffffff";

    roundedRect(
        ctx,
        cardX,
        cardY,
        cardWidth,
        cardHeight,
        radius
    );

    ctx.fill();


    // ======================================
    // SHOP NAME
    // ======================================

    const shopName =
        localStorage.getItem("shopName")
        || "My Shop";


    ctx.fillStyle = "#14213d";

    ctx.font =
        "bold 48px Arial";


    ctx.textAlign = "left";

    ctx.fillText(
        shopName,
        95,
        125
    );


    // ======================================
    // PAYMENT REQUEST
    // ======================================

    ctx.fillStyle = "#e76f51";

    ctx.font =
        "bold 22px Arial";


    ctx.fillText(
        "PAYMENT REQUEST",
        95,
        165
    );


    // ======================================
    // UPI BADGE
    // ======================================

    ctx.fillStyle = "#14213d";

    roundedRect(
        ctx,
        720,
        95,
        80,
        48,
        15
    );

    ctx.fill();


    ctx.fillStyle = "#ffffff";

    ctx.font =
        "bold 22px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "UPI",
        760,
        126
    );


    // ======================================
    // SCAN TO PAY
    // ======================================

    ctx.fillStyle = "#14213d";

    ctx.font =
        "bold 34px Arial";


    ctx.fillText(
        "Scan to Pay",
        450,
        235
    );


    // ======================================
    // QR CODE
    // ======================================

    const qrCanvas =
        qrContainer
            ? qrContainer.querySelector("canvas")
            : null;


    if (qrCanvas) {

        const qrSize = 500;

        const qrX =
            (canvas.width - qrSize) / 2;

        const qrY = 265;


        ctx.drawImage(
            qrCanvas,
            qrX,
            qrY,
            qrSize,
            qrSize
        );

    }


    // ======================================
    // PAYMENT INFORMATION
    // ======================================

    const upiId =
        upiIdSelect
            ? upiIdSelect.value.trim()
            : "";

    const amount =
        amountInput
            ? amountInput.value.trim()
            : "";

    const note =
        noteInput
            ? noteInput.value.trim()
            : "";


    let infoY = 825;


    // Amount
    ctx.textAlign = "left";

    ctx.fillStyle = "#777777";

    ctx.font =
        "22px Arial";


    ctx.fillText(
        "Amount",
        100,
        infoY
    );


    ctx.fillStyle = "#14213d";

    ctx.font =
        "bold 28px Arial";


    ctx.textAlign = "right";

    ctx.fillText(
        amount !== ""
            ? `₹${Number(amount).toFixed(2)}`
            : "Pay any amount",
        800,
        infoY
    );


    // Note
    infoY += 55;


    ctx.textAlign = "left";

    ctx.fillStyle = "#777777";

    ctx.font =
        "22px Arial";


    ctx.fillText(
        "Note",
        100,
        infoY
    );


    ctx.fillStyle = "#14213d";

    ctx.font =
        "bold 22px Arial";


    ctx.textAlign = "right";

    ctx.fillText(
        note || "No note",
        800,
        infoY
    );


    // UPI ID
    infoY += 55;


    ctx.textAlign = "left";

    ctx.fillStyle = "#777777";

    ctx.font =
        "22px Arial";


    ctx.fillText(
        "UPI ID",
        100,
        infoY
    );


    ctx.fillStyle = "#14213d";

    ctx.font =
        "bold 21px Arial";


    ctx.textAlign = "right";

    ctx.fillText(
        upiId,
        800,
        infoY
    );


    // ======================================
    // FOOTER
    // ======================================

    ctx.textAlign = "center";

    ctx.fillStyle = "#777777";

    ctx.font =
        "20px Arial";


    ctx.fillText(
        "Scan with any supported UPI app",
        450,
        1010
    );


    ctx.fillStyle = "#14213d";

    ctx.font =
        "bold 20px Arial";


    ctx.fillText(
        "Secure • Fast • Trusted",
        450,
        1050
    );


    return canvas;

}


// ==========================================
// DOWNLOAD QR / PAYMENT CARD
// ==========================================

if (downloadQrBtn) {

    downloadQrBtn.addEventListener(
        "click",
        function () {

            const canvas =
                createPaymentImage();


            canvas.toBlob(
                function (blob) {

                    if (!blob) {

                        alert(
                            "Could not create image."
                        );

                        return;
                    }


                    const url =
                        URL.createObjectURL(blob);


                    const link =
                        document.createElement("a");


                    link.href = url;

                    link.download =
                        "upi-payment-qr.png";


                    document.body.appendChild(link);

                    link.click();

                    document.body.removeChild(link);


                    setTimeout(
                        function () {

                            URL.revokeObjectURL(url);

                        },
                        1000
                    );

                },
                "image/png"
            );

        }
    );

}


// ==========================================
// SHARE QR / PAYMENT CARD
// ==========================================

if (shareQrBtn) {

    shareQrBtn.addEventListener(
        "click",
        async function () {

            const canvas =
                createPaymentImage();


            // ==================================
            // MODERN SHARE API
            // ==================================

            if (
                navigator.share &&
                navigator.canShare
            ) {

                try {

                    const blob =
                        await new Promise(
                            function (resolve) {

                                canvas.toBlob(
                                    resolve,
                                    "image/png"
                                );

                            }
                        );


                    if (!blob) {

                        throw new Error(
                            "Could not create image."
                        );

                    }


                    const file =
                        new File(
                            [blob],
                            "upi-payment-qr.png",
                            {
                                type: "image/png"
                            }
                        );


                    if (
                        navigator.canShare({
                            files: [file]
                        })
                    ) {

                        await navigator.share({

                            title:
                                "UPI Payment QR",

                            text:
                                "Scan to make a UPI payment.",

                            files: [file]

                        });

                        return;

                    }

                } catch (error) {

                    // User cancelling the share dialog
                    // should not show an error.
                    if (
                        error &&
                        error.name === "AbortError"
                    ) {

                        return;

                    }

                    console.error(
                        "Share error:",
                        error
                    );

                }

            }


            // ==================================
            // FALLBACK
            // ==================================

            const upiId =
                upiIdSelect
                    ? upiIdSelect.value.trim()
                    : "";


            const amount =
                amountInput
                    ? amountInput.value.trim()
                    : "";


            const note =
                noteInput
                    ? noteInput.value.trim()
                    : "";


            let message =
                `UPI Payment\n\n` +
                `UPI ID: ${upiId}`;


            if (amount !== "") {

                message +=
                    `\nAmount: ₹${Number(amount).toFixed(2)}`;

            }


            if (note !== "") {

                message +=
                    `\nNote: ${note}`;

            }


            try {

                await navigator.clipboard.writeText(
                    message
                );


                alert(
                    "Payment details copied to clipboard."
                );

            } catch (error) {

                console.error(
                    "Clipboard error:",
                    error
                );


                alert(
                    message
                );

            }

        }
    );

}


// ==========================================
// INITIALIZE APPLICATION
// ==========================================

loadShopName();

updateShopNameTitle();

renderProfiles();

updateProfileDropdown();


// Start on Generate page
showGenerateSection();


console.log(
    "UPI Payment Manager initialized successfully."
);