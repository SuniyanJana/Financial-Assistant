<div align="center">

<img src="Frontend/src/assets/financial-logo.png" width="110" alt="Financial Assistant Logo">

# 💰 Financial Assistant

### Your personal command center for smarter money management.

Track your money.  
Understand your spending.  
Manage your funds.  
Monitor investments.  
Plan your future.

<br>

![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/API-Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

<br>

[![GitHub](https://img.shields.io/badge/GitHub-SuniyanJana-181717?style=flat-square&logo=github)](https://github.com/SuniyanJana)
[![Repository](https://img.shields.io/badge/Repository-Financial--Assistant-blue?style=flat-square)](https://github.com/SuniyanJana/Financial-Assistant)

</div>

---

# 🧭 Table of Contents

- [✨ About the Project](#-about-the-project)
- [✨ Features](#-features)
- [📊 One Dashboard. Multiple Decisions.](#-one-dashboard-multiple-decisions)
- [⚡ How You Use It](#-how-you-use-it)
- [📈 Financial Logic](#-financial-logic)
- [🚀 Getting Started](#-getting-started)
- [📂 Project Structure](#-project-structure)
- [👨‍💻 Developer](#developer)

---

# ✨ About the Project

**Financial Assistant** is a full-stack personal finance management application designed to bring everyday financial information into one place.

Instead of keeping expenses, investments, income, goals and financial insights separated across different applications or spreadsheets, Financial Assistant connects them into a single dashboard.

The application helps users answer simple but important questions:

> 💳 Where is my money going?

> 💰 How much money do I have available?

> 📈 How are my investments performing?

> 🎯 What am I saving toward?

> 🧠 What does my overall financial position look like?

The project was built to explore how a modern full-stack application can combine **frontend interfaces, REST APIs, authentication, database design, financial calculations and data visualization** into one working product.

---

# ✨ Features

<table>
<tr>
<td width="50%">

## 💳 Expense Intelligence

Know where your money is going.

- ➕ Add expenses
- ✏️ Edit expenses
- 🗑️ Delete expenses
- 🏷️ Categorize spending
- 📅 Monthly spending analysis
- 📊 Visual expense breakdown
- 🔎 Spending patterns
- 📜 Expense history

</td>

<td width="50%">

## 💰 Fund Tracker

Know how much financial runway you have.

- 💵 Monthly income
- 💰 Current balance
- 📊 Monthly spending
- 📅 Previous-month spending
- 📈 Daily spending average
- ⏳ Days balance can last
- 🛡️ Emergency fund estimation

</td>
</tr>

<tr>
<td width="50%">

## 📈 Investment Center

Keep investments connected to your overall financial picture.

- ➕ Add investments
- 💵 Track invested amount
- 📊 Track current value
- 📈 Expected return rate
- 🟢 Active investments
- 📜 Investment history
- 💸 Withdrawal tracking

</td>

<td width="50%">

## 🎯 Goal Tracker

Give your money a destination.

- 🎯 Create financial goals
- 💰 Set target amounts
- 📊 Track progress
- 📅 Monitor future plans
- ⭐ Organize financial priorities

</td>
</tr>

<tr>
<td width="50%">

## 🧠 Financial Health

Turn financial numbers into a clearer picture.

The Health Score provides a simplified view of the user's financial position using available financial information.

</td>

<td width="50%">

## 🔐 Personal & Secure

Your financial information belongs to your account.

- 🔑 JWT authentication
- 🛡️ Protected API routes
- 👤 User-specific records
- 🔒 Password hashing
- ⚙️ Environment-based secrets

</td>
</tr>
</table>

---

# 📊 One Dashboard. Multiple Decisions.

Financial Assistant is designed around the decisions people actually make.

```text
                         FINANCIAL ASSISTANT
                                │
       ┌────────────────────────┼────────────────────────┐
       │                        │                        │
       ▼                        ▼                        ▼
   💳 SPENDING              💰 FUNDS                 📈 INVESTING
       │                        │                        │
       ▼                        ▼                        ▼
  Where is it going?      How much remains?       Where is it growing?
       │                        │                        │
       └────────────────────────┼────────────────────────┘
                                │
                                ▼
                         🎯 FUTURE GOALS
                                │
                                ▼
                       🧠 BETTER DECISIONS
```

---

# ⚡ How You Use It

## 01 — Track

Record your everyday financial activity.

```text
Expenses
    ↓
Categories
    ↓
Monthly totals
    ↓
Spending patterns
```

---

## 02 — Understand

Transform stored financial data into useful information.

```text
Income
Expenses
Investments
Goals
   ↓
Financial Overview
```

---

## 03 — Plan

Set targets instead of simply looking at past spending.

```text
Goal
 ↓
Target
 ↓
Progress
 ↓
Future Planning
```

---

## 04 — Grow

Keep investments connected to your overall financial picture.

```text
Investment
     ↓
Invested Amount
     ↓
Current Value
     ↓
Returns / Withdrawal
```

---

# 📈 Financial Logic

Financial Assistant connects different parts of a user's financial activity.

For example:

```text
Monthly Income
      │
      ├───────────────┐
      │               │
      ▼               ▼
   Expenses       Investments
      │               │
      │               ▼
      │        Active Investment
      │            Amount
      │               │
      └───────┬───────┘
              │
              ▼
        Available Funds
              │
              ▼
       Financial Overview
```

When an investment is made, its invested amount is considered when calculating available funds.

When an investment is withdrawn, the withdrawn amount becomes available again.

This keeps the Fund Tracker connected with investment activity.

---

# 🚀 Getting Started

Want to run Financial Assistant locally?

Follow these steps.

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/SuniyanJana/Financial-Assistant.git
```

Move into the project:

```bash
cd Financial-Assistant
```

---

# 2️⃣ Start the Backend

Move into the backend:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```text
Backend/.env
```

You can use `.env.example` as the template.

Example:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend will run at:

```text
http://localhost:5000
```

---

# 3️⃣ Start the Frontend

Open a **new terminal**.

From the project root:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
Frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the application:

```text
http://localhost:5173
```

---

# 📂 Project Structure

```text
Financial-Assistant/
│
├── 📁 Backend/
│   │
│   ├── 📁 src/
│   │   ├── 📁 config/
│   │   ├── 📁 controllers/
│   │   ├── 📁 middleware/
│   │   ├── 📁 models/
│   │   ├── 📁 routes/
│   │   ├── 📁 utils/
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── README.md
│   ├── package.json
│   └── package-lock.json
│
├── 📁 Frontend/
│   │
│   ├── 📁 public/
│   │
│   ├── 📁 src/
│   │   ├── 📁 api/
│   │   ├── 📁 assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🔮 Future Improvements

- 🤖 AI-powered financial assistance
- 💡 Personalized saving recommendations
- 🔔 Financial alerts
- 📈 More investment insights
- 🧠 Personalized financial recommendations

---

<a id="developer"></a>

# 👨‍💻 Developer

<div align="center">

### Suniyan Jana

**B.Tech — Computer Science & Engineering**  
**SOA University**

[![GitHub](https://img.shields.io/badge/GitHub-@SuniyanJana-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SuniyanJana)

[![Financial Assistant](https://img.shields.io/badge/Project-Financial%20Assistant-00a86b?style=for-the-badge)](https://github.com/SuniyanJana/Financial-Assistant)

</div>

---

<p align="center">

## 💸 Manage Your Money.

## 📊 Understand Your Numbers.

## 🎯 Plan Your Future.

<br>

### Financial Assistant

**Built with React • Node.js • Express • MongoDB**

<br>

⭐ **If you like the project, consider giving it a star.**

</p>

---

