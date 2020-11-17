import React, { Component } from "react";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Card from "@material-ui/core/Card";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
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

async function fetchDistricts() {
  let resdata = [];
  await axios
    .get(`http://localhost:3001/api/location/getalldistricts`)
    .then((res) => {
      resdata = res.data.result;
    })
    .catch((err) => {
      console.log(err);
    });
  return resdata;
}

async function fetchPanchayats() {
  let resdata = [];
  await axios
    .get(`http://localhost:3001/api/location/getallpanchayats`)
    .then((res) => {
      resdata = res.data.result;
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
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
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
    availableDistricts: [],
    availablePanchayats: [],
    districtSelect: "",
    panchayatSelect: "",
    previousSelect: "",
    snackbarMessage: "",
    snackbarColor: "",
    selectedType: "",
    open: false,
    averageWaterUsagePerMonth: 0,
    averageWaterUsagePerPersonPerMonth: 0,
    totalDistictsCovered: 0,
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
      averageWaterUsagePerMonth: analytics.averageWaterUsagePerMonth,
      averageWaterUsagePerPersonPerMonth: analytics.averageWaterUsagePerPersonPerMonth.toFixed(
        2
      ),
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
    let districts = await fetchDistricts();
    let panchayats = await fetchPanchayats();
    this.setState({
      availableDistricts: districts,
      availablePanchayats: panchayats,
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    e.persist();
    let ev = e;
    if (this.state.panchayatSelect.length !== 0) {
      if (this.state.previousSelect === this.state.panchayatSelect) {
        return;
      }
      await axios
        .post(`http://localhost:3001/api/analytics/getpanchayatstatistics`, {
          Pincode: this.state.panchayatSelect,
        })
        .then(async (res) => {
          let analytics = res.data.finalresult;
          console.log(analytics);
          this.setState({
            averageWaterUsagePerMonth: analytics.averageWaterUsagePerMonth,
            averageWaterUsagePerPersonPerMonth: analytics.averageWaterUsagePerPersonPerMonth.toFixed(
              2
            ),
            totalFamiliesBenefitted: analytics.totalFamiliesBenefitted,
            totalPeopleBenefitted: analytics.totalPeopleBenefitted,
            totalExpenditure: analytics.totalExpenditure,
            totalWaterSourcesConstructed:
              analytics.totalWaterSourcesConstructed,
            totalSanitationSystemsConstructed:
              analytics.totalSanitationSystemsConstructed,
            totalConstuctedBarGraph: analytics.totalConstuctedBarGraph,
            waterSourcesStatusPieChart: analytics.waterSourcesStatusPieChart,
            sanitationSystemsStatusPieChart:
              analytics.sanitationSystemsStatusPieChart,
            snackbarMessage: res.data.message,
            open: true,
            previousSelect: this.state.panchayatSelect,
            selectedType: "panchayat",
            snackbarColor: "green",
          });
          ev.target.reset();
        })
        .catch((err) => {
          this.setState({
            ...this.state,
            open: true,
            snackbarMessage: err.response.data.message,
            snackbarColor: "red",
          });
        });
    } else if (this.state.districtSelect.length !== 0) {
      if (this.state.previousSelect === this.state.districtSelect) {
        return;
      }
      await axios
        .post(`http://localhost:3001/api/analytics/getdistrictstatistics`, {
          District: this.state.districtSelect,
        })
        .then(async (res) => {
          let analytics = res.data.finalresult;
          console.log(analytics);
          this.setState({
            averageWaterUsagePerMonth: analytics.averageWaterUsagePerMonth,
            averageWaterUsagePerPersonPerMonth: analytics.averageWaterUsagePerPersonPerMonth.toFixed(
              2
            ),
            totalFamiliesBenefitted: analytics.totalFamiliesBenefitted,
            totalPeopleBenefitted: analytics.totalPeopleBenefitted,
            totalPanchayatsCovered: analytics.totalPanchayatsCovered,
            totalExpenditure: analytics.totalExpenditure,
            totalWaterSourcesConstructed:
              analytics.totalWaterSourcesConstructed,
            totalSanitationSystemsConstructed:
              analytics.totalSanitationSystemsConstructed,
            totalConstuctedBarGraph: analytics.totalConstuctedBarGraph,
            waterSourcesStatusPieChart: analytics.waterSourcesStatusPieChart,
            sanitationSystemsStatusPieChart:
              analytics.sanitationSystemsStatusPieChart,
            snackbarMessage: res.data.message,
            open: true,
            previousSelect: this.state.districtSelect,
            selectedType: "district",
            snackbarColor: "green",
          });
          ev.target.reset();
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            ...this.state,
            open: true,
            snackbarMessage: err.response.data.message,
            snackbarColor: "red",
          });
        });
    } else {
      if (this.state.previousSelect === "") {
        return;
      }
      let analytics = await fetchAnalytics();
      this.setState({
        averageWaterUsagePerMonth: analytics.averageWaterUsagePerMonth,
        averageWaterUsagePerPersonPerMonth: analytics.averageWaterUsagePerPersonPerMonth.toFixed(
          2
        ),
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
        snackbarMessage: "Fetched Analytics Successfully!",
        open: true,
        selectedType: "",
        previousSelect: "",
        snackbarColor: "green",
      });
    }
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ ...this.state, open: false });
  };

  renderBarGraph() {
    if (this.state.totalConstuctedBarGraph.length !== 0) {
      return (
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
      );
    } else {
      return (
        <Typography style={{ margin: 20 }} component="h3" variant="subtitle1">
          No Data in Bar Graph
        </Typography>
      );
    }
  }

  renderPieChart(data) {
    if (data.length !== 0) {
      return (
        <PieChart width={400} height={270}>
          <Legend />
          <Tooltip />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#82ca9d"
            label
          />
        </PieChart>
      );
    } else {
      return (
        <Typography style={{ margin: 20 }} component="h3" variant="subtitle1">
          No Data in Pie Chart
        </Typography>
      );
    }
  }

  renderDistrict() {
    const { classes } = this.props;
    if (this.state.selectedType === "") {
      return (
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
      );
    }
  }

  renderPanchayats() {
    const { classes } = this.props;
    if (this.state.selectedType !== "panchayat") {
      return (
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
      );
    }
  }

  renderDonations() {
    const { classes } = this.props;
    if (this.state.selectedType === "") {
      return (
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
      );
    }
  }

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
          <form
            className={classes.form}
            style={{ marginBottom: 40, width: "60%" }}
            onSubmit={this.handleSubmit}
          >
            <Grid container justify="center" spacing={3}>
              <Grid item xs={12} sm={4}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className={classes.form}
                >
                  <InputLabel id="District-Label">District</InputLabel>
                  <Select
                    labelId="District-Label"
                    id="District"
                    label="District"
                    name="District"
                    variant="outlined"
                    value={this.state.districtSelect}
                    onOpen={(e) => {
                      if (this.state.availableDistricts.length === 0)
                        this.setState({
                          open: true,
                          snackbarMessage: "Districts Unavailable!",
                          snackbarColor: "red",
                        });
                    }}
                    onChange={(e) => {
                      this.setState({ districtSelect: e.target.value });
                      axios
                        .post(
                          `http://localhost:3001/api/location/getcorrespondingpanchayats`,
                          { District: e.target.value }
                        )
                        .then((res) => {
                          let panchayats = res.data.result;
                          this.setState({ availablePanchayats: panchayats });
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                    fullWidth
                  >
                    {this.state.availableDistricts.map((pin) => (
                      <MenuItem key={pin.District} value={pin.District}>
                        {pin.District}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className={classes.form}
                >
                  <InputLabel id="Panchayat-Label">Panchayat</InputLabel>
                  <Select
                    labelId="Panchayat-Label"
                    id="Panchayat"
                    label="Panchayat"
                    name="Panchayat"
                    variant="outlined"
                    value={this.state.panchayatSelect}
                    onOpen={(e) => {
                      if (this.state.availablePanchayats.length === 0)
                        this.setState({
                          open: true,
                          snackbarMessage: "Panchayats Unavailable!",
                          snackbarColor: "red",
                        });
                    }}
                    onChange={(e) => {
                      this.setState({ panchayatSelect: e.target.value });
                    }}
                    fullWidth
                  >
                    {this.state.availablePanchayats.map((pin) => (
                      <MenuItem key={pin.Pincode} value={pin.Pincode}>
                        {pin.Panchayat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={2}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={async (e) => {
                    e.preventDefault();
                    if (this.state.previousSelect === "") {
                      let panchayats = await fetchPanchayats();
                      this.setState({
                        availablePanchayats: panchayats,
                        districtSelect: "",
                        panchayatSelect: "",
                      });
                      return;
                    }
                    let analytics = await fetchAnalytics();
                    let districts = await fetchDistricts();
                    let panchayats = await fetchPanchayats();
                    this.setState({
                      averageWaterUsagePerMonth:
                        analytics.averageWaterUsagePerMonth,
                      averageWaterUsagePerPersonPerMonth: analytics.averageWaterUsagePerPersonPerMonth.toFixed(
                        2
                      ),
                      totalDistictsCovered: analytics.totalDistictsCovered,
                      totalPanchayatsCovered: analytics.totalPanchayatsCovered,
                      totalFamiliesBenefitted:
                        analytics.totalFamiliesBenefitted,
                      totalPeopleBenefitted: analytics.totalPeopleBenefitted,
                      totalDonations: analytics.totalDonations,
                      totalExpenditure: analytics.totalExpenditure,
                      totalWaterSourcesConstructed:
                        analytics.totalWaterSourcesConstructed,
                      totalSanitationSystemsConstructed:
                        analytics.totalSanitationSystemsConstructed,
                      totalConstuctedBarGraph:
                        analytics.totalConstuctedBarGraph,
                      waterSourcesStatusPieChart:
                        analytics.waterSourcesStatusPieChart,
                      sanitationSystemsStatusPieChart:
                        analytics.sanitationSystemsStatusPieChart,
                      availableDistricts: districts,
                      availablePanchayats: panchayats,
                      snackbarMessage: "Fetched Analytics Successfully!",
                      open: true,
                      selectedType: "",
                      previousSelect: "",
                      snackbarColor: "green",
                      districtSelect: "",
                      panchayatSelect: "",
                    });
                  }}
                >
                  Reset
                </Button>
              </Grid>
              <Grid item xs={6} sm={2}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Query!
                </Button>
              </Grid>
            </Grid>
          </form>
          <Grid container justify="center" spacing={3}>
            {this.renderDistrict()}
            {this.renderPanchayats()}
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
            {this.renderDonations()}
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
            <Grid item>
              <Card className={classes.gridpaper}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    Avg Water Usage Per Month
                  </Typography>
                  <Typography variant="h6" component="h2">
                    {this.state.averageWaterUsagePerMonth}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.gridpaper}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    Avg Water Usage Per Person Per Month
                  </Typography>
                  <Typography variant="h6" component="h2">
                    {this.state.averageWaterUsagePerPersonPerMonth}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Typography
            style={{ margin: 30, marginTop: 50 }}
            component="h1"
            variant="h6"
          >
            Commissioning of Projects
          </Typography>
          {this.renderBarGraph()}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} className={classes.griditem}>
              <Typography style={{ margin: 10 }} component="h1" variant="h6">
                Status of Water Sources
              </Typography>
              {this.renderPieChart(this.state.waterSourcesStatusPieChart)}
            </Grid>
            <Grid item xs={12} sm={6} className={classes.griditem}>
              <Typography style={{ margin: 10 }} component="h1" variant="h6">
                Status of Sanitation Systems
              </Typography>
              {this.renderPieChart(this.state.sanitationSystemsStatusPieChart)}
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Dashboard);
