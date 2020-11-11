import React, { Component } from "react";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from '@material-ui/core/FormControl';
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";

import Header from "../components/Header";

async function fetchDB() {
  let resdata = [];
  await axios.get(`http://localhost:3001/api/waterusages/getallwaterusages`)
      .then(res => {
        resdata = res.data.result;
      })
      .catch(err => {
        console.log(err);
      });
  return resdata;
}

async function fetchWSID() {
  let resdata = [];
  await axios.get(`http://localhost:3001/api/watersources/getallwatersources`)
      .then(res => {
        resdata = res.data.result;
      })
      .catch(err => {
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
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class WaterUsage extends React.Component {
  state = {
    rows: [],
    showWaterUsage: false,
    showWaterUsageText: "Show Water Usages",
    snackbarMessage: '',
    snackbarColor: '',
    wsidSelect: '',
    monthSelect: '',
    yearSelect: '',
    availableWSID: [],
    open: false,
  };

  async componentDidMount() {
    let newrows = await fetchDB();
    let WSIDs = await fetchWSID();
    this.setState({ rows: newrows, availableWSID: WSIDs });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    e.persist();
    let ev = e;
    axios.post(`http://localhost:3001/api/waterusages/addwaterusage`, { WSID: e.target.WSID.value, Month: e.target.Month.value, Year: e.target.Year.value, Usages: e.target.Usages.value })
      .then(async (res) => {
        let newrows = await fetchDB();
        this.setState({ ...this.state, rows: newrows, snackbarMessage: res.data.message, open: true, snackbarColor: "green", wsidSelect: '', monthSelect: '', yearSelect: '' });
        ev.target.reset();
      })
      .catch(err => {
        console.log(err);
        this.setState({ ...this.state, open: true, snackbarMessage: err.response.data.message, snackbarColor: "red" });
      });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ ...this.state, open: false });
  };

  renderTable() {
    const { classes } = this.props;
    if (this.state.showWaterUsage) {
      return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  All Water Usages
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>WSID</TableCell>
                      <TableCell>Month</TableCell>
                      <TableCell>Year</TableCell>
                      <TableCell align="right">Usages</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={`${row.WSID}-${row.Month}-${row.Year}`}>
                        <TableCell>{row.WSID}</TableCell>
                        <TableCell>{row.Month}</TableCell>
                        <TableCell>{row.Year}</TableCell>
                        <TableCell>{row.Usages}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      );
    }
    return <br />;
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
            message={<span id="client-snackbar">{this.state.snackbarMessage}</span>}
          />
        </Snackbar>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Water Usages
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <FormControl variant="outlined" fullWidth className={classes.form}>
                <InputLabel id="WSID-Label">
                  WSID
                </InputLabel>
                <Select
                  labelId="WSID-Label"
                  id="WSID"
                  label="WSID"
                  name="WSID"
                  variant="outlined"
                  value={this.state.wsidSelect}
                  onOpen={(e) => {if(this.state.availableWSID.length === 0) this.setState({ open: true, snackbarMessage: "WaterSources Unavailable!", snackbarColor: "red" })}}
                  onChange={(e) => {this.setState({ wsidSelect: e.target.value })}}
                  required
                  fullWidth
                >
                  {this.state.availableWSID.map((ws) => (
                      <MenuItem key={ws.WSID} value={ws.WSID}>{ `${ws.WSID} - ${ws.WCapacity} L - ${ws.Pincode}` }</MenuItem>
                  ))}
                </Select>
              </FormControl>  
              <FormControl variant="outlined" fullWidth className={classes.form}>
                <InputLabel id="Month-Label">
                  Month
                </InputLabel>
                <Select
                  labelId="Month-Label"
                  id="Month"
                  label="Month"
                  name="Month"
                  variant="outlined"
                  value={this.state.monthSelect}
                  onChange={(e) => {this.setState({ monthSelect: e.target.value })}}
                  required
                  fullWidth
                >
                  <MenuItem value={"January"}>January</MenuItem>
                  <MenuItem value={"February"}>February</MenuItem>
                  <MenuItem value={"March"}>March</MenuItem>
                  <MenuItem value={"April"}>April</MenuItem>
                  <MenuItem value={"May"}>May</MenuItem>
                  <MenuItem value={"June"}>June</MenuItem>
                  <MenuItem value={"July"}>July</MenuItem>
                  <MenuItem value={"August"}>August</MenuItem>
                  <MenuItem value={"September"}>September</MenuItem>
                  <MenuItem value={"October"}>October</MenuItem>
                  <MenuItem value={"November"}>November</MenuItem>
                  <MenuItem value={"December"}>December</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" fullWidth className={classes.form}>
                <InputLabel id="Year-Label">
                  Year
                </InputLabel>
                <Select
                  labelId="Year-Label"
                  id="Year"
                  label="Year"
                  name="Year"
                  variant="outlined"
                  value={this.state.yearSelect}
                  onChange={(e) => {this.setState({ yearSelect: e.target.value })}}
                  required
                  fullWidth
                >
                  <MenuItem value={2019}>2019</MenuItem>
                  <MenuItem value={2020}>2020</MenuItem>
                  <MenuItem value={2021}>2021</MenuItem>
                  <MenuItem value={2022}>2022</MenuItem>
                  <MenuItem value={2023}>2023</MenuItem>
                  <MenuItem value={2024}>2024</MenuItem>
                  <MenuItem value={2025}>2025</MenuItem>
                  <MenuItem value={2026}>2026</MenuItem>
                  <MenuItem value={2027}>2027</MenuItem>
                  <MenuItem value={2028}>2028</MenuItem>
                  <MenuItem value={2029}>2029</MenuItem>
                  <MenuItem value={2030}>2030</MenuItem>
                </Select>
              </FormControl>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Usages"
                label="Usages"
                type="number"
                id="Usages"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Add WaterUsage
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
                onClick={(e) => {
                  console.log("came in");
                  e.preventDefault();
                  if (!this.state.showWaterUsage)
                    this.setState({
                      ...this.state,
                      showWaterUsage: true,
                      showWaterUsageText: "Hide Water Usages",
                    });
                  else
                    this.setState({
                      ...this.state,
                      showWaterUsage: false,
                      showWaterUsageText: "Show Water Usages",
                    });
                  console.log(this.state);
                }}
              >
                {this.state.showWaterUsageText}
              </Button>
            </form>
          </div>
        </Container>
        {this.renderTable()}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(WaterUsage);
