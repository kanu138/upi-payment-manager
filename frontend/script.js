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

const upiIdError = document.getElementById("upiIdError");
const amountError = document.getElementById("amountError");
const noteError = document.getElementById("noteError");

// Generate form
const upiIdSelect = document.getElementById("upiId");

// Custom UPI dropdown
const upiDropdown =
    document.getElementById("upiDropdown");

const upiDropdownTrigger =
    document.getElementById("upiDropdownTrigger");

const upiDropdownMenu =
    document.getElementById("upiDropdownMenu");

const upiSelectedContent =
    document.getElementById("upiSelectedContent");

const amountInput = document.getElementById("amount");
const noteInput = document.getElementById("note");
const generateBtn = document.getElementById("generateBtn");
const resetBtn = document.getElementById("resetBtn");

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

const shopNameDisplay = document.getElementById("shopNameDisplay");

const shopNameEdit = document.getElementById("shopNameEdit");

const profilesList = document.getElementById("profilesList");

const profileCount = document.querySelector(".profile-count");

const editAccountBtn = document.getElementById("editAccountBtn");

const saveAccountBtn = document.getElementById("saveAccountBtn");

const editProfileActions = document.getElementById("editProfileActions");

const profileForm = document.getElementById("profileForm");
const profileNameInput = document.getElementById("profileName");
const profileUpiIdInput = document.getElementById("profileUpiId");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const addProfileBtn = document.getElementById("addProfileBtn");

const closeProfileFormBtn = document.getElementById("closeProfileForm");
const profileLimitError = document.getElementById("profileLimitError");

const profileNameError = document.getElementById("profileNameError");
const profileUpiIdError = document.getElementById("profileUpiIdError");


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

    const savedShopName =
        localStorage.getItem("shopName");

    const shopName =
        savedShopName || "My Shop";


    if (shopNameInput) {
        shopNameInput.value =
            savedShopName || "";
    }


    if (shopNameDisplay) {
        shopNameDisplay.textContent =
            shopName;
    }
}


function updateShopNameTitle() {

    const shopNameTitle =
        document.getElementById("shopNameTitle");

    if (!shopNameTitle) {
        return;
    }


    const savedShopName =
        localStorage.getItem("shopName");


    shopNameTitle.textContent =
        savedShopName || "My Shop";
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
// CUSTOM UPI DROPDOWN
// ==========================================

function updateCustomUpiDropdown() {
    if (
        !upiIdSelect ||
        !upiDropdownMenu ||
        !upiSelectedContent
    ) {
        return;
    }

    const profiles = getProfiles();

    // Clear menu
    upiDropdownMenu.innerHTML = "";

    // Update selected display
    const selectedValue = upiIdSelect.value;

    const selectedProfile = profiles.find(function (profile) {
        return profile.upiId === selectedValue;
    });

    if (!selectedProfile) {
        upiSelectedContent.innerHTML = `
            <span class="upi-selected-placeholder">
                Select a UPI profile
            </span>
        `;
    } else {
        upiSelectedContent.innerHTML = `
            <span class="upi-selected-name">
                ${escapeHtml(selectedProfile.name)}
            </span>

            <span class="upi-selected-id">
                ${escapeHtml(selectedProfile.upiId)}
            </span>
        `;
    }

    // No profiles
    if (profiles.length === 0) {
        upiDropdownMenu.innerHTML = `
            <div class="upi-dropdown-empty">
                No UPI profiles added yet.
            </div>
        `;

        return;
    }

    // Create profile options
    profiles.forEach(function (profile) {

        const option =
            document.createElement("button");

        option.type = "button";
        option.className = "upi-dropdown-option";

        option.setAttribute("role", "option");

        if (profile.upiId === selectedValue) {
            option.classList.add("selected");
            option.setAttribute("aria-selected", "true");
        }

        option.innerHTML = `
            <span class="upi-option-name">
                ${escapeHtml(profile.name)}
            </span>

            <span class="upi-option-id">
                ${escapeHtml(profile.upiId)}
            </span>
        `;

        option.addEventListener(
            "click",
            function () {

                // Update hidden native select
                upiIdSelect.value = profile.upiId;

                // Notify any existing select listeners
                upiIdSelect.dispatchEvent(
                    new Event("change", {
                        bubbles: true
                    })
                );

                // Update visible dropdown
                updateCustomUpiDropdown();

                closeUpiDropdown();
            }
        );

        upiDropdownMenu.appendChild(option);
    });
}


function openUpiDropdown() {

    if (
        !upiDropdown ||
        !upiDropdownMenu ||
        !upiDropdownTrigger
    ) {
        return;
    }

    updateCustomUpiDropdown();

    upiDropdown.classList.add("open");

    upiDropdownMenu.classList.remove("hidden");

    upiDropdownTrigger.setAttribute(
        "aria-expanded",
        "true"
    );
}


function closeUpiDropdown() {

    if (
        !upiDropdown ||
        !upiDropdownMenu ||
        !upiDropdownTrigger
    ) {
        return;
    }

    upiDropdown.classList.remove("open");

    upiDropdownMenu.classList.add("hidden");

    upiDropdownTrigger.setAttribute(
        "aria-expanded",
        "false"
    );
}


function toggleUpiDropdown() {

    if (
        upiDropdownMenu &&
        !upiDropdownMenu.classList.contains("hidden")
    ) {
        closeUpiDropdown();
    } else {
        openUpiDropdown();
    }
}

if (upiDropdownTrigger) {
    upiDropdownTrigger.addEventListener(
        "click",
        function () {
            toggleUpiDropdown();
        }
    );
}


// Close when clicking outside
document.addEventListener(
    "click",
    function (event) {

        if (
            upiDropdown &&
            !upiDropdown.contains(event.target)
        ) {
            closeUpiDropdown();
        }

    }
);


// Close with Escape
document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {
            closeUpiDropdown();
        }

    }
);

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
        updateCustomUpiDropdown();

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


        if (accountEditMode) {

    profileElement.classList.add(
        "edit-mode"
    );

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

    } else {

        profileElement.innerHTML = `
            <div class="profile-info">

                <strong>
                    ${escapeHtml(profile.name)}
                </strong>

                <span>
                    ${escapeHtml(profile.upiId)}
                </span>

            </div>
        `;

    }


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


    const profileElement =
        profilesList
            ? profilesList.children[index]
            : null;


    if (!profileElement) {
        return;
    }


    const deleteButton =
        profileElement.querySelector(
            ".delete-profile-btn"
        );


    if (!deleteButton) {
        return;
    }


    // First click
    if (deleteButton.dataset.confirming !== "true") {

        deleteButton.dataset.confirming =
            "true";

        deleteButton.textContent =
            "Confirm delete";

        deleteButton.classList.add(
            "delete-confirm"
        );

        return;
    }


    // Second click = actually delete
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

