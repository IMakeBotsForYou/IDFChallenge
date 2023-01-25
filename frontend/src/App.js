// Importing modules
import React, { useState, useEffect } from "react";
import "./App.css";
import ReactDOM from "react-dom/client";

let global_data = {}


function MyForm() {
  const [inputs, setInputs] = useState({});
  const [data, setData] = useState({
        time: 0,
        distance: 0,
        warning: "None"
    });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(inputs => ({...inputs, [name]: value}))
    console.log(inputs);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Using fetch to fetch the api from 
    // flask server it will be redirected to proxy
    if (!inputs)
        inputs = {}
    console.log(inputs);
    fetch("/", {
        "method": "POST",
        "body": JSON.stringify(inputs),
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
    }).then((res) =>
        res.json().then((data) => {
            // Setting a data from api
            setData(data)
        })
    ).catch(error => console.log(error));
  }

  return ( 
    <>
    <form onSubmit={handleSubmit}>
      <label>Load:  </label>
      <input 
        type="number" 
        name="load" 
        value={inputs.load || 0} 
        onChange={handleChange}
      /><br></br>
      <label>Enter your Base Mass:  </label>
        <input 
          type="number" 
          name="base_mass" 
          value={inputs.base_mass || 35000} 
          onChange={handleChange}
        /><br></br>
      <label>Enter your Force:  </label>
        <input 
          type="number" 
          name="force" 
          value={inputs.force || 100000} 
          onChange={handleChange}
        /><br></br>
      <label>Enter your Required Speed:  </label>
        <input 
          type="number" 
          name="req_speed" 
          value={inputs.req_speed || 140} 
          onChange={handleChange}
        /><br></br>
        <input type="submit" />
    </form>
    <div>
        <p>
          {data.time}s
        </p>
        <p>
          {data.distance}m
        </p>
        <br></br>
        <p>
          Warning: {data.warning}
        </p>
    </div>
    </>
  )
}
//

function App() {
    return (
        <>
          <div className="App">
            <header>
              <h1>Takeoff calculator</h1>
            </header>
          </div>
          <div style={{marginLeft: 50 + 'px'}}>
          <MyForm/>
          </div>
        </>
    ); //
}

export default App;