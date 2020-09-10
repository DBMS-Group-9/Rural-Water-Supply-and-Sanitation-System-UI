import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import Routing from './Routing.js';


import CssBaseline from '@material-ui/core/CssBaseline';

import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const history = createBrowserHistory();

class App extends Component {
  state = {
    player: [{ bid: "35" }, { bid: "50" }, { bid: "100" }],
  };

  bidIncreaseHandler = () => {
    console.log(this);
    console.log("Bid Increased!");
    this.setState({
      player: [{ bid: "45" }, { bid: "50" }, { bid: "100" }],
    });
  };

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Header />
        <div style={{ marginBottom: 100 }}>
          <Router history={history}><Routing /></Router>
        </div>
        <Footer
          title="The Database Alchemists"
          description="Developed by the students of Amrita Vishwa Vidyapeetham"
        />
      </React.Fragment>
    );
  }
}

export default App;