if (closeProfileFormBtn) {

    closeProfileFormBtn.addEventListener(
        "click",
        function () {

            closeProfileForm();

        }
    );

}

// ==========================================
// ACCOUNT EDIT MODE
// ==========================================

let accountEditMode = false;


function enterAccountEditMode() {

    accountEditMode = true;


    // Show shop name input
    if (shopNameDisplay) {
        shopNameDisplay.classList.add("hidden");
    }

    if (shopNameEdit) {
        shopNameEdit.classList.remove("hidden");
    }


    // Show edit controls
    if (editProfileActions) {
        editProfileActions.classList.remove(
            "hidden"
        );
    }


    // Switch buttons
    if (editAccountBtn) {
        editAccountBtn.classList.add("hidden");
    }

    if (saveAccountBtn) {
        saveAccountBtn.classList.remove("hidden");
    }


    // Put current name in input
    const currentShopName =
        localStorage.getItem("shopName")
        || "";

    if (shopNameInput) {
        shopNameInput.value =
            currentShopName;

        shopNameInput.focus();
    }


    renderProfiles();

}


function exitAccountEditMode() {

    accountEditMode = false;


    // Show shop name
    if (shopNameDisplay) {
        shopNameDisplay.classList.remove(
            "hidden"
        );
    }

    if (shopNameEdit) {
        shopNameEdit.classList.add("hidden");
    }


    // Hide edit controls
    if (editProfileActions) {
        editProfileActions.classList.add(
            "hidden"
        );
    }


    // Switch buttons
    if (editAccountBtn) {
        editAccountBtn.classList.remove(
            "hidden"
        );
    }

    if (saveAccountBtn) {
        saveAccountBtn.classList.add("hidden");
    }


    // Close profile form if open
    closeProfileForm();


    // Reload displayed information
    loadShopName();

    renderProfiles();

}


if (editAccountBtn) {

    editAccountBtn.addEventListener(
        "click",
        function () {

            enterAccountEditMode();

        }
    );

}


if (saveAccountBtn) {

    saveAccountBtn.addEventListener(
        "click",
        function () {

            const shopName =
                shopNameInput
                    ? shopNameInput.value.trim()
                    : "";


            if (shopName === "") {

                localStorage.removeItem(
                    "shopName"
                );

            } else {

                localStorage.setItem(
                    "shopName",
                    shopName
                );

            }


            updateShopNameTitle();

            exitAccountEditMode();

        }
    );

}

if (addProfileBtn) {

    addProfileBtn.addEventListener(
        "click",
        function () {

            const profiles = getProfiles();

            if (profiles.length >= 5) {

                if (profileLimitError) {
                    profileLimitError.textContent =
                        "You already have 5 UPI IDs added.";
                }

                return;
            }

            if (profileLimitError) {
                profileLimitError.textContent = "";
            }

            openProfileForm();

        }
    );

}



