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
function createData(id, SSID, SStatus, SEstimation, Pincode) {
  return { id, SSID, SStatus, SEstimation, Pincode };
}

function initializeDB() {
  let newrows = sessionStorage.getItem('SanitationSystems');
  if(newrows) {
    newrows = JSON.parse(newrows);
  }
  else {
    newrows = [
      createData(0, "S001", "Constructed", "2100000", "641105"),
      createData(1, "S002", "Constructed", "2000000", "641041"),
      createData(2, "S003", "Approved", "1800000", "641062"),
      createData(3, "S004", "Planned", "1500000", "635602"),
      createData(4, "S005", "Constructred", "2000000", "641605"),
      createData(5, "S006", "Constructred", "1700000", "609503"),
      createData(6, "S007", "Approved", "2200000", "641112"),
      createData(7, "S008", "Planned", "1600000", "621702"),
      createData(8, "S009", "Constructred", "2300000", "626126"),
      createData(9, "S010", "Approved", "2500000", "641655"),
    ]
    sessionStorage.setItem('SanitationSystems', JSON.stringify(newrows));
  }
  return newrows;
}

function getFromSessionStorage(key) {
  let obj = JSON.parse(sessionStorage.getItem(key));
  if(!obj) {
    obj = [];
  }
  return obj;
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
    rows: initializeDB(),
    showSanitationSystems: false,
    showSanitationSystemsText: "Show Sanitation Systems",
    locationSelect: '',
    statusSelect: '',
    availableLocation: getFromSessionStorage('Location'),
    open: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    var newrows = this.state.rows;
    newrows.push(
      createData(
        this.state.rows.length,
        e.target.SSID.value,
        e.target.SStatus.value,
        e.target.SEstimation.value,
        e.target.Pincode.value
      )
    );
    this.setState({ ...this.state, rows: newrows, open: true, locationSelect: '', statusSelect: '' });
    sessionStorage.setItem('SanitationSystems', JSON.stringify(newrows));
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
                      <TableRow key={row.id}>
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
            message={<span id="client-snackbar">Sanitaion System Added Successfully!</span>}
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
                id="SSID"
                label="SSID"
                name="SSID"
                type="text"
                autoFocus
              />
              <FormControl variant="outlined" fullWidth className={classes.form}>
                <InputLabel id="Location-Label">
                  Status
                </InputLabel>
                <Select
                  labelId="Location-Label"
                  id="SStatus"
                  label="Status"
                  name="SStatus"
                  variant="outlined"
                  value={this.state.statusSelect}
                  onChange={(e) => {this.setState({ statusSelect: e.target.value })}}
                  required
                  fullWidth
                >
                  <MenuItem value={"Constructed"}>Constructed</MenuItem>
                  <MenuItem value={"Planned"}>Planned</MenuItem>
                  <MenuItem value={"Approved"}>Approved</MenuItem>
                </Select>
              </FormControl>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="SEstimation"
                label="Estimation"
                type="number"
                id="SEstimation"
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
