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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from "@material-ui/core/Snackbar";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import { withStyles } from "@material-ui/core/styles";

import Header from "../components/Header";

async function fetchDB(token) {
  let resdata = [];
  let message = '';
  let errorStatus = false;
  await axios.get(`http://localhost:3001/api/sanitationsystems/getallapprovedsanitationsystems`, { headers: { Authorization: "Bearer " + token } })
      .then(res => {
        resdata = res.data.result;
        message = res.data.message;
      })
      .catch(err => {
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

class sanitationsystems extends React.Component {
  state = {
    rows: [],
    approveSelect: {
      SSID: null,
      SCapacity: null,
      Pincode: null,
      newSStatus: null
    },
    snackbarColor: '',
    snackbarMessage: '',
    openDialog: false,
    budget: 0,
    Token: null,
    open: false,
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
    if (Designation !== "Project Manager") {
      this.setState({
        ...this.state,
        snackbarMessage: "Login as Project Manager First!!!",
        open: true,
        snackbarColor: "red",
      });
      let self = this;
      setTimeout(function () {
        self.props.history.push("/Dashboard");
      }, 500);
    }
    this.createdFunction();
  }

  async createdFunction(snackbarDeny) {
    let newrows = await fetchDB(this.state.Token);
    console.log(newrows);
    if(snackbarDeny) {
      this.setState({ rows: newrows.resdata })
      return;
    }
    if(newrows.errorStatus) {
      this.setState({
        ...this.state,
        open: true,
        snackbarMessage: newrows.message,
        snackbarColor: "red",
      });
    }
    else {
      this.setState({
        ...this.state,
        open: true,
        rows: newrows.resdata,
        snackbarMessage: newrows.message,
        snackbarColor: "green",
      });
    }
    if(this.state.rows.length === 0) {
      let self = this;
      setTimeout(function(){ self.setState({ open: false });self.setState({ open: true, snackbarMessage: "No Projects Available to Manage!", snackbarColor: "red"  }); }, 3000);
    }
  }

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
    this.setState({ ...this.state, openDialog: false, approveSelect: {
      SSID: null,
      SCapacity: null,
      Pincode: null,
      newSStatus: null
    }  });
  };

  handleAgree = () => {
    axios
      .post(`http://localhost:3001/api/sanitationsystems/updatesanitationsystemstatus`, {
        SSID: this.state.approveSelect.SSID,
        SStatus: this.state.approveSelect.newSStatus,
        oldSStatus: this.state.approveSelect.SStatus
      }, {
        headers: { Authorization: "Bearer " + this.state.Token }
      })
      .then(async (res) => {
        this.createdFunction(true);
        this.setState({
          ...this.state,
          snackbarMessage: res.data.message,
          open: true,
          snackbarColor: "green",
        });
      })
      .catch((err) => {
        this.setState({
          ...this.state,
          open: true,
          snackbarMessage: err.response.data.message,
          snackbarColor: "red",
        });
      });
    this.setState({ ...this.state, openDialog: false, approveSelect: {
      SSID: null,
      SCapacity: null,
      Pincode: null,
      newSStatus: null
    } });
  }

  approve(row) {
    if(row.newSStatus === undefined || row.newSStatus === null) {
      this.setState({ open: true, snackbarMessage: "Please Select a status to change first!", snackbarColor: "red" });  
      return;
    }
    this.setState({ approveSelect: row, openDialog: true });
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
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  Manage Sanitation Systems
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>SSID</TableCell>                      
                      <TableCell>Status</TableCell>
                      <TableCell>Estimation</TableCell>                     
                      <TableCell>Pincode</TableCell>
                      <TableCell>Status Update</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={row.SSID}>
                        <TableCell>{row.SSID}</TableCell>
                        <TableCell>{row.SStatus}</TableCell>
                        <TableCell>{row.SEstimation}</TableCell>
                        <TableCell>{row.Pincode}</TableCell>
                        <TableCell component="th" scope="row">
                        <Select
                          id="newSStatus"
                          label="newSStatus"
                          name="newSStatus"
                          value={row.newSStatus ? row.newSStatus : " "}
                          onChange={(e) => { row.newSStatus = e.target.value; this.setState({ rows: this.state.rows }) }}
                          required
                          fullWidth
                        >
                          <MenuItem value={'Under-maintenance'}>Under-maintenance</MenuItem>
                          <MenuItem value={'Under-construction'}>Under-construction</MenuItem>
                          <MenuItem value={'Working'}>Working</MenuItem>                          
                        </Select>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <IconButton
                            color="primary"
                            aria-label="mark approved"
                            component="span"
                            disabled={(row.newSStatus === undefined || row.newSStatus === null)?true:false}
                            onClick={(event) => this.approve(row)}
                          >
                            <CheckIcon />
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
        <Dialog
          open={this.state.openDialog}
          keepMounted
          onClose={this.handleDisagree}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {`Are you sure you want Change the Status of this Project ID: ${this.state.approveSelect.SSID} - Capacity: ${this.state.approveSelect.SCapacity} - Pincode: ${this.state.approveSelect.Pincode} to ${this.state.approveSelect.newSStatus} ?`}
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.handleDisagree} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.handleAgree} color="primary">
              Approve
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(sanitationsystems);