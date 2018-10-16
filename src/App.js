import React, { Component } from "react";
import "./App.css";

import axios from "axios";
import MergeRecords from "./components/MergeRecords/MergeRecords";
import Record from "./components/Record/Record";

class App extends Component {
  state = {
    data: null,
    error: null,
    merged: false
  };
  componentDidMount() {
    axios
      .get("https://pznmh01oo9.execute-api.ca-central-1.amazonaws.com/dev/test-merge-two-records")
      .then(response => {
        this.setState({ data: response.data });
      })
      .catch(error => {
        this.setState({ error });
      });
  }
  render() {
    const { data, error, merged } = this.state;
    let content = null;
    if (error) {
      content = <div>We encountered an error. Please try again later.</div>;
    }
    if (data) {
      if (merged) {
        content = (
          <MergeRecords
            data={data}
            onUndo={() => {
              this._onUndo();
            }}
          />
        );
      } else {
        content = (
          <Record
            data={data[0]}
            onMerge={() => {
              this._onMerge();
            }}
          />
        );
      }
    }
    return <div className="App">{content}</div>;
  }
  _onMerge() {
    this.setState({
      merged: true
    });
  }
  _onUndo() {
    this.setState({
      merged: false
    });
  }
}

export default App;
