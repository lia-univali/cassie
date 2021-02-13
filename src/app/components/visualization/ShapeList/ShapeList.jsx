import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import { Grid, List, ListItem, ListItemText, Paper } from '@material-ui/core'

import TransectShapeList from './TransectShapeList'

import { highlight, clearHighlight } from '../../../../store/ducks/map';


const useStyles = makeStyles(theme => ({
  wrapper: {
    marginBottom: 0,
    marginLeft: 12,
  }
}))

const ShapeList = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [t] = useTranslation()

  const shapes = useSelector(state => state.map.shapes)

  return (
    <Paper className={classes.wrapper}>
      <List>
        {
          shapes.map((item, i) => (
            <ListItem key={i}
              onMouseOver={() => dispatch(highlight(i))}
              onMouseOut={() => dispatch(clearHighlight())}
            >
              <Grid container direction="column">
                <ListItemText
                  primary={t(item.name)}
                  secondary={item.overlays.length === 1 ?
                    `1 ${t('forms.map.item.s')}`
                    : `${item.overlays.length} ${t('forms.map.item.p')}`}
                />
                {item.name === t('forms.map.transects.title') && <TransectShapeList />}
              </Grid>
            </ListItem>
          ))
        }
      </List>
    </Paper>
  )
}

export default ShapeList