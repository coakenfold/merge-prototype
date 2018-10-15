import React, { Component } from "react";
import "./App.css";

// import dummyData from "./data/data";
import axios from "axios";
import MergeRecords from "./components/MergeRecords/MergeRecords";
class App extends Component {
  state = {
    data: null,
    error: null
  };
  componentDidMount() {
    axios
      .get("https://pznmh01oo9.execute-api.ca-central-1.amazonaws.com/dev/test-merge-two-records")
      .then(response => {
        this.setState({ data: response.data });
        // this.setState({ data: dummyData });
      })
      .catch(error => {
        this.setState({ error });
      });
  }
  render() {
    const { data, error } = this.state;
    let content = null;
    if (error) {
      content = <div>We encountered an error. Please try again later.</div>;
    }
    if (data) {
      content = <MergeRecords data={data} />;
    }
    return <div className="App">{content}</div>;
  }
}

export default App;
