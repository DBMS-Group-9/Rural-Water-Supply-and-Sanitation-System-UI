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
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from "@material-ui/icons/Close";

import { withStyles } from "@material-ui/core/styles";

import Header from "../components/Header";
import Resign from "../static/resign.svg";

async function fetchDB(token) {
  let resdata = [];
  await axios
    .get(`http://localhost:3001/api/employees/getallemployees`, { headers: { Authorization: "Bearer " + token } })
    .then((res) => {
      resdata = res.data.result;
    })
    .catch((err) => {
      console.log(err);
    });
  return resdata;
}

async function fetchJobs(token) {
  let resdata = [];
  await axios
    .get(`http://localhost:3001/api/jobs/getalljobs`, { headers: { Authorization: "Bearer " + token } })
    .then((res) => {
      resdata = res.data.result;
    })
    .catch((err) => {
      console.log(err);
    });
  return resdata;
}

async function fetchLocations() {
  let resdata = [];
  await axios
    .get(`http://localhost:3001/api/location/getalllocations`)
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
    showEmployeeText: "Show Employee",
    jobSelect: "",
    locationSelect: "",
    deleteSelect: null,
    snackbarColor: "",
    Token: null,
    snackbarMessage: "",
    openDialog: false,
    availableJobs: [],
    availableLocation: [],
    val : {
      FName:"",
        LName: "",
        EContact: "",
        Username: "",
        Password: "",
    }
  };

  async componentDidMount() {
    let Token = sessionStorage.getItem("Token");
    if (!Token || Token.length === 0) {
      this.setState({
        ...this.state,
        snackbarMessage: "Please Login First!!!",
        open: true,
        snackbarColor: "red",
      });
      let self = this;
      setTimeout(function () {
        self.props.history.push("/");
      }, 500);
    }
    await this.setState({ Token });
    let Designation = sessionStorage.getItem("Designation");
    if (Designation !== "Admin") {
      this.setState({
        ...this.state,
        snackbarMessage: "Login as Admin First!!!",
        open: true,
        snackbarColor: "red",
      });
      let self = this;
      setTimeout(function () {
        self.props.history.push("/Dashboard");
      }, 500);
    }
    let newrows = await fetchDB(Token);
    let jobs = await fetchJobs(this.state.Token);
    let locations = await fetchLocations();
    this.setState({
      rows: newrows,
      availableJobs: jobs,
      availableLocation: locations,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    e.persist();
    for(let txt of Object.values(this.state.val)) {
      if(txt.length > 0) {
        this.setState({ open: true, snackbarMessage: "Invalid Values!", snackbarColor: "red" });
        return;
      }
    }
    let ev = e;
    axios
      .post(`http://localhost:3001/api/employees/addemployee`, {
        FName: e.target.FName.value,
        LName: e.target.LName.value,
        EContact: e.target.EContact.value,
        JobCode: e.target.JobCode.value,
        Pincode: e.target.Pincode.value,
        Username: e.target.Username.value,
        Password: e.target.Password.value,
      }, { headers: { Authorization: "Bearer " + this.state.Token } })
      .then(async (res) => {
        let newrows = await fetchDB(this.state.Token);
        this.setState({
          ...this.state,
          rows: newrows,
          snackbarMessage: res.data.message,
          open: true,
          snackbarColor: "green",
          jobSelect: "",
          locationSelect: "",
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
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ ...this.state, open: false });
  };

  handleDisagree = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ ...this.state, openDialog: false, deleteSelect: null  });
  };

  handleAgree = () => {
    console.log("resign",this.state.deleteSelect);
    axios
      .post(`http://localhost:3001/api/employees/markresigned`, {
        EmpID: this.state.deleteSelect.EmpID
      }, { headers: { Authorization: "Bearer " + this.state.Token } })
      .then(async (res) => {
        let newrows = await fetchDB(this.state.Token);
        this.setState({
          ...this.state,
          rows: newrows,
          snackbarMessage: res.data.message,
          open: true,
          snackbarColor: "green",
        });
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
    this.setState({ ...this.state, openDialog: false, deleteSelect: null });
  }

  deleteComponent(row) {
    this.setState({ deleteSelect: row, openDialog: true });
  }

  renderTable() {
    const { classes } = this.props;
    if (this.state.showEmployee) {
      return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  All Employees
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Job Code</TableCell>
                      <TableCell>Pincode</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={row.EmpID}>
                        <TableCell>{row.EmpID}</TableCell>
                        <TableCell>{`${row.FName} ${row.LName}`}</TableCell>
                        <TableCell>{row.EContact}</TableCell>
                        <TableCell>{row.Username}</TableCell>
                        <TableCell>{row.JobCode}</TableCell>
                        <TableCell>{row.Pincode}</TableCell>
                        <TableCell component="th" scope="row">
                          <IconButton
                            color="secondary"
                            aria-label="mark resigned"
                            component="span"
                            onClick={(event) => this.deleteComponent(row)}
                          >
                            <img height="24" width="24" src={Resign}></img>
                          </IconButton>
                        </TableCell>
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
            message={
              <span id="client-snackbar">{this.state.snackbarMessage}</span>
            }
          />
        </Snackbar>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Employee
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="FName"
                label="First Name"
                type="text"
                id="FName"
                autoFocus
                error={(this.state.val.FName.length === 0)? false : true}
                helperText={this.state.val.FName}
                onChange={(e) => {
                  let val = this.state.val;
                  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]+/;
                  if (format.test(e.target.value)) val.FName = "Name cannot contain special symbols";            
                  else val.FName = "";
                  this.setState({ val });
                }}
                error={(this.state.val.FName.length === 0)? false : true}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="LName"
                label="Last Name"
                type="text"
                id="LName"
                error={(this.state.val.LName.length === 0)? false : true}
                helperText={this.state.val.LName}
                onChange={(e) => {
                  let val = this.state.val;
                  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]+/;
                  if (format.test(e.target.value)) val.LName = "Name cannot contain special symbols";            
                  else val.LName = "";
                  this.setState({ val });
                }}
                error={(this.state.val.LName.length === 0)? false : true}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="EContact"
                label="Conatct"
                type="number"
                id="EContact"
                error={(this.state.val.EContact.length === 0)? false : true}
                helperText={this.state.val.EContact}
                onChange={(e) => {
                  var format = /[0-9]+/;
                  var cformat = /[0-5]+/;
                  var val = this.state.val
                  if (!format.test(e.target.value) || e.target.value.length !== 10) val.EContact="Contact Number must have 10 numbers";  
                  else if (e.target.value.toString()[0].match(cformat)) val.EContact="Please enter a valid contact number";
                  else val.EContact = "";
                  this.setState({ val });
                }}
                error={(this.state.val.EContact.length === 0)? false : true}
              />
              <FormControl
                variant="outlined"
                fullWidth
                className={classes.form}
              >
                <InputLabel id="Job-Label">Job Code</InputLabel>
                <Select
                  labelId="Job-Label"
                  id="JobCode"
                  label="Job Code"
                  name="JobCode"
                  variant="outlined"
                  value={this.state.jobSelect}
                  onOpen={(e) => {
                    if (this.state.availableJobs.length === 0)
                      this.setState({
                        open: true,
                        snackbarMessage: "Jobs Unavailable!",
                        snackbarColor: "red",
                      });
                  }}
                  onChange={(e) => {
                    this.setState({ jobSelect: e.target.value });
                  }}
                  required
                  fullWidth
                >
                  {this.state.availableJobs.map((job) => (
                    <MenuItem
                      key={job.JobCode}
                      value={job.JobCode}
                    >{`${job.JobCode} - ${job.Designation} - ${job.Shift}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                variant="outlined"
                fullWidth
                className={classes.form}
              >
                <InputLabel id="Pincode-Label">Pincode</InputLabel>
                <Select
                  labelId="Pincode-Label"
                  id="Pincode"
                  label="Pincode"
                  name="Pincode"
                  variant="outlined"
                  value={this.state.locationSelect}
                  onOpen={(e) => {
                    if (this.state.availableLocation.length === 0)
                      this.setState({
                        open: true,
                        snackbarMessage: "Location Unavailable!",
                        snackbarColor: "red",
                      });
                  }}
                  onChange={(e) => {
                    this.setState({ locationSelect: e.target.value });
                  }}
                  required
                  fullWidth
                >
                  {this.state.availableLocation.map((pin) => (
                    <MenuItem
                      key={pin.Pincode}
                      value={pin.Pincode}
                    >{`${pin.Pincode} - ${pin.Panchayat} - ${pin.District}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Usename"
                label="Usename"
                type="text"
                id="Username"
                error={(this.state.val.Username.length === 0)? false : true}
                helperText={this.state.val.Username}
                onChange={(e) => {
                  let val = this.state.val;
                  var format = /[!#$%^&*()+\-=\[\]{};':"\\|,<>\/?]+/;
                  if (format.test(e.target.value)) val.Username = "Username format invalid";            
                  else val.Username = "";
                  this.setState({ val });
                }}
                error={(this.state.val.Username.length === 0)? false : true}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Password"
                label="Password"
                type="text"
                id="Password"
                error={(this.state.val.Password.length === 0)? false : true}
                helperText={this.state.val.Password}
                onChange={(e) => {
                  let val = this.state.val;
                  var format = /[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/;
                  if (format.test(e.target.value)) val.Password = "Inalid Password Format";            
                  else val.Password = "";
                  this.setState({ val });
                }}
                error={(this.state.val.Password.length === 0)? false : true}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Add Employee
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
                onClick={(e) => {
                  console.log("came in");
                  e.preventDefault();
                  if (!this.state.showEmployee)
                    this.setState({
                      ...this.state,
                      showEmployee: true,
                      showEmployeeText: "Hide Employee",
                    });
                  else
                    this.setState({
                      ...this.state,
                      showEmployee: false,
                      showEmployeeText: "Show Employee",
                    });
                  console.log(this.state);
                }}
              >
                {this.state.showEmployeeText}
              </Button>
            </form>
          </div>
        </Container>
        {this.renderTable()}
        <Dialog
          open={this.state.openDialog}
          keepMounted
          onClose={this.handleDisagree}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Are you sure you want to Mark Resignation for this Employee?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.handleDisagree} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleAgree} color="secondary">
              Mark Resign
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Employee);
