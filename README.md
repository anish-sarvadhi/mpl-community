# 🔐 Next.js WebApp — SSO POC with AES-256 Encryption

This project is a proof-of-concept (POC) demonstrating how to securely share user data via **AES-256-bit encryption** during SSO (Single Sign-On) between a mobile app and a Next.js web application.

---

## 🔒 Encryption Overview

We are using **AES-256 (Advanced Encryption Standard with 256-bit key length)** for encrypting user information passed in the URL.

- **Encryption Type:** AES-256
- **Mode:** CBC (via `crypto-js`)
- **Key Derivation:** PBKDF2 with salt and IV (initialization vector)
- **Cipher Format:** Base64-encoded JSON containing encrypted data, salt, and IV

### 🧠 Brute Force Resistance

AES-256 encryption is extremely secure:

| Type     | Key Size | Possible Combinations      | Brute Force Time (Est.)      |
|----------|----------|-----------------------------|------------------------------|
| AES-256  | 256-bit  | 1.1 x 10⁷⁷ combinations     | **Effectively unbreakable**  |

Without the key, brute-forcing AES-256 is computationally infeasible, even with modern supercomputers.

---

## 🧪 How It Works

1. **Mobile App** encrypts user credentials using AES-256 and attaches the result in a query string like:
```

[https://yourdomain.com/sso-login?data=](https://yourdomain.com/sso-login?data=)\<encrypted\_payload>

````

2. **WebApp (`/sso-login` route)** receives and decrypts the payload.
3. If token is verified, the user is logged in automatically.

---

## 🚀 Getting Started

### 🛠️ Setup Instructions

1. **Install dependencies**:

```bash
yarn
````

2. **Start development server**:

   ```bash
   yarn dev
   ```

3. **Configure your API**:

   Open the file:

   ```
   pages/sso-login.tsx
   ```

   Replace the default API URL with your own backend verification endpoint:

   ```ts
   axios.get('https://<your-backend-url>/api/v1/auth/verify-token', ...)
   ```

---

## 📁 Project Structure Highlights

* `enc-dec.ts`
  Contains AES-256 encryption and decryption logic.

* `app/sso-login/page.tsx`
  Handles SSO login by decrypting data and verifying the token.

---

## 📌 Notes

* Do **not share the encryption key** publicly.
* For production, move keys and secrets to **environment variables**.
* Make sure both client (React Native app) and web use the **same passphrase and encryption logic**.
```
