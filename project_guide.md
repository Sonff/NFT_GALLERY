# 📘 NFT Gallery - Beginner's A to Z Project Guide (Hinglish)

Yeh guide un logon ke liye hai jo is project ko bilkul basic se samajhna chahte hain. Agar aap kisi beginner ko yeh project samjhana chahte hain, toh yeh file aapke liye ek complete cheat-sheet ka kaam karegi.

---

## 🌐 1. Web3 Ke Basics (Simple Words Mein)

Sabsay pehle, beginner ko yeh concepts samjhana zaroori hai:
*   **Wallet (MetaMask)**: Yeh blockchain par hamari identity aur security key hoti hai. Jaise bank account ka login credential hota hai, waise hi MetaMask wallet hamara account number (Wallet Address) provide karta hai.
*   **Wallet Address (0x...)**: Yeh user ka public identifier hai (jaise UPI ID ya account number).
*   **Blockchain Networks**: 
    *   *Ethereum*: Sabse bada aur secure network par gas fees expensive hoti hai.
    *   *Polygon*: Ethereum ke upar ek layer-2 network jo fast aur cheap transaction speed deta hai.
    *   *Base Network*: Coinbase dwara banaya gaya secure, low-fee Ethereum layer-2 network.
    *   *BNB Chain*: Binance Smart Chain jo low fees aur speed ke liye popular hai.
*   **NFT (Non-Fungible Token)**: Blockchain par store kiya gaya ek unique digital asset (images, art, gifs).
*   **Alchemy**: Yeh ek node provider hai jo hamare backend code ko blockchain data read karne ki access deta hai (jaise Ethereum, Base, etc. se NFT information laana).

---

## 🔐 2. Cryptographic Sign-In Kaise Kaam Karta Hai? (A to Z Flow)

Traditonal websites par email/password se login hota hai, par is Web3 project mein hum **Passwordless Sign-In** use karte hain:

1.  **Nonce Request**: Jab user "Connect Wallet" dabaata hai, toh front-end server se request karta hai: *"Mujhe is address ke liye ek unique random code (Nonce) do."*
2.  **Challenge Generation**: Server ek random number generates karta hai (jaise `61920`) aur use database mein save kar leta hai.
3.  **MetaMask Signing**: Frontend user ko MetaMask popup dikhata hai: *"Aap is message ko sign kijiye jiski value '61920' hai."* User signature approve karta hai.
4.  **Backend Verification**: Frontend signature ko server par bhejta hai. Server **Ethers.js** (`verifyMessage`) use karke check karta hai ki *kya waqai is signature ko usi wallet address ne sign kiya hai jisne signature bheja tha?*
5.  **JWT Issue**: Verification success hone par, backend ek **JWT Token (JSON Web Token)** issue karta hai. Frontend ise `localStorage` mein rakh leta hai, jisse aage ke requests authenticated maane jaate hain (jaise favorites save karna).

---

## 📁 3. File-by-File Breakdown (Kon si file kya karti hai?)

### 💻 A. Front-End Files (React + Vite)

#### 1. [`src/main.jsx`](file:///F:/Projects/NFT_Gallery/src/main.jsx)
*   **Role**: Pura frontend React application ka initial entry point hai.
*   **Value**: Yeh application ke routes ko Web3Provider, AuthProvider, aur ThemeProvider ke saath wrap karta hai taaki wallet aur theme ka data pure app mein share ho sake.

#### 2. [`src/App.jsx`](file:///F:/Projects/NFT_Gallery/src/App.jsx)
*   **Role**: Application ki routing controller file hai.
*   **Value**: Yeh define karti hai ki kaun si URL par kaun sa page open hoga (Home, Gallery, Favorites, Settings, profile pages).

#### 3. [`src/index.css`](file:///F:/Projects/NFT_Gallery/src/index.css)
*   **Role**: Global design aur styling hub hai.
*   **Value**: Tailwind CSS directives ke saath glassmorphism classes, gradients, and dark mode base settings isme define hain.

