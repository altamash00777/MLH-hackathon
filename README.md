# 🌾 DISHA — Agricultural Market Coordination Platform

> **Connecting Farmers, Buyers & Market Intelligence**

DISHA is a technology-based agricultural platform built for the **MLH Hackathon — Open Innovation**. It helps farmers and buyers discover suitable matches and coordinate the complete agricultural transaction from **matching to payment**.

---

## 🎯 Problem

Farmers and buyers often have fragmented information about:

* Crop availability
* Quantity and quality
* Price
* Location
* Pickup and delivery
* Payment status
* Market prices

Finding a buyer is only one part of the problem. After a match, multiple activities still need to be coordinated.

---

## 💡 Solution

DISHA provides a single platform for:

**Farmer → Buyer Matching → Deal → Pickup → Delivery → Payment**

### Key Features

* 👨‍🌾 Farmer crop listings
* 🏢 Buyer requirements
* 🤝 Farmer-buyer matching
* 📑 Deal coordination and task tracking
* 🚚 Pickup & delivery coordination
* 💰 Net realization / profit calculation
* 💳 Payment tracking
* 📊 Current mandi market intelligence
* 🤖 AI-ready farmer assistant

---

## ❄️ Snowflake Integration

Snowflake is used as the **market intelligence and analytical data layer**.

### MongoDB

Stores operational data:

```text
Users
Listings
Requirements
Matches
Deals
Transactions
Payments
```

### Snowflake

Stores and analyzes mandi market data:

```text
Crop
State
District
Market
Variety
Grade
Min Price
Max Price
Modal Price
Arrival Date
```

Market data is collected from the **Government of India data.gov.in Mandi API**, imported into Snowflake, and exposed through the backend to the React **Market Intelligence** dashboard.

```text
data.gov.in
     ↓
Snowflake
     ↓
Market Intelligence API
     ↓
React Dashboard
     ↓
Farmer
```

This allows farmers to view current market prices and compare markets for their selected crop.

---

## 🔄 How DISHA Works

```text
Farmer Creates Listing
          ↓
Buyer Creates Requirement
          ↓
Matching Engine
          ↓
Deal Created
          ↓
Task Coordination
          ↓
Pickup & Delivery
          ↓
Payment
          ↓
Transaction Completed
```

---

## 🛠️ Tech Stack

**Frontend**

* React.js
* Vite
* CSS

**Backend**

* Node.js
* Express.js
* REST API
* JWT

**Databases**

* MongoDB — transactional data
* Snowflake — market intelligence

**External Services**

* Government of India data.gov.in
* OpenRouteService

**AI**

* Snowflake Cortex / DISHA Sahayak — planned AI intelligence layer

---

## 🌟 Why DISHA?

DISHA is designed not just as a marketplace, but as a **coordination platform**.

It connects:

> **Matching + Market Intelligence + Deal Coordination + Logistics + Payment**

into one workflow, reducing information fragmentation between farmers and buyers.

---

## 🚀 Future Scope

* 🤖 DISHA Sahayak AI assistant
* 📈 Advanced market analytics
* 🧠 Snowflake Cortex integration
* 🚛 Logistics provider coordination
* 🏪 Storage coordination
* 👥 FPO group transactions

---

## 🏆 Hackathon

**MLH Hackathon — Open Innovation**

### Project: DISHA

> *Turning fragmented agricultural transactions into one coordinated workflow.*

---
