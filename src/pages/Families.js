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
  await axios.get(`http://localhost:3001/api/families/getallfamilies`, { headers: { Authorization: "Bearer " + token } })
      .then(res => {
        resdata = res.data.result;
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

class Families extends React.Component {
  state = {
    rows: [],
    showFamilies: false,
    showFamiliesText: "Show Families",
    locationSelect: '',
    snackbarColor: '',
    snackbarMessage: '',
    Token: null,
    availableLocation: [],
    open: false,
    val : {
      Persons: "",
      FHead: "",
      FContact: ""
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
    let locations = await fetchLocations();
    this.setState({ rows: newrows, availableLocation: locations });
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
    axios.post(`http://localhost:3001/api/families/addfamily`, { Persons: e.target.Persons.value, FHead: e.target.FHead.value, FContact: e.target.FContact.value, Pincode: e.target.Pincode.value }, { headers: { Authorization: "Bearer " + this.state.Token } })
      .then(async (res) => {
        let newrows = await fetchDB(this.state.Token);
        this.setState({ ...this.state, rows: newrows, snackbarMessage: res.data.message, open: true, snackbarColor: "green", locationSelect: '' });
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
    if (this.state.showFamilies) {
      return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  All Families
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>FID</TableCell>
                      <TableCell>Persons</TableCell>
                      <TableCell>FHead</TableCell>
                      <TableCell>FContact</TableCell>
                      <TableCell>Pincode</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={row.FID}>
                        <TableCell>{row.FID}</TableCell>
                        <TableCell>{row.Persons}</TableCell>
                        <TableCell>{row.FHead}</TableCell>
                        <TableCell>{row.FContact}</TableCell>
                        <TableCell>{row.Pincode}</TableCell>
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
              Families
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Persons"
                label="Persons"
                type="number"
                id="Persons"
                autoFocus
                error={(this.state.val.Persons.length === 0)? false : true}
                helperText={this.state.val.Persons}
                onChange={(e) => {
                  let val = this.state.val;
                  var format = /[0-9]+/;
                  if (!format.test(e.target.value)) val.Persons = "People cannot contain special symbols";            
                  else val.Persons = "";
                  this.setState({ val });
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="FHead"
                label="Family Head"
                type="text"
                id="FHead"
                error={(this.state.val.FHead.length === 0)? false : true}
                helperText={this.state.val.FHead}
                onChange={(e) => {
                  let val = this.state.val;
                  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]+/;
                  if (format.test(e.target.value)) val.FHead = "Name cannot contain special symbols";            
                  else val.FHead = "";
                  this.setState({ val });
                }}
                error={(this.state.val.FHead.length === 0)? false : true}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="FContact"
                label="Contact"
                type="number"
                id="FContact"
                error={(this.state.val.FContact.length === 0)? false : true}
                helperText={this.state.val.FContact}
                onChange={(e) => {
                  var format = /[0-9]+/;
                  var cformat = /[0-5]+/;
                  var val = this.state.val
                  if (!format.test(e.target.value) || e.target.value.length !== 10 ) val.FContact="Contact Number must have 10 numbers";  
                  else if (e.target.value.toString()[0].match(cformat)) val.FContact="Please enter a valid contact number";  
                  else val.FContact = "";
                  this.setState({ val });
                }}
                error={(this.state.val.FContact.length === 0)? false : true}
              />              
              <FormControl variant="outlined" fullWidth className={classes.form}>
                <InputLabel id="Location-Label">
                  Pincode
                </InputLabel>
                <Select
                  labelId="Location-Label"
                  id="Pincode"
                  label="Pincode"
                  name="Pincode"
                  variant="outlined"
                  value={this.state.locationSelect}
                  onOpen={(e) => {if(this.state.availableLocation.length === 0) this.setState({ open: true, snackbarMessage: "Locations Unavailable!", snackbarColor: "red" })}}
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
                Add Family
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
                onClick={(e) => {
                  console.log("came in");
                  e.preventDefault();
                  if (!this.state.showFamilies)
                    this.setState({
                      ...this.state,
                      showFamilies: true,
                      showFamiliesText: "Hide Families",
                    });
                  else
                    this.setState({
                      ...this.state,
                      showFamilies: false,
                      showFamiliesText: "Show Families",
                    });
                  console.log(this.state);
                }}
              >
                {this.state.showFamiliesText}
              </Button>
            </form>
          </div>
        </Container>
        {this.renderTable()}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Families);
