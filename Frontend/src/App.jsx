import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import financialLogo from "./assets/financial-logo.png";
import { api } from "./api/api";

// ─────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────

const G = {
  bg: "#030f07",
  card: "#071a0e",
  border: "#0d3319",
  neon: "#00ff6a",
  neonDim: "#00c44f",
  neonFaint: "rgba(0,255,106,0.08)",
  red: "#ff3b5c",
  amber: "#ffb700",
  text: "#e8ffe0",
  muted: "#4d7a5a",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Syne:wght@400;700;800&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: ${G.bg};
  color: ${G.text};
  font-family: 'Syne', sans-serif;
  min-height: 100vh;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: ${G.bg};
}

::-webkit-scrollbar-thumb {
  background: ${G.neonDim};
  border-radius: 2px;
}

.mono {
  font-family: 'Share Tech Mono', monospace;
}

.card {
  background: ${G.card};
  border: 1px solid ${G.border};
  border-radius: 16px;
  padding: 24px;
}

.neon-text {
  color: ${G.neon};
  text-shadow: 0 0 12px ${G.neon}44;
}

.btn-neon {
  background: ${G.neon};
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all .2s;
}

.btn-neon:hover {
  background: #fff;
  box-shadow: 0 0 20px ${G.neon}88;
}

.btn-ghost {
  background: transparent;
  color: ${G.neon};
  border: 1px solid ${G.neonDim};
  border-radius: 8px;
  padding: 9px 20px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all .2s;
}

.btn-ghost:hover {
  background: ${G.neonFaint};
}

.btn-amber {
  background: transparent;
  color: ${G.amber};
  border: 1px solid ${G.amber}55;
  border-radius: 8px;
  padding: 8px 14px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all .2s;
}

.btn-amber:hover {
  background: ${G.amber}18;
}

.btn-danger {
  background: transparent;
  color: ${G.red};
  border: 1px solid ${G.red}55;
  border-radius: 8px;
  padding: 8px 14px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all .2s;
}

.btn-danger:hover {
  background: ${G.red}18;
}

input,
select,
textarea {
  background: #0a1f10;
  border: 1px solid ${G.border};
  color: ${G.text};
  border-radius: 8px;
  padding: 10px 14px;
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  width: 100%;
  outline: none;
  transition: border .2s;
}

input:focus,
select:focus,
textarea:focus {
  border-color: ${G.neonDim};
  box-shadow: 0 0 8px ${G.neon}22;
}

select option {
  background: #0a1f10;
}

label {
  font-size: 12px;
  color: ${G.muted};
  display: block;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: .8px;
}

.nav-item {
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  transition: all .2s;
  white-space: nowrap;
  text-align: center;
}

.nav-item.active {
  background: ${G.neon};
  color: #000;
}

.nav-item:not(.active):hover {
  background: ${G.neonFaint};
  color: ${G.neon};
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.82);
  backdrop-filter: blur(6px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal {
  background: #071a0e;
  border: 1px solid ${G.neonDim};
  border-radius: 20px;
  padding: 28px;
  width: 100%;
  max-width: 500px;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: 0 0 50px ${G.neon}22;
}

.sbox {
  background: ${G.card};
  border: 1px solid ${G.border};
  border-radius: 12px;
  padding: 18px;
  flex: 1;
  min-width: 140px;
}

.pbar-bg {
  background: #0d3319;
  border-radius: 100px;
  height: 8px;
  overflow: hidden;
}

.pbar-fill {
  background: linear-gradient(90deg, ${G.neonDim}, ${G.neon});
  border-radius: 100px;
  height: 100%;
  transition: width .6s ease;
}

.sdot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}

.g2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.inv-row {
  background: ${G.bg};
  border: 1px solid ${G.border};
  border-radius: 12px;
  padding: 16px;
  transition: border .2s;
}

.inv-row:hover {
  border-color: ${G.neonDim}55;
}

.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
}

.bup {
  background: ${G.neon}22;
  color: ${G.neon};
  border: 1px solid ${G.neon}44;
}

.bdn {
  background: ${G.red}22;
  color: ${G.red};
  border: 1px solid ${G.red}44;
}

.bamb {
  background: ${G.amber}22;
  color: ${G.amber};
  border: 1px solid ${G.amber}44;
}

