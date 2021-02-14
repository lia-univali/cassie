import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'

import { Waves, Assignment } from '@material-ui/icons'
import {
  Avatar, IconButton, List, ListItem, ListItemAvatar,
  ListItemSecondaryAction, ListItemText
} from '@material-ui/core'

import { Actions as Imagery } from '../store/ducks/imagery'
import { openDialog } from '../store/ducks/dialog'

const ActionList = ({ name }) => {
  const hasShorelineData = useSelector(state => Boolean(state.results.coastlineData))

  const dispatch = useDispatch()
  const [t] = useTranslation()

  return (
    <List>
      <ListItem button onClick={() => dispatch(Imagery.analyzeCoastline())}>
        <ListItemAvatar>
          <Avatar><Waves /></Avatar>
        </ListItemAvatar>
        <ListItemText primary={t('forms.imageChooser.actions.analyzeShoreline.title')} style={{ paddingRight: 48 }} />
        {
          hasShorelineData &&
          <ListItemSecondaryAction>
            <IconButton aria-label='results' onClick={() => dispatch(openDialog('coastlineEvolution'))}>
              <Assignment />
            </IconButton>
          </ListItemSecondaryAction>
        }
      </ListItem>
    </List>
  )
}

export default ActionList