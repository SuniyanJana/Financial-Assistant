# 🤖 Financial Assistant — Backend API

Node.js + Express.js + MongoDB REST API

---

## 📁 Project Structure

```
src/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Signup, login, salary
│   ├── expenseController.js   # Expense CRUD + stats
│   ├── investmentController.js # Investment + P&L tracking
│   ├── fundController.js      # Fund summary + health score
│   └── goalController.js      # Goal CRUD + savings tracker
├── middleware/
│   ├── auth.js                # JWT protect middleware
│   ├── errorHandler.js        # Global error handler
│   └── validate.js            # express-validator runner
├── models/
│   ├── User.js
│   ├── Expense.js
│   ├── Investment.js
│   └── Goal.js
├── routes/
│   ├── authRoutes.js
│   ├── expenseRoutes.js
│   ├── investmentRoutes.js
│   ├── fundRoutes.js
│   └── goalRoutes.js
└── server.js                  # Entry point
```

---

## ⚙️ Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Then edit .env with your MongoDB URI and JWT secret

# 3. Run in development
npm run dev

# 4. Run in production
npm start
```

---

## 🔐 Authentication
All protected routes require:
```
Authorization: Bearer <token>
```

---

## 📡 API Endpoints

### AUTH  `/api/auth`
| Method | Endpoint     | Auth | Description          |
|--------|-------------|------|----------------------|
| POST   | /signup      | ❌   | Create account       |
| POST   | /login       | ❌   | Login                |
| GET    | /me          | ✅   | Get current user     |
| PUT    | /salary      | ✅   | Update salary        |

**POST /signup**
```json
{ "name": "John", "contact": "john@email.com", "password": "abc123" }
```

**POST /login**
```json
{ "contact": "john@email.com", "password": "abc123" }
```

**PUT /salary**
```json
{ "salary": 50000 }
```

---

### EXPENSES  `/api/expenses`
| Method | Endpoint    | Description                  |
|--------|------------|------------------------------|
| GET    | /           | Get all expenses (paginated) |
| GET    | /stats      | Monthly stats + charts data  |
| POST   | /           | Add expense                  |
| PUT    | /:id        | Edit expense                 |
| DELETE | /:id        | Delete expense               |

**POST /** — Add Expense
```json
{
  "type": "Food",
  "amount": 350,
  "mode": "UPI",
  "note": "Lunch",
  "date": "2024-01-15"
}
```

**GET /stats** — Returns:
- This month total, count, highest, daily average
- Previous month total
- Change percentage
- Daily breakdown array (for chart)
- Category breakdown (for pie chart)
- Last 6 months trend

---

### INVESTMENTS  `/api/investments`
| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| GET    | /                     | Get all investments + summary |
| GET    | /activity             | Investment activity log      |
| POST   | /                     | Add investment               |
| PUT    | /:id/update-value     | Update current value (up/down)|
| PUT    | /:id/withdraw         | Withdraw — calculates P&L    |
| DELETE | /:id                  | Remove investment            |

**POST /** — Add Investment
```json
{ "asset": "SIP", "amount": 5000, "rate": 12 }
```

**PUT /:id/update-value** — Regular check-in
```json
{ "currentValue": 5800, "note": "Market rally" }
```
Response includes: `direction` (up/down), `change`, `changePercent`, `totalPnl`

**PUT /:id/withdraw** — Sell/Withdraw
```json
{ "withdrawAmount": 6200 }
```
Response includes: `isProfit`, `pnl`, `percentageReturn`, `amountAddedToFund`

---

### FUND TRACKER  `/api/fund`
| Method | Endpoint       | Description                  |
|--------|---------------|------------------------------|
| GET    | /summary       | Balance, forecast, emergency |
| GET    | /health-score  | Score + monthly trend        |

**GET /summary** — Returns:
- `salary`, `balance`, `emergencyFund` (15% of salary)
- `dailyAverage`, `daysLeft`
- `investmentReturns` (from withdrawals)
- `forecast` array for balance chart

**GET /health-score** — Returns:
- Numeric `score` (0–100)
- `savingsRate`, investment portfolio
- `monthlyTrend` array for bar chart
- `trendDirection`: "up" (bad 🔴) or "down" (good 🟢)

---

### GOALS  `/api/goals`
| Method | Endpoint       | Description             |
|--------|---------------|-------------------------|
| GET    | /             | Get all goals + summary |
| POST   | /             | Create goal             |
| PUT    | /:id          | Update goal             |
| PUT    | /:id/savings  | Update saved amount     |
| DELETE | /:id          | Delete goal             |

**POST /** — Create Goal
```json
{ "name": "New Laptop", "target": 80000, "saved": 15000 }
```

**PUT /:id/savings** — Update savings
```json
{ "saved": 25000 }
```
Response includes: `achieved`, `remaining`, `percentage`
