# UPI Payment Manager

A lightweight offline web application for generating UPI payment QR codes.

The current version allows a user to enter a UPI ID, recipient name, amount, and payment note. The application creates a UPI payment URI and converts it into a QR code that can be scanned using a UPI-compatible payment application.

## Features

* Generate UPI payment QR codes
* Enter recipient UPI ID and name
* Enter a predefined payment amount
* Add an optional payment note
* Validate UPI ID format
* Validate payment amount
* Payment amount limited to ₹1–₹100,000
* User-friendly validation messages
* Works offline after the required QR library is stored locally
* No database or backend required in the current version

## How It Works

The application follows this flow:

```text
User enters payment details
          ↓
Input validation
          ↓
UPI payment URI generated
          ↓
UPI URI encoded into QR code
          ↓
QR code displayed
          ↓
User scans QR using a UPI app
          ↓
UPI payment screen opens
```

For example, the application generates a URI similar to:

```text
upi://pay?pa=example@upi&pn=Kartik&am=100&cu=INR&tn=Test%20Payment
```

This URI is then encoded into a QR code.

## Technologies Used

* HTML
* CSS
* JavaScript
* QR Code JavaScript library
* Git
* GitHub

## Project Structure

```text
upi-payment-manager/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── qrcode.min.js
│
├── .gitignore
└── README.md
```

## Running the Project

The current version is a frontend-only application.

### 1. Clone the repository

```bash
git clone https://github.com/kanu138/upi-payment-manager.git
```

### 2. Open the project

Open the project folder in VS Code.

### 3. Run the application

Open:

```text
frontend/index.html
```

in a web browser.

No backend or database is required for the current version.

## Input Validation

The application validates user input before generating the QR code.

### UPI ID

The application checks that the UPI ID follows a basic format such as:

```text
username@bank
```

This is a format check only. It does not verify whether the UPI ID actually exists.

### Amount

The amount must be:

```text
₹1 ≤ Amount ≤ ₹100,000
```

## Current Limitations

The current version is intentionally simple.

* Payment transactions are not processed by the application.
* The application does not verify whether a payment was completed.
* No transaction data is stored.
* No user accounts or authentication are implemented.
* UPI IDs are entered manually.
* The QR code currently uses a basic design.
* The application does not currently provide QR image download or sharing functionality.

## Future Development

The project will be developed further into a more practical UPI Payment Manager.

### Version 2 — Improved User Interface

The interface will be redesigned around two main sections:

```text
┌─────────────────────────────────────┐
│          UPI Payment Manager        │
├──────────────────┬──────────────────┤
│     Payment      │   Profile /      │
│      QR          │    Settings      │
└──────────────────┴──────────────────┘
```

The Profile / Settings section will allow users to:

* Save up to 5 UPI IDs
* Associate a name with each UPI ID
* Configure a shop or firm name
* Edit saved payment information

The main payment screen will then allow the user to select a saved UPI ID from a dropdown instead of entering it manually every time.

### Business-Friendly QR

The QR design will also be improved so that it is more suitable for shops and small businesses.

The generated QR will include information such as:

* Shop / firm name
* Payment amount
* Selected recipient
* QR code

The application will also provide options to:

* Download the generated QR as an image
* Share the QR image
* Share the payment link

### Version 3 — Backend and Database

A backend and database will eventually be introduced to support features such as:

* Persistent UPI profiles
* Transaction history
* Multiple users
* Saved payment records
* Database-backed settings

Potential technologies for the backend include:

* FastAPI
* MySQL
* SQLAlchemy

## Project Goal

The goal of this project is to progressively develop a simple offline QR generator into a practical payment-management application while learning:

* Frontend development
* JavaScript and DOM manipulation
* API/backend development
* Database management
* Software architecture
* Git and GitHub
* Input validation
* Basic application security
