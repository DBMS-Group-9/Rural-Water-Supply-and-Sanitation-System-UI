import React, { Component } from 'react';

import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Donor from './components/Donor';
import Homepage from './components/Homepage';
class App extends Component {
  state = {
    player: [
      { bid: "35" },
      { bid: "50" },
      { bid: "100" }
    ]
  }

  bidIncreaseHandler = () => {
    console.log(this);
    console.log("Bid Increased!");
    this.setState({
      player: [
        { bid: "45" },
        { bid: "50" },
        { bid: "100" }
      ]

    })
  }

  render() {
    return (
      // <div>
      //   <Header />
      //   <Footer />
      //   {/* <button onClick = {this.showAbstract}>Show Abstract</button> */}
      // </div>

      // <div className="App-header">
      //   <h1 align='center'>Rural Water Supply and Sanitation System</h1>

      //   <p align="center">The Smart monitoring System</p>
      //   <button align = 'left' onClick = {this.bidIncreaseHandler}>Click To Bid</button>
      //   <Player bid = {this.state.player[0].bid} />


      //   <div className="App-bottom">
      //     <h1>Welcome to Auctions</h1>




      //     <p align="center">PLAYER 1 IS HERE</p>
      //     <div>
      //       <Footer />
      //     </div>

      //   </div>
      // </div>
      <React.Fragment>
          <Header />
         <Homepage />
        <Footer title="The Database Alchemists" description="Developed by the students of Amrita Vishwa Vidyapeetham" />
      </React.Fragment>
    );
  }


}

export default App;
