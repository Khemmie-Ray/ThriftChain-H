# 🪙 ThriftChains Frontend

**ThriftChain** is a decentralized savings dApp that enables users to create and manage individual or group savings goals using ERC20 tokens. This repository contains the frontend interface that interacts with the underlying smart contracts to offer a seamless user experience for thrift creation, participation, and tracking.

---

## 🔍 Overview

ThriftChain empowers users to:
- Save towards personal financial goals (Solo Thrift)
- Collaboratively contribute with friends or community members (Group Thrift)
- Enjoy secure, on-chain management of savings via low-gas proxy contracts

The frontend is designed to guide users through:
- Wallet connection and registration
- Creating or joining savings goals
- Tracking progress and managing contributions

---

## ✨ Features

- **User Registration**: Sign up with a unique username and optional verification for group participation.
- **Thrift Creation**: Launch solo or group savings goals with custom parameters.
- **Group Participation**: Join existing thrift pools once verified by the admin.
- **On-Chain Saving**: Make token contributions securely using ERC20 approvals.
- **Progress Tracking**: View your savings milestones, deadlines, and group stats.
- **Admin Dashboard** *(for superusers)*: Verify users, adjust platform settings, and monitor thrift contracts.

---

## 🛠 Tech Stack

| Layer           | Tools/Frameworks                             |
|----------------|-----------------------------------------------|
| UI              | React.js, Tailwind CSS, Headless UI          |
| Blockchain      | Ethers.js, Reown                             |
| State Mgmt      | Context                                      |

---

## 🌐 Hedera Integration Summary (Detailed)

ThriftChain leverages **Hedera Hashgraph** for fast, low-cost, and eco-friendly blockchain operations:

### **Smart Contract Deployment**
- All smart contracts are deployed on **Hedera Testnet** using Hedera's EVM-compatible environment
- The factory pattern ensures minimal gas costs by deploying lightweight proxy contracts for each thrift goal
- Contracts utilize Hedera's native ERC20 token standards for savings contributions

### **Key Integrations**
- **Hedera JSON-RPC Relay**: The frontend connects to Hedera Testnet via the JSON-RPC relay endpoint for seamless Ethereum tooling compatibility
- **Wallet Integration**: Users connect their Hedera-compatible wallets (MetaMask, HashPack, Blade) through Reown (formerly WalletConnect)
- **Transaction Processing**: All savings operations (deposits, withdrawals, thrift creation) are executed as Hedera smart contract transactions
- **Token Support**: The dApp uses HTS (Hedera Token Service) compatible ERC20 tokens or wrapped HBAR for contributions

### **Why Hedera?**
- **Low Fees**: Transaction costs are significantly lower than Ethereum mainnet
- **Fast Finality**: Near-instant transaction confirmation (3-5 seconds)
- **Carbon Negative**: Hedera's environmentally sustainable consensus mechanism
- **Security**: Enterprise-grade security with transparent governance

---

## 🚀 Deployment & Setup Instructions

Follow these step-by-step instructions to run ThriftChain locally on **Hedera Testnet**:

### **Prerequisites**

Before you begin, ensure you have:
- Node.js (v16 or higher)
- npm or yarn package manager
- A Hedera-compatible wallet (MetaMask configured for Hedera Testnet)
- Testnet HBAR for gas fees (get from [Hedera Faucet](https://portal.hedera.com/))

---

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/your-username/thriftchain-frontend.git
cd thriftchain-frontend
```

---

### **Step 2: Install Dependencies**

```bash
npm install
```

*Or if using yarn:*

```bash
yarn install
```

---

### **Step 3: Configure Environment Variables**

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Edit the `.env` file with the following Hedera Testnet configuration:

```env
# Hedera Testnet RPC URL
VITE_RPC_URL=https://testnet.hashio.io/api

# Deployed Contract Addresses on Hedera Testnet
VITE_CONTRACT_ADDRESS=0x473Ffc0f943B1a39576D98537133C6ae688d135e
VITE_MULTICALL2_ADDRESS=0xC0acb216BA2863f30b627512d5a80568BDF2F482

# Mock Token for Testing
VITE_MOCK_TOKEN_ADDRESS=0xe850E1BF5Cfb124B5D986A301e925aBBaDC34F9C

# Optional: Reown (WalletConnect) Project ID
VITE_PROJECTID=your_project_id_here
```

**Important Notes:**
- The RPC URL connects to Hedera Testnet via the JSON-RPC relay
- Contract addresses are already deployed on Hedera Testnet
- Get a free Reown Project ID from [Reown Cloud](https://cloud.reown.com/)

---

### **Step 4: Configure MetaMask for Hedera Testnet**

Add Hedera Testnet to your MetaMask:

| Parameter | Value |
|-----------|-------|
| **Network Name** | Hedera Testnet |
| **RPC URL** | `https://testnet.hashio.io/api` |
| **Chain ID** | `296` |
| **Currency Symbol** | `HBAR` |
| **Block Explorer** | `https://hashscan.io/testnet` |

---

### **Step 5: Fund Your Wallet**

Get testnet HBAR from the [Hedera Portal Faucet](https://portal.hedera.com/):

1. Create a Hedera Testnet account
2. Copy your wallet address
3. Request testnet HBAR (needed for gas fees)

---

### **Step 6: Run the Development Server**

Start the local development server:

```bash
npm run dev
```

*Or with yarn:*

```bash
yarn dev
```

The application will launch at:

```
http://localhost:5173
```

---

### **Running Environment**

When properly configured, your local environment should have:

- **Frontend**: React development server running on `http://localhost:5173`
- **Blockchain Network**: Connected to Hedera Testnet via `https://testnet.hashio.io/api`
- **Wallet**: MetaMask or compatible wallet connected to Hedera Testnet (Chain ID: 296)
- **Smart Contracts**: Interacting with deployed contracts at the addresses specified in `.env`

**Expected Console Output:**

```
VITE v4.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

### **Step 7: Test the Application**

1. Open `http://localhost:5173` in your browser
2. Connect your wallet (ensure it's on Hedera Testnet)
3. Register a new user with a username
4. Create a solo or group thrift savings goal
5. Make test contributions using the Mock Token
6. Track your savings progress on the dashboard

---

### **Troubleshooting**

#### Issue: Wallet won't connect
- **Solution**: Verify MetaMask is on Hedera Testnet (Chain ID: 296) and has testnet HBAR

#### Issue: Transactions failing
- **Solution**: Ensure you have sufficient testnet HBAR for gas fees

#### Issue: Contract not found errors
- **Solution**: Double-check contract addresses in `.env` match deployed addresses

#### Issue: RPC connection errors
- **Solution**: Verify `VITE_RPC_URL` is set to `https://testnet.hashio.io/api`

---

## 📝 Contract Addresses

All contracts are deployed on **Hedera Testnet**:

- **Main Contract**: `0x473Ffc0f943B1a39576D98537133C6ae688d135e`
- **Multicall2**: `0xC0acb216BA2863f30b627512d5a80568BDF2F482`
- **Mock Token**: `0xe850E1BF5Cfb124B5D986A301e925aBBaDC34F9C`

View contracts on [HashScan Testnet Explorer](https://hashscan.io/testnet)

---

## 📚 Additional Resources

- [Hedera Documentation](https://docs.hedera.com/)
- [Hedera Testnet Portal](https://portal.hedera.com/)
- [HashScan Explorer](https://hashscan.io/)
- [Reown Documentation](https://docs.reown.com/)
- [Ethers.js Documentation](https://docs.ethers.org/)

---

## 📄 License

This project is licensed under the MIT License.