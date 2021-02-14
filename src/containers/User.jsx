import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router'
import { useTranslation } from 'react-i18next'

import * as auth from '../store/ducks/auth'

import { Avatar, IconButton, Menu, MenuItem, Typography } from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'

const User = ({ name, imageUrl, children }) => {
  const [anchor, setAnchor] = useState(null)
  const dispatch = useDispatch()
  const [t] = useTranslation()

  const handleOpen = (event) => {
    setAnchor(event.currentTarget)
  }

  const handleClose = () => {
    setAnchor(null)
  }

  const handleLogout = () => {
    dispatch(auth.Actions.revoke(() => {
      dispatch(push('/'))
      document.location.reload()
    }))
  }

  return !name ? null : (
    // @TODO has raw css
    <div>
      <div className="flex vcenter">
        <Avatar alt={name} src={imageUrl} />
        <Typography variant="body2" color="inherit" className="margin-left">
          {name}
        </Typography>
        <IconButton color="inherit" onClick={e => handleOpen(e)} disableRipple>
          <MoreVert />
        </IconButton>
      </div>
      <Menu
        anchorEl={anchor}
        open={anchor !== null}
        onClose={() => handleClose()}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        getContentAnchorEl={null}
      >
        {children}
        <MenuItem onClick={handleLogout}>{t('auth.signout')}</MenuItem>
      </Menu>
    </div>
  )
}

export default User
