/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import "./App.css";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

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
    //fetch all markets
    setData([
      {
        id: 0,
        title: "are you constipated?",
        type: "simple",
        tags: ["orphans", "what"],
        prices: [1.0, 0.0],
      },
      {
        id: 1,
        title: "Will the sun rise tomorrow?",
        type: "simple",
        tags: ["sports", "racism"],
        prices: [0.0, 1.0],
      },
      {
        id: 2,
        title: "Is the sky blue?",
        type: "simple",
        tags: ["gay", "politics"],
        prices: [0.5, 0.5],
      },
      {
        id: 3,
        title: "how fast does water flow downhill?",
        type: "advanced",
        tags: ["science", "physics"],
        options: ["10km/h", "20km/h", "30km/h"],
        prices: [0.5, 0.5, 0.5],
      },
      {
        id: 4,
        title: "is eric wong drop as a child?",
        type: "simple",
        tags: ["transgender", "based"],
        prices: [0.75, 0.25],
      },
      {
        id: 5,
        title: "Will Bitcoin reach $100k by end of year?",
        type: "simple",
        tags: ["crypto", "finance"],
        prices: [0.65, 0.35],
      },
      {
        id: 6,
        title: "Who will win the next election?",
        type: "advanced",
        tags: ["politics"],
        options: ["Candidate A", "Candidate B", "Candidate C"],
        prices: [0.4, 0.35, 0.25],
      },
      {
        id: 7,
        title: "Will it rain tomorrow?",
        type: "simple",
        tags: ["weather"],
        prices: [0.3, 0.7],
      },
      {
        id: 8,
        title: "What will be the temperature high?",
        type: "advanced",
        tags: ["weather", "science"],
        options: ["Below 60°F", "60-75°F", "Above 75°F"],
        prices: [0.2, 0.5, 0.3],
      },
    ]);
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
        <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px"}}>
          {data.map((item) => (
            <Preview
              title={item.title}
              open={() => setId(item.id)}
              key={item.id}
              market={item}
            />
          ))}
        </div>
      </div>
    </>
  );
}
function Preview({ title, open, market }) {
  const [type, setType] = useState("");
  useEffect(() => {
    setType(market.type);
  }, [market]);
  return (
    <>
      <div className="preview" onClick={() => open()}>
        {type == "simple" && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <div style={{ fontWeight: 400, width: "100%" }}>{title}</div>
              <Graph values={market.prices} />
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
        )}
        {type == "advanced" && (
          <>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontWeight: 400 }}>{title}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {market.options?.map((option) => (
                <div className="option" key={option}>
                  {option}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
function Graph({ values }) {
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
        d={arc(width / 2, height / 2, 35, 0, 180 - values[0] * 180)}
        style={{
          fill: "none",
          stroke: "#c74c4c",
          strokeWidth: "10",
          strokeLinecap: "round",
        }}
      />
      <path
        d={arc(width / 2, height / 2, 35, 180, 180 - values[0] * 180)}
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
        fill={values[0] >= values[1] ? "#4CC790" : "#c74c4c"}
        style={{ fontSize: "16px", fontWeight: "bold" }}
      >
        {Math.round(values[0] * 100)}%
      </text>
    </svg>
  );
}

function Market({ market, onClose }) {
  useEffect(() => {
    console.log(market);
    //fetch market details using id
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
              src={`https://avatars.dicebear.com/api/identicon/${market.id}.svg`}
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
      </div>
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
