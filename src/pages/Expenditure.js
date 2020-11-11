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

async function fetchDB() {
  let resdata = [];
  await axios.get(`http://localhost:3001/api/expenditures/getallexpenditures`)
      .then(res => {
        resdata = res.data.result;
      })
      .catch(err => {
        console.log(err);
      });
  return resdata;
}

async function fetchEmpID() {
  let resdata = [];
  await axios.get(`http://localhost:3001/api/employees/getallemployees`)
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

async function fetchSSID() {
  let resdata = [];
  await axios.get(`http://localhost:3001/api/sanitationsystems/getallsanitationsystems`)
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

class Expenditure extends React.Component {
  state = {
    rows: [],
    showExpenditure: false,
    empidSelect:'',
    ssidSelect:'',
    wsidSelect:'',
    showExpenditureText: "Show Expenditure",
    snackbarColor: '',
    snackbarMessage: '',
    availableEmpID: [],
    availableWSID: [],
    availableSSID: []
  };

  async componentDidMount() {
    let newrows = await fetchDB();
    let EmpIDs = await fetchEmpID();
    let WSIDs = await fetchWSID();
    let SSIDs = await fetchSSID();
    this.setState({ rows: newrows, availableEmpID: EmpIDs, availableWSID: WSIDs, availableSSID: SSIDs });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    e.persist();
    let ev = e;
    axios.post(`http://localhost:3001/api/expenditures/addexpenditure`, { EDate: e.target.EDate.value, EmpID: e.target.EmpID.value, WSID: e.target.WSID.value, SSID: e.target.SSID.value, EAmount: e.target.EAmount.value })
      .then(async (res) => {
        let newrows = await fetchDB();
        this.setState({ ...this.state, rows: newrows, snackbarMessage: res.data.message, open: true, snackbarColor: "green", empidSelect: '', wsidSelect: '' ,ssidSelect: '' });
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
    if (this.state.showExpenditure) {
      return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  All Expenditures
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Expense ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Employee ID</TableCell>
                      <TableCell>WSID</TableCell>
                      <TableCell>SSID</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={row.ExpenseID}>
                        <TableCell>{row.ExpenseID}</TableCell>
                        <TableCell>{row.EDate}</TableCell>
                        <TableCell>{row.EmpID}</TableCell>
                        <TableCell>{row.WSID}</TableCell>
                        <TableCell>{row.SSID}</TableCell>
                        <TableCell>{row.EAmount}</TableCell>
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
              Expenditure
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="ExpenseID"
                label="Expense ID"
                name="ExpenseID"
                type="text"
                autoFocus
              />
              <FormControl variant="outlined" fullWidth className={classes.form}>
                <InputLabel id="EmpID-Label">
                  Employee ID
                </InputLabel>
                <Select
                  labelId="EmpID-Label"
                  id="EmpID"
                  label="Employee ID"
                  name="EmpID"
                  variant="outlined"
                  value={this.state.empidSelect}
                  onChange={(e) => {this.setState({ empidSelect: e.target.value })}}
                  required
                  fullWidth
                >
                  {this.state.availableEmpID.map((emp) => (
                      <MenuItem key={emp.EmpID} value={emp.EmpID}>{ `${emp.EmpID} - ${emp.FName} ${emp.LName}` }</MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                  onChange={(e) => {this.setState({ wsidSelect: e.target.value })}}
        
                  fullWidth
                >
                  {this.state.availableWSID.map((ws) => (
                      <MenuItem key={ws.WSID} value={ws.WSID}>{ `${ws.WSID} - ${ws.WCapacity} L - ${ws.Pincode}` }</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined" fullWidth className={classes.form}>
                <InputLabel id="SSID-Label">
                    SSID
                </InputLabel>
                <Select
                  labelId="SSID-Label"
                  id="SSID"
                  label="SSID"
                  name="SSID"
                  variant="outlined"
                  value={this.state.ssidSelect}
                  onChange={(e) => {this.setState({ ssidSelect: e.target.value })}}
                  
                  fullWidth
                >
                  {this.state.availableSSID.map((ss) => (
                      <MenuItem key={ss.SSID} value={ss.SSID}>{ `${ss.SSID} - ${ss.Pincode}` }</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="EAmount"
                label="Amount"
                type="number"
                id="EAmount"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Add Expenditure
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
                onClick={(e) => {
                  console.log("came in");
                  e.preventDefault();
                  if (!this.state.showExpenditure)
                    this.setState({
                      ...this.state,
                      showExpenditure: true,
                      showExpenditureText: "Hide Expenditure",
                    });
                  else
                    this.setState({
                      ...this.state,
                      showExpenditure: false,
                      showExpenditureText: "Show Expenditure",
                    });
                  console.log(this.state);
                }}
              >
                {this.state.showExpenditureText}
              </Button>
            </form>
          </div>
        </Container>
        {this.renderTable()}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Expenditure);
