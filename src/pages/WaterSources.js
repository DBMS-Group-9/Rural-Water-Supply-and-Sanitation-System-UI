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
function createData(id, WSID, WStatus, WEstimation, WCapacity, Pincode) {
  return { id, WSID, WStatus, WEstimation, WCapacity, Pincode };
}

function initializeDB() {
  let newrows = sessionStorage.getItem('WaterSources');
  if(newrows) {
    newrows = JSON.parse(newrows);
  }
  else {
    newrows = [
      createData(0, "W001", "Planned", "4100000", "50000", "641105"),
      createData(1, "W002", "Constructed", "5261510", "120000", "641041"),
      createData(2, "W003", "Constructed", "4500000", "55000", "641062"),
      createData(3, "W004", "Planned", "3500000", "40000", "635602"),
      createData(4, "W005", "Constructed", "5400000", "75000", "641605"),
      createData(5, "W006", "Approved", "6400000", "90000", "609503"),
      createData(6, "W007", "Constructed", "7500000", "150000", "641112"),
      createData(7, "W008", "Constructed", "7000000", "135000", "621702"),
      createData(8, "W009", "Planned", "4600000", "60000", "626126"),
      createData(9, "W010", "Approved", "6000000", "80000", "641655")
    ]
    sessionStorage.setItem('WaterSources', JSON.stringify(newrows));
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

class WaterSources extends React.Component {
  state = {
    rows: initializeDB(),
    showWaterSources: false,
    showWaterSourcesText: "Show Water Sources",
    locationSelect: '',
    statusSelect: '',
    availableLocation: JSON.parse(sessionStorage.getItem('Location')),
    open: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    var newrows = this.state.rows;
    newrows.push(
      createData(
        this.state.rows.length,
        e.target.WSID.value,
        e.target.WStatus.value,
        e.target.WEstimation.value,
        e.target.WCapacity.value,        
        e.target.Pincode.value
      )
    );
    this.setState({ ...this.state, rows: newrows, open: true, locationSelect: '', statusSelect: '' });
    sessionStorage.setItem('WaterSources', JSON.stringify(newrows));
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
    if (this.state.showWaterSources) {
      return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  All Water Sources
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>WSID</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Capacity</TableCell>
                      <TableCell>Estimation</TableCell>
                      <TableCell>Pincode</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.WSID}</TableCell>
                        <TableCell>{row.WStatus}</TableCell>
                        <TableCell>{row.WCapacity}</TableCell>
                        <TableCell>{row.WEstimation}</TableCell>
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
            message={<span id="client-snackbar">Water Source Added Successfully!</span>}
          />
        </Snackbar>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Water Sources
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="WSID"
                label="WSID"
                name="WSID"
                type="text"
                autoFocus
              />
              <FormControl variant="outlined" fullWidth className={classes.form}>
                <InputLabel id="Location-Label">
                  Status
                </InputLabel>
                <Select
                  labelId="Location-Label"
                  id="WStatus"
                  label="Status"
                  name="WStatus"
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
                name="WCapacity"
                label="Capacity"
                type="number"
                id="WCapacity"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="WEstimation"
                label="Estimation"
                type="number"
                id="WEstimation"
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
                Add Water Source
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
                onClick={(e) => {
                  console.log("came in");
                  e.preventDefault();
                  if (!this.state.showWaterSources)
                    this.setState({
                      ...this.state,
                      showWaterSources: true,
                      showWaterSourcesText: "Hide Water Sources",
                    });
                  else
                    this.setState({
                      ...this.state,
                      showWaterSources: false,
                      showWaterSourcesText: "Show Water Sources",
                    });
                  console.log(this.state);
                }}
              >
                {this.state.showWaterSourcesText}
              </Button>
            </form>
          </div>
        </Container>
        {this.renderTable()}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(WaterSources);
