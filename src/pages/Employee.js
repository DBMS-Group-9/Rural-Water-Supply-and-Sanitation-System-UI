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
function createData(id, EmpID, FName, LName, EContact, JobCode, Pincode) {
  return { id, EmpID, FName, LName, EContact, JobCode, Pincode };
}

function initializeDB() {
  let newrows = sessionStorage.getItem('Employee');
  if(newrows) {
    newrows = JSON.parse(newrows);
  }
  else {
    newrows = [
      createData(0, 'E001','Ashwin','Venkatesan',9867564361,'J01',641105),
      createData(1, 'E002','Senthi','kumar',8985663421,'J05',641041),
      createData(2, 'E003','Ganesh','Iyer',9676415267,'J07',641062),
      createData(3, 'E004','Suresh','Nair',9989432678,'J04',635602),
      createData(4, 'E005','Rama','Rao',8884587239,'J06',641605),
      createData(5, 'E006','Ashwin','Raman',9876523465,'J02',609503),
      createData(6, 'E007','Ramachandra','Iyer',9987643257,'J08',641112),
      createData(7, 'E008','Deva','Pillai',9876345656,'J04',621702),
      createData(8, 'E009','Dharun','Venkatesah',6308456579,'J03',626126),
      createData(9, 'E010','Kavin','Thevar',9441343733,'J09',641655)
    ]
    sessionStorage.setItem('Employee', JSON.stringify(newrows));
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

class Employee extends React.Component {
  state = {
    rows: initializeDB(),
    showEmployee: false,
    showEmployeeText: "Show Employee",
    jobSelect: '',
    locationSelect: '',
    availableJobs: JSON.parse(sessionStorage.getItem('Jobs')),
    availableLocation: JSON.parse(sessionStorage.getItem('Location')),
    open: false,
    submiterror: false
  };

  handleSubmit = (e) => {
    e.preventDefault();
    var newrows = this.state.rows;
    for (let row of newrows) {
      if(row.EmpID === e.target.EmpID.value) {
        this.setState({ submiterror: true });
        return;
      }
    }
    newrows.push(
      createData(
        this.state.rows.length,
        e.target.EmpID.value,
        e.target.FName.value,
        e.target.LName.value,
        e.target.EContact.value,
        e.target.JobCode.value,
        e.target.Pincode.value
      )
    );
    this.setState({ ...this.state, rows: newrows, open: true, jobSelect: '', locationSelect: '' });
    sessionStorage.setItem('Employee', JSON.stringify(newrows));
    e.target.reset();
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ ...this.state, open: false, submiterror: false });
  };

  renderTable() {
    const { classes } = this.props;
    if (this.state.showEmployee) {
      return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  All Employee
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Job Code</TableCell>
                      <TableCell>Pincode</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.EmpID}</TableCell>
                        <TableCell>{`${row.FName} ${row.LName}`}</TableCell>
                        <TableCell>{row.EContact}</TableCell>
                        <TableCell>{row.JobCode}</TableCell>
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
            message={<span id="client-snackbar">Employee Added Successfully!</span>}
          />
        </Snackbar>
        <Snackbar
          open={this.state.submiterror}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <SnackbarContent
            style={{
              backgroundColor: "red",
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
            message={<span id="client-snackbar">Employee ID Already Present!</span>}
          />
        </Snackbar>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Employee
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="EmpID"
                label="Employee ID"
                name="EmpID"
                type="text"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="FName"
                label="First Name"
                type="text"
                id="FName"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="LName"
                label="Last Name"
                type="text"
                id="LName"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="EContact"
                label="Conatct"
                type="number"
                id="EContact"
              />
              <FormControl variant="outlined" fullWidth className={classes.form}>
                <InputLabel id="Job-Label">
                  Job Code
                </InputLabel>
                <Select
                  labelId="Job-Label"
                  id="JobCode"
                  label="Job Code"
                  name="JobCode"
                  variant="outlined"
                  value={this.state.jobSelect}
                  onChange={(e) => {this.setState({ jobSelect: e.target.value })}}
                  required
                  fullWidth
                >
                  {this.state.availableJobs.map((job) => (
                      <MenuItem key={job.JobCode} value={job.JobCode}>{ `${job.JobCode} - ${job.Designation} - ${job.Shift}` }</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined" fullWidth className={classes.form}>
                <InputLabel id="Pincode-Label">
                    Pincode
                </InputLabel>
                <Select
                  labelId="Pincode-Label"
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
                Add Employee
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
                onClick={(e) => {
                  console.log("came in");
                  e.preventDefault();
                  if (!this.state.showEmployee)
                    this.setState({
                      ...this.state,
                      showEmployee: true,
                      showEmployeeText: "Hide Employee",
                    });
                  else
                    this.setState({
                      ...this.state,
                      showEmployee: false,
                      showEmployeeText: "Show Employee",
                    });
                  console.log(this.state);
                }}
              >
                {this.state.showEmployeeText}
              </Button>
            </form>
          </div>
        </Container>
        {this.renderTable()}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Employee);
