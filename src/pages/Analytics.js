import React, { Component } from "react";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
} from "recharts";
import { withStyles } from "@material-ui/core/styles";

import Header from "../components/Header";

async function fetchAnalytics() {
  let resdata = [];
  await axios
    .get(`http://localhost:3001/api/analytics/getallstatistics`)
    .then((res) => {
      resdata = res.data.finalresult;
    })
    .catch((err) => {
      console.log(err);
    });
  return resdata;
}

const styles = (theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: 10,
  },
  gridpaper: {
    textAlign: "center",
    backgroundColor: "#6A8FD4",
    color: "white",
  },
  griditem: {
    padding: theme.spacing(2),
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class Dashboard extends React.Component {
  state = {
    snackbarMessage: "",
    snackbarColor: "",
    open: false,
    totalDistictsCovered: 0,
    totalPanchayatsCovered: 0,
    totalFamiliesBenefitted: 0,
    totalPeopleBenefitted: 0,
    totalDonations: 0,
    totalExpenditure: 0,
    totalWaterSourcesConstructed: 0,
    totalSanitationSystemsConstructed: 0,
    totalConstuctedBarGraph: [],
    waterSourcesStatusPieChart: [],
    sanitationSystemsStatusPieChart: [],
  };

  async componentDidMount() {
    let analytics = await fetchAnalytics();
    this.setState({
      totalDistictsCovered: analytics.totalDistictsCovered,
      totalPanchayatsCovered: analytics.totalPanchayatsCovered,
      totalFamiliesBenefitted: analytics.totalFamiliesBenefitted,
      totalPeopleBenefitted: analytics.totalPeopleBenefitted,
      totalDonations: analytics.totalDonations,
      totalExpenditure: analytics.totalExpenditure,
      totalWaterSourcesConstructed: analytics.totalWaterSourcesConstructed,
      totalSanitationSystemsConstructed:
        analytics.totalSanitationSystemsConstructed,
      totalConstuctedBarGraph: analytics.totalConstuctedBarGraph,
      waterSourcesStatusPieChart: analytics.waterSourcesStatusPieChart,
      sanitationSystemsStatusPieChart:
        analytics.sanitationSystemsStatusPieChart,
    });
  }

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ ...this.state, open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Header />
        <Snackbar
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <SnackbarContent
            style={{
              backgroundColor: this.state.snackbarColor,
            }}
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={this.handleClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
            message={
              <span id="client-snackbar">{this.state.snackbarMessage}</span>
            }
          />
        </Snackbar>
        <div className={classes.paper}>
          <Typography style={{ margin: 10 }} component="h1" variant="h5">
            Analytics
          </Typography>
          <Grid container justify="center" spacing={3}>
            <Grid item>
              <Card className={classes.gridpaper}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    Districts Covered
                  </Typography>
                  <Typography variant="h6" component="h2">
                    {this.state.totalDistictsCovered}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.gridpaper}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    Panchayats Covered
                  </Typography>
                  <Typography variant="h6" component="h2">
                    {this.state.totalPanchayatsCovered}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.gridpaper}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    Families Benefitted
                  </Typography>
                  <Typography variant="h6" component="h2">
                    {this.state.totalFamiliesBenefitted}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.gridpaper}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    People Benefitted
                  </Typography>
                  <Typography variant="h6" component="h2">
                    {this.state.totalPeopleBenefitted}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.gridpaper}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    Donations
                  </Typography>
                  <Typography variant="h6" component="h2">
                    Rs.{this.state.totalDonations}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.gridpaper}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    Expenditure
                  </Typography>
                  <Typography variant="h6" component="h2">
                    Rs.{this.state.totalExpenditure}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.gridpaper}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    Water Sources
                  </Typography>
                  <Typography variant="h6" component="h2">
                    {this.state.totalWaterSourcesConstructed}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.gridpaper}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    Sanitation Systems
                  </Typography>
                  <Typography variant="h6" component="h2">
                    {this.state.totalSanitationSystemsConstructed}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Typography style={{ margin: 30, marginTop: 50 }} component="h1" variant="h6">
            Commissioning of Projects
          </Typography>
          <ResponsiveContainer width="70%" height={200}>
            <BarChart data={this.state.totalConstuctedBarGraph}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Water Sources" fill="#8884d8" />
              <Bar dataKey="Sanitation Systems" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} className={classes.griditem}>
              <Typography style={{ margin: 10 }} component="h1" variant="h6">
                Status of Water Sources
              </Typography>
              <PieChart width={400} height={250}>
                <Legend />
                <Tooltip />
                <Pie
                  data={this.state.waterSourcesStatusPieChart}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                />
              </PieChart>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.griditem}>
              <Typography style={{ margin: 10 }} component="h1" variant="h6">
                Status of Sanitation Systems
              </Typography>
              <PieChart width={250} height={250}>
                <Legend />
                <Tooltip />
                <Pie
                  data={this.state.sanitationSystemsStatusPieChart}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                />
              </PieChart>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Dashboard);
