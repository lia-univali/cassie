import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import { useTranslation } from 'react-i18next'

import { Actions as AuthActions } from '../../../store/ducks/auth'
import { Actions as LangActions } from '../../../store/ducks/i18n'

import { Container, Avatar, Box, Button, Grid, Typography, AppBar, Toolbar,IconButton } from '@material-ui/core'
// import {MenuIcon} from '@material-ui/icons/Menu'

import LogoIcon from '@material-ui/icons/Language'
import { makeStyles } from '@material-ui/core/styles'
import googleLogo from '../../../resources/googleLogo.svg'
import googleLogoDisabled from '../../../resources/googleLogoDisabled.svg'

import pt from '../../../resources/i18n/pt.svg'
import en from '../../../resources/i18n/en.svg'

const useStyles = makeStyles(theme => ({
  backdrop: {
    height: '100vh',
    width: '100vw',
    position: 'fixed',
    zIndex: '-1',
    top: 0,
    left: 0,
    backgroundColor: theme.palette.primary.light,
  },
  heading: {
    
    backgroundColor: theme.palette.primary.main,
    background: 'url(/bg.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '75vh'
  },
  headingContainer: {
    padding: '10vh 0px',
  },
  content: {
    padding: '60px 0px',
  },
  black_content: {
    padding: '60px 0px',
    backgroundColor: 'black'
  },
  logo: {
    fontSize: 120,
    color: 'white',
    margin: '0px 0px 20px 0px',
  },
  title: {
    color: 'white',
    fontWeight: '600',
    marginBottom: '1rem'
  },
  content_title: {
    fontWeight: '600',
    marginBottom: '1.5rem'
  },
  subtitle: {
    color: 'white',
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
  description: {
    margin: '30px 0px 40px 0px',
    color: 'rgba(0, 0, 0, 0.85)',
  },
  google: {
    margin: '-4px 20px -4px -15px',
  },
  intro_gif:{
    maxWidth: '100%',
  }
}))

const HomePage = () => {
  const busy = useSelector(state => state.auth.authenticating)

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
      <Box className={classes.heading} >

        <Box className={classes.i18nSwitchers}>
          <Button className={classes.i18nSwitch} onClick={() => handleLanguageChange('pt-BR')}>
            <Avatar alt='' src={pt} className={classes.flag} />
            pt-BR
          </Button>
          <Button className={classes.i18nSwitch} onClick={() => handleLanguageChange('en-US')}>
            <Avatar className={classes.flag} alt='' src={en} />
            en-US
          </Button>
        </Box>

        <Container className={classes.headingContainer} maxWidth="md" display='flex' flexDirection='column'>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography className={classes.title} variant='h2'>
                Coastal Analysis System via Satellite Imagery Engine
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography className={classes.subtitle} variant='body1'>
                {t('self.shortDesc')}
              </Typography>
              
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={busy} variant='contained' size='large' color="primary"
                onClick={() => dispatch(AuthActions.begin(() => dispatch(push('/main/acquisition'))))}
              >
                <Avatar className={classes.google} variant='square'
                  alt='Google Logo' src={busy ? googleLogoDisabled : googleLogo} 
                />
                {t('auth.signin')}
              </Button>
            </Grid>
            
          </Grid>         
        </Container>
        
      </Box>
      <Box className={classes.content}>
        <Container maxWidth="md" display='flex' flexDirection='column'>
          <Typography className={classes.content_title} variant='h3' align='center'>
            {t('home.about.title')}
          </Typography>
          <Grid container spacing={3} justify="center" alignItems="center">
            <Grid item xs={12} md={6}>
              <img src="/usage_cassie.gif" className={classes.intro_gif}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant='body1'>
                {t('self.abstract')}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box className={classes.black_content}>
        <Container maxWidth="md" display='flex' flexDirection='column'>
          <Typography className={classes.title} variant='h3' align='center'>
            {t('home.instructions.title')}
          </Typography>
          <Grid container spacing={3} justify="center" alignItems="center">
            <Grid item xs={12} md={6}>
              <img src="/usage_cassie.gif" className={classes.intro_gif}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant='body1'>
                {t('self.abstract')}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage