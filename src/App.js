import React, { Component } from "react";
import "./App.css";

// TODO: consume via xhr
import data from "./data/data";

import MergeRecords from "./components/MergeRecords/MergeRecords";
class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Prototype</h1>
        <MergeRecords data={data} />
      </div>
    );
  }
}

export default App;
