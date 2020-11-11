import React, { Component } from "react";
import axios from 'axios';
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

async function fetchJobs() {
  let resdata = [];
  await axios.get(`http://localhost:3001/api/utility/getemergencyjobs`)
      .then(res => {
        resdata = res.data.result;
        console.log(resdata);
      })
      .catch(err => {
        console.log(err);
      });
  return resdata;
}

async function fetchLocations() {
    let resdata = [];
    await axios.get(`http://localhost:3001/api/location/getalllocations`)
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

class Employee extends React.Component {
  state = {
    rows: [],
    showEmployee: false,
    jobSelect: '',
    locationSelect: '',
    shiftSelect: '',
    snackbarColor: '',
    snackbarMessage: '',
    availableJobs: [],
    availableLocation: []
  };

  async componentDidMount() {
    let jobs = await fetchJobs();
    let locations = await fetchLocations();
    this.setState({ availableJobs: jobs, availableLocation: locations });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    e.persist();
    axios.post(`http://localhost:3001/api/utility/emergencydetails`, { Designation: e.target.Designation.value, Shift: e.target.Shift.value, Pincode: e.target.Pincode.value })
      .then(async (res) => {
        let newrows = res.data.result;
        if(newrows.length == 0) {
          this.setState({ ...this.state, open: true, snackbarMessage: "No Employees Found", snackbarColor: "red" });
          return;
        }
        this.setState({ ...this.state, rows: newrows, snackbarMessage: res.data.message, open: true, snackbarColor: "green", showEmployee: true });
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
    if (this.state.showEmployee) {
      return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  Found Employees
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Designation</TableCell>
                      <TableCell>Shift</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={row.EmpID}>
                        <TableCell>{`${row.FName} ${row.LName}`}</TableCell>
                        <TableCell>{row.EContact}</TableCell>
                        <TableCell>{row.Designation}</TableCell>
                        <TableCell>{row.Shift}</TableCell>
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
              Service Needed
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <FormControl variant="outlined" fullWidth className={classes.form}>
                <InputLabel id="Job-Label">
                  Job Code
                </InputLabel>
                <Select
                  labelId="Job-Label"
                  id="Designation"
                  label="Designation"
                  name="Designation"
                  variant="outlined"
                  value={this.state.jobSelect}
                  onOpen={(e) => {if(this.state.availableJobs.length === 0) this.setState({ open: true, snackbarMessage: "Jobs Unavailable!", snackbarColor: "red" })}}
                  onChange={(e) => {this.setState({ jobSelect: e.target.value })}}
                  required
                  fullWidth
                >
                  {this.state.availableJobs.map((job) => (
                      <MenuItem key={job.JobCode} value={job.Designation}>{ job.Designation }</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined" fullWidth className={classes.form}>
                <InputLabel id="Shift-Label">
                  Shift
                </InputLabel>
                <Select
                  labelId="Shift-Label"
                  id="Shift"
                  label="Shift"
                  name="Shift"
                  variant="outlined"
                  value={this.state.shiftSelect}
                  onChange={(e) => {this.setState({ shiftSelect: e.target.value })}}
                  required
                  fullWidth
                >
                  <MenuItem value={"Morning"}>Morning Shift</MenuItem>
                  <MenuItem value={"Evening"}>Evening Shift</MenuItem>
                  <MenuItem value={"Night"}>Night Shift</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" fullWidth className={classes.form}>
                <InputLabel id="Pincode-Label">
                    Pincode
                </InputLabel>
                <Select
                  labelId="Pincode-Label"
                  id="Pincode"
                  label="Pincode"
                  name="Pincode"
                  variant="outlined"
                  value={this.state.locationSelect}
                  onOpen={(e) => {if(this.state.availableLocation.length === 0) this.setState({ open: true, snackbarMessage: "Location Unavailable!", snackbarColor: "red" })}}
                  onChange={(e) => {this.setState({ locationSelect: e.target.value })}}
                  required
                  fullWidth
                >
                  {this.state.availableLocation.map((pin) => (
                      <MenuItem key={pin.Pincode} value={pin.Pincode}>{ `${pin.Pincode} - ${pin.Panchayat} - ${pin.District}` }</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Search
              </Button>
            </form>
          </div>
        </Container>
        {this.renderTable()}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Employee);
