import React from "react";
import { Route } from "react-router-dom";
import { withRouter } from "react-router-dom";

import Home from "./pages/Homepage";
import Abstract from "./pages/Abstract";
import Donate from "./pages/Donate";

export const HomeRoute = "/";
export const AbstractRoute = "/abstract/";
export const DonateRoute = "/donate/";

class Routing extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Route path={HomeRoute} exact component={Home} />
        <Route path={AbstractRoute} component={Abstract} />
        <Route path={DonateRoute} component={Donate} />
      </React.Fragment>
    );
  }
}
export default withRouter(Routing);
