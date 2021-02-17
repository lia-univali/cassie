import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'
import { useTranslation } from 'react-i18next'

import * as auth from '../../../store/ducks/auth'

import { makeStyles } from '@material-ui/core/styles'
import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  contextItem: {
    marginRight: theme.spacing(2)
  }
}))

const User = ({ name, imageUrl, children }) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const classes = useStyles()

  const [anchor, setAnchor] = useState(null)

  const handleLogout = () => {
    dispatch(auth.Actions.revoke(() => {
      dispatch(push('/'))
      document.location.reload()
    }))
  }

  return !name ? null : (
    <Box>
      <Box display='flex' alignItems='center'>
        <Avatar className={classes.contextItem} alt={name} src={imageUrl} />
        <Typography className={classes.contextItem} variant='body1' color='inherit'>
          {name}
        </Typography>
        <IconButton color='inherit' onClick={e => setAnchor(e.currentTarget)} disableRipple>
          <MoreVert />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        getContentAnchorEl={null}
      >
        {children}
        <MenuItem onClick={handleLogout}>{t('auth.signout')}</MenuItem>
      </Menu>
    </Box>
  )
}

export default User
