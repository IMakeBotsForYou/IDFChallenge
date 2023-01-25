// Importing modules
import React, { useState, useEffect } from "react";
import "./App.css";
  
function App() {
    // usestate for setting a javascript
    // object for storing and using data
    const [data, setdata] = useState({
        time: 0,
        distance: 0,
        warning: "None",
    });
  
    // Using useEffect for single rendering
    useEffect(() => {
        // Using fetch to fetch the api from 
        // flask server it will be redirected to proxy
        fetch("/", {
            "mode": "POST",
            "body": JSON.stringify()
        }).then((res) =>
            res.json().then((data) => {
                // Setting a data from api
                setdata({
                    time: data.time,
                    distance: data.distance,
                    warning: data.warning,
                });
            })
        );
    }, []);
  
    return (
        <div className="App">
            <header>
                <h1>Takeoff calculator</h1>
            </header>
        </div>
    );
}
  
export default App;



/*class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<NameForm />);*/