/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef, use, useMemo } from "react";
import "./App.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ToastContainer, toast, Slide } from "react-toastify";

function Login({ onSuccess }) {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [referralKey, setReferralKey] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  async function handleSubmit() {
    try {
      if (isSignup) {
        const response = await fetch("http://localhost:8080/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: userName, password, email, referralKey }),
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        setIsSignup(false);
        setUsername("");
        setPassword("");
        setEmail("");
        return;
      }

      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: userName, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid login credentials");
      }

      const userResponse = await fetch("http://localhost:8080/api/user", { credentials: "include" });

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
      <div className="page" style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2>{isSignup ? "Sign Up" : "Login"}</h2>
          <input type="text" placeholder="Username" style={{ padding: "10px", fontSize: "16px" }} value={userName} onChange={(e) => setUsername(e.target.value)} />
          {isSignup && <input type="email" placeholder="Email" style={{ padding: "10px", fontSize: "16px" }} value={email} onChange={(e) => setEmail(e.target.value)} />}
          <input type="password" placeholder="Password" style={{ padding: "10px", fontSize: "16px" }} value={password} onChange={(e) => setPassword(e.target.value)} />
          {isSignup && <input type="password" placeholder="Referral Key" style={{ padding: "10px", fontSize: "16px" }} value={referralKey} onChange={(e) => setReferralKey(e.target.value)} />}
          <button className="btn" onClick={handleSubmit} style={{ padding: "10px 20px", fontSize: "16px" }}>
            {isSignup ? "Sign Up" : "Login"}
          </button>
          <button className="btn" onClick={() => setIsSignup(!isSignup)} style={{ padding: "10px 20px", fontSize: "16px", backgroundColor: "#ccc" }}>
            {isSignup ? "Already have an account? Login" : "Need an account? Sign Up"}
          </button>
          <button
            className="btn"
            onClick={() => onSuccess(null)} // Browse without login
            style={{ padding: "10px 20px", fontSize: "16px", backgroundColor: "#ddd" }}>
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
        <div className="pofile" style={{ display: "flex", flexDirection: "row" }}>
          <div className="subtitle" style={{ flex: 1 }}>
            Profile
          </div>
          <button className="btn" onClick={onLogout} style={{ marginRight: "20px" }}>
            Logout
          </button>
        </div>
        <div className="bets">Welcome back, {account.name}.</div>
        <div></div>
      </div>
    </>
  );
}

function Store({ account, isLoggedIn }) {
  const [id, setId] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/markets", { credentials: "include" })
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <>
      <div className="page">
        {id !== null && <Market market={data.find((item) => item.id === id)} onClose={() => setId(null)} account={account} isLoggedIn={isLoggedIn} />}
        <div className="subtitle">All Markets</div>
        <div style={{ margin: "20px", display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px" }}>
          {data ? (
            <>
              {data.map((item) => (
                <Preview title={item.title} open={() => setId(item.id)} key={item.id} market={item} isLoggedIn={isLoggedIn} />
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
            <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
              <div style={{ fontWeight: 400, width: "100%" }}>{title}</div>
              <Graph value={market.shares[0].price} />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="option" style={{ backgroundColor: "#4CC790" }}>
                {market.shares[0].name}
              </div>
              <div className="option" style={{ backgroundColor: "#c74c4c" }}>
                {market.shares[1].name}
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
      return { x: cx + r * Math.cos(radians), y: cy + -r * Math.sin(radians) };
    };
    const start = convert(startAngle);
    const end = convert(endAngle);
    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    const sweep = endAngle < startAngle ? 1 : 0;

    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
  }
  return (
    <svg width={width} height={height} style={{ flexShrink: 0 }}>
      <path d={arc(width / 2, height / 2, 35, 0, 180 - value * 180)} style={{ fill: "none", stroke: "#c74c4c", strokeWidth: "10", strokeLinecap: "round" }} />
      <path d={arc(width / 2, height / 2, 35, 180, 180 - value * 180)} style={{ fill: "none", stroke: "#4CC790", strokeWidth: "10", strokeLinecap: "round" }} />
      <text x={width / 2} y={height / 2 + 5} textAnchor="middle" dominantBaseline="middle" fill={value >= 0.5 ? "#4CC790" : "#c74c4c"} style={{ fontSize: "16px", fontWeight: "bold" }}>
        {Math.round(value * 100)}%
      </text>
    </svg>
  );
}

function Market({ market, onClose, isLoggedIn, account }) {
  return (
    <>
      <div className="market">
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
          <div style={{ width: "56px", height: "56px", flexShrink: 0, borderRadius: "10px", background: "var(--accent-bg)" }}>
            <img src={`/market/${market.id}.svg`} style={{ width: "100%", height: "100%" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <h2 className="heading">{market.title} </h2>
            <div style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "15px", fontFamily: "var(--mono)" }}>#{market.id.toString().padStart(8, "0")}</span>
              <span style={{ fontSize: "15px", display: "flex", flexDirection: "row", gap: "5px" }}>
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
        <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
          <div style={{ flex: "75%" }}>
            <Chart />
          </div>
          <div style={{ flex: "25%" }}>
            <Trade isLoggedIn={isLoggedIn} market={market} />
          </div>
        </div>
      </div>
    </>
  );
}

function Trade({ isLoggedIn, market }) {
  const [tradeMode, setMode] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [values, setValues] = useState(market.shares.map(() => 0));
  // if (!isLoggedIn) {
  //   return <div>Please login to trade.</div>;
  // }
  function calculate() {
    setSubtotal(values.reduce((acc, val, idx) => acc + val * market.shares[idx].price * (tradeMode ? 1 : -1), 0));
  }
  function processTrade() {
    if (!isLoggedIn) {
      alert("Please login before placing a trade.");
      return;
    }

    fetch("http://localhost:8080/api/trade", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        marketId: market.id,
        tradeMode,
        trades: market.shares.map((share, i) => ({ shareId: share.id, quantity: values[i] })),
      }),
    });
  }
  return (
    <>
      <div className="trade-wrapper">
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className={`trade-btn ${tradeMode ? "active" : ""}`} onClick={() => setMode(true)}>
            Buy
          </button>
          <button className={`trade-btn ${tradeMode ? "" : "active"}`} onClick={() => setMode(false)}>
            Sell
          </button>
        </div>
        <div className="calculator" style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem", minWidth: "30vw" }}>
          {market.shares.map((share) => (
            <div key={share.id} className="share" style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
              <div
                style={{
                  // width: "50%",
                  fontSize: "20px",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  textAlign: "center",
                  borderColor: "#2563EB",
                  color: "#ffffff",
                  backgroundColor: "#3B82F6",
                  whiteSpace: "nowrap",
                  flex: "1 0 40%",
                }}>
                {share.name}
              </div>
              <input className="trade-input" type="number" placeholder="Amount" style={{ flex: "1 0 60%" }} value={values[market.shares.indexOf(share)]} onChange={(e) => {
                const newValues = [...values];
                newValues[market.shares.indexOf(share)] = parseFloat(e.target.value) || 0;
                setValues(newValues);
                calculate()
              }} />
            </div>
          ))}
          <hr />
          <div>subtotal: ${subtotal.toFixed(2)}</div>
        </div>
        <input type="button" value="Submit" onClick={() => processTrade()} />
      </div>
    </>
  );
}

function Chart() {
  return <></>;
}

function Loading() {
  const rawTime = useRef(0);
  const [time, setTime] = useState(0);
  const frame = useRef(null);
  const thing = [];
  const height = 400;
  const width = 300;
  const count = 25;
  // eslint-disable-next-line react-hooks/purity
  const digits = useMemo(() => Array.from({ length: count }, () => Math.floor(Math.random() * 10)), [count]);
  const gap = (2 * Math.PI) / count;
  const centerX = 0;
  const centerY = -50;
  const size = Math.min(width, height) * 0.35;
  const ease = gsap.parseEase("sine.inOut");

  for (let i = 1; i <= count; i++) {
    const x = getX(i * gap + time);
    const y = getY(i * gap + time);
    const angle = Math.atan2(getY(i * gap + 1 + time) - getY(i * gap + time), getX(i * gap + 1 + time) - getX(i * gap + time));
    thing.push(
      <div className="point" key={i} style={{ fontFamily: "var(--mono)", position: "absolute", transformOrigin: "center center", transform: `translate3d(${x}px, ${y}px, 0) rotate(${angle}rad)` }}>
        {digits[i - 1]}
      </div>,
    );
  }

  function getX(t) {
    return centerX + (size * Math.sqrt(2) * Math.cos(t)) / 1 + Math.sin(t) ** 2;
  }
  function getY(t) {
    return centerY + (size * Math.sqrt(2) * Math.sin(t) * Math.cos(t)) / 1 + Math.sin(t) ** 2;
  }

  useEffect(() => {
    const loop = () => {
      rawTime.current += 0.01;

      setTime(ease((Math.sin(rawTime.current) + 2) / 2) * 5);
      frame.current = requestAnimationFrame(loop);
    };
    frame.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame.current);
    };
  }, [ease]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center", height: "100vh", justifyContent: "center" }}>
        <div>{thing}</div>
        <div style={{ transform: "translate(0px, 50px)" }}>Loading...</div>
      </div>
    </>
  );
}

function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("Store");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("token")) {
      return;
    }

    async function loadUser() {
      try {
        const response = await fetch("http://localhost:8080/api/user", { credentials: "include" });
        if (!response.ok) {
          setAccount(null);
          return;
        }
        const user = await response.json();
        // console.log(user);
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
    await fetch("http://localhost:8080/api/logout", { method: "POST", credentials: "include" });
    setAccount(null);
    toast.info("Logged out successfully");
  }

  if (loading) {
    return <Loading />;
  }

  if (account === undefined) {
    return <Login onSuccess={setAccount} />;
  }

  return (
    <>
      <div className="header">
        <h1 className="logo" onClick={() => setPage("debug")}>
          Thing
        </h1>

        <input style={{ flex: 2, margin: "auto", padding: "10px" }} type="text" placeholder="Search markets..." />
        {account ? (
          <>
            <button style={{ margin: "auto", padding: "10px 20px" }} onClick={() => setPage("dashboard")}>
              Dashboard
            </button>
            <button style={{ margin: "auto", padding: "10px 20px" }} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button style={{ margin: "auto", padding: "10px 20px" }} onClick={() => setAccount(undefined)}>
            Login
          </button>
        )}
        <button style={{ margin: "auto", padding: "10px 20px" }} onClick={() => setPage("Store")}>
          Store
        </button>
      </div>
      {page === "dashboard" && account && <Dashboard account={account} onLogout={handleLogout} />}
      {page === "Store" && <Store account={account} isLoggedIn={!!account} />}
      {page === "debug" && <Debug />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
        transition={Slide}
      />
    </>
  );
}

function Debug() {
  const [resonse, setResponse] = useState(null);
  function foo() {
    //delet all markets
    fetch("http://localhost:8080/api/markets/all", { method: "DELETE", credentials: "include" })
      .then((response) => response.text())
      .then((text) => setResponse(text))
      .catch((err) => console.error("Fetch error:", err));
  }
  function foo1() {
    //add market
    fetch("http://localhost:8080/api/addMarket", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Market",
        tags: ["test"],
        shares: [
          { name: "Yes", price: 0.5 },
          { name: "No", price: 0.5 },
        ],
      }),
    })
      .then((response) => response.text())
      .then((text) => setResponse(text))
      .catch((err) => console.error("Fetch error:", err));
  }
  function foo2() {
    fetch("http://localhost:8080/api/generateMarket", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" } })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => Promise.reject(new Error(text || response.statusText)));
        }
        return response.text();
      })
      .then((text) => setResponse(text))
      .catch((err) => {
        console.error("Fetch error:", err);
        setResponse(`Error: ${err.message}`);
      });
  }
  function foo3() {
    fetch("http://localhost:8080/api/wow", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ balance: 1000 }) })
      .then((response) => response.text())
      .then((text) => setResponse(text))
      .catch((err) => console.error("Fetch error:", err));
  }
  return (
    <>
      <div className="page">
        <div className="profile">Debug Page</div>
      </div>
      <button onClick={() => foo()}>delete</button>
      <button onClick={() => foo1()}>add</button>
      <button onClick={() => foo2()}>e</button>
      <button onClick={() => foo3()}>weather thing</button>
      <div>Debug response: </div>
      <div>{resonse}</div>
    </>
  );
}

export default App;
