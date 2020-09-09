import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import MainPost from './MainPost';
import Abstract from './Abstract';

class Homepage extends React.Component {

  state = {
    MainPost: {
      title: 'Rural Water Supply and Sanitation System',
      description:
        "To improve the quality of lives of people living in rural areas by building a composite and decentralised rural water supply and sanitation system.",
      image: require('static/HomeCover.jpg'),
      imgText: 'main image description'
    },
    Abstract: [
      {
        title: 'Abstact',
        date: 'Abstract of the Project',
        description:
          'The Failure of Rural Communities to understand the need of water resources as a social good and their inability to adhere to hygienic sanitation practice...',
        image: require('static/HomeCover.jpg'),
        imageText: 'Image Text',
      }
    ]
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <MainPost post={this.state.MainPost} />
        <Grid container justify="center" style={{ marginBottom: 100 }}>
          {this.state.Abstract.map((post) => (
            <Abstract key={post.title} post={post} />
          ))}
        </Grid>
      </React.Fragment>
    );


  }
}

export default Homepage;