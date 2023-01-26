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
    if (arr[i] >= 15 && arr[i] <= 30) {
      return { bool: true, index: i };
    }
  }
  return { bool: false, index: -1 };
}




function WeatherButton() {

    const componentDidMount = () => {
      const collection = document.getElementsByClassName("editable");
      for (let i = 0; i < collection.length; i++) {
        const coli = collection[i];
        coli.addEventListener('keydown', (evt) => {
          if (!(((evt.keyCode >= 48 && evt.keyCode <= 57) || (evt.keyCode >= 96 && evt.keyCode <= 105) || (evt.keyCode === 8 || (evt.keyCode >= 37 && evt.keyCode <= 40) )))) 
              evt.preventDefault(); // 0-9 only, arrow keys, backspace
          if (coli.id == "month" && parseInt(coli.innerHTML + evt.key) > 12)
            evt.preventDefault();
          if (coli.id == "day" && parseInt(coli.innerHTML + evt.key) > 31)
            evt.preventDefault();
        });
      }
    }

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
        var year = document.getElementById("year").innerHTML;
        var month = document.getElementById("month").innerHTML;
        var day = document.getElementById("day").innerHTML;
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=30&longitude=35&hourly=temperature_2m&start_date=${year.padStart(4)}-${month.padStart(2)}-${day.padStart(2)}&end_date=${year.padStart(4)}-${month.padStart(2)}-${day.padStart(2)}`, {
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
    componentDidMount()
    var weather_check = checkArray(temp_data)
    return (<>
        <div className="right_top_part">
        <h3>Weather</h3><br></br>  
        <div style={{display: "inline"}}>
          <span>Edit: </span>
          <span id="day" className="editable" contentEditable="true">01</span>
          <span id="line1" >-</span>
          <span id="month" className="editable" contentEditable="true">01</span>
          <span id="line2">-</span>
          <span id="year" className="editable" contentEditable="true">2023</span>
        </div><br></br><br></br>

        {weather_check.bool ? "You can fly @ " + weather_check.index + ":00" : temp_data !== [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ? "You can't fly today." : ""} <br></br>
        <button className="rt epic_button" onClick={onClick}>Check Weather</button> 

        <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
          />
        </div>

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
    <div className="lt">
    <form onSubmit={handleSubmit}>
    <h2>Inputs</h2>
    <div className="pair">
      <label>Load:</label>
      <input 
        type="number" 
        name="load" 
        value={inputs.load || 0} 
        onChange={handleChange}
        style={{float: 'right'}}
      /></div>
      <div className="pair">
      <label>Enter your Base Mass:  </label>
        <input 
          type="number" 
          name="base_mass" 
          value={inputs.base_mass || 35000} 
          onChange={handleChange}
          style={{float: 'right'}}
        /></div>
        <div className="pair">
      <label>Enter your Force:  </label>
        <input 
          type="number" 
          name="force" 
          value={inputs.force || 100000} 
          onChange={handleChange}
          style={{float: 'right'}}
        /></div>
        <div className="pair">
      <label>Enter your Required Speed:　</label>
        <input 
          type="number" 
          name="req_speed" 
          value={inputs.req_speed || 140} 
          onChange={handleChange}
          style={{float: 'right'}}
        /></div>
        <input type="submit" className="epic_button" value="Calculate"/>
    </form>
    </div>


    <div className="lb"><br></br>
    <h2>Results</h2>
    <div className="box">
      <p>
        Take off will take <span className="value">{data.time}s</span>
      </p>
    </div>
    <div className="box">
      <p>
        Runway length: <span className="value">{data.distance}m</span>
      </p>
    </div>
    <div className="box">
      <p>
        Warning: <span className="value">{data.warning}</span>
      </p>
    </div>
    </div>

    </>
  )
}
//

function App() {
    return (
        <>
        <div className="all">
          <div className="grid-container">

              <div>
                <MyForm/>
              </div>

              <div className="rt">
                <WeatherButton/>
              </div>
          </div>
        </div>
        </>
    ); 
}

export default App;