#### 4. [`src/context/Web3Context.jsx`](file:///F:/Projects/NFT_Gallery/src/context/Web3Context.jsx)
*   **Role**: MetaMask connection manager hai.
*   **Value**: `window.ethereum` ko listen karta hai. Jab user wallet select karta hai ya network switch karta hai (jaise Base se Polygon), toh yeh instantly react karke frontend display update kar deta hai.

#### 5. [`src/context/AuthContext.jsx`](file:///F:/Projects/NFT_Gallery/src/context/AuthContext.jsx)
*   **Role**: User authentication aur session control state hai.
*   **Value**: Signature verification ke calls handle karta hai, JWT token generate karwata hai, aur user ke cloud favorites data ko active state mein load rakhta hai.

#### 6. [`src/context/ThemeContext.jsx`](file:///F:/Projects/NFT_Gallery/src/context/ThemeContext.jsx)
*   **Role**: Dark/Light mode manager.
*   **Value**: LocalStorage mein theme state save karta hai taaki website reload karne par light/dark mode preference change na ho.

#### 7. [`src/services/api.js`](file:///F:/Projects/NFT_Gallery/src/services/api.js)
*   **Role**: API interceptor binding.
*   **Value**: Frontend backend API calls ke liye Axios instantiator hai. Yeh check karta hai ki agar `localStorage` mein JWT token hai, toh use aage bheje jaane wale har request headers mein automatically inject kar de.

#### 8. [`src/components/Navbar.jsx`](file:///F:/Projects/NFT_Gallery/src/components/Navbar.jsx)
*   **Role**: Header navigation bar.
*   **Value**: Active page routes, logo, dark mode toggle button, wallet disconnect control, aur shortened address (`0x9f02...a5c8`) render karta hai.

#### 9. [`src/components/FilterSidebar.jsx`](file:///F:/Projects/NFT_Gallery/src/components/FilterSidebar.jsx)
*   **Role**: Side filtering controls.
*   **Value**: Blockchain selector (All, Ethereum, Polygon, Base, BNB Chain) aur dynamic collections categories list button render karta hai. Isme `shrink-0` class laya gaya hai taaki text list squeezed ya vertical overlap na kare.

#### 10. [`src/components/NftCard.jsx`](file:///F:/Projects/NFT_Gallery/src/components/NftCard.jsx)
*   **Role**: Single NFT item display manager.
*   **Value**: Renders the image, collection title, network badge, aur floor values (like `0.0000499 ETH` ya empty prices ke liye `N/A`). `pb-[100%] h-0 relative` box wrap lagaya hai taaki size mismatch hone par images collapse/mishap na karein.

#### 11. [`src/components/NftGrid.jsx`](file:///F:/Projects/NFT_Gallery/src/components/NftGrid.jsx)
*   **Role**: Responsive card alignment list.
*   **Value**: Accepts `colsClass` config parameter. Sidebar active hone par `3-column` layout display karta hai aur dashboard/favorites full screen par clean `4-columns` render karta hai.

#### 12. [`src/components/NftDetailsModal.jsx`](file:///F:/Projects/NFT_Gallery/src/components/NftDetailsModal.jsx)
*   **Role**: Pop-up window modal.
*   **Value**: Card click hone par asset parameters (Attributes, token Standard, description, copy contract button, specific properties) screen ke upar clean glassmorphic popup modal mein show karta hai.

