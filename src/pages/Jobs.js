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
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";

// Generate Order Data
function createData(id, JobCode, Designation, Shift) {
  return { id, JobCode, Designation, Shift };
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
    rows: [
      createData(0, "Job01", "08-09-2020", "Elvis Presley"),
      createData(1, "Job02", "07-09-2020", "Paul McCartney"),
      createData(2, "Job03", "09-09-2020", "Tom Scholz"),
      createData(3, "Job04", "10-09-2020", "Michael Jackson"),
      createData(4, "Job05", "05-09-2020", "Bruce Springsteen"),
    ],
    showDonors: false,
    showDonorsText: "Show Donors",
    open: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    var newrows = this.state.rows;
    newrows.push(
      createData(
        this.state.rows.length,
        e.target.JobCode.value,
        e.target.Designation.value,
        e.target.Shift.value
      )
    );
    this.setState({ ...this.state, rows: newrows, open: true });
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
    if (this.state.showDonors) {
      return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  All Donations
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
                      <TableRow key={row.id}>
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
            message={<span id="client-snackbar">Donation Successful!</span>}
          />
        </Snackbar>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Donate
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="JobCode"
                label="Job Code"
                name="JobCode"
                type="text"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Designation"
                label="Designation"
                type="Designation"
                id="Designation"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Shift"
                label="Shift"
                type="text"
                id="Shift"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Donate Now!
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
                onClick={(e) => {
                  console.log("came in");
                  e.preventDefault();
                  if (!this.state.showDonors)
                    this.setState({
                      ...this.state,
                      showDonors: true,
                      showDonorsText: "Hide Donors",
                    });
                  else
                    this.setState({
                      ...this.state,
                      showDonors: false,
                      showDonorsText: "Show Donors",
                    });
                  console.log(this.state);
                }}
              >
                {this.state.showDonorsText}
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