@media(max-width:620px) {
  .card {
    padding: 16px;
  }

  .modal {
    padding: 20px;
  }

  .srow {
    flex-direction: column;
  }

  .g2 {
    grid-template-columns: 1fr;
  }
}
`;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

const fmtC = (n) => `₹${fmt(n)}`;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const today = () => new Date().toISOString().slice(0, 10);

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────

function Nav({ page, setPage, user, onLogout }) {
  return (
    <nav
      style={{
        background: G.card,
        borderBottom: `1px solid ${G.border}`,
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <span
  style={{
    display: "flex",
    alignItems: "center",
    fontWeight: 800,
    fontSize: 15,
    color: G.neon,
    marginRight: 4,
    whiteSpace: "nowrap",
    textShadow: `0 0 16px ${G.neon}55`,
  }}
>
  <img
    src={financialLogo}
    alt="Financial Assistant"
    style={{
      width: 32,
      height: 32,
      objectFit: "contain",
      marginRight: 6,
      display: "block",
    }}
  />

  Financial Assistant
</span>

      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          flex: 1,
        }}
      >
        {["Expenses", "Fund Tracker", "Health Score", "Goal Tracker"].map(
          (p, i) => (
            <div
              key={p}
              className={`nav-item${page === i + 1 ? " active" : ""}`}
              onClick={() => setPage(i + 1)}
            >
              {p}
            </div>
          )
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: G.muted,
          }}
        >
          👤 {user?.name || user?.email || "User"}
        </span>

        <button
          className="btn-danger"
          style={{
            padding: "6px 12px",
            fontSize: 12,
          }}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────
// LOGIN / SIGNUP
// ─────────────────────────────────────────────

function Login({ onLogin }) {
  const [f, sf] = useState({
    name: "",
    contact: "",
    password: "",
  });

  const [err, serr] = useState("");
  const [mode, smode] = useState("login");
  const [loading, setLoading] = useState(false);

  const go = async () => {
    if (
      !f.contact.trim() ||
      !f.password ||
      (mode === "signup" && !f.name.trim())
    ) {
      serr("All fields required");
      return;
    }

    serr("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const data = await api.request("/auth/signup", {
          method: "POST",
          body: JSON.stringify({
            name: f.name.trim(),
            email: f.contact.trim().toLowerCase(),
            password: f.password,
          }),
        });

        if (data.token) {
          localStorage.setItem("fa_token", data.token);
        }

        onLogin(data.user || data);
      } else {
        const data = await api.request("/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: f.contact.trim().toLowerCase(),
            password: f.password,
          }),
        });

        if (data.token) {
          localStorage.setItem("fa_token", data.token);
        }

        onLogin(data.user || data);
      }
    } catch (error) {
      serr(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: `radial-gradient(ellipse at 50% 0%, ${G.neon}08 0%, ${G.bg} 70%)`,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 36,
          }}
        >
          <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  }}
>
  <img
    src={financialLogo}
    alt="Financial Assistant"
    style={{
      width: 52,
      height: 52,
      objectFit: "contain",
      display: "block",
    }}
  />
</div>

          <h1
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: G.neon,
              textShadow: `0 0 28px ${G.neon}55`,
            }}
          >
            Financial Assistant
          </h1>

          <p
            style={{
              color: G.muted,
              marginTop: 6,
              fontSize: 14,
            }}
          >
            Your intelligent personal finance companion
          </p>
        </div>

        <div
          className="card"
          style={{
            border: `1px solid ${G.neonDim}`,
          }}
        >
          <h2
            style={{
              fontWeight: 700,
              marginBottom: 24,
              fontSize: 18,
            }}
          >
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {mode === "signup" && (
              <div>
                <label>Full Name</label>

                <input
                  placeholder="John Doe"
                  value={f.name}
                  onChange={(e) =>
                    sf((p) => ({
                      ...p,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
            )}

            <div>
              <label>Email</label>

              <input
                type="email"
                placeholder="email@example.com"
                value={f.contact}
                onChange={(e) =>
                  sf((p) => ({
                    ...p,
                    contact: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label>Password</label>

              <input
                type="password"
                placeholder="••••••••"
                value={f.password}
                onChange={(e) =>
                  sf((p) => ({
                    ...p,
                    password: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    go();
                  }
                }}
              />
            </div>

            {err && (
              <p
                style={{
                  color: G.red,
                  fontSize: 13,
                }}
              >
                ⚠ {err}
              </p>
            )}

            <button
              className="btn-neon"
              style={{
                width: "100%",
                padding: 13,
                fontSize: 16,
              }}
              onClick={go}
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "signup"
                ? "Create Account"
                : "Login"}
            </button>
          </div>

          <p
            style={{
              marginTop: 20,
              textAlign: "center",
              fontSize: 13,
              color: G.muted,
            }}
          >
            {mode === "signup"
              ? "Already have an account? "
              : "New here? "}

            <span
              style={{
                color: G.neon,
                cursor: "pointer",
              }}
              onClick={() => {
                smode((m) => (m === "signup" ? "login" : "signup"));
                serr("");
              }}
            >
              {mode === "signup" ? "Login" : "Sign Up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// EXPENSE PAGE
// ─────────────────────────────────────────────

function ExpensePage() {
  const [expenses, setExp] = useState([]);
  const [showAdd, setSA] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, sf] = useState({
    type: "",
    amount: "",
    mode: "Cash",
    note: "",
    date: today(),
  });

  const TYPES = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Health",
    "Education",
    "Entertainment",
    "Other",
  ];

  const MODES = [
    "Cash",
    "UPI",
    "Card",
    "Net Banking",
    "Wallet",
  ];

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.request("/expenses");

      setExp(data.expenses || []);
    } catch (error) {
      console.error("Failed to load expenses:", error);
      setError(error.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const addExp = async () => {
    if (!form.type || !form.amount) {
      setError("Please select a type and enter an amount.");
      return;
    }

    try {
      setError("");

      const data = await api.request("/expenses", {
        method: "POST",
        body: JSON.stringify({
          type: form.type,
          amount: Number(form.amount),
          mode: form.mode,
          note: form.note,
          date: form.date,
        }),
      });

      setExp((prev) => [data.expense, ...prev]);

      sf({
        type: "",
        amount: "",
        mode: "Cash",
        note: "",
        date: today(),
      });

      setSA(false);
    } catch (error) {
      console.error("Failed to add expense:", error);
      setError(error.message || "Failed to add expense");
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await api.request(`/expenses/${id}`, {
        method: "DELETE",
      });

      setExp((prev) => prev.filter((e) => e._id !== id));
    } catch (error) {
      setError(error.message || "Failed to delete expense");
    }
  };

  const now = new Date();
  const tm = now.getMonth();
  const ty = now.getFullYear();

  const tme = expenses.filter((e) => {
    const d = new Date(e.date);

    return (
      d.getMonth() === tm &&
      d.getFullYear() === ty
    );
  });

  const pme = expenses.filter((e) => {
    const d = new Date(e.date);

    const pm = tm === 0 ? 11 : tm - 1;
    const py = tm === 0 ? ty - 1 : ty;

    return (
      d.getMonth() === pm &&
      d.getFullYear() === py
    );
  });

  const tmt = tme.reduce(
    (a, e) => a + Number(e.amount || 0),
    0
  );

  const pmt = pme.reduce(
    (a, e) => a + Number(e.amount || 0),
    0
  );

  const dayAvg =
    now.getDate() > 0
      ? (tmt / now.getDate()).toFixed(0)
      : 0;

  const high = tme.length
    ? Math.max(...tme.map((e) => Number(e.amount || 0)))
    : 0;

  const diff = pmt
    ? ((tmt - pmt) / pmt * 100).toFixed(1)
    : null;

  const byDate = {};

  tme.forEach((e) => {
    const key = new Date(e.date)
      .toISOString()
      .slice(0, 10);

    byDate[key] =
      (byDate[key] || 0) +
      Number(e.amount || 0);
  });

  const cdata = Object.entries(byDate)
    .sort()
    .map(([d, a]) => ({
      date: d.slice(5),
      amt: a,
    }));

  const byType = {};

  tme.forEach((e) => {
    byType[e.type] =
      (byType[e.type] || 0) +
      Number(e.amount || 0);
  });

  const pie = Object.entries(byType).map(
    ([n, v]) => ({
      name: n,
      value: v,
    })
  );

  const PC = [
    G.neon,
    "#00d4aa",
    "#00aaff",
    "#aa00ff",
    G.amber,
    G.red,
    "#ff6b00",
    "#00ffdd",
  ];

  return (
    <div
      style={{
        padding: "24px 20px",
        maxWidth: 920,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            Expense{" "}
            <span className="neon-text">
              Window
            </span>
          </h2>

          <p
            style={{
              color: G.muted,
              fontSize: 13,
              marginTop: 2,
            }}
          >
            {MONTHS[tm]} {ty}
          </p>
        </div>

        <button
          className="btn-neon"
          onClick={() => setSA(true)}
        >
          + Add Expense
        </button>
      </div>

      {loading && (
        <p
          style={{
            color: G.muted,
            marginBottom: 16,
          }}
        >
          Loading expenses...
        </p>
      )}

      {error && (
        <p
          style={{
            color: G.red,
            marginBottom: 16,
          }}
        >
          ⚠ {error}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
        className="srow"
      >
        {[
          {
            label: "This Month",
            val: fmtC(tmt),
            sub:
              diff !== null
                ? `${diff > 0 ? "↑" : "↓"} ${Math.abs(
                    diff
                  )}% vs last month`
                : "No prev data",
            sc:
              diff > 0
                ? G.red
                : G.neon,
          },
          {
            label: "Daily Average",
            val: fmtC(dayAvg),
            sub: "per day this month",
            sc: G.muted,
          },
          {
            label: "Highest",
            val: fmtC(high),
            sub: "single transaction",
            sc: G.amber,
          },
          {
            label: "Transactions",
            val: tme.length,
            sub: "this month",
            sc: G.muted,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="sbox"
            style={{
              flex: "1 1 140px",
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: G.muted,
                textTransform: "uppercase",
                letterSpacing: ".8px",
              }}
            >
              {s.label}
            </p>

            <p
              className="mono"
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: G.neon,
                margin: "6px 0 4px",
              }}
            >
              {s.val}
            </p>

            <p
              style={{
                fontSize: 12,
                color: s.sc,
              }}
            >
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      {cdata.length > 0 && (
        <div
          className="g2"
          style={{
            marginBottom: 20,
          }}
        >
          <div className="card">
            <p
              style={{
                fontWeight: 700,
                marginBottom: 16,
                fontSize: 14,
              }}
            >
              Daily Expenses
            </p>

            <ResponsiveContainer
              width="100%"
              height={180}
            >
              <AreaChart data={cdata}>
                <defs>
                  <linearGradient
                    id="expenseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={G.neon}
                      stopOpacity={0.3}
                    />

                    <stop
                      offset="95%"
                      stopColor={G.neon}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={G.border}
                />

                <XAxis
                  dataKey="date"
                  stroke={G.muted}
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  stroke={G.muted}
                  tick={{ fontSize: 11 }}
                />

                <Tooltip
                  contentStyle={{
                    background: G.card,
                    border: `1px solid ${G.border}`,
                    borderRadius: 8,
                    color: G.text,
                  }}
                  formatter={(v) => [
                    fmtC(v),
                    "Amount",
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="amt"
                  stroke={G.neon}
                  fill="url(#expenseGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <p
              style={{
                fontWeight: 700,
                marginBottom: 16,
                fontSize: 14,
              }}
            >
              By Category
            </p>

            {pie.length ? (
              <ResponsiveContainer
                width="100%"
                height={180}
              >
                <PieChart>
                  <Pie
                    data={pie}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pie.map((_, i) => (
                      <Cell
                        key={i}
                        fill={
                          PC[i % PC.length]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      background: G.card,
                      border: `1px solid ${G.border}`,
                      borderRadius: 8,
                      color: G.text,
                    }}
                    formatter={(v) => fmtC(v)}
                  />

                  <Legend
                    iconSize={8}
                    wrapperStyle={{
                      fontSize: 11,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p
                style={{
                  color: G.muted,
                  textAlign: "center",
                  paddingTop: 60,
                  fontSize: 13,
                }}
              >
                No data yet
              </p>
            )}
          </div>
        </div>
      )}

      <div className="card">
        <p
          style={{
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Recent Transactions
        </p>

        {expenses.length === 0 ? (
          <p
            style={{
              color: G.muted,
              textAlign: "center",
              padding: "32px 0",
              fontSize: 13,
            }}
          >
            No expenses yet. Add your first!
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {expenses.slice(0, 10).map((e) => (
              <div
                key={e._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: G.bg,
                  borderRadius: 10,
                  border: `1px solid ${G.border}`,
                  gap: 10,
                }}
              >
                <div>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {e.type}
                  </span>

                  <span
                    style={{
                      color: G.muted,
                      fontSize: 12,
                      marginLeft: 8,
                    }}
                  >
                    {e.mode}
                  </span>

                  {e.note && (
                    <p
                      style={{
                        fontSize: 12,
                        color: G.muted,
                        marginTop: 2,
                      }}
                    >
                      {e.note}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    textAlign: "right",
                  }}
                >
                  <p
                    className="mono"
                    style={{
                      color: G.red,
                      fontWeight: 700,
                    }}
                  >
                    -{fmtC(e.amount)}
                  </p>

                  <p
                    style={{
                      fontSize: 11,
                      color: G.muted,
                    }}
                  >
                    {new Date(
                      e.date
                    ).toLocaleDateString("en-IN")}
                  </p>

                  <button
                    className="btn-danger"
                    style={{
                      padding: "3px 8px",
                      fontSize: 10,
                      marginTop: 4,
                    }}
                    onClick={() =>
                      deleteExpense(e._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <div
          className="overlay"
          onClick={(e) =>
            e.target === e.currentTarget &&
            setSA(false)
          }
        >
          <div className="modal">
            <h3
              style={{
                fontWeight: 800,
                marginBottom: 20,
                color: G.neon,
              }}
            >
              Add Expense
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div>
                <label>Type</label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    sf((p) => ({
                      ...p,
                      type: e.target.value,
                    }))
                  }
                >
                  <option value="">
                    Select type
                  </option>

                  {TYPES.map((t) => (
                    <option key={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Amount (₹)</label>

                <input
                  type="number"
                  placeholder="0"
                  value={form.amount}
                  onChange={(e) =>
                    sf((p) => ({
                      ...p,
                      amount: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label>Payment Mode</label>

                <select
                  value={form.mode}
                  onChange={(e) =>
                    sf((p) => ({
                      ...p,
                      mode: e.target.value,
                    }))
                  }
                >
                  {MODES.map((m) => (
                    <option key={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Note</label>

                <input
                  placeholder="What was this for?"
                  value={form.note}
                  onChange={(e) =>
                    sf((p) => ({
                      ...p,
                      note: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label>Date</label>

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    sf((p) => ({
                      ...p,
                      date: e.target.value,
                    }))
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <button
                  className="btn-ghost"
                  style={{
                    flex: 1,
                  }}
                  onClick={() =>
                    setSA(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="btn-neon"
                  style={{
                    flex: 1,
                  }}
                  onClick={addExp}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// INVESTMENT SECTION
// ─────────────────────────────────────────────

function InvestmentSection({ onInvestmentWithdrawn }) {
  const [investments, setInv] = useState([]);
  const [activity, setActivity] = useState([]);

  const [form, sf] = useState({
    asset: "",
    amount: "",
    rate: "",
  });

  const [updM, setUpdM] = useState(null);
  const [wdM, setWdM] = useState(null);

  const [uf, suf] = useState({
    currentValue: "",
    note: "",
  });

  const [wf, swf] = useState({
    withdrawAmount: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInvestments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.request(
        "/investments"
      );

      setInv(data.investments || []);
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to load investments"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadActivity = async () => {
    try {
      const data = await api.request(
        "/investments/activity"
      );

      setActivity(data.activity || []);
    } catch (error) {
      console.error(
        "Failed to load investment activity:",
        error
      );
    }
  };

  useEffect(() => {
    loadInvestments();
    loadActivity();
  }, []);

  const addInv = async () => {
    if (!form.asset || !form.amount) {
      setError(
        "Asset and amount are required."
      );
      return;
    }

    try {
      setError("");

      const data = await api.request(
        "/investments",
        {
          method: "POST",
          body: JSON.stringify({
            asset: form.asset,
            amount: Number(form.amount),
            rate:
              form.rate === ""
                ? undefined
                : Number(form.rate),
          }),
        }
      );

      setInv((prev) => [
        data.investment,
        ...prev,
      ]);

      sf({
        asset: "",
        amount: "",
        rate: "",
      });
    } catch (error) {
      setError(
        error.message ||
          "Failed to add investment"
      );
    }
  };

  const openUpd = (inv) => {
    setUpdM(inv);

    suf({
      currentValue: inv.currentValue,
      note: "",
    });
  };

  const saveUpd = async () => {
    if (!updM) return;

    const nv = Number(uf.currentValue);

    if (Number.isNaN(nv) || nv < 0) {
      return;
    }

    try {
      setError("");

      const data = await api.request(
        `/investments/${updM._id}/update-value`,
        {
          method: "PUT",
          body: JSON.stringify({
            currentValue: nv,
            note: uf.note || "",
          }),
        }
      );

      const updated =
        data.investment ||
        data.updatedInvestment;

      if (updated) {
        setInv((prev) =>
          prev.map((i) =>
            i._id === updM._id
              ? updated
              : i
          )
        );
      } else {
        await loadInvestments();
      }

      await loadActivity();
      // Refresh Fund Tracker after withdrawal
      if (onInvestmentWithdrawn) {
        await onInvestmentWithdrawn();
      }
      setUpdM(null);
    } catch (error) {
      setError(
        error.message ||
          "Failed to update investment"
      );
    }
  };

  const openWd = (inv) => {
    setWdM(inv);

    swf({
      withdrawAmount: String(
        inv.currentValue
      ),
    });
  };

  const saveWd = async () => {
    if (!wdM) return;

    const wd = Number(
      wf.withdrawAmount
    );

    if (Number.isNaN(wd) || wd < 0) {
      return;
    }

    try {
      setError("");

      const data = await api.request(
        `/investments/${wdM._id}/withdraw`,
        {
          method: "PUT",
          body: JSON.stringify({
            withdrawAmount: wd,
          }),
        }
      );

      const updated =
        data.investment ||
        data.updatedInvestment;

      if (updated) {
        setInv((prev) =>
          prev.map((i) =>
            i._id === wdM._id
              ? updated
              : i
          )
        );
      } else {
        await loadInvestments();
      }

      await loadActivity();

      setWdM(null);
    } catch (error) {
      setError(
        error.message ||
          "Failed to withdraw investment"
      );
    }
  };

  const removeInvestment = async (id) => {
    if (
      !window.confirm(
        "Remove this investment?"
      )
    ) {
      return;
    }

    try {
      await api.request(
        `/investments/${id}`,
        {
          method: "DELETE",
        }
      );

      setInv((prev) =>
        prev.filter((i) => i._id !== id)
      );
    } catch (error) {
      setError(
        error.message ||
          "Failed to delete investment"
      );
    }
  };

  const active = investments.filter(
    (i) => i.status === "active"
  );

  const withdrawn =
    investments.filter(
      (i) => i.status === "withdrawn"
    );

  const totInv = active.reduce(
    (a, i) =>
      a + Number(i.invested || 0),
    0
  );

  const totCurr = active.reduce(
    (a, i) =>
      a + Number(i.currentValue || 0),
    0
  );

  const unrealPnl =
    totCurr - totInv;

  const realPnl =
    withdrawn.reduce(
      (a, i) =>
        a + Number(i.realisedPnl || 0),
      0
    );

  if (loading) {
    return (
      <p
        style={{
          color: G.muted,
          padding: "20px 0",
        }}
      >
        Loading investments...
      </p>
    );
  }

  return (
    <div>
      {error && (
        <p
          style={{
            color: G.red,
            marginBottom: 16,
          }}
        >
          ⚠ {error}
        </p>
      )}

      {investments.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
          className="srow"
        >
          {[
            {
              label:
                "Total Invested (Active)",
              val: fmtC(totInv),
              c: G.text,
            },
            {
              label:
                "Current Market Value",
              val: fmtC(totCurr),
              c:
                totCurr >= totInv
                  ? G.neon
                  : G.red,
            },
            {
              label: "Unrealised P&L",
              val: `${
                unrealPnl >= 0 ? "+" : ""
              }${fmtC(unrealPnl)}`,
              c:
                unrealPnl >= 0
                  ? G.neon
                  : G.red,
            },
            {
              label: "Realised P&L",
              val: `${
                realPnl >= 0 ? "+" : ""
              }${fmtC(realPnl)}`,
              c:
                realPnl >= 0
                  ? G.neon
                  : G.red,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="sbox"
              style={{
                flex: "1 1 140px",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: G.muted,
                  textTransform:
                    "uppercase",
                  letterSpacing: ".8px",
                }}
              >
                {s.label}
              </p>

              <p
                className="mono"
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: s.c,
                  marginTop: 6,
                }}
              >
                {s.val}
              </p>
            </div>
          ))}
        </div>
      )}

      <div
        className="card"
        style={{
          marginBottom: 20,
        }}
      >
        <p
          style={{
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          ➕ Add New Investment
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Asset (e.g. Gold, SIP, Stocks)"
            value={form.asset}
            onChange={(e) =>
              sf((p) => ({
                ...p,
                asset: e.target.value,
              }))
            }
            style={{
              flex: 2,
              minWidth: 160,
            }}
          />

          <input
            type="number"
            placeholder="Amount invested (₹)"
            value={form.amount}
            onChange={(e) =>
              sf((p) => ({
                ...p,
                amount: e.target.value,
              }))
            }
            style={{
              flex: 1,
              minWidth: 130,
            }}
          />

          <input
            type="number"
            placeholder="Rate % p.a."
            value={form.rate}
            onChange={(e) =>
              sf((p) => ({
                ...p,
                rate: e.target.value,
              }))
            }
            style={{
              flex: 1,
              minWidth: 100,
            }}
          />

          <button
            className="btn-neon"
            onClick={addInv}
          >
            Add
          </button>
        </div>
      </div>

      {active.length > 0 && (
        <div
          className="card"
          style={{
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            📈 Active Investments
          </p>

          <p
            style={{
              fontSize: 12,
              color: G.muted,
              marginBottom: 16,
            }}
          >
            Regularly update your investment
            value. When you sell or withdraw,
            the backend records the transaction.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {active.map((inv) => {
              const invested =
                Number(inv.invested || 0);

              const current =
                Number(
                  inv.currentValue || 0
                );

              const pnl =
                current - invested;

              const pct =
                invested > 0
                  ? (
                      (pnl / invested) *
                      100
                    ).toFixed(1)
                  : 0;

              const up = pnl >= 0;

              return (
                <div
                  key={inv._id}
                  className="inv-row"
                >
                  <div
                    style={{
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: 8,
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: 15,
                        }}
                      >
                        {inv.asset}
                      </span>

                      {inv.rate !==
                        undefined &&
                        inv.rate !==
                          null &&
                        inv.rate !== "" && (
                          <span
                            style={{
                              fontSize: 12,
                              color: G.amber,
                            }}
                          >
                            @ {inv.rate}%
                            p.a.
                          </span>
                        )}

                      <span
                        className={`badge ${
                          up
                            ? "bup"
                            : "bdn"
                        }`}
                      >
                        {up ? "▲" : "▼"}{" "}
                        {Math.abs(pct)}%
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: 12,
                        color: G.muted,
                        marginTop: 4,
                      }}
                    >
                      Invested:{" "}
                      <span
                        className="mono"
                        style={{
                          color: G.text,
                        }}
                      >
                        {fmtC(invested)}
                      </span>

                      &nbsp;·&nbsp;

                      Now:{" "}
                      <span
                        className="mono"
                        style={{
                          color: up
                            ? G.neon
                            : G.red,
                        }}
                      >
                        {fmtC(current)}
                      </span>

                      &nbsp;·&nbsp;

                      <span
                        style={{
                          color: up
                            ? G.neon
                            : G.red,
                        }}
                      >
                        P&L:{" "}
                        {up ? "+" : ""}
                        {fmtC(pnl)}
                      </span>
                    </p>

                    {inv.updatedAt && (
                      <p
                        style={{
                          fontSize: 11,
                          color: G.muted,
                          marginTop: 3,
                        }}
                      >
                        Last updated:{" "}
                        {new Date(
                          inv.updatedAt
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      className="btn-ghost"
                      style={{
                        fontSize: 12,
                        padding:
                          "7px 14px",
                      }}
                      onClick={() =>
                        openUpd(inv)
                      }
                    >
                      📊 Update Value
                    </button>

                    <button
                      className="btn-amber"
                      onClick={() =>
                        openWd(inv)
                      }
                    >
                      💰 Withdraw / Sell
                    </button>

                    <button
                      className="btn-danger"
                      onClick={() =>
                        removeInvestment(
                          inv._id
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {withdrawn.length > 0 && (
        <div
          className="card"
          style={{
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            🏦 Withdrawn Investments
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {withdrawn.map((inv) => {
              const pnl =
                Number(
                  inv.realisedPnl || 0
                );

              const profit = pnl >= 0;

              return (
                <div
                  key={inv._id}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    padding:
                      "12px 16px",
                    background: G.bg,
                    borderRadius: 10,
                    border: `1px solid ${G.border}`,
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontWeight: 700,
                      }}
                    >
                      {inv.asset}
                    </span>

                    <p
                      style={{
                        fontSize: 12,
                        color: G.muted,
                        marginTop: 3,
                      }}
                    >
                      Invested:{" "}
                      {fmtC(
                        inv.invested
                      )}
                    </p>
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <span
                      className={`badge ${
                        profit
                          ? "bup"
                          : "bdn"
                      }`}
                    >
                      {profit
                        ? "PROFIT"
                        : "LOSS"}
                    </span>

                    <p
                      className="mono"
                      style={{
                        color: profit
                          ? G.neon
                          : G.red,
                        fontWeight: 700,
                        marginTop: 4,
                      }}
                    >
                      {profit ? "+" : ""}
                      {fmtC(pnl)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activity.length > 0 && (
        <div
          className="card"
          style={{
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            🕒 Recent Investment Activity
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {activity
              .slice(0, 8)
              .map((a, index) => (
                <div
                  key={
                    a._id ||
                    a.id ||
                    index
                  }
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    padding:
                      "9px 14px",
                    background: G.bg,
                    borderRadius: 8,
                    border: `1px solid ${G.border}`,
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {a.asset}
                    </span>

                    <span
                      style={{
                        fontSize: 12,
                        color: G.muted,
                        marginLeft: 8,
                      }}
                    >
                      {a.type ===
                      "withdraw"
                        ? "Withdrawn"
                        : "Value Updated"}
                    </span>
                  </div>

                  <div
                    style={{
                      textAlign:
                        "right",
                    }}
                  >
                    {a.type ===
                    "withdraw" ? (
                      <span
                        className="mono"
                        style={{
                          color:
                            Number(
                              a.pnl
                            ) >= 0
                              ? G.neon
                              : G.red,
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {Number(
                          a.pnl
                        ) >= 0
                          ? "+"
                          : ""}
                        {fmtC(a.pnl)}
                      </span>
                    ) : (
                      <span
                        className="mono"
                        style={{
                          color:
                            Number(
                              a.pnl
                            ) >= 0
                              ? G.neon
                              : G.red,
                          fontSize: 13,
                        }}
                      >
                        {fmtC(a.prev)}{" "}
                        →{" "}
                        {fmtC(a.curr)}
                      </span>
                    )}

                    <p
                      style={{
                        fontSize: 11,
                        color: G.muted,
                      }}
                    >
                      {a.date
                        ? new Date(
                            a.date
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {investments.length === 0 && (
        <p
          style={{
            color: G.muted,
            textAlign: "center",
            padding: "32px 0",
            fontSize: 14,
          }}
        >
          No investments tracked yet.
          Add your first asset above!
        </p>
      )}

      {updM && (
        <div
          className="overlay"
          onClick={(e) =>
            e.target === e.currentTarget &&
            setUpdM(null)
          }
        >
          <div className="modal">
            <h3
              style={{
                fontWeight: 800,
                marginBottom: 6,
                color: G.neon,
              }}
            >
              📊 Update Investment Value
            </h3>

            <p
              style={{
                color: G.muted,
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              Update the current market
              value of{" "}
              <strong
                style={{
                  color: G.text,
                }}
              >
                {updM.asset}
              </strong>
              .
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div>
                <label>
                  Originally Invested
                </label>

                <p
                  className="mono"
                  style={{
                    color: G.muted,
                    padding:
                      "10px 14px",
                    background:
                      "#0a1f10",
                    borderRadius: 8,
                    border: `1px solid ${G.border}`,
                  }}
                >
                  {fmtC(
                    updM.invested
                  )}
                </p>
              </div>

              <div>
                <label>
                  Last Recorded Value
                </label>

                <p
                  className="mono"
                  style={{
                    color: G.muted,
                    padding:
                      "10px 14px",
                    background:
                      "#0a1f10",
                    borderRadius: 8,
                    border: `1px solid ${G.border}`,
                  }}
                >
                  {fmtC(
                    updM.currentValue
                  )}
                </p>
              </div>

              <div>
                <label>
                  Current Market Value (₹)
                </label>

                <input
                  type="number"
                  value={
                    uf.currentValue
                  }
                  onChange={(e) =>
                    suf((p) => ({
                      ...p,
                      currentValue:
                        e.target.value,
                    }))
                  }
                />
              </div>

              {uf.currentValue !==
                "" &&
                (() => {
                  const nv = Number(
                    uf.currentValue
                  );

                  const chg =
                    nv -
                    Number(
                      updM.currentValue ||
                        0
                    );

                  const up = chg >= 0;

                  return (
                    <div
                      style={{
                        padding:
                          "12px 14px",
                        borderRadius: 10,
                        background: up
                          ? `${G.neon}12`
                          : `${G.red}12`,
                        border: `1px solid ${
                          up
                            ? G.neonDim
                            : G.red
                        }44`,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 13,
                          color: up
                            ? G.neon
                            : G.red,
                          fontWeight: 700,
                        }}
                      >
                        {up
                          ? "▲ Gone UP"
                          : "▼ Gone DOWN"}{" "}
                        by{" "}
                        {fmtC(
                          Math.abs(chg)
                        )}
                      </p>

                      <p
                        style={{
                          fontSize: 12,
                          color: G.muted,
                          marginTop: 4,
                        }}
                      >
                        Total P&L vs
                        invested:{" "}
                        {nv -
                          Number(
                            updM.invested ||
                              0
                          ) >=
                        0
                          ? "+"
                          : ""}
                        {fmtC(
                          nv -
                            Number(
                              updM.invested ||
                                0
                            )
                        )}
                      </p>
                    </div>
                  );
                })()}

              <div>
                <label>
                  Note (optional)
                </label>

                <input
                  placeholder="e.g. Market rally, SIP return..."
                  value={uf.note}
                  onChange={(e) =>
                    suf((p) => ({
                      ...p,
                      note: e.target.value,
                    }))
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <button
                  className="btn-ghost"
                  style={{
                    flex: 1,
                  }}
                  onClick={() =>
                    setUpdM(null)
                  }
                >
                  Cancel
                </button>

                <button
                  className="btn-neon"
                  style={{
                    flex: 1,
                  }}
                  onClick={saveUpd}
                >
                  Save Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {wdM && (
        <div
          className="overlay"
          onClick={(e) =>
            e.target === e.currentTarget &&
            setWdM(null)
          }
        >
          <div className="modal">
            <h3
              style={{
                fontWeight: 800,
                marginBottom: 6,
                color: G.amber,
              }}
            >
              💰 Withdraw / Sell Investment
            </h3>

            <p
              style={{
                color: G.muted,
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              Enter the amount you
              actually received for{" "}
              <strong
                style={{
                  color: G.text,
                }}
              >
                {wdM.asset}
              </strong>
              .
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div>
                <label>
                  Originally Invested
                </label>

                <p
                  className="mono"
                  style={{
                    color: G.muted,
                    padding:
                      "10px 14px",
                    background:
                      "#0a1f10",
                    borderRadius: 8,
                    border: `1px solid ${G.border}`,
                  }}
                >
                  {fmtC(
                    wdM.invested
                  )}
                </p>
              </div>

              <div>
                <label>
                  Amount Received (₹)
                </label>

                <input
                  type="number"
                  value={
                    wf.withdrawAmount
                  }
                  onChange={(e) =>
                    swf((p) => ({
                      ...p,
                      withdrawAmount:
                        e.target.value,
                    }))
                  }
                />
              </div>

              {wf.withdrawAmount !==
                "" &&
                (() => {
                  const wd = Number(
                    wf.withdrawAmount
                  );

                  const pnl =
                    wd -
                    Number(
                      wdM.invested ||
                        0
                    );

                  const profit =
                    pnl >= 0;

                  return (
                    <div
                      style={{
                        padding:
                          "14px 16px",
                        borderRadius: 10,
                        background:
                          profit
                            ? `${G.neon}12`
                            : `${G.red}12`,
                        border: `1px solid ${
                          profit
                            ? G.neonDim
                            : G.red
                        }44`,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 14,
                          color: profit
                            ? G.neon
                            : G.red,
                          fontWeight: 800,
                        }}
                      >
                        {profit
                          ? "✅ PROFIT"
                          : "❌ LOSS"}
                        :{" "}
                        {profit
                          ? "+"
                          : ""}
                        {fmtC(pnl)}
                      </p>

                      <p
                        style={{
                          fontSize: 12,
                          color: G.muted,
                          marginTop: 6,
                        }}
                      >
                        {fmtC(wd)} received
                        from this
                        investment.
                      </p>
                    </div>
                  );
                })()}

              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <button
                  className="btn-ghost"
                  style={{
                    flex: 1,
                  }}
                  onClick={() =>
                    setWdM(null)
                  }
                >
                  Cancel
                </button>

                <button
                  className="btn-neon"
                  style={{
                    flex: 1,
                  }}
                  onClick={saveWd}
                >
                  Confirm Withdrawal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// FUND TRACKER
// ─────────────────────────────────────────────

function FundPage() {
  const [summary, setSummary] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [salaryInput, setSalaryInput] =
    useState("");

  const [savingSalary, setSavingSalary] =
    useState(false);

  const [salaryMessage, setSalaryMessage] =
    useState("");

  // ─────────────────────────────────────────
  // Load fund summary
  // ─────────────────────────────────────────
  const loadSummary = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await api.request(
          "/fund/summary"
        );

      // IMPORTANT:
      // Backend returns:
      // { success: true, fund: {...} }
      //
      // So we must store data.fund,
      // NOT the complete response.
      setSummary(
        data.fund || {}
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to load fund summary"
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Initial load
  // ─────────────────────────────────────────
  useEffect(() => {
    loadSummary();
  }, []);

  // ─────────────────────────────────────────
  // Save monthly income
  // ─────────────────────────────────────────
  const saveSalary = async () => {
    setSalaryMessage("");
    setError("");

    const amount =
      Number(salaryInput);

    if (
      salaryInput === "" ||
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      setError(
        "Please enter a valid monthly income."
      );

      return;
    }

    try {
      setSavingSalary(true);

      // api.js automatically adds
      // the logged-in user's JWT token.
      await api.request(
        "/fund/income",
        {
          method: "PUT",

          body: JSON.stringify({
            salary: amount,
          }),
        }
      );

      setSalaryMessage(
        "Monthly income saved successfully."
      );

      setSalaryInput("");

      // Reload the complete dashboard
      await loadSummary();
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to save monthly income."
      );
    } finally {
      setSavingSalary(false);
    }
  };

  // ─────────────────────────────────────────
  // Loading
  // ─────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          padding: 30,
          textAlign: "center",
          color: G.muted,
        }}
      >
        Loading fund tracker...
      </div>
    );
  }

  // ─────────────────────────────────────────
  // Error
  // ─────────────────────────────────────────
  if (error && !summary) {
    return (
      <div
        style={{
          padding:
            "24px 20px",
          maxWidth: 920,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: G.red,
          }}
        >
          ⚠ {error}
        </p>

        <button
          className="btn-neon"
          style={{
            marginTop: 15,
          }}
          onClick={loadSummary}
        >
          Retry
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // Safe summary object
  // ─────────────────────────────────────────
  const s =
    summary || {};

  // ─────────────────────────────────────────
  // Values
  // ─────────────────────────────────────────
  const salary =
    Number(
      s.salary || 0
    );

  const mexp =
    Number(
      s.thisMonthExpenses || 0
    );

  const pexp =
    Number(
      s.previousMonthExpenses || 0
    );

  const balance =
    Number(
      s.balance ?? salary - mexp
    );

  const dailyExp =
    Number(
      s.dailyAverage || 0
    );

  const daysLeft =
  Number(s.daysLeft || 0);

  const daysBalanceText =
    dailyExp <= 0
      ? "Not enough data"
      : balance <= 0
      ? "Exceeded"
      : `${daysLeft} days`;

  const emergency =
    Number(
      s.emergencyFund ??
        salary * 0.15
    );

  const budgetPercent =
    salary > 0
      ? (mexp / salary) *
        100
      : 0;

  // ─────────────────────────────────────────
  // Whether salary exists
  // ─────────────────────────────────────────
  const hasSalary =
    salary > 0;

  return (
    <div
      style={{
        padding:
          "24px 20px",
        maxWidth: 920,
        margin: "0 auto",
      }}
    >
      {/* ─────────────────────────────────────
          Header
      ───────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 24,
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <h2
          style={{
            fontSize: 26,
            fontWeight: 800,
          }}
        >
          Fund{" "}
          <span className="neon-text">
            Tracker
          </span>
        </h2>

        <button
          className="btn-ghost"
          onClick={loadSummary}
          disabled={loading}
        >
          ↻ Refresh
        </button>
      </div>

      {/* ─────────────────────────────────────
          Error message
      ───────────────────────────────────── */}
      {error && (
        <div
          className="card"
          style={{
            marginBottom: 20,
            borderColor: G.red,
          }}
        >
          <p
            style={{
              color: G.red,
            }}
          >
            ⚠ {error}
          </p>
        </div>
      )}

      {/* ─────────────────────────────────────
          Salary Input
      ───────────────────────────────────── */}
      <div
        className="card"
        style={{
          marginBottom: 20,
        }}
      >
        <p
          style={{
            fontSize: 18,
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          {hasSalary
            ? "Monthly Income"
            : "Set Your Monthly Income"}
        </p>

        <p
          style={{
            color: G.muted,
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {hasSalary
            ? "Update your monthly income anytime. Your fund tracker will recalculate automatically."
            : "Enter your monthly income to start using the Fund Tracker."}
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter monthly income"
            value={salaryInput}
            onChange={(e) =>
              setSalaryInput(
                e.target.value
              )
            }
            style={{
              flex: "1 1 250px",
              padding:
                "12px 14px",
              borderRadius: 8,
              border:
                `1px solid ${G.border}`,
              background:
                G.bg,
              color:
                G.text,
              outline: "none",
              fontSize: 14,
            }}
          />

          <button
            className="btn-neon"
            onClick={saveSalary}
            disabled={savingSalary}
          >
            {savingSalary
              ? "Saving..."
              : hasSalary
              ? "Update Income"
              : "Save Monthly Income"}
          </button>
        </div>

        {salaryMessage && (
          <p
            style={{
              marginTop: 12,
              color: G.neon,
              fontSize: 13,
            }}
          >
            ✓ {salaryMessage}
          </p>
        )}
      </div>

      {/* ─────────────────────────────────────
          Show dashboard only when salary exists
      ───────────────────────────────────── */}
      {hasSalary ? (
        <>
          {/* ───────────────────────────────────
              Summary boxes
          ─────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 20,
            }}
            className="srow"
          >
            {[
              {
                label:
                  "Current Balance",

                val:
                  fmtC(balance),

                c:
                  balance >= 0
                    ? G.neon
                    : G.red,
              },

              {
                label:
                  "This Month Spent",

                val:
                  fmtC(mexp),

                c: G.amber,
              },

              {
                label:
                  "Prev Month Spent",

                val:
                  fmtC(pexp),

                c: G.muted,
              },

              {
                label:
                  "Daily Average",

                val:
                  fmtC(dailyExp),

                c: G.text,
              },

              {
                label:
                  "Days Balance Lasts",

                val: daysBalanceText,

                c:
                  dailyExp <= 0
                  ? G.muted
                  : balance <= 0
                  ? G.red
                  : daysLeft > 10
                  ? G.neon
                  : G.red,
              },

              {
                label:
                  "Emergency Fund (15%)",

                val:
                  fmtC(emergency),

                c: G.amber,
              },
            ].map(
              (item) => (
                <div
                  key={
                    item.label
                  }
                  className="sbox"
                  style={{
                    flex:
                      "1 1 140px",
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      color:
                        G.muted,
                      textTransform:
                        "uppercase",
                      letterSpacing:
                        ".8px",
                    }}
                  >
                    {item.label}
                  </p>

                  <p
                    className="mono"
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color:
                        item.c,
                      marginTop: 6,
                    }}
                  >
                    {item.val}
                  </p>
                </div>
              )
            )}
          </div>

          {/* ───────────────────────────────────
              Monthly Income Display
          ─────────────────────────────────── */}
          <div
            className="card"
            style={{
              marginBottom: 20,
            }}
          >
            <p
              style={{
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              Monthly Income
            </p>

            <p
              className="mono"
              style={{
                color: G.neon,
                fontSize: 24,
              }}
            >
              {fmtC(salary)}
            </p>
          </div>

          {/* ───────────────────────────────────
              Budget Usage
          ─────────────────────────────────── */}
          <div
            className="card"
            style={{
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Monthly Budget Usage
              </span>

              <span
                className="mono"
                style={{
                  fontSize: 13,
                  color:
                    G.amber,
                }}
              >
                {budgetPercent.toFixed(
                  1
                )}
                %
              </span>
            </div>

            <div className="pbar-bg">
              <div
                className="pbar-fill"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      budgetPercent
                    )
                  )}%`,

                  background:
                    mexp > salary
                      ? G.red
                      : undefined,
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginTop: 6,
                fontSize: 12,
                color:
                  G.muted,
              }}
            >
              <span>
                Spent:{" "}
                {fmtC(mexp)}
              </span>

              <span>
                Income:{" "}
                {fmtC(salary)}
              </span>
            </div>
          </div>

          {/* ───────────────────────────────────
              Investment Portfolio
          ─────────────────────────────────── */}
          <div
            style={{
              borderTop:
                `1px solid ${G.border}`,
              paddingTop: 24,
            }}
          >
            <h3
              style={{
                fontSize: 20,
                fontWeight: 800,
                marginBottom: 20,
              }}
            >
              Investment{" "}
              <span className="neon-text">
                Portfolio
              </span>
            </h3>

            <InvestmentSection
              onInvestmentWithdrawn={
                loadSummary
              }
            />
          </div>
        </>
      ) : (
        /* ─────────────────────────────────────
           Empty state for a new user
        ───────────────────────────────────── */
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: 35,
          }}
        >
          <div
            style={{
              fontSize: 40,
              marginBottom: 12,
            }}
          >
            💰
          </div>

          <h3
            style={{
              fontSize: 20,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Your Fund Tracker
            Is Ready
          </h3>

          <p
            style={{
              color: G.muted,
              fontSize: 14,
            }}
          >
            Enter your monthly income
            above to start tracking
            your balance, expenses,
            emergency fund, and budget.
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// HEALTH SCORE
// ─────────────────────────────────────────────

function HealthPage() {
  const [health, setHealth] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadHealth = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.request(
        "/fund/health-score"
      );

      setHealth(
        data.healthScore ||
          data.score ||
          data
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to load health score"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: 30,
          textAlign: "center",
          color: G.muted,
        }}
      >
        Loading financial health...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "24px 20px",
          maxWidth: 920,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: G.red,
          }}
        >
          ⚠ {error}
        </p>

        <button
          className="btn-neon"
          style={{
            marginTop: 15,
          }}
          onClick={loadHealth}
        >
          Retry
        </button>
      </div>
    );
  }

  const h =
    health || {};

  const score = Math.max(
    0,
    Math.min(
      100,
      Number(
        h.score ??
          h.healthScore ??
          0
      )
    )
  );

  const savingsRate = Number(
    h.savingsRate ??
      h.savR ??
      0
  );

  const portfolioValue = Number(
    h.portfolioValue ??
      h.totalCurrentValue ??
      0
  );

  const totalInvested = Number(
    h.totalInvested ??
      h.invested ??
      0
  );

  const monthlyData =
    h.monthlyExpenses ||
    h.mdata ||
    h.expenseTrend ||
    [];

  const sc =
    score >= 70
      ? G.neon
      : score >= 40
      ? G.amber
      : G.red;

  return (
    <div
      style={{
        padding: "24px 20px",
        maxWidth: 920,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 26,
            fontWeight: 800,
          }}
        >
          Financial{" "}
          <span className="neon-text">
            Health Score
          </span>
        </h2>

        <button
          className="btn-ghost"
          onClick={loadHealth}
        >
          ↻ Refresh
        </button>
      </div>

      <div
        className="card"
        style={{
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: G.muted,
            fontSize: 13,
            textTransform:
              "uppercase",
            letterSpacing: ".8px",
            marginBottom: 12,
          }}
        >
          Your Financial Score
        </p>

        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: sc,
            textShadow: `0 0 30px ${sc}55`,
            fontFamily:
              "'Share Tech Mono', monospace",
          }}
        >
          {score}
        </div>

        <div
          style={{
            fontSize: 14,
            color: sc,
            marginTop: 4,
          }}
        >
          {score >= 70
            ? "Excellent 🟢"
            : score >= 40
            ? "Average 🟡"
            : "Needs Improvement 🔴"}
        </div>

        <p
          style={{
            color: G.muted,
            fontSize: 12,
            marginTop: 8,
          }}
        >
          Based on savings rate,
          investments & spending
          patterns
        </p>
      </div>

      <div
        className="g2"
        style={{
          marginBottom: 20,
        }}
      >
        <div className="card">
          <p
            style={{
              fontSize: 13,
              color: G.muted,
              marginBottom: 8,
              textTransform:
                "uppercase",
            }}
          >
            Savings Rate
          </p>

          <p
            className="mono"
            style={{
              fontSize: 28,
              color:
                savingsRate >= 20
                  ? G.neon
                  : G.red,
              fontWeight: 700,
            }}
          >
            {savingsRate.toFixed(1)}%
          </p>

          <div
            className="pbar-bg"
            style={{
              marginTop: 8,
            }}
          >
            <div
              className="pbar-fill"
              style={{
                width: `${Math.max(
                  0,
                  Math.min(
                    100,
                    savingsRate
                  )
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="card">
          <p
            style={{
              fontSize: 13,
              color: G.muted,
              marginBottom: 8,
              textTransform:
                "uppercase",
            }}
          >
            Portfolio Value
          </p>

          <p
            className="mono"
            style={{
              fontSize: 24,
              color:
                portfolioValue >=
                totalInvested
                  ? G.neon
                  : G.red,
              fontWeight: 700,
            }}
          >
            {fmtC(
              portfolioValue
            )}
          </p>

          <p
            style={{
              fontSize: 12,
              color: G.muted,
              marginTop: 6,
            }}
          >
            Invested:{" "}
            {fmtC(totalInvested)}
          </p>
        </div>
      </div>

      <div className="card">
        <p
          style={{
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Monthly Expense Trend
        </p>

        {monthlyData.length ===
        0 ? (
          <p
            style={{
              color: G.muted,
              textAlign: "center",
              padding: "40px 0",
              fontSize: 13,
            }}
          >
            Add expenses to see your
            monthly trend
          </p>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={220}
          >
            <BarChart
              data={monthlyData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={G.border}
              />

              <XAxis
                dataKey="month"
                stroke={G.muted}
                tick={{
                  fontSize: 11,
                }}
              />

              <YAxis
                stroke={G.muted}
                tick={{
                  fontSize: 11,
                }}
              />

              <Tooltip
                contentStyle={{
                  background: G.card,
                  border: `1px solid ${G.border}`,
                  borderRadius: 8,
                  color: G.text,
                }}
                formatter={(v) => [
                  fmtC(v),
                  "Expenses",
                ]}
              />

              <Bar
                dataKey="amt"
                fill={G.neon}
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// GOAL TRACKER
// ─────────────────────────────────────────────

function GoalPage() {
  const [goals, setGoals] =
    useState([]);

  const [form, sf] = useState({
    name: "",
    target: "",
    saved: "",
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.request(
        "/goals"
      );

      setGoals(data.goals || []);
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to load goals"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const add = async () => {
    if (
      !form.name ||
      !form.target
    ) {
      setError(
        "Goal name and target are required."
      );
      return;
    }

    try {
      setError("");

      const data = await api.request(
        "/goals",
        {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            target: Number(
              form.target
            ),
            saved:
              Number(
                form.saved
              ) || 0,
          }),
        }
      );

      setGoals((prev) => [
        data.goal,
        ...prev,
      ]);

      sf({
        name: "",
        target: "",
        saved: "",
      });
    } catch (error) {
      setError(
        error.message ||
          "Failed to add goal"
      );
    }
  };

  const updS = async (id, value) => {
    try {
      const data = await api.request(
        `/goals/${id}/savings`,
        {
          method: "PUT",
          body: JSON.stringify({
            saved: Number(value),
          }),
        }
      );

      const updated =
        data.goal ||
        data.updatedGoal;

      if (updated) {
        setGoals((prev) =>
          prev.map((g) =>
            g._id === id
              ? updated
              : g
          )
        );
      } else {
        await loadGoals();
      }
    } catch (error) {
      setError(
        error.message ||
          "Failed to update savings"
      );
    }
  };

  const rem = async (id) => {
    if (
      !window.confirm(
        "Remove this goal?"
      )
    ) {
      return;
    }

    try {
      await api.request(
        `/goals/${id}`,
        {
          method: "DELETE",
        }
      );

      setGoals((prev) =>
        prev.filter(
          (g) => g._id !== id
        )
      );
    } catch (error) {
      setError(
        error.message ||
          "Failed to delete goal"
      );
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: 30,
          textAlign: "center",
          color: G.muted,
        }}
      >
        Loading goals...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "24px 20px",
        maxWidth: 920,
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          fontSize: 26,
          fontWeight: 800,
          marginBottom: 24,
        }}
      >
        Goal{" "}
        <span className="neon-text">
          Tracker
        </span>
      </h2>

      {error && (
        <p
          style={{
            color: G.red,
            marginBottom: 16,
          }}
        >
          ⚠ {error}
        </p>
      )}

      <div
        className="card"
        style={{
          marginBottom: 24,
        }}
      >
        <p
          style={{
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          🎯 Set a New Goal
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Goal name (e.g. New Laptop)"
            value={form.name}
            onChange={(e) =>
              sf((p) => ({
                ...p,
                name: e.target.value,
              }))
            }
            style={{
              flex: 2,
              minWidth: 160,
            }}
          />

          <input
            type="number"
            placeholder="Target amount (₹)"
            value={form.target}
            onChange={(e) =>
              sf((p) => ({
                ...p,
                target:
                  e.target.value,
              }))
            }
            style={{
              flex: 1,
              minWidth: 130,
            }}
          />

          <input
            type="number"
            placeholder="Already saved (₹)"
            value={form.saved}
            onChange={(e) =>
              sf((p) => ({
                ...p,
                saved:
                  e.target.value,
              }))
            }
            style={{
              flex: 1,
              minWidth: 130,
            }}
          />

          <button
            className="btn-neon"
            onClick={add}
          >
            Add Goal
          </button>
        </div>
      </div>

      {goals.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "60px 20px",
          }}
        >
          <div
            style={{
              fontSize: 40,
              marginBottom: 12,
            }}
          >
            🎯
          </div>

          <p
            style={{
              color: G.muted,
              fontSize: 14,
            }}
          >
            No goals yet. Set your
            first financial goal above!
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {goals.map((g) => {
            const target =
              Number(
                g.target || 0
              );

            const saved =
              Number(
                g.saved || 0
              );

            const pct = Math.min(
              100,
              target > 0
                ? (saved / target) *
                    100
                : 0
            );

            const remaining =
              Math.max(
                0,
                target - saved
              );

            const done =
              remaining === 0;

            return (
              <div
                key={g._id}
                className="card"
                style={{
                  border: done
                    ? `1px solid ${G.neon}`
                    : undefined,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "flex-start",
                    marginBottom: 12,
                    flexWrap:
                      "wrap",
                    gap: 8,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontWeight: 800,
                        fontSize: 17,
                      }}
                    >
                      {g.name}{" "}
                      {done && (
                        <span
                          style={{
                            color: G.neon,
                            fontSize: 13,
                          }}
                        >
                          ✓ Achieved!
                        </span>
                      )}
                    </h3>

                    <p
                      style={{
                        fontSize: 13,
                        color: G.muted,
                        marginTop: 2,
                      }}
                    >
                      Target:{" "}
                      <span
                        className="mono"
                        style={{
                          color: G.text,
                        }}
                      >
                        {fmtC(target)}
                      </span>
                    </p>
                  </div>

                  <button
                    className="btn-danger"
                    onClick={() =>
                      rem(g._id)
                    }
                  >
                    Remove
                  </button>
                </div>

                <div
                  className="pbar-bg"
                  style={{
                    marginBottom: 8,
                  }}
                >
                  <div
                    className="pbar-fill"
                    style={{
                      width: `${pct}%`,
                      background: done
                        ? G.neon
                        : undefined,
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    fontSize: 12,
                    marginBottom: 16,
                    flexWrap:
                      "wrap",
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      color: G.neon,
                    }}
                    className="mono"
                  >
                    Saved:{" "}
                    {fmtC(saved)}
                  </span>

                  <span
                    className="mono"
                    style={{
                      color: G.amber,
                    }}
                  >
                    {pct.toFixed(1)}%
                    complete
                  </span>

                  <span
                    style={{
                      color:
                        remaining > 0
                          ? G.red
                          : G.neon,
                    }}
                    className="mono"
                  >
                    Remaining:{" "}
                    {fmtC(
                      remaining
                    )}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems:
                      "center",
                    flexWrap:
                      "wrap",
                  }}
                >
                  <label
                    style={{
                      margin: 0,
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    Update Saved:
                  </label>

                  <input
                    type="number"
                    value={saved}
                    style={{
                      flex: 1,
                      minWidth: 120,
                      maxWidth: 200,
                    }}
                    onChange={(e) =>
                      updS(
                        g._id,
                        e.target.value
                      )
                    }
                  />
                </div>

                <ResponsiveContainer
                  width="100%"
                  height={80}
                  style={{
                    marginTop: 12,
                  }}
                >
                  <BarChart
                    data={[
                      {
                        name: "Saved",
                        val: saved,
                      },
                      {
                        name: "Remaining",
                        val: remaining,
                      },
                    ]}
                    layout="vertical"
                  >
                    <XAxis
                      type="number"
                      stroke={G.muted}
                      tick={{
                        fontSize: 10,
                      }}
                    />

                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke={G.muted}
                      tick={{
                        fontSize: 10,
                      }}
                      width={62}
                    />

                    <Tooltip
                      contentStyle={{
                        background:
                          G.card,
                        border: `1px solid ${G.border}`,
                        borderRadius: 8,
                        color: G.text,
                      }}
                      formatter={(v) =>
                        fmtC(v)
                      }
                    />

                    <Bar
                      dataKey="val"
                      radius={[
                        0,
                        6,
                        6,
                        0,
                      ]}
                    >
                      <Cell
                        fill={G.neon}
                      />

                      <Cell
                        fill={G.red}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────

export default function App() {
  const [user, setUser] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem(
            "fa_session"
          );

        return saved
          ? JSON.parse(saved)
          : null;
      } catch {
        return null;
      }
    });

  const [page, setPage] =
    useState(1);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "fa_session",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem(
        "fa_session"
      );
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem(
      "fa_token"
    );

    localStorage.removeItem(
      "fa_session"
    );

    setUser(null);
    setPage(1);
  };

  return (
    <>
      <style>{css}</style>

      {!user ? (
        <Login
          onLogin={(u) => {
            setUser(u);
            setPage(1);
          }}
        />
      ) : (
        <>
          <Nav
            page={page}
            setPage={setPage}
            user={user}
            onLogout={handleLogout}
          />

          {page === 1 && (
            <ExpensePage />
          )}

          {page === 2 && (
            <FundPage />
          )}

          {page === 3 && (
            <HealthPage />
          )}

          {page === 4 && (
            <GoalPage />
          )}

          <div
            style={{
              textAlign: "center",
              padding:
                "24px 0 40px",
              color: G.muted,
              fontSize: 12,
              borderTop: `1px solid ${G.border}`,
              marginTop: 20,
            }}
          >
            Financial Assistant ©
            2026 &nbsp;·&nbsp; Your
            personal finance
            companion
          </div>
        </>
      )}
    </>
  );
}