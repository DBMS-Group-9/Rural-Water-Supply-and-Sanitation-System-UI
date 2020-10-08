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
function createData(id, WSID, Month, Year, Usage) {
  return { id, WSID, Month, Year, Usage };
}

function initializeDB() {
  let newrows = sessionStorage.getItem('WaterUsage');
  if(newrows) {
    newrows = JSON.parse(newrows);
  }
  else {
    newrows = [
      createData(0, 'W002','January',2020,20000),
      createData(1, 'W007','March',2020,30000),
      createData(2, 'W008','November',2020,25000),
      createData(3, 'W002','February',2020,9000),
      createData(4, 'W008','January',2020,30000),
      createData(5, 'W003','April',2020,25000),
      createData(6, 'W007','February',2020,17000),
      createData(7, 'W005','September',2020,22000),
      createData(8, 'W003','June',2020,15000),
      createData(9, 'W002','July',2020,21000)
    ]
    sessionStorage.setItem('WaterUsage', JSON.stringify(newrows));
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

class WaterUsage extends React.Component {
  state = {
    rows: initializeDB(),
    showWaterUsage: false,
    showWaterUsageText: "Show Water Usage",
    wsidSelect: '',
    monthSelect: '',
    yearSelect: '',
    availableWSID: JSON.parse(sessionStorage.getItem('WaterSources')),
    open: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    var newrows = this.state.rows;
    newrows.push(
      createData(
        this.state.rows.length,
        e.target.WSID.value,
        e.target.Month.value,
        e.target.Year.value,
        e.target.Usage.value
      )
    );
    this.setState({ ...this.state, rows: newrows, open: true, wsidSelect: '', monthSelect: '', yearSelect: '' });
    sessionStorage.setItem('WaterUsage', JSON.stringify(newrows));
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
    if (this.state.showWaterUsage) {
      return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  All Water Usage
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>WSID</TableCell>
                      <TableCell>Month</TableCell>
                      <TableCell>Year</TableCell>
                      <TableCell align="right">Usage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.WSID}</TableCell>
                        <TableCell>{row.Month}</TableCell>
                        <TableCell>{row.Year}</TableCell>
                        <TableCell>{row.Usage}</TableCell>
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
            message={<span id="client-snackbar">Water Usage Registered Successfully!</span>}
          />
        </Snackbar>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Water Usage
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
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
                  required
                  fullWidth
                >
                  {this.state.availableWSID.map((ws) => (
                      <MenuItem key={ws.WSID} value={ws.WSID}>{ `${ws.WSID} - ${ws.WCapacity} L - ${ws.Pincode}` }</MenuItem>
                  ))}
                </Select>
              </FormControl>  
              <FormControl variant="outlined" fullWidth className={classes.form}>
                <InputLabel id="Month-Label">
                  Month
                </InputLabel>
                <Select
                  labelId="Month-Label"
                  id="Month"
                  label="Month"
                  name="Month"
                  variant="outlined"
                  value={this.state.monthSelect}
                  onChange={(e) => {this.setState({ monthSelect: e.target.value })}}
                  required
                  fullWidth
                >
                  <MenuItem value={"January"}>January</MenuItem>
                  <MenuItem value={"February"}>February</MenuItem>
                  <MenuItem value={"March"}>March</MenuItem>
                  <MenuItem value={"April"}>April</MenuItem>
                  <MenuItem value={"May"}>May</MenuItem>
                  <MenuItem value={"June"}>June</MenuItem>
                  <MenuItem value={"July"}>July</MenuItem>
                  <MenuItem value={"August"}>August</MenuItem>
                  <MenuItem value={"September"}>September</MenuItem>
                  <MenuItem value={"October"}>October</MenuItem>
                  <MenuItem value={"November"}>November</MenuItem>
                  <MenuItem value={"December"}>December</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" fullWidth className={classes.form}>
                <InputLabel id="Year-Label">
                  Year
                </InputLabel>
                <Select
                  labelId="Year-Label"
                  id="Year"
                  label="Year"
                  name="Year"
                  variant="outlined"
                  value={this.state.yearSelect}
                  onChange={(e) => {this.setState({ yearSelect: e.target.value })}}
                  required
                  fullWidth
                >
                  <MenuItem value={2019}>2019</MenuItem>
                  <MenuItem value={2020}>2020</MenuItem>
                  <MenuItem value={2021}>2021</MenuItem>
                  <MenuItem value={2022}>2022</MenuItem>
                  <MenuItem value={2023}>2023</MenuItem>
                  <MenuItem value={2024}>2024</MenuItem>
                  <MenuItem value={2025}>2025</MenuItem>
                  <MenuItem value={2026}>2026</MenuItem>
                  <MenuItem value={2027}>2027</MenuItem>
                  <MenuItem value={2028}>2028</MenuItem>
                  <MenuItem value={2029}>2029</MenuItem>
                  <MenuItem value={2030}>2030</MenuItem>
                </Select>
              </FormControl>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Usage"
                label="Usage"
                type="number"
                id="Usage"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Add WaterUsage
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
                onClick={(e) => {
                  console.log("came in");
                  e.preventDefault();
                  if (!this.state.showWaterUsage)
                    this.setState({
                      ...this.state,
                      showWaterUsage: true,
                      showWaterUsageText: "Hide Water Usage",
                    });
                  else
                    this.setState({
                      ...this.state,
                      showWaterUsage: false,
                      showWaterUsageText: "Show Water Usage",
                    });
                  console.log(this.state);
                }}
              >
                {this.state.showWaterUsageText}
              </Button>
            </form>
          </div>
        </Container>
        {this.renderTable()}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(WaterUsage);
