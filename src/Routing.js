import React from "react";
import { Route } from "react-router-dom";
import { withRouter } from "react-router-dom";

import Home from "./pages/Homepage";
import Abstract from "./pages/Abstract";
import Dashboard from "./pages/Dashboard";
import Donate from "./pages/Donate";
import Jobs from "./pages/Jobs";
import Location from "./pages/Location";
import Employee from "./pages/Employee";
import WaterSources from "./pages/WaterSources";
import ApproveWaterSources from "./pages/ApproveWaterSources";
import ManageWaterSources from "./pages/ManageWaterSources";
import WaterUsage from "./pages/WaterUsage";
import SanitationSystems from "./pages/SanitationSystems";
import ApproveSanitationSystems from "./pages/ApproveSanitationSystems";
import ManageSanitationSystems from "./pages/ManageSanitationSystems";
import Families from "./pages/Families";
import Emergency from "./pages/Emergency";
import Expenditure from "./pages/Expenditure";
import Login from "./pages/Login";

export const HomeRoute = "/";
export const AbstractRoute = "/abstract/";
export const DashboardRoute = "/dashboard/";
export const DonateRoute = "/donate/";
export const JobsRoute = "/jobs/";
export const LocationRoute = "/location/";
export const EmployeeRoute = "/employee/";
export const WaterSourcesRoute = "/watersources/";
export const ApproveWaterSourcesRoute = "/approvewatersources/";
export const ManageWaterSourcesRoute = "/managewatersources/";
export const WaterUsageRoute = "/waterusage/";
export const SanitationSystemsRoute = "/sanitationsystems/";
export const ApproveSanitationSystemsRoute = "/approvesanitationsystems/";
export const ManageSanitationSystemsRoute = "/managesanitationsystems/";
export const FamiliesRoute = "/families/";
export const EmergencyRoute = "/emergency/";
export const ExpenditureRoute = "/expenditure/";
export const LoginRoute = "/login";

class Routing extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Route path={HomeRoute} exact component={Home} />
        <Route path={AbstractRoute} component={Abstract} />
        <Route path={DashboardRoute} component={Dashboard} />
        <Route path={DonateRoute} component={Donate} />
        <Route path={JobsRoute} component={Jobs} />
        <Route path={LocationRoute} component={Location} />
        <Route path={EmployeeRoute} component={Employee} />
        <Route path={WaterSourcesRoute} component={WaterSources} />
        <Route path={ApproveWaterSourcesRoute} component={ApproveWaterSources} />
        <Route path={ManageWaterSourcesRoute} component={ManageWaterSources} />
        <Route path={WaterUsageRoute} component={WaterUsage} />
        <Route path={SanitationSystemsRoute} component={SanitationSystems} />
        <Route path={ApproveSanitationSystemsRoute} component={ApproveSanitationSystems} />
        <Route path={ManageSanitationSystemsRoute} component={ManageSanitationSystems} />
        <Route path={FamiliesRoute} component={Families} />
        <Route path={ExpenditureRoute} component={Expenditure} />
        <Route path={EmergencyRoute} component={Emergency} />
        <Route path={LoginRoute} component={Login} />
      </React.Fragment>
    );
  }
}
export default withRouter(Routing);
