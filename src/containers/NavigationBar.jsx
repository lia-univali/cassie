import React from 'react';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import User from './User';

class NavigationBar extends React.Component {
  render() {
    const { user } = this.props;

    return (
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" className="flex1" color="inherit">
            C.A.S.S.I.E. <small>Coastal Analysis via Satellite Imagery Engine</small>
          </Typography>
          <User name={user.name} image={user.image}>
          </User>
        </Toolbar>
      </AppBar>
    );
  }
}

export default connect(state => {
  return { user: state.user };
})(NavigationBar);
