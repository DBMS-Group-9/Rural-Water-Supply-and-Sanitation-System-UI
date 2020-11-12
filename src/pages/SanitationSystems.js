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
  await axios.get(`http://localhost:3001/api/sanitationsystems/getallsanitationsystems`)
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

class SanitationSystems extends React.Component {
  state = {
    rows: [],
    showSanitationSystems: false,
    showSanitationSystemsText: "Show Sanitation Systems",
    snackbarColor: '',
    snackbarMessage: '',
    locationSelect: '',
    availableLocation: [],
    open: false,
  };

  async componentDidMount() {
    let newrows = await fetchDB();
    let locations = await fetchLocations();
    this.setState({ rows: newrows, availableLocation: locations });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    e.persist();
    let ev = e;
    axios.post(`http://localhost:3001/api/sanitationsystems/addsanitationsystem`, { SStatus: 'Planned', SEstimation: e.target.SEstimation.value, Pincode: e.target.Pincode.value })
      .then(async (res) => {
        let newrows = await fetchDB();
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
    if (this.state.showSanitationSystems) {
      return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  All Sanitation Systems
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>SSID</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Estimation</TableCell>
                      <TableCell>Pincode</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={row.SSID}>
                        <TableCell>{row.SSID}</TableCell>
                        <TableCell>{row.SStatus}</TableCell>
                        <TableCell>{row.SEstimation}</TableCell>
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
              Sanitation Systems
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="SEstimation"
                label="Estimation"
                type="number"
                id="SEstimation"
                autoFocus
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
                Add Sanitation Systems
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
                onClick={(e) => {
                  console.log("came in");
                  e.preventDefault();
                  if (!this.state.showSanitationSystems)
                    this.setState({
                      ...this.state,
                      showSanitationSystems: true,
                      showSanitationSystemsText: "Hide Sanitation Systems",
                    });
                  else
                    this.setState({
                      ...this.state,
                      showSanitationSystems: false,
                      showSanitationSystemsText: "Show Sanitation Systems",
                    });
                  console.log(this.state);
                }}
              >
                {this.state.showSanitationSystemsText}
              </Button>
            </form>
          </div>
        </Container>
        {this.renderTable()}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SanitationSystems);