// ==========================================
// RESET / REFRESH FORM
// ==========================================

if (resetBtn) {

    resetBtn.addEventListener(
        "click",
        function () {
            // Refresh animation
            resetBtn.classList.remove("resetting");

            void resetBtn.offsetWidth;

            resetBtn.classList.add("resetting");

            // Clear form fields
            if (upiIdSelect) {
                upiIdSelect.value = "";
                updateCustomUpiDropdown();
                closeUpiDropdown();
            }

            if (amountInput) {
                amountInput.value = "";
            }

            if (noteInput) {
                noteInput.value = "";
            }


            // Remove generated QR
            if (qrContainer) {
                qrContainer.innerHTML = "";
            }


            // Hide payment card
            if (paymentCard) {
                paymentCard.classList.add("hidden");
            }


            // Hide Download / Share buttons
            if (qrActions) {
                qrActions.classList.add("hidden");
            }


            // Return to top of Generate page
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

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


            // Clear old errors
            if (profileNameError) {
                profileNameError.textContent = "";
            }

            if (profileUpiIdError) {
                profileUpiIdError.textContent = "";
            }

            if (profileLimitError) {
                profileLimitError.textContent = "";
            }


            // Validate profile name
            if (name === "") {

                if (profileNameError) {
                    profileNameError.textContent =
                        "Profile name cannot be empty.";
                }

                if (profileNameInput) {
                    profileNameInput.focus();
                }

                return;
            }


            // Validate UPI ID
            if (upiId === "") {

                if (profileUpiIdError) {
                    profileUpiIdError.textContent =
                        "UPI ID cannot be empty.";
                }

                if (profileUpiIdInput) {
                    profileUpiIdInput.focus();
                }

                return;
            }


            if (!isValidUpiId(upiId)) {

                if (profileUpiIdError) {
                    profileUpiIdError.textContent =
                        "Enter a valid UPI ID, e.g. name@upi";
                }

                if (profileUpiIdInput) {
                    profileUpiIdInput.focus();
                }

                return;
            }


            const profiles = getProfiles();


            // Maximum 5 profiles
            if (profiles.length >= 5) {

                if (profileLimitError) {
                    profileLimitError.textContent =
                        "You already have 5 UPI IDs added.";
                }

                return;
            }


            // Duplicate UPI ID
            const alreadyExists =
                profiles.some(function (profile) {

                    return profile.upiId.toLowerCase()
                        === upiId.toLowerCase();

                });


            if (alreadyExists) {

                if (profileUpiIdError) {
                    profileUpiIdError.textContent =
                        "This UPI ID is already added.";
                }

                if (profileUpiIdInput) {
                    profileUpiIdInput.focus();
                }

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


            // Clear limit message
            if (profileLimitError) {
                profileLimitError.textContent = "";
            }

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
    
    // Clear previous errors
    if (upiIdError) {
        upiIdError.textContent = "";
    }

    if (amountError) {
        amountError.textContent = "";
    }

    if (noteError) {
        noteError.textContent = "";
    }


    // ======================================
    // VALIDATE UPI ID
    // ======================================

    if (upiId === "") {

        if (upiIdError) {
            upiIdError.textContent =
                "Please select a UPI profile.";
        }

        if (upiIdSelect) {
            upiIdSelect.focus();
        }

        return;
    }


    if (!isValidUpiId(upiId)) {

        if (upiIdError) {
            upiIdError.textContent =
                "Please select a valid UPI profile.";
        }

        if (upiIdSelect) {
            upiIdSelect.focus();
        }

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

            if (amountError) {
                amountError.textContent =
                    "Amount must be greater than ₹0.";
            }

            if (amountInput) {
                amountInput.focus();
            }

            return;
        }


        if (numericAmount > 100000) {

            if (amountError) {
                amountError.textContent =
                    "Amount cannot be more than ₹1,00,000.";
            }

            if (amountInput) {
                amountInput.focus();
            }

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


if (profileNameInput) {

    profileNameInput.addEventListener(
        "input",
        function () {

            if (profileNameError) {
                profileNameError.textContent = "";
            }

        }
    );

}


if (profileUpiIdInput) {

    profileUpiIdInput.addEventListener(
        "input",
        function () {

            if (profileUpiIdError) {
                profileUpiIdError.textContent = "";
            }

        }
    );

}


if (upiIdSelect) {

    upiIdSelect.addEventListener(
        "change",
        function () {

            if (upiIdError) {
                upiIdError.textContent = "";
            }

        }
    );

}


if (amountInput) {

    amountInput.addEventListener(
        "input",
        function () {

            if (amountError) {
                amountError.textContent = "";
            }

        }
    );

}