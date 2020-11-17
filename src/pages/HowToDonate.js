import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Markdown from "./../components/Markdown";

import Header from "../components/Header";

const useStyles = makeStyles((theme) => ({
  markdown: {
    ...theme.typography.body2,
    padding: theme.spacing(3, 0),
  },
}));

export default function Abstract() {
  const classes = useStyles();
  const tempMD = `
  **Bank Name**: HDFC BANK
  
  **ACCOUNT NUMBER**: 01234567138191
  
  **IFSC CODE**: HDFC0000004
  

  **BRANCH NAME**: CHENNAI - ITC CENTRE - ANNA SALAI
  
  **MICR CODE**: 600240002
  
  **CITY**: CHENNAI
  
  **STATE**: TAMILNADU
  
  **ADDRESS**: 759, ITC CENTREANNA SALAI, OPP T.V.S.CHENNAI, TAMILNADU 600002
  
  **PHONE NUMBER**: 9723872832`;


  return (
    <Grid item xs={12} md={8} justify="center" style={{ maxWidth: '100%', margin: 20 }}>
      <Header />
      <Typography variant="h6" gutterBottom>
        How to Donate
      </Typography>
      <Divider />
      <Markdown
        className={classes.markdown}
        key={tempMD.substring(0, 40)}
      >
        {tempMD}
      </Markdown>
    </Grid>
  );
}
