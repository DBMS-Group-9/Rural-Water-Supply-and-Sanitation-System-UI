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
function createData(id, Pincode, Panchayat, District) {
  return { id, Pincode, Panchayat, District };
}

function initializeDB() {
  let newrows = sessionStorage.getItem('Location');
  if(newrows) {
    newrows = JSON.parse(newrows);
  }
  else {
    newrows = [
      createData(0, 641112,'Ettimadai','Coimbatore'),
      createData(1, 641105,'Madukarai','Coimbatore'),
      createData(2, 641041,'PN Pudur','Coimbatore'),
      createData(3, 641062,'RG Pudur','Coimbatore'),
      createData(4, 635602,'Adiyur','Vellore'),
      createData(5, 641605,'Ugayanur','Tiruppur'),
      createData(6, 609503,'Koothanur','Tiruppur'),
      createData(7, 621702,'Ambil','Tiruchirappalli'),
      createData(8, 626126,'Kunnur','Theni'),
      createData(9, 641655,'Alathur','Coimbatore')
    ]
    sessionStorage.setItem('Location', JSON.stringify(newrows));
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

class Location extends React.Component {
  state = {
    rows: initializeDB(),
    showLocation: false,
    showLocationText: "Show Location",
    open: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    var newrows = this.state.rows;
    newrows.push(
      createData(
        this.state.rows.length,
        e.target.Pincode.value,
        e.target.Panchayat.value,
        e.target.District.value
      )
    );
    this.setState({ ...this.state, rows: newrows, open: true });
    sessionStorage.setItem('Location', JSON.stringify(newrows));
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
    if (this.state.showLocation) {
      return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  All Location
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Pincode</TableCell>
                      <TableCell>Panchayat</TableCell>
                      <TableCell>District</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.Pincode}</TableCell>
                        <TableCell>{row.Panchayat}</TableCell>
                        <TableCell>{row.District}</TableCell>
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
            message={<span id="client-snackbar">Location Added Successfully!</span>}
          />
        </Snackbar>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Location
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="Pincode"
                label="Pincode"
                name="Pincode"
                type="number"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Panchayat"
                label="Panchayat"
                type="text"
                id="Panchayat"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="District"
                label="District"
                type="text"
                id="District"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Add Location
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
                onClick={(e) => {
                  console.log("came in");
                  e.preventDefault();
                  if (!this.state.showLocation)
                    this.setState({
                      ...this.state,
                      showLocation: true,
                      showLocationText: "Hide Location",
                    });
                  else
                    this.setState({
                      ...this.state,
                      showLocation: false,
                      showLocationText: "Show Location",
                    });
                  console.log(this.state);
                }}
              >
                {this.state.showLocationText}
              </Button>
            </form>
          </div>
        </Container>
        {this.renderTable()}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Location);
