/* eslint-disable no-unused-vars */
import { use, useEffect, useState } from "react";
import "./App.css";

function Dashboard() {
  const [name, setName] = useState("Dude");

  useEffect(() => {
    //get user info
  }, []);

  return (
    <>
      <div className="page">
        <div className="pofile">
          <div className="User">{name}</div>
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
        title: "Will shit go down?",
        type: "simple",
        tags: ["anal", "shit"],
        prices: ["0.50", "0.50"],
      },
      {
        id: 1,
        title: "Will the sun rise tomorrow?",
        type: "simple",
        tags: ["sports", "racism"],
        prices: ["0.50", "0.50"],
      },
      {
        id: 2,
        title: "Is the sky blue?",
        type: "simple",
        tags: ["gay", "politics"],
        prices: ["0.50", "0.50"],
      },
      {
        id: 3,
        title: "how fast does water flow downhill?",
        type: "advanced",
        tags: ["science", "physics"],
        options: ["10km/h", "20km/h", "30km/h"],
        prices: ["0.50", "0.50", "0.50"],
      },
    ]);
  }, []);

  return (
    <>
      <div className="page">
        {id !== null && <Market market={data.find((item) => item.id === id)} onClose={() => setId(null)} />}
        <div className="subtitle">All Markets</div>
        <div style={{ display: "flex" }}>
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
        <div style={{ fontWeight: 400 }}>{title}</div>
        <div style={{ display: "flex", flexDirection: "row", marginTop: "auto" }}>
          {market.prices?.map((price, index) => (
            <div className="lables" key={index}>
              {price}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "row"}}>
          {type == "simple" && (
            <>
              <div className="option">Yes</div>
              <div className="option">No</div>
            </>
          )}
          {type == "advanced" && (
            <>
              {market.options?.map((option) => (
                <div className="option" key={option}>
                  {option}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function Market({ market, onClose }) {
  useEffect(() => { 
    console.log(market);
    //fetch market details using id
  }, );
  return (
    <>
      <div className="market">
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: "20px"}}>
          <div style={{width: "56px", height: "56px", flexShrink: 0,borderRadius: "10px", background: "var(--accent-bg)"}}>
            <img src={`https://avatars.dicebear.com/api/identicon/${market.id}.svg`}style={{width: "100%", height: "100%"}} />
          </div>
          <div style={{display: "flex", flexDirection: "column", flex: 1}}>
            <h2 className="heading">{market.title} </h2>
            <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center"}}>
              <span style={{fontSize: "15px", fontFamily: "var(--mono)"}}>#{market.id.toString().padStart(8, "0")}</span>
              <span style={{fontSize: "15px", display: "flex", flexDirection: "row", gap: "5px"}}>
                {market.tags?.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </span>
            </div>
          </div>
          <button style={{}} className="btn" onClick={onClose}>Close</button>
        
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
        <h1 className="logo" >Thing</h1>
        <div></div>
        <input style={{flex:2, margin: "auto", padding: "10px"}} type="text" name="" id="" placeholder="Search markets..."/>
        <button style={{margin: "auto", padding: "10px 20px"}} onClick={() => setPage("dashboard")}>Dashboard</button>
        <button style={{margin: "auto", padding: "10px 20px"}} onClick={() => setPage("Store")}>Store</button>
      </div>
      {page === "dashboard" && <Dashboard />}
      {page === "Store" && <Store />}
    </>
  );
}

export default App;
