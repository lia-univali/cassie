import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Actions as AuthActions } from '../../../store/ducks/auth'
import { Actions as LangActions } from '../../../store/ducks/i18n'
import { Avatar, Box, Button} from '@material-ui/core'

import { makeStyles, withStyles } from '@material-ui/core/styles'

import pt from '../../../resources/i18n/pt.svg'
import en from '../../../resources/i18n/en.svg'
import NavBar from '../../components/homepage/NavBar'
import Footer from '../../components/homepage/Footer'

const useStyles = makeStyles(theme => ({
  content: {
    padding: '60px 0px',
  },
  
  subtitle: {
    fontSize: '1.5rem',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'column',
    backgroundColor: theme.palette.primary[200],
    padding: '40px 48px',
  },
  i18nSwitchers: {
    textAlign: 'right',
    backgroundColor: 'white'
  },
  i18nSwitch: {
    padding: '5px 10px',
    margin: '0 10px',
    
  },
  flag: {
    marginRight: '5px',
    height: '25px',
    width: '25px'
  },
  site: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateRows: '1fr auto',
  }
}))

const HomePageTemplate = (props) => {

  const dispatch = useDispatch()
  const [t] = useTranslation()
  const classes = useStyles()

  useEffect(() => {
    dispatch(AuthActions.loadClientAuth())
  }, [])

  const handleLanguageChange = (local) => {
    dispatch(LangActions.setLang(local))
  }
  return (  
    <Box>
        <NavBar>
            <Button className={classes.i18nSwitch} onClick={() => handleLanguageChange('pt-BR')}>
            <Avatar alt='' src={pt} className={classes.flag} />
            pt-BR
            </Button>
            <Button className={classes.i18nSwitch} onClick={() => handleLanguageChange('en-US')}>
            <Avatar className={classes.flag} alt='' src={en} />
            en-US
            </Button>
        </NavBar>
        <Box className={classes.site}>
          <Box className={classes.maincontent}>
              {props.children}
          </Box>
          <Footer/>
        </Box>
        
    </Box>
  )
}

export default HomePageTemplate