# 🌾 DISHA — KissanConnect

### AI-Powered Farmer–Buyer Marketplace

DISHA (KissanConnect) is a farmer-focused digital marketplace that directly connects **farmers with buyers**, helping reduce middlemen, improve price discovery, and make agricultural selling more transparent.

The platform combines **market intelligence, AI assistance, intelligent matching, FPO aggregation, and logistics estimation** into one system.

---

## 🚀 Key Features

### 👨‍🌾 Farmer
- Create and manage crop listings
- Set expected selling price and quantity
- Find suitable buyers
- View buyer requirements
- Receive intelligent buyer matches
- Join and contribute to FPOs
- Track FPO purchases
- View market price trends
- Estimate transportation and selling costs

### 🏢 Buyer
- Create crop requirements
- Discover matching farmers
- Purchase from individual farmers or FPOs
- View crop quantity, quality, grade and expected price

### 🤖 DISHA AI Assistant
An AI-powered farmer assistant using **Snowflake Cortex AI**.

It can:
- Explain marketplace features
- Help farmers understand crop selling
- Explain buyer matching
- Explain net realization
- Explain transportation costs
- Understand English, Hindi and Hinglish
- Provide simple, farmer-friendly responses

The AI is designed **not to invent real-time marketplace information** or claim that an action was performed unless the backend actually performs it.

---

# ❄️ Snowflake Integration

Snowflake is used in DISHA in **two separate ways**.

## 1. 📊 Snowflake Market Intelligence

DISHA uses Snowflake to process and serve mandi price data.

### Data Source

Mandi data is obtained from the Government of India's **data.gov.in** platform.

The data is stored and analyzed in Snowflake using:

```text
Database
SNOWFLAKE_LEARNING_DB

Schema
MARKET_INTELLIGENCE

Table
MANDI_PRICES

Warehouse
COMPUTE_WH
```

The backend provides market intelligence such as:

- Available crops
- Available states
- Crop price trends
- Historical mandi prices
- Market-based price information

Example API endpoints:

```text
/api/market-intelligence/crops
/api/market-intelligence/states
/api/market-intelligence/trend/:crop
```

This allows farmers to make better selling decisions using real market data instead of static/mock information.

---

## 2. 🤖 Snowflake Cortex AI

DISHA's chatbot uses **Snowflake Cortex AI** for natural-language assistance.

The backend communicates with the Snowflake Cortex REST API using an OpenAI-compatible client.

Architecture:

```text
React Chatbot
      ↓
Express Backend
      ↓
Cortex Service
      ↓
Snowflake Cortex AI
      ↓
AI Response
      ↓
Farmer
```

The Cortex integration uses:

```env
CORTEX_ACCOUNT_URL=...
CORTEX_PAT=...
```

A dedicated Snowflake account is used for Cortex AI, keeping the AI infrastructure separate from the existing mandi-data Snowflake account.

### Why Cortex?

- AI powered by Snowflake
- Secure API-based integration
- OpenAI-compatible API interface
- Supports farmer-friendly natural-language interaction
- Demonstrates practical Snowflake Cortex usage in the application

---

# 🧠 Intelligent Farmer–Buyer Matching

DISHA calculates a compatibility score between farmer listings and buyer requirements.

Example:

```text
Crop Match       → 30%
Quantity Match   → 15%
Quality Match    → 0%
Grade Match      → 10%
Location Match   → 10%
Price Match      → 20%
```

The resulting score helps identify suitable buyers for farmers.

---

# 🚚 Logistics & Net Realization

DISHA integrates transportation estimation to help farmers understand the actual economics of selling their crop.

The system considers:

- Distance
- Estimated travel time
- Transportation cost
- Selling price
- Production cost
- Other expenses

This helps calculate **net realization**, rather than looking only at the selling price.

---

# 👥 FPO Aggregation

Farmers can join a **Farmer Producer Organization (FPO)** and contribute their produce.

The system supports:

- FPO creation
- Joining FPOs
- Crop contribution
- Target quantity
- Collected quantity
- Buyer purchases
- Remaining quantity
- Purchase status tracking

This allows multiple farmers to collectively fulfill larger buyer requirements.

---

# 🛠️ Technology Stack

### Frontend
- React
- Vite
- Framer Motion
- Lucide Icons
- CSS
- i18n / Hindi support

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- REST APIs

### AI & Data
- Snowflake Cortex AI
- Snowflake Market Intelligence
- Government mandi data
- OpenRouteService

---

# 📁 Project Structure

```text
KissanConnect/
│
├── frontend/
│   ├── src/
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   │   ├── cortexService.js
│   │   └── ...
│   ├── middleware/
│   ├── test-cortex.js
│   ├── server.js
│   └── .env
│
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the backend:

```env
PORT=5000

MONGODB_URL=your_mongodb_url

JWT_SECRET=your_jwt_secret

ORS_API_KEY=your_ors_api_key

MANDI_API_KEY=your_mandi_api_key

# Existing Snowflake account for market intelligence
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_USERNAME=your_username
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_WAREHOUSE=your_warehouse
SNOWFLAKE_DATABASE=your_database
SNOWFLAKE_SCHEMA=your_schema

# Separate Snowflake account for Cortex AI
CORTEX_ACCOUNT_URL=your_cortex_account_url
CORTEX_PAT=your_cortex_pat
```

**Never commit `.env` or expose your API keys/PATs publicly.**

---

# ▶️ Running the Project

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend communicates with the Express backend through REST APIs.

---

# 🌱 Vision

DISHA aims to create a more transparent agricultural marketplace where farmers can:

**List → Discover Buyers → Match → Calculate Costs → Sell**

By combining **real market data, AI assistance, intelligent matching, FPO aggregation and logistics intelligence**, DISHA helps farmers make more informed selling decisions and connect directly with buyers.

---

## 🏆 Project Highlights

- 🌾 Direct farmer–buyer marketplace
- 📊 Real mandi market intelligence using Snowflake
- ❄️ Snowflake Cortex AI-powered assistant
- 🤖 Intelligent buyer matching
- 👥 FPO aggregation
- 🚚 Logistics cost estimation
- 💰 Net realization analysis
- 🌐 Hindi / English / Hinglish farmer-friendly experience
