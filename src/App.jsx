/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef, use } from "react";
import "./App.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function Login({ onSuccess }) {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  function checkLogin() {
    //check login details

    // eslint-disable-next-line no-constant-condition
    if (true) {
      onSuccess({
        name: userName,
      });
    } else {
      alert("login failed.");
    }
  }
  return (
    <>
      <div
        className="page"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
            onClick={checkLogin}
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
}

function Dashboard() {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    //load account
  }, []);
  if (!account) {
    return <Login onSuccess={(acc) => setAccount(acc)} />;
  }
  return (
    <>
      <div className="page">
        <div className="pofile">
          <div className="User">{account.name}</div>
        </div>
        <div className="bets"></div>
      </div>
    </>
  );
}

function Store() {
  const [id, setId] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/markets")
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

function Market({ market, onClose }) {
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
            <Trade />
          </div>
        </div>
      </div>
    </>
  );
}
function Trade(){
  const [buyMode, setMode] = useState(true)
  return(
    <>
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
  const [page, setPage] = useState("Store");

  return (
    <>
      <div className="header">
        <h1 className="logo">Thing</h1>
        <div></div>
        <input
          style={{ flex: 2, margin: "auto", padding: "10px" }}
          type="text"
          name=""
          id=""
          placeholder="Search markets..."
        />
        <button
          style={{ margin: "auto", padding: "10px 20px" }}
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </button>
        <button
          style={{ margin: "auto", padding: "10px 20px" }}
          onClick={() => setPage("Store")}
        >
          Store
        </button>
      </div>
      {page === "dashboard" && <Dashboard />}
      {page === "Store" && <Store />}
    </>
  );
}

export default App;
