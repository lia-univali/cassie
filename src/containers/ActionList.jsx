import React from 'react';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Waves from '@material-ui/icons/Waves';
import Assignment from '@material-ui/icons/Assignment';
import { List, ListItem } from '@material-ui/core';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { analyzeCoastline } from '../ducks/imagery';
import { openDialog } from '../ducks/dialog';

class ActionList extends React.Component {
  render() {
    //console.log(this.props);

    return (
      <List>
        <ListItem button onClick={() => this.props.analyzeCoastline()}>
          <ListItemAvatar>
            <Avatar><Waves /></Avatar>
          </ListItemAvatar>
          <ListItemText primary="Analisar linhas de costa" style={{ paddingRight: 48 }} />
          {"coastlineData" in this.props.results &&
            <ListItemSecondaryAction>
              <IconButton aria-label="results" onClick={() => this.props.openDialog("coastlineEvolution")}>
                <Assignment />
              </IconButton>
            </ListItemSecondaryAction>
          }
        </ListItem>
      </List>
    );
  }
}

export default connect(state => ({
  results: state.results
}), { analyzeCoastline, openDialog })(ActionList);
