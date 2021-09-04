import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/tree")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  console.log(`data=${data}`)
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>{JSON.stringify(data)}</p>
      </header>
    </div>
  );
}

export default App;