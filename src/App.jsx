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
        <h2 className="heading">Dashboard</h2>
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
        prices: ["0.50", "0.50"],
      },
      {
        id: 1,
        title: "Will the sun rise tomorrow?",
        type: "simple",
        prices: ["0.50", "0.50"],
      },
      {
        id: 2,
        title: "Is the sky blue?",
        type: "simple",
        prices: ["0.50", "0.50"],
      },
      {
        id: 3,
        title: "how fast does water flow downhill?",
        type: "advanced",
        options: ["10km/h", "20km/h", "30km/h"],
        prices: ["0.50", "0.50", "0.50"],
      },
    ]);
  }, []);

  return (
    <>
      <div className="page">
        <h2 className="heading">Store</h2>
        {id && <Market market={data.find((item) => item.id === id)} onClose={() => setId(null)} />}
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
    //fetch market details using id
  }, );
  return (
    <>
      <div className="market">
        <h2 className="heading">{market.title}</h2>
        <p>Market details... {market.id}</p>
        <button style={{ float: "right" }} className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </>
  );
}

function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <>
      <div className="header">
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("Store")}>Store</button>
      </div>
      {page === "dashboard" && <Dashboard />}
      {page === "Store" && <Store />}
    </>
  );
}

export default App;
