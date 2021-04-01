import React from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Typography, Toolbar, ListItemIcon, ListItemText } from '@material-ui/core'
import { Actions as LangActions } from '../../../store/ducks/i18n'
import { Avatar, MenuItem } from '@material-ui/core'
import User from './User'
import pt from '../../../resources/i18n/pt.svg'
import en from '../../../resources/i18n/en.svg'

const useStyles = makeStyles(theme => ({
  title: {
    flex: 1
  },
  flag: {
    width: '20px',
    height: '20px',
    marginLeft: '10px'
  }
}))

const NavigationBar = () => {
  const user = useSelector(state => state.auth.user, shallowEqual)
  const [t] = useTranslation()
  const classes = useStyles()
  const dispatch = useDispatch()
  const handleLanguageChange = (local) => {
    dispatch(LangActions.setLang(local))
  }
  return (
    <AppBar position='static' >
      <Toolbar variant="dense">
        <Typography className={classes.title} variant='h6' color='inherit'>
        {t('self.code')}
        </Typography>
        <User {...user}>
          
          <MenuItem onClick={() => handleLanguageChange('pt-BR')}>
            
            <ListItemText primary="pt-BR" />
            <ListItemIcon>
              <Avatar alt='' src={pt} className={classes.flag} />
            </ListItemIcon>
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange('en-US')}>
            
            <ListItemText primary="en-US" />
            <ListItemIcon>
              <Avatar className={classes.flag} alt='' src={en} />
            </ListItemIcon>
          </MenuItem>
        </User>
        
        
      </Toolbar>
    </AppBar>
  )
}

export default NavigationBar
