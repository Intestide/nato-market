/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef, use } from "react";
import "./App.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function Login({ onSuccess }) {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  async function handleSubmit() {
    try {
      if (isSignup) {
        const response = await fetch("http://localhost:8080/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: userName, password }),
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        alert("Signup successful! Please login.");
        setIsSignup(false);
        return;
      }

      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: new URLSearchParams({
          username: userName,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid login credentials");
      }

      const userResponse = await fetch("http://localhost:8080/api/user", {
        credentials: "include",
      });

      if (!userResponse.ok) {
        throw new Error("Unable to load user after login");
      }

      const user = await userResponse.json();
      onSuccess(user);
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <>
      <div
        className="page"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2>{isSignup ? "Sign Up" : "Login"}</h2>
          <input
            type="text"
            placeholder="Username"
            style={{ padding: "10px", fontSize: "16px" }}
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            style={{ padding: "10px", fontSize: "16px" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn"
            onClick={handleSubmit}
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
          <button
            className="btn"
            onClick={() => setIsSignup(!isSignup)}
            style={{ padding: "10px 20px", fontSize: "16px", backgroundColor: "#ccc" }}
          >
            {isSignup ? "Already have an account? Login" : "Need an account? Sign Up"}
          </button>
          <button
            className="btn"
            onClick={() => onSuccess(null)} // Browse without login
            style={{ padding: "10px 20px", fontSize: "16px", backgroundColor: "#ddd" }}
          >
            Browse Without Login
          </button>
        </div>
      </div>
    </>
  );
}

function Dashboard({ account, onLogout }) {
  return (
    <>
      <div className="page">
        <div className="pofile">
          <div className="User">{account.name}</div>
          <button className="btn" onClick={onLogout} style={{ marginLeft: "20px" }}>
            Logout
          </button>
        </div>
        <div className="bets">Welcome back, {account.name}! Use the store to browse markets.</div>
      </div>
    </>
  );
}

function Store({ isLoggedIn }) {
  const [id, setId] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/markets", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <>
      <div className="page">
        {id !== null && (
          <Market
            market={data.find((item) => item.id === id)}
            onClose={() => setId(null)}
            isLoggedIn={isLoggedIn}
          />
        )}
        <div className="subtitle">All Markets</div>
        <div
          style={{
            margin: "20px",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {data ? (
            <>
              {data.map((item) => (
                <Preview
                  title={item.title}
                  open={() => setId(item.id)}
                  key={item.id}
                  market={item}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </>
          ) : (
            "waiting ..."
          )}
        </div>
      </div>
    </>
  );
}
function Preview({ title, open, market }) {
  const [type, setType] = useState("");
  return (
    <>
      <div className="preview" onClick={() => open()}>
        {market.shares.length == 2 ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <div style={{ fontWeight: 400, width: "100%" }}>{title}</div>
              <Graph value={market.shares[0].price} />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="option" style={{ backgroundColor: "#4CC790" }}>
                Yes
              </div>
              <div className="option" style={{ backgroundColor: "#c74c4c" }}>
                No
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontWeight: 400 }}>{title}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {market.shares.map((share) => (
                <div className="option" key={share}>
                  {share.price}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {market.shares.map((share) => (
                <div className="option" key={share}>
                  {share.name}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
function Graph({ value }) {
  const width = 120;
  const height = 80;
  useEffect(() => {}, []);
  function arc(cx, cy, r, startAngle, endAngle) {
    if (endAngle - startAngle === 0) return "";
    const convert = (angle) => {
      const radians = (angle * Math.PI) / 180;
      return {
        x: cx + r * Math.cos(radians),
        y: cy + -r * Math.sin(radians),
      };
    };
    const start = convert(startAngle);
    const end = convert(endAngle);
    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    const sweep = endAngle < startAngle ? 1 : 0;

    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
  }
  return (
    <svg width={width} height={height} style={{ flexShrink: 0 }}>
      <path
        d={arc(width / 2, height / 2, 35, 0, 180 - value * 180)}
        style={{
          fill: "none",
          stroke: "#c74c4c",
          strokeWidth: "10",
          strokeLinecap: "round",
        }}
      />
      <path
        d={arc(width / 2, height / 2, 35, 180, 180 - value * 180)}
        style={{
          fill: "none",
          stroke: "#4CC790",
          strokeWidth: "10",
          strokeLinecap: "round",
        }}
      />
      <text
        x={width / 2}
        y={height / 2 + 5}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={value >= 0.5 ? "#4CC790" : "#c74c4c"}
        style={{ fontSize: "16px", fontWeight: "bold" }}
      >
        {Math.round(value * 100)}%
      </text>
    </svg>
  );
}

function Market({ market, onClose, isLoggedIn }) {
  useEffect(() => {
  });
  return (
    <>
      <div className="market">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              flexShrink: 0,
              borderRadius: "10px",
              background: "var(--accent-bg)",
            }}
          >
            <img
              src={`/market/${market.id}.svg`}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <h2 className="heading">{market.title} </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "15px", fontFamily: "var(--mono)" }}>
                #{market.id.toString().padStart(8, "0")}
              </span>
              <span
                style={{
                  fontSize: "15px",
                  display: "flex",
                  flexDirection: "row",
                  gap: "5px",
                }}
              >
                
                {market.tags?.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </span>
            </div>
          </div>
          <button style={{}} className="btn" onClick={onClose}>
            Close
          </button>
        </div>
        <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
          <div style={{flex: "60%"}}>
            <Chart />
          </div>
          <div style={{flex: "40%"}}>
            <Trade isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </div>
    </>
  );
}
function Trade({ isLoggedIn }){
  const [buyMode, setMode] = useState(true)
  if (!isLoggedIn) {
    return <div>Please login to trade.</div>;
  }
  return(
    <>
      <span>Buy</span><span>Sell</span>
      <div onClick={() => setMode(!buyMode)}>{buyMode? "Buy" : "Sell"}</div>
    </>
  );
}

function Chart(){
  return(
    <>
    </>  
  );
}
function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("Store");

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("http://localhost:8080/api/user", {
          credentials: "include",
        });
        if (!response.ok) {
          setAccount(null);
          return;
        }
        const user = await response.json();
        setAccount(user);
      } catch (error) {
        console.error("Failed to check auth:", error);
        setAccount(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  async function handleLogout() {
    await fetch("http://localhost:8080/logout", {
      method: "POST",
      credentials: "include",
    });
    setAccount(null);
  }

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  if (account === undefined) { // Not checked yet, but for now, if null, show login
    return <Login onSuccess={setAccount} />;
  }

  return (
    <>
      <div className="header">
        <h1 className="logo">Thing</h1>
        <div></div>
        <input
          style={{ flex: 2, margin: "auto", padding: "10px" }}
          type="text"
          placeholder="Search markets..."
        />
        {account ? (
          <>
            <button
              style={{ margin: "auto", padding: "10px 20px" }}
              onClick={() => setPage("dashboard")}
            >
              Dashboard
            </button>
            <button
              style={{ margin: "auto", padding: "10px 20px" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            style={{ margin: "auto", padding: "10px 20px" }}
            onClick={() => setAccount(undefined)} // Go back to login
          >
            Login
          </button>
        )}
        <button
          style={{ margin: "auto", padding: "10px 20px" }}
          onClick={() => setPage("Store")}
        >
          Store
        </button>
      </div>
      {page === "dashboard" && account && <Dashboard account={account} onLogout={handleLogout} />}
      {page === "Store" && <Store isLoggedIn={!!account} />}
    </>
  );
}

export default App;