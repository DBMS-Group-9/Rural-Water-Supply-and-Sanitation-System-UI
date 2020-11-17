import React, { Component } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";

import Abstract from "../components/MiniPosts";
import Header from "../components/Header";

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
    margin: 10
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class Dashboard extends React.Component {
  state = {
    snackbarMessage: "",
    snackbarColor: "",
    open: false,
    Abstracts: {
      Locations: {
        title: "Locations",
        subtitle: "Add or View Locations",
        image: require("./../static/location.png"),
        imageText: "Image Text",
        ref: "/Location",
      },
      Jobs: {
        title: "Jobs",
        subtitle: "Add or View Jobs",
        image: require("./../static/job.png"),
        imageText: "Image Text",
        ref: "/Jobs",
      },
      WaterSources: {
        title: "Water Sources",
        subtitle: "Plan New Water Sources or View Available Water Sources",
        image: require("./../static/HomeCover.jpg"),
        imageText: "Image Text",
        ref: "/WaterSources",
      },
      SanitationSystems: {
        title: "Sanitation Systems",
        subtitle:
          "Plan New Sanitation Systems or View Available Sanitation Systems",
        image: require("./../static/sanitationsystem.png"),
        imageText: "Image Text",
        ref: "/SanitationSystems",
      },
      ApproveWaterSources: {
        title: "Approve Water Sources",
        subtitle: "View and Approve Planned Water Sources",
        image: require("./../static/HomeCover.jpg"),
        imageText: "Image Text",
        ref: "/ApproveWaterSources",
      },
      ManageWaterSources: {
        title: "Manage Water Sources",
        subtitle: "View and Modify Status of Constructed Water Sources",
        image: require("./../static/HomeCover.jpg"),
        imageText: "Image Text",
        ref: "/ManageWaterSources",
      },
      ApproveSanitationSystems: {
        title: "Approve Sanitation Systems",
        subtitle:
          "View and Approve Planned Sanitation Systems",
        image: require("./../static/sanitationsystem.png"),
        imageText: "Image Text",
        ref: "/ApproveSanitationSystems",
      },
      ManageSanitationSystems: {
        title: "Manage Sanitation Systems",
        subtitle:
          "View and Modify Status of Constructed Sanitation Systems",
        image: require("./../static/sanitationsystem.png"),
        imageText: "Image Text",
        ref: "/ManageSanitationSystems",
      },
      Employees: {
        title: "Employees",
        subtitle: "Add, view and manage Employees",
        image: require("./../static/employee.jpg"),
        imageText: "Image Text",
        ref: "/Employee",
      },
      Donate: {
        title: "Donate",
        subtitle: "Records All Donation Details",
        image: require("./../static/donate.png"),
        imageText: "Image Text",
        ref: "/Donate",
      },
      Families: {
        title: "Families",
        subtitle: "Add or view Families",
        image: require("./../static/family.jpg"),
        imageText: "Image Text",
        ref: "/Families",
      },
      Expenditures: {
        title: "Expenditure",
        subtitle: "View all Expenditures",
        image: require("./../static/expenditure.jpg"),
        imageText: "Image Text",
        ref: "/Expenditure",
      },
      WaterUsages: {
        title: "Water Usage",
        subtitle: "Record the Water Usage of a Water Source",
        image: require("./../static/HomeCover.jpg"),
        imageText: "Image Text",
        ref: "/WaterUsage",
      },
    },
    displayedAbstracts: [],
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
      }, 1000);
    }
    let Designation = sessionStorage.getItem("Designation");
    if (!Designation || Designation.length === 0) {
      this.setState({
        ...this.state,
        snackbarMessage: "Designation Not Set. Contact Admins.",
        open: true,
        snackbarColor: "red",
      });
      let self = this;
      setTimeout(function () {
        self.props.history.push("/");
      }, 1000);
    }
    let da = [];
    if (Designation === "Admin") {
      let display = ["Locations", "Jobs", "Employees", "Families"];
      for (let item of display) {
        da.push(this.state.Abstracts[item]);
      }
    } else if (Designation === "Planning Engineer") {
      let display = ["WaterSources", "SanitationSystems"];
      for (let item of display) {
        da.push(this.state.Abstracts[item]);
      }
    } else if (Designation === "Operator") {
      let display = ["WaterUsages"];
      for (let item of display) {
        da.push(this.state.Abstracts[item]);
      }
    } else if (Designation === "Accountant") {
      let display = ["ApproveWaterSources", "ApproveSanitationSystems", "Expenditures", "Donate"];
      for (let item of display) {
        da.push(this.state.Abstracts[item]);
      }
    } else if (Designation === "Project Manager") {
      let display = ["ManageWaterSources", "ManageSanitationSystems"];
      for (let item of display) {
        da.push(this.state.Abstracts[item]);
      }
    }
    this.setState({ displayedAbstracts: da });
  }

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ ...this.state, open: false });
  };

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
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Dashboard
          </Typography>
        </div>
        <Grid container justify="center">
          {this.state.displayedAbstracts.map((post) => (
            <Abstract key={post.title} post={post} />
          ))}
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Dashboard);
