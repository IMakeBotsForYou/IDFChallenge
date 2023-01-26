// Importing modules
import React, { useState, useEffect } from "react";
import "./App.css";
import ReactDOM from "react-dom/client";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import annotations from 'highcharts/modules/annotations';
annotations(Highcharts);

function generate_options(json_res){
            return ({
    chart: {
    type: 'line'
  },
  title: {
    text: 'Daily Temperature'
  },
  xAxis: {
    categories: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','08:00','07:00','08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'], 
    max: 24,
    min: 0
  },
  yAxis: {
    title: {
      text: 'Temperature (°C)'
    }
  },
  plotOptions: {
    line: {
      dataLabels: {
        enabled: true
      },
      enableMouseTracking: true
    }
  },
   series: [{
          name: 'Temp (C)', 
          data: json_res.map((temp) => {
              return {
                  y: temp,
                  color: temp < 15 ? 'red' : (temp < 30 ? 'green' : 'black')
              }
          }),
          dataLabels: {
              enabled: true
          }
      }]
    })
} 



const useScript = url => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [url]);
};


function checkArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > 15 && arr[i] < 30) {
      return { bool: true, index: i };
    }
  }
  return { bool: false, index: -1 };
}





function WeatherButton() {
    const [temp_data, setData] = useState(
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );  

    const [chartOptions, setChartOptions] = useState(generate_options(temp_data));
    useEffect(() => {
        setChartOptions(generate_options(temp_data));
    }, [temp_data]);

    const onClick = (event) => {
        // Using fetch to fetch the api from 
        // flask server it will be redirected to proxy
        fetch("https://api.open-meteo.com/v1/forecast?latitude=30&longitude=35&hourly=temperature_2m&start_date=2023-01-01&end_date=2023-01-01", {
            "method": "GET"
        }).then((res) =>
            res.json().then((json_res) => {
                // Setting a data from api
                setData(json_res.hourly.temperature_2m);
                setChartOptions({
                  ...generate_options(json_res.hourly.temperature_2m)
                });
                })  
            ).catch(error => console.log(error));
    }

    var weather_check = checkArray(temp_data)
    return (<>
      <h4>01/01/2023</h4>
      {weather_check.bool ? "You can fly @ " + weather_check.index + ":00" : temp_data != [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ? "You can't fly today." : ""} <br></br>
      <button class="rt" onClick={onClick}>Check Weather</button> 

      <HighchartsReact
      highcharts={Highcharts}
      options={chartOptions}
    />

    </>)
  
}


function MyForm() {
  var [inputs, setInputs] = useState({});
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
    <div class="lt">
    <form onSubmit={handleSubmit}>
    <h2>Inputs</h2>
      <label>Load:</label>
      <input 
        type="number" 
        name="load" 
        value={inputs.load || 0} 
        onChange={handleChange}
        style={{float: 'right'}}
      /><br></br>
      <label>Enter your Base Mass:  </label>
        <input 
          type="number" 
          name="base_mass" 
          value={inputs.base_mass || 35000} 
          onChange={handleChange}
          style={{float: 'right'}}
        /><br></br>
      <label>Enter your Force:  </label>
        <input 
          type="number" 
          name="force" 
          value={inputs.force || 100000} 
          onChange={handleChange}
          style={{float: 'right'}}
        /><br></br>
      <label>Enter your Required Speed:  </label>
        <input 
          type="number" 
          name="req_speed" 
          value={inputs.req_speed || 140} 
          onChange={handleChange}
          style={{float: 'right'}}
        /><br></br>
        <input type="submit" />
    </form>
    </div>
    <div class="lb">
        <h2>Results</h2>
        <p>
          Take off will take {data.time}s
        </p>
        <p>
          Runway length: {data.distance}m
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
        <div class="grid-container">

            <div className="App hd">
              <header>
                <h1>Takeoff calculator</h1>
              </header>
            </div>

            <div>
              <MyForm/>
            </div>

            <div class="rt">
              <WeatherButton/>
            </div>
        </div>
        </>
    ); 
}

export default App;