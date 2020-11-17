import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import Routing from './Routing.js';


import CssBaseline from '@material-ui/core/CssBaseline';

import "./App.css";
import Footer from "./components/Footer";

const history = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
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
