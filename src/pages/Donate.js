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
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { withStyles } from "@material-ui/core/styles";

import Header from "../components/Header";

async function fetchDB(token) {
  let resdata = [];
  await axios.get(`http://localhost:3001/api/donations/getalldonations`, { headers: { Authorization: "Bearer " + token } })
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

class Donate extends React.Component {
  state = {
    rows: [],
    showDonors: false,
    showDonorsText: "Show Donors",
    phoneErrorText: "",
    selectedDate: null,
    phone: false,
    open: false,
    token: null,
    val: {
      TransactionID: "",
      Amount: "",
      AccountNumber:"",
      DContact:""
    },
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
    await this.setState({ token: Token });
    let Designation = sessionStorage.getItem("Designation");
    if (Designation !== "Accountant") {
      this.setState({
        ...this.state,
        snackbarMessage: "Login as Accountant First!!!",
        open: true,
        snackbarColor: "red",
      });
      let self = this;
      setTimeout(function () {
        self.props.history.push("/Dashboard");
      }, 500);
    }
    let newrows = await fetchDB(Token);
    var d = new Date().toISOString();
    this.setState({ rows: newrows, selectedDate: d });
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
    var d = new Date(this.state.selectedDate);
    var date =
      +("0" + d.getDate()).slice(-2) +
      "-" +
      ("0" + (d.getMonth() + 1)).slice(-2) +
      "-" +
      d.getFullYear();
    axios.post(`http://localhost:3001/api/donations/adddonation`, { TransactionID: e.target.TransactionID.value, AccountNumber: e.target.AccountNumber.value, Amount: Number(e.target.Amount.value).toFixed(2), DContact: e.target.DContact.value, DDate: date }, {
      headers: { Authorization: "Bearer " + this.state.Token }
    })
      .then(async (res) => {
        let newrows = await fetchDB();
        this.setState({ ...this.state, rows: newrows, snackbarMessage: res.data.message, open: true, snackbarColor: "green" });
        ev.target.reset();
      })
      .catch(err => {
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
    if (this.state.showDonors) {
      return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  All Donations
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Date</TableCell>                      
                      <TableCell>Account Number</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={row.TransactionID}>
                        <TableCell>{row.TransactionID}</TableCell>
                        <TableCell>{row.DDate}</TableCell>
                        <TableCell>{row.AccountNumber}</TableCell>
                        <TableCell>{row.DContact}</TableCell>                        
                        <TableCell align="right">{row.Amount}</TableCell>
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
              Donate
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="TransactionID"
                label="Transaction ID"
                name="TransactionID"
                type="text"
                autoFocus
                error={(this.state.val.TransactionID.length === 0)? false : true}
                helperText={this.state.val.TransactionID}
                onChange={(e) => {
                  let val = this.state.val;
                  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                  if (format.test(e.target.value)) val.TransactionID = "TransactionID cannot contain special symbols";            
                  else val.TransactionID = "";
                  this.setState({ val });
                }}
                error={(this.state.val.TransactionID.length === 0)? false : true}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="AccountNumber"
                label="Account Number"
                type="text"
                id="AccountNumber"
                error={(this.state.val.AccountNumber.length === 0)? false : true}
                helperText={this.state.val.AccountNumber}
                onChange={(e) => {
                  let val = this.state.val;
                  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                  if (format.test(e.target.value) || (e.target.value.length > 25)) val.AccountNumber = "Account Number must be a number of length less than 25";            
                  else val.AccountNumber = "";
                  this.setState({ val });
                }}
                error={(this.state.val.AccountNumber.length === 0)? false : true}
              />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  autoOk
                  variant="inline"
                  inputVariant="outlined"
                  label="Donation Date"
                  format="dd/MM/yyyy"
                  value={this.state.selectedDate}
                  required
                  fullWidth
                  InputAdornmentProps={{ position: "start" }}
                  style={{ marginTop: 16, marginBottom: 8 }}
                  onChange={date => {this.setState({selectedDate: date.toISOString()})}}
                  maxDate={new Date()}
                />
              </MuiPickersUtilsProvider>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Amount"
                label="Amount"
                type="number"
                id="Amount"
                error={(this.state.val.Amount.length === 0)? false : true}
                helperText={this.state.val.Amount}
                onChange={(e) => {
                  var format = /[0-9.]+/;
                  var val = this.state.val
                  if (!format.test(e.target.value)) val.Amount="Amount can only be numbers";  
                  else val.Amount = "";
                  this.setState({ val });
                }}
                error={(this.state.val.Amount.length === 0)? false : true}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="DContact"
                label="Contact"
                type="number"
                id="DContact"
                error={(this.state.val.DContact.length === 0)? false : true}
                helperText={this.state.val.DContact}
                onChange={(e) => {
                  var format = /[0-9]+/;
                  var cformat = /[0-5]+/;
                  var val = this.state.val
                  if (!format.test(e.target.value) || e.target.value.length !== 10 ) val.DContact="Contact Number must have 10 numbers";  
                  else if (e.target.value.toString()[0].match(cformat)) val.DContact="Please enter a valid contact number";  
                  else val.DContact = "";
                  this.setState({ val });
                }}
                error={(this.state.val.DContact.length === 0)? false : true}
              />              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Donate Now!
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
                onClick={(e) => {
                  console.log("came in");
                  e.preventDefault();
                  if (!this.state.showDonors)
                    this.setState({
                      ...this.state,
                      showDonors: true,
                      showDonorsText: "Hide Donors",
                    });
                  else
                    this.setState({
                      ...this.state,
                      showDonors: false,
                      showDonorsText: "Show Donors",
                    });
                  console.log(this.state);
                }}
              >
                {this.state.showDonorsText}
              </Button>
            </form>
          </div>
        </Container>
        {this.renderTable()}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Donate);
