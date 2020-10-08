import React, { Component } from "react";
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

// Generate Order Data
function createData(id, ExpenseID, EDate, EmpID, WSID, SSID, EAmount) {
  return { id, ExpenseID, EDate, EmpID, WSID, SSID, EAmount };
}

function initializeDB() {
  let newrows = sessionStorage.getItem('Expenditure');
  if(newrows) {
    newrows = JSON.parse(newrows);
  }
  else {
    newrows = [
      createData(0, "E00001", "2020-01-01", "E004", "W003", "NULL", 4500000),
      createData(1, "E00002", "2020-03-06", "E004", "W007", "NULL", 7500000),
      createData(2, "E00003", "2020-04-09", "E004", "NULL", "S006", 1700000),
      createData(3, "E00004", "2020-02-14", "E004", "NULL", "S001", 2100000),
      createData(4, "E00005", "2020-01-25", "E004", "W005", "NULL", 5400000),
      createData(5, "E00006", "2020-05-09", "E004", "NULL", "S005", 2000000),
      createData(6, "E00007", "2020-04-16", "E004", "NULL", "S002", 2000000),
      createData(7, "E00008", "2020-07-04", "E004", "W002", "NULL", 7000000),
      createData(8, "E00009", "2020-08-15", "E004", "W008", "NULL", 5261510),
      createData(9, "E00010", "2020-05-15", "E004", "NULL", "S009", 2300000)
    ]
    sessionStorage.setItem('Expenditure', JSON.stringify(newrows));
  }
  return newrows;
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
    rows: initializeDB(),
    showExpenditure: false,
    showExpenditureText: "Show Expenditure",
    empidSelect: '',
    wsidSelect: '',
    ssidSelect: '',
    availableEmpID: JSON.parse(sessionStorage.getItem('Employee')),
    availableWSID: JSON.parse(sessionStorage.getItem('WaterSources')),
    availableSSID: JSON.parse(sessionStorage.getItem('SanitationSystems')),
    open: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    var newrows = this.state.rows;
    var d = new Date();
    var date =
      +("0" + d.getDate()).slice(-2) +
      "-" +
      ("0" + (d.getMonth() + 1)).slice(-2) +
      "-" +
      d.getFullYear();
    newrows.push(
      createData(
        this.state.rows.length,
        e.target.ExpenseID.value,
        date,
        e.target.EmpID.value,
        e.target.WSID.value,
        e.target.SSID.value,
        e.target.EAmount.value
      )
    );
    this.setState({ ...this.state, rows: newrows, open: true, empidSelect: '', wsidSelect: '', ssidSelect: '' });
    sessionStorage.setItem('Expenditure', JSON.stringify(newrows));
    e.target.reset();
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
                  All Expenditure
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
                      <TableRow key={row.id}>
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
        <Snackbar
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <SnackbarContent
            style={{
              backgroundColor: "green",
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
            message={<span id="client-snackbar">Expenditure Created Successfully!</span>}
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
