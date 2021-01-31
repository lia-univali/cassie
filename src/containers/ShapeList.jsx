import React from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import RemoveIcon from '@material-ui/icons/Remove';
import Grid from '@material-ui/core/Grid';
import { highlight, clearHighlight } from '../ducks/map';
import i18next from 'i18next'

class TransectShapeList extends React.Component {
  render() {
    const labels = [
      { class: i18next.t('forms.map.transects.stable'), color: '#43a047' },
      { class: i18next.t('forms.map.transects.accreted'), color: '#1976d2' },
      { class: i18next.t('forms.map.transects.eroded'), color: '#ffa000' },
      { class: i18next.t('forms.map.transects.criticallyEroded'), color: '#d32f2f' }
    ]

    return (
      labels.map((label, index) => (
        <Grid key={index} container direction="row">
          <RemoveIcon style={{ color: label.color }} />
          <ListItemText
            secondary={label.class}
          />
        </Grid>
      ))
    )
  }
}

const labels = [
  { class: 'Estável', color: '#43a047' },
  { class: 'Acrescida', color: '#1976d2' },
  { class: 'Erodida', color: '#ffa000' },
  { class: 'Intensamente Erodida', color: '#d32f2f' }
]

class TransectShapeList extends React.Component {
  render() {
    return (
      labels.map(label => (
        <Grid container direction="row">
          <RemoveIcon style={{ color: label.color }} />
          <ListItemText
            secondary={label.class}
          />
        </Grid>
      ))
    )
  }
}

class ShapeList extends React.Component {
  createItems() {
    return this.props.shapes.map((item, i) => (
      <ListItem key={i}
        onMouseOver={() => this.props.highlight(i)}
        onMouseOut={() => this.props.clearHighlight()}
      >
        <Grid container direction="column">
          <ListItemText
            primary={item.name}
            secondary={item.overlays.length === 1 ? `1 ${i18next.t('forms.map.item.s')}` : `${item.overlays.length} ${i18next.t('forms.map.item.p')}`}
          />
          {item.name === i18next.t('forms.map.transects.title') && <TransectShapeList />}
        </Grid>
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
