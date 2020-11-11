import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import MainPost from '../components/MainPost';
import Abstract from '../components/MiniPosts';
import Header from "../components/Header";

class Homepage extends React.Component {

  state = {
    MainPost: {
      title: 'Rural Water Supply and Sanitation System',
      description:
        "To improve the quality of lives of people living in rural areas by building a composite and decentralised rural water supply and sanitation system.",
      image: require('./../static/HomeCover.jpg'),
      imgText: 'main image description'
    },
    Abstract: [
      {
        title: 'Abstact',
        subtitle: 'Abstract of the Project',
        description:
          'The Failure of Rural Communities to understand the need of water resources as a social good and their inability to adhere to hygienic sanitation practice...',
        image: require('./../static/HomeCover.jpg'),
        imageText: 'Image Text',
        ref: '/abstract',
        refText: 'Continue Reading...'
      }
    ]
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Header />
        <MainPost post={this.state.MainPost} />
        <Grid container justify="center" >
          {this.state.Abstract.map((post) => (
            <Abstract key={post.title} post={post} />
          ))}
        </Grid>
      </React.Fragment>
    );


  }
}

export default Homepage;