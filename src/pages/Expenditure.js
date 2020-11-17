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

async function fetchDB(token) {
  let resdata = [];
  let message = '';
  let errorStatus = false;
  await axios.get(`http://localhost:3001/api/expenditures/getallexpenditures`, { headers: { Authorization: "Bearer " + token } })
      .then(res => {
        resdata = res.data.result;
        message = res.data.message;
      })
      .catch(err => {
        console.log(err);
        message = err.response.data.message;
        errorStatus = true;
      });
  return { resdata, message, errorStatus };
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
    snackbarColor: '',
    Token: null,
    snackbarMessage: ''
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
    if(newrows.errorStatus) {
      this.setState({
        ...this.state,
        open: true,
        snackbarMessage: newrows.message,
        snackbarColor: "red",
      });
    }
    else {
      if(newrows.length === 0) {
        this.setState({ open: true, snackbarMessage: "No Expenditures Done Yet!", snackbarColor: "red" });
      }
      else {
        this.setState({ rows: newrows.resdata, open: true, snackbarMessage: newrows.message, snackbarColor: "green" });
      }
    }
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
          message={<span id="client-snackbar">{this.state.snackbarMessage}</span>}
          />
        </Snackbar>
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
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Expenditure);
