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
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import { withStyles } from "@material-ui/core/styles";

import Header from "../components/Header";

async function fetchDB() {
  let resdata = [];
  let message = '';
  let errorStatus = false;
  let balance = 0;
  await axios.get(`http://localhost:3001/api/watersources/getallplannedwatersources`)
      .then(res => {
        resdata = res.data.result;
        message = res.data.message;
      })
      .catch(err => {
        message = err.response.data.message;
        errorStatus = true;
      });
  await axios.get(`http://localhost:3001/api/utility/getbalance`)
      .then(res => {
        balance = res.data.balance;
      })
      .catch(err => {
        message += err.response.data.message;
      });
  return { resdata, message, errorStatus, balance };
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

class WaterSources extends React.Component {
  state = {
    rows: [],
    approveSelect: {
      WEstimation: 0
    },
    snackbarColor: '',
    snackbarMessage: '',
    openDialog: false,
    budget: 0,
    Token: null,
    open: false,
  };

  async componentDidMount() {
    this.createdFunction();
    let token = sessionStorage.getItem('Token');
    this.setState({ Token: token })
  }

  async createdFunction(snackbarDeny) {
    let newrows = await fetchDB();
    console.log(newrows);
    if(snackbarDeny) {
      this.setState({ rows: newrows.resdata,
        budget: newrows.balance, })
      if(this.state.rows.length === 0) {
        let self = this;
        setTimeout(function(){ self.setState({ open: false });self.setState({ open: true, snackbarMessage: "No More Projects Planned!", snackbarColor: "red"  }); }, 3000);
      }
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
        budget: newrows.balance,
        snackbarMessage: newrows.message,
        snackbarColor: "green",
      });
    }
    if(this.state.rows.length === 0) {
      let self = this;
      setTimeout(function(){ self.setState({ open: false });self.setState({ open: true, snackbarMessage: "No More Projects Planned!", snackbarColor: "red"  }); }, 3000);
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
      WEstimation: 0
    }  });
  };

  handleAgree = () => {
    axios
      .post(`http://localhost:3001/api/watersources/approvewatersource`, {
        WSID: this.state.approveSelect.WSID,
        WEstimation: this.state.approveSelect.WEstimation,
        WStatus: 'Approved'
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
      WEstimation: 0
    } });
  }

  approve(row) {
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
                  Planned Water Sources
                </Typography>
                <Typography component="h2" variant="h6" gutterBottom>
                  Budget: {this.state.budget}
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>WSID</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Estimation</TableCell>
                      <TableCell>Capacity</TableCell>
                      <TableCell>Pincode</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={row.WSID}>
                        <TableCell>{row.WSID}</TableCell>
                        <TableCell>{row.WStatus}</TableCell>
                        <TableCell>{row.WEstimation}</TableCell>
                        <TableCell>{row.WCapacity}</TableCell>
                        <TableCell>{row.Pincode}</TableCell>
                        <TableCell component="th" scope="row">
                          <IconButton
                            color="primary"
                            aria-label="mark approved"
                            component="span"
                            disabled={(this.state.budget-row.WEstimation)<0?true:false}
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
            {"Are you sure you want Approve this Project?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Your Expenditure will be Rocorded and the Overall Budget will Reduce.\nCurrent Budget: ${this.state.budget}.\nBudget after Project Approval: ${this.state.budget-this.state.approveSelect.WEstimation}`}
            </DialogContentText>
          </DialogContent>
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

export default withStyles(styles, { withTheme: true })(WaterSources);