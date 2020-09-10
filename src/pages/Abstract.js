import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Markdown from "./../components/Markdown";
import AbstractPost from "./../static/Abstract.md";
import ReactMarkdown from 'markdown-to-jsx';

const useStyles = makeStyles((theme) => ({
  markdown: {
    ...theme.typography.body2,
    padding: theme.spacing(3, 0),
  },
}));

export default function Abstract() {
  const classes = useStyles();
  const tempMD = `
  ## Group Members
  
  | **Roll Number** | **Name** |
  | --- | --- |
  | CB.EN.U4CSE18266 | Venkatasubramanian N |
  | CB.EN.U4CSE18212 | Ashwin V |
  | CB.EN.U4CSE18227 | Gubbala Sri Ram  |
  | CB.EN.U4CSE18234 | K. Chandra Mohan Reddy |
  
  ## Objective
  
  To improve the quality of lives of people living in rural areas by building a composite and decentralised rural water supply and sanitation system. 
  
  ## Software
  
  - Database: Oracle SQL
  - UI design: ReactJS
  
  ## Introduction
  
  The Failure of Rural Communities to understand the need of water resources as a social good and their inability to adhere to hygienic sanitation practices has led to the improper usage of water resources. There is also an acute need for a proper and easy to use health and sanitation systems in rural areas. This makes the aim of the project to focus on four different components.
  
  1. Improved Water Supply Facilities. 
  2. Hygienic Sanitation System. 
  3. Community Mobilisation and Education. 
  4. Advanced Monitoring, Evaluating and Supporting System. 
  
  ## Abstract
  
  Starting with the first component, water for the village is considered as a single resource for the village and is distributed equally among the villagers in appropriate time intervals. We also have a reserve to be used in case of emergency. The second component targets on the sanitary investments like constructing safe wastewater and excreta disposal systems, public installations on a pilot basis, small sewer collectors, community septic tanks, as well as lagoon-type wastewater treatment. The third component focuses on educating the villagers by connecting with them in a way they understand using community mobilisation. The last and important component focuses on using the latest and advanced technology to monitor the whole system in real time and evaluate the efficiency of both the villagers and the system in frequent time intervals. This whole data is stored in a relational database and can be used anytime to make sure of the success of this project mainly in areas like funding.
  
  Ensures Rehabilitated, Hygenic water supply and sanitation system. `;


  return (
    <Grid item xs={12} md={8} justify="center" style={{ maxWidth: '100%', marginTop: 10 }}>
      <Typography variant="h6" gutterBottom>
        Abstract
      </Typography>
      <Divider />
      <Markdown
        className={classes.markdown}
        key={AbstractPost.substring(0, 40)}
      >
        {tempMD}
      </Markdown>
    </Grid>
  );
}
