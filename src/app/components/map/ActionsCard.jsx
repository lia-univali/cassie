import React, { useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Collapse, Chip, Divider, IconButton, Typography } from '@material-ui/core'
import { Card, CardHeader, CardContent, CardActions} from '@material-ui/core'
import { ExpandMore as MoreIcon, ExpandLess as LessIcon } from '@material-ui/icons'

import ActionList from './ActionList'
import { Actions as Acquisition } from '../../../store/ducks/acquisition'

const useStyles = makeStyles(theme => ({
  wrapper: {
    marginBottom: 0,
    marginLeft: 12,
  },
  item: {
    margin: 0,
    padding: 0,
  },
  chip:{
    marginLeft: theme.spacing(1)
  }
}))

const ActionsCard = ({ className }) => {
  const availableDates = useSelector(state => state.acquisition.availableDates)
  const classes = useStyles()
  const dispatch = useDispatch()
  const [t] = useTranslation()

  const [expanded, setExpanded] = useState(true)

  return availableDates === undefined ? null : (
    <Card className={className} style={{ margin: 12 }}>
      <CardHeader
        title={t('forms.imageChooser.actions.title')}
      />
      <Divider />
      <CardContent className={classes.item}>
        <ActionList name='actions' />
      </CardContent>
    </Card>
  )
}

export default ActionsCard