#### 13. Pages (`src/pages/`):
*   [`Home.jsx`](file:///F:/Projects/NFT_Gallery/src/pages/Home.jsx): Welcome landing screen jisme animations hain.
*   [`Gallery.jsx`](file:///F:/Projects/NFT_Gallery/src/pages/Gallery.jsx): Main query catalog dashboard jo parameters refresh hone par auto fetch-call load karta hai, pagination update karta hai, aur sorted values update karta hai.
*   [`Favorites.jsx`](file:///F:/Projects/NFT_Gallery/src/pages/Favorites.jsx): Database linked user assets display card list.
*   [`Dashboard.jsx`](file:///F:/Projects/NFT_Gallery/src/pages/Dashboard.jsx): Holding numbers metrics, total unique collections calculations, aur queries activities telemetry summary display karta hai.
*   [`Profile.jsx`](file:///F:/Projects/NFT_Gallery/src/pages/Profile.jsx) / [`Settings.jsx`](file:///F:/Projects/NFT_Gallery/src/pages/Settings.jsx): Custom avatar selections aur username preferences update form controllers.

---

### 🖥️ B. Back-End Files (Node.js + Express + Mongoose)

#### 1. [`server/server.js`](file:///F:/Projects/NFT_Gallery/server/server.js)
*   **Role**: Express web server entry point.
*   **Value**: App config rules load karta hai, Cross-Origin Resource Sharing (CORS) check karta hai, MongoDB database trigger setup bootstrapper initiate karta hai, aur routes controller logic compile karta hai.

#### 2. [`server/config/db.js`](file:///F:/Projects/NFT_Gallery/server/config/db.js)
*   **Role**: MongoDB client database configuration file.
*   **Value**: Cloud MongoDB Atlas database instance se connection secure karta hai.

#### 3. Schemas/Models (`server/models/`):
*   `User.js`: MongoDB Schema. Isme walletAddress, nonce tracking value, custom username, aur avatar preference metadata format saved hota hai.
*   `Favorite.js`: Cloud database layout structure liked collectibles parameters metadata save karne ke liye.
*   `Analytics.js`: Website counts data save rakhta hai.

#### 4. JWT Security Middleware [`server/middleware/auth.js`](file:///F:/Projects/NFT_Gallery/server/middleware/auth.js)
*   **Role**: Session validation blocker.
*   **Value**: Har post/delete requests ke time headers mein se request JWT extract karta hai, use verification key se verify karta hai. Match failure hone par server query reject kar deta hai (Unauthorized 401).

#### 5. Controllers (`server/controllers/`):
*   `authController.js`: Nonce generate karne aur signatures cryptographically check karke session validity JWT generate karne ka logic isme likha hai.
*   `favoriteController.js`: Database operations (create, read, delete) of favorites controller.
*   `nftController.js`: Frontend request read karke networks dynamically divide karta hai, filters map karta hai aur pagination values evaluate karta hai.

#### 6. Service [`server/services/alchemyService.js`](file:///F:/Projects/NFT_Gallery/server/services/alchemyService.js)
*   **Role**: Real-time blockchain data puller node service.
*   **Value**: Alchemy NFT API endpoints ko call karta hai.
    *   **Image Recovery Logic**: Agar main NFT image IPFS details error deteen hain, toh OpenSea CDN (`contract.openSeaMetadata.imageUrl`) se path extract karke load kar leta hai (jaise "Sleepy Emmy OE" key fix).
    *   **Floor Price**: Actual real prices check karke details convert karta hai (jaise `0.0000499 ETH`). Agar detail available na ho, toh random fake values generate karne ke bajaye clean `null` return karta hai, taaki front-end par safely `N/A` print ho sake.

---

## 🛠️ 4. Beginner Ke Liye Troubleshooting Guide

Aap beginner ko ye steps explain kar sakte hain debugging ke liye:

1.  **Frontend Build and Compiles verify karna**:
    `npm run build` run karne se Vite check karta hai ki pure client folder mein koi compiler error, broken relative paths ya code error toh nahi hai. Agar package successfully compile hokar `dist/` create karta hai, iska matlab front-end side code absolute clear hai.
2.  **API Connections testing**:
    Backend API running status inspect karne ke liye terminal task logs test karte hain. Port `5000` default node port hai jaha cloud Atlas database link connection initialize test check report karta hai: `MongoDB connected successfully`.
3.  **Spam vs Original NFTs logic**:
    Sare networks fetch request logic use karte samay wallet me direct multi-chain parallel calls (`Promise.all()`) runs hotin hain jo raw network arrays ko single list me flat karke user console par dynamic catalog view present karta hai.
