import React, { Component } from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: "wrap",
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
}));

export default function Header() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
            component="a"
            style={{textDecoration: 'none'}}
            href="/"
          >
            Rural Water Supply and Sanitation System
          </Typography>
          <nav>
            <Link
              variant="button"
              color="textPrimary"
              href="/abstract"
              className={classes.link}
            >
              Abstract
            </Link>
            <Link
              variant="button"
              color="textPrimary"
              href="/location"
              className={classes.link}
            >
              Location
            </Link>
            <Link
              variant="button"
              color="textPrimary"
              href="/jobs"
              className={classes.link}
            >
              Jobs
            </Link>
            <Link
              variant="button"
              color="textPrimary"
              href="/employee"
              className={classes.link}
            >
              Employee
            </Link>
            <Link
              variant="button"
              color="textPrimary"
              href="/watersources"
              className={classes.link}
            >
              Water Sources
            </Link>
            <Link
              variant="button"
              color="textPrimary"
              href="/waterusage"
              className={classes.link}
            >
              Water Usage
            </Link>
            <Link
              variant="button"
              color="textPrimary"
              href="/sanitationsystems"
              className={classes.link}
            >
              Sanitation Systems
            </Link>
            <Link
              variant="button"
              color="textPrimary"
              href="/expenditure"
              className={classes.link}
            >
              Expenditure
            </Link>
            <Link
              variant="button"
              color="textPrimary"
              href="/donate"
              className={classes.link}
            >
              Donate
            </Link>
          </nav>
          {/*<Button
            href="#"
            color="primary"
            variant="outlined"
            className={classes.link}
          >
            Login
          </Button>*/}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
