import React from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { highlight, clearHighlight } from '../ducks/map';

class ShapeList extends React.Component {
  createItems() {
    return this.props.shapes.map((item, i) => (
      <ListItem key={i}
        onMouseOver={() => this.props.highlight(i)}
        onMouseOut={() => this.props.clearHighlight()}
      >
        <ListItemText
          primary={item.name}
          secondary={item.overlays.length === 1 ? "1 item" : `${item.overlays.length} itens`}
        />
      </ListItem>
    ))
  }

  render() {
    return (
      <div>
        <Paper style={styles.wrapper}>
          <List>
            {this.createItems()}
          </List>
        </Paper>
      </div>
    );
  }
}

const styles = {
  wrapper: {
    marginBottom: 0,
    marginLeft: 12,
  }
}

export default connect(state => ({
  shapes: state.map.shapes,
}), { highlight, clearHighlight })(ShapeList);
