import React, { Component } from "react";
import axios from "axios";
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
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { withStyles } from "@material-ui/core/styles";

import Header from "../components/Header";

async function fetchDB(token) {
  let resdata = [];
  await axios
    .get(`http://localhost:3001/api/waterusages/getallwaterusages`, { headers: { Authorization: "Bearer " + token } })
    .then((res) => {
      resdata = res.data.result;
    })
    .catch((err) => {
      console.log(err);
    });
  return resdata;
}

async function fetchWSID(token) {
  let resdata = [];
  await axios
    .get(`http://localhost:3001/api/watersources/getallwatersources`, { headers: { Authorization: "Bearer " + token } })
    .then((res) => {
      resdata = res.data.result;
    })
    .catch((err) => {
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

class WaterUsage extends React.Component {
  state = {
    rows: [],
    showWaterUsage: false,
    showWaterUsageText: "Show Water Usages",
    snackbarMessage: "",
    snackbarColor: "",
    wsidSelect: "",
    monthSelect: "",
    yearSelect: "",
    Token: null,
    availableWSID: [],
    open: false,
    minDate: null,
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
    if (Designation !== "Operator") {
      this.setState({
        ...this.state,
        snackbarMessage: "Login as Operator First!!!",
        open: true,
        snackbarColor: "red",
      });
      let self = this;
      setTimeout(function () {
        self.props.history.push("/Dashboard");
      }, 500);
    }
    let newrows = await fetchDB(Token);
    let WSIDs = await fetchWSID(Token);
    this.setState({ rows: newrows, availableWSID: WSIDs });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    e.persist();
    let ev = e;
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    axios
      .post(`http://localhost:3001/api/waterusages/addwaterusage`, {
        WSID: e.target.WSID.value,
        Month: monthNames[this.state.monthSelect],
        Year: this.state.yearSelect,
        Usages: e.target.Usages.value,
      }, { headers: { Authorization: "Bearer " + this.state.Token } })
      .then(async (res) => {
        let newrows = await fetchDB(this.state.Token);
        this.setState({
          ...this.state,
          rows: newrows,
          snackbarMessage: res.data.message,
          open: true,
          snackbarColor: "green",
          wsidSelect: "",
          monthSelect: "",
          yearSelect: "",
        });
        ev.target.reset();
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          ...this.state,
          open: true,
          snackbarMessage: err.response.data.message,
          snackbarColor: "red",
        });
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
    if (this.state.showWaterUsage) {
      return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  All Water Usages
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>WSID</TableCell>
                      <TableCell>Month</TableCell>
                      <TableCell>Year</TableCell>
                      <TableCell align="right">Usages</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={`${row.WSID}-${row.Month}-${row.Year}`}>
                        <TableCell>{row.WSID}</TableCell>
                        <TableCell>{row.Month}</TableCell>
                        <TableCell>{row.Year}</TableCell>
                        <TableCell>{row.Usages}</TableCell>
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
            message={
              <span id="client-snackbar">{this.state.snackbarMessage}</span>
            }
          />
        </Snackbar>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Water Usages
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <FormControl
                variant="outlined"
                fullWidth
                className={classes.form}
              >
                <InputLabel id="WSID-Label">WSID</InputLabel>
                <Select
                  labelId="WSID-Label"
                  id="WSID"
                  label="WSID"
                  name="WSID"
                  variant="outlined"
                  value={this.state.wsidSelect}
                  onOpen={(e) => {
                    if (this.state.availableWSID.length === 0)
                      this.setState({
                        open: true,
                        snackbarMessage: "WaterSources Unavailable!",
                        snackbarColor: "red",
                      });
                  }}
                  onChange={(e) => {
                    this.setState({ wsidSelect: e.target.value });
                    axios
                      .post(
                        `http://localhost:3001/api/waterusages/getwaterusagemindate`,
                        { WSID: e.target.value }, { headers: { Authorization: "Bearer " + this.state.Token } }
                      )
                      .then(async (res) => {
                        this.setState({ minDate: res.data.result });
                      })
                      .catch((err) => {
                        console.log(err);
                        this.setState({
                          open: true,
                          snackbarMessage: err.response.data.message,
                          snackbarColor: "red",
                        });
                      });
                  }}
                  required
                  fullWidth
                >
                  {this.state.availableWSID.map((ws) => (
                    <MenuItem
                      key={ws.WSID}
                      value={ws.WSID}
                    >{`${ws.WSID} - ${ws.WCapacity} L - ${ws.Pincode}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  style={{ marginTop: 16, marginBottom: 8 }}
                  views={["year", "month"]}
                  label="Month and Year"
                  disabled={!this.state.minDate}
                  onChange={(e) => {
                    this.setState({
                      yearSelect: e.getFullYear(),
                      monthSelect: e.getMonth(),
                    });
                  }}
                  minDate={this.state.minDate}
                  required
                  fullWidth
                  inputVariant="outlined"
                />
              </MuiPickersUtilsProvider>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Usages"
                label="Usages"
                type="number"
                id="Usages"
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
                      showWaterUsageText: "Hide Water Usages",
                    });
                  else
                    this.setState({
                      ...this.state,
                      showWaterUsage: false,
                      showWaterUsageText: "Show Water Usages",
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
