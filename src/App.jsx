/* eslint-disable no-unused-vars */
import { use, useEffect, useState } from 'react'
import './App.css'

function Dashboard(){
  const [name, setName] = useState('Dude');
  
  useEffect(() => {
    //get user info    
  }, []);

  return (
    <>
      <div className='page'>
        <h1>Dashboard</h1>
        <div className='pofile'>
          <div className='User'>{name}</div>
        </div>
        <div className='bets'>

        </div>
      </div>
    </>
  )
}


function Store(){
  const [id, setId] = useState(null);
  const [data, setData] = useState([
    {id: 1, title: 'Market 1'},
    {id: 2, title: 'Market 2'},
    {id: 3, title: 'Market 3'},
  ]);
  return (
    <>
      <div className='page'>
        <h1>Store</h1>
        {id && <Market id={id} onClose={() => setId(null)} />}
        <div className='discover'>
          <h2>All Markets</h2>
          {data.map((item) => (  
            <div 
              className='preview'
              key={item.id} 
              onClick={() => setId(item.id)}
            >{item.title}</div>
          ))}
        </div>
      </div>
    </>
  )
}


function Market({id, onClose}){
  useEffect(() => {
    //fetch market details using id
  }, [id]);
  return (
    <>
      <div className='market'>
        <h2>Market </h2>
        <p>Market details... {id}</p>
        <button style={{float: 'right' }} className='btn' onClick={onClose}>Close</button>
      </div>
    </>
  )
}

function App() {
  const [page, setPage] = useState('dashboard');

  return (  
    <>
      <div className='header'>
        <button onClick={() => setPage('dashboard')}>Dashboard</button>
        <button onClick={() => setPage('Store')}>Store</button>
      </div>
      {page === 'dash  board' && <Dashboard />}
      {page === 'Store' && <Store />}
    </>
  )
}

export default App
