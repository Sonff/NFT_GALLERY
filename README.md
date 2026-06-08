# 🎨 NFT Gallery - Premium Full-Stack Web3 Portfolio Platform

[![Vite](https://img.shields.io/badge/Vite-5.4.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.19.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/cloud/atlas)
[![Ethers](https://img.shields.io/badge/Ethers.js-6.13.x-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)](https://docs.ethers.org/)

**NFT Gallery** is a premium, state-of-the-art Web3 portfolio showcase application. Users can connect their MetaMask wallet, verify their identity cryptographically via session-based JWT authentication, query their live digital collectibles (NFTs) in real-time across four major EVM networks (Ethereum, Polygon, Base, and BNB Chain), track genuine floor prices, and curate custom favorites directly to a cloud-hosted MongoDB database.

---

## ✨ Key Features

*   **🦊 MetaMask Connection & Session Security**: Seamless wallet connection with active event listeners to auto-sync account addresses and network changes.
*   **🔐 Cryptographic Passwordless Sign-In**: Request a server-signed random challenge nonce, sign it via MetaMask, and verify it cryptographically on the backend using Ethers.js to issue a secure JWT session token.
*   **🌐 Real-Time Multi-Chain Aggregation**: Fetches active assets across **Ethereum**, **Polygon**, **Base**, and **BNB Chain** in parallel using optimized Alchemy SDK v3 integrations.
*   **🖼️ OpenSea Image Recovery Fallback**: If an NFT's IPFS gateway times out, the backend automatically recovers images using the OpenSea metadata cache (`contract.openSeaMetadata.imageUrl`), restoring missing media seamlessly.
*   **📉 Real Floor Prices**: Displays accurate, on-chain floor prices (e.g. `0.0000499 ETH` for Sleepy Emmy OE) and filters out speculative mock values, showing `N/A` for assets with no active floor price.
*   **🔍 Advanced Search & Filter Sidebar**: Instant query sorting (A-Z, Z-A, Token ID), custom search, and a responsive filter sidebar. The sidebar is secured with `shrink-0` classes to prevent squishing and fits perfectly alongside the responsive NFT Grid.
*   **💖 Cloud Favorites Integration**: Authenticated users can save, fetch, and unsave favorite NFTs, storing metadata persistently in MongoDB Atlas.
*   **📊 Web3 Dashboard & Analytics**: Displays stats like total holding counts, total unique collections, favorite lists, and tracks platform activity telemetry logs.
*   **🎨 Premium Glassmorphic Design**: Curated color palettes with global dark mode toggles, modern Outfit & Inter typography, and customized interactive scrollbars.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), React Router DOM v6, Ethers.js v6, Tailwind CSS v3, Lucide Icons, React Hot Toast |
| **Backend** | Node.js, Express.js, JWT Authentication, Ethers.js, Axios, Morgan Logs, Helmet |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Integrations** | Alchemy NFT API v3 (Ethereum, Polygon, Base, BNB Chain) |

---

## 📁 Project Directory Structure

```text
NFT_Gallery/
├── package.json             (Frontend configuration)
├── tailwind.config.js       (Tailwind styles & utility directives)
├── postcss.config.js
├── index.html
├── src/
│   ├── main.jsx             (React bootstrapper with context wraps)
│   ├── App.jsx              (Global layout router)
│   ├── index.css            (Custom scrollbar, animations, glassmorphism layers)
│   ├── pages/               (Home, Dashboard, Gallery, NftDetails, Favorites, Profile, Settings)
│   ├── components/          (Navbar, Footer, FilterSidebar, NftCard, NftGrid, SearchBar, LoadingSkeleton)
│   ├── context/             (Web3Context, AuthContext, ThemeContext)
│   └── services/            (Axios interceptor configuration)
└── server/
    ├── package.json         (Backend configurations)
    ├── server.js            (Express application runner)
    ├── config/db.js         (MongoDB connection setup)
    ├── models/              (User, Favorite, Analytics schemas)
    ├── middleware/          (JWT verification, errorHandlers)
    ├── controllers/         (authController, nftController, favoriteController)
    └── routes/              (Express API routers)
```

---

## 🚀 Setup & Installation

### Prerequisites

*   [Node.js](https://nodejs.org/) (v20+ recommended)
*   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance running on `27017`)
*   MetaMask browser extension installed.
*   An [Alchemy API Key](https://dashboard.alchemy.com/) (configured for Ethereum, Polygon, Base, and BNB Chain).

### Step 1: Install Dependencies

1.  Clone/Extract the project directory.
2.  Install **Frontend** dependencies in the root folder:
    ```bash
    npm install
    ```
3.  Install **Backend** dependencies in the `server` folder:
    ```bash
    cd server
    npm install
    ```

### Step 2: Configure Environment Variables

1.  **Frontend Config**: Create a `.env` file in the project root:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

2.  **Backend Config**: Create a `.env` file inside the `server/` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string_here
    JWT_SECRET=your_jwt_signing_secret_here
    ALCHEMY_API_KEY=your_alchemy_api_key_here
    NODE_ENV=development
    ```

### Step 3: Start the Application

1.  **Start Backend**: Navigate to `server/` and run:
    ```bash
    npm run dev
    ```
2.  **Start Frontend**: Navigate to the root folder, open a new terminal tab and run:
    ```bash
    npm run dev
    ```
3.  Open the local address printed by Vite (typically `http://localhost:5173`) in your browser.

---

## 🔐 Cryptographic Authentication Flow

The platform utilizes a secure cryptographic handshake protocol for passwordless login:

```mermaid
sequenceDiagram
    autonumber
    actor User as MetaMask Wallet
    participant UI as React Frontend
    participant API as Express Server
    
    User->>UI: Click "Connect Wallet" & "Sign-In"
    UI->>API: GET /api/auth/nonce/:walletAddress
    API-->>UI: Return random cryptographic challenge Nonce
    UI->>User: Request signature over nonce challenge
    User-->>UI: Sign challenge & return hex signature
    UI->>API: POST /api/auth/verify { walletAddress, signature, nonce }
    Note over API: Ethers verifyMessage recovers signature signer address
    API->>API: Check address matches, update User & rotate Nonce
    API-->>UI: Send JWT Access Token & User Profile
    UI->>User: Connection Successful! (Session JWT stored in LocalStorage)
```

---

## 📡 REST API Reference

All routes are prefixed with `/api`.

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| **GET** | `/auth/nonce/:walletAddress` | Fetches a new signature challenge nonce | Public |
| **POST** | `/auth/verify` | Authenticates signature and issues JWT token | Public |
| **GET** | `/nfts/:walletAddress` | Queries and paginates assets (Ethereum, Polygon, Base, BNB) | Public |
| **GET** | `/user/:walletAddress` | Fetches username, avatar, and system stats | Public |
| **PUT** | `/user/profile` | Updates user settings (username/avatar) | JWT Required |
| **GET** | `/favorites/:walletAddress` | Fetches saved favorite assets | Public |
| **POST** | `/favorites` | Saves an NFT metadata block as a favorite | JWT Required |
| **DELETE** | `/favorites/:id` | Un-favorites an NFT (uses composite/Mongo ID) | JWT Required |
| **GET** | `/analytics` | Fetches aggregate global dashboard analytics | Public |

---

## 🧪 Build and Verification

To verify that the application has zero import errors, lint warnings, or asset packaging issues, compile the production distribution package:

```bash
# Compile and build production assets
npm run build
```

This outputs optimized HTML, JS, and CSS chunks into the `dist/` directory ready for static deployments (Vercel, Netlify).

---

## 📄 License

This project is licensed under the MIT License.
#   N F T _ G A L L E R Y  
 