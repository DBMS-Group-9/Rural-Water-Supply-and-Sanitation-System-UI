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
  await axios.get(`http://localhost:3001/api/jobs/getalljobs`)
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

class Jobs extends React.Component {
  state = {
    rows: [],
    showJobs: false,
    showJobsText: "Show Jobs",
    snackbarMessage: "",
    snackbarColor: "",
    shiftSelect: '',
    open: false,
  };

  async componentDidMount() {
    let newrows = await fetchDB();
    this.setState({ rows: newrows });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    e.persist();
    let ev = e;
    axios.post(`http://localhost:3001/api/jobs/addjob`, { Designation: e.target.Designation.value, Shift: e.target.Shift.value })
      .then(async (res) => {
        let newrows = await fetchDB();
        this.setState({ ...this.state, rows: newrows, snackbarMessage: res.data.message, open: true, snackbarColor: "green", shiftSelect: '' });
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
    if (this.state.showJobs) {
      return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  All Jobs
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Job ID</TableCell>
                      <TableCell>Designation</TableCell>
                      <TableCell>Shift</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={row.JobCode}>
                        <TableCell>{row.JobCode}</TableCell>
                        <TableCell>{row.Designation}</TableCell>
                        <TableCell>{row.Shift}</TableCell>
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
              Jobs
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Designation"
                label="Designation"
                type="text"
                id="Designation"
                autoFocus
              />
              <FormControl variant="outlined" fullWidth className={classes.form}>
                <InputLabel id="Shift-Label">
                  Shift
                </InputLabel>
                <Select
                  labelId="Shift-Label"
                  id="Shift"
                  label="Shift"
                  name="Shift"
                  variant="outlined"
                  value={this.state.shiftSelect}
                  onChange={(e) => {this.setState({ shiftSelect: e.target.value })}}
                  required
                  fullWidth
                >
                  <MenuItem value={"Full-Time"}>Full Time</MenuItem>
                  <MenuItem value={"Morning"}>Morning Shift</MenuItem>
                  <MenuItem value={"Evening"}>Evening Shift</MenuItem>
                  <MenuItem value={"Night"}>Night Shift</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Add Job
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
                onClick={(e) => {
                  console.log("came in");
                  e.preventDefault();
                  if (!this.state.showJobs)
                    this.setState({
                      ...this.state,
                      showJobs: true,
                      showJobsText: "Hide Jobs",
                    });
                  else
                    this.setState({
                      ...this.state,
                      showJobs: false,
                      showJobsText: "Show Jobs",
                    });
                  console.log(this.state);
                }}
              >
                {this.state.showJobsText}
              </Button>
            </form>
          </div>
        </Container>
        {this.renderTable()}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Jobs);
