import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import { useTranslation } from 'react-i18next'

import { Actions as AuthActions } from '../../../store/ducks/auth'
import { Actions as LangActions } from '../../../store/ducks/i18n'

import { Container, Avatar, Box, Button, Grid, Typography, Badge, AppBar, Toolbar,IconButton } from '@material-ui/core'
// import {MenuIcon} from '@material-ui/icons/Menu'

import LogoIcon from '@material-ui/icons/Language'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import googleLogo from '../../../resources/googleLogo.svg'
import googleLogoDisabled from '../../../resources/googleLogoDisabled.svg'

import pt from '../../../resources/i18n/pt.svg'
import en from '../../../resources/i18n/en.svg'
import NavBar from '../../components/homepage/NavBar'

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
    backgroundAttachment: 'fixed',
    minHeight: '75vh'
  },
  bay: {
    padding: '60px 0px',
    background: 'url(/bay.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  risc: {
    padding: '60px 0px',
    background: 'url(/port.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  headingContainer: {
    paddingBottom: '10vh',
    paddingTop: '15vh'
  },
  content: {
    padding: '60px 0px',
  },
  
  logo: {
    fontSize: 120,
    color: 'white',
    margin: '0px 0px 20px 0px',
  },
  title: {
    fontWeight: '600',
    marginBottom: '2rem'
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
  description: {
    margin: '30px 0px 40px 0px',
    color: 'rgba(0, 0, 0, 0.85)',
  },
  google: {
    margin: '-4px 20px -4px -15px',
  },
  intro_gif:{
    maxWidth: '100%',
  },
  spaced_text:{
    marginBottom: '20px'
  },
  bay_text:{
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: '2rem'
  },
  spaced_btn:{
    margin: '8px'
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
}))

const WhiteTextTypography = withStyles({
  root: {
    color: "#FFFFFF"
  }
})(Typography);

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.background.paper}`,
    borderRadius: '.75rem'
  },
}))(Avatar);

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
        <Box className={classes.i18nSwitchers}>
          
        </Box>

        <Container className={classes.headingContainer} maxWidth="md" display='flex' flexDirection='column'>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <WhiteTextTypography className={classes.title} variant='h2'>
                Coastal Analysis System via Satellite Imagery Engine
              </WhiteTextTypography>
            </Grid>
            <Grid item xs={12} md={8}>
              <WhiteTextTypography className={classes.subtitle} variant='body1'>
                {t('self.shortDesc')}
              </WhiteTextTypography>
              
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={busy} variant='contained' size='large' color="primary" className={classes.spaced_btn}
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
          <Typography className={classes.title} variant='h3' align='center'>
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
      <Box className={classes.content} bgcolor="white">
        <Container maxWidth="md" display='flex' flexDirection='column'>
          <Typography className={classes.title} variant='h3'>
            {t('home.instructions.title')}
          </Typography>
          <Grid container p={5} justify="center" alignItems="center">
            <Grid item xs={12}>
              <Typography variant='body1' className={classes.spaced_text}>
                {t('home.instructions.text')}
              </Typography>
            </Grid>
          </Grid>
          <Box display='flex' flexDirection='row' >
            <Button variant='contained' className={classes.spaced_btn} color="primary" href="https://earthengine.google.com/signup/" m='10'>
              {t('home.instructions.btnEngineSingUp')}
            </Button>
            <Button variant='contained' className={classes.spaced_btn} color="secondary" href="https://earthengine.google.com/signup/">
              {t('home.instructions.btnManual')}
            </Button>
            <Button variant='contained' className={classes.spaced_btn} color="default" href="https://earthengine.google.com/signup/">
              {t('home.instructions.btnVideo')}
            </Button>
          </Box>
        </Container>
      </Box>

      <Box className={classes.bay}>
        <Container maxWidth="md" display='flex' flexDirection='column'>
          <Grid container  spacing={3} justify="center" alignItems="center">
            <Grid item xs={12} md={6}> </Grid>
            <Grid item xs={12} md={6}>
              <Box className={classes.bay_text}>
                <WhiteTextTypography className={classes.title} variant='h3' align="right">
                  {t('home.baysqueeze.title')}
                </WhiteTextTypography>
                <WhiteTextTypography variant='body1' className={classes.spaced_text} align="right">
                  {t('home.baysqueeze.text')}
                </WhiteTextTypography>
                <Box display='flex' flexDirection='row' justifyContent="flex-end">
                  <Button variant='contained' className={classes.spaced_btn} color="secondary" href="https://earthengine.google.com/signup/">
                    {t('home.baysqueeze.btn')}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>


      <Box className={classes.risc}>
        <Container maxWidth="md" display='flex' flexDirection='column'>
          <Grid container  spacing={3} justify="center" alignItems="center">
            
            <Grid item xs={12} md={6}>
              <Box className={classes.bay_text}>
                <WhiteTextTypography className={classes.title} variant='h3' align="left">
                  {t('home.riscport.title')}
                </WhiteTextTypography>
                <WhiteTextTypography variant='body1' className={classes.spaced_text} align="left">
                  {t('home.baysqueeze.text')}
                </WhiteTextTypography>
                <Box display='flex' flexDirection='row' justifyContent="flex-start">
                  <Button variant='contained' className={classes.spaced_btn} color="secondary" href="https://earthengine.google.com/signup/">
                    {t('home.baysqueeze.btn')}
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}> </Grid>
          </Grid>
        </Container>
      </Box>



      <Box className={classes.content}>
        <Container maxWidth="md" display='flex' flexDirection='column'>
          <Typography className={classes.title} variant='h3'>
            {t('home.members.title')}
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                name: "Antonio H.F. Klein",
                img: "klein.jpg",
                group: "ufsc.png",
                role: "Pesquisador"
              },
              {
                name: "Rudimar L.S. Dazzi",
                img: "rudimar.png",
                group: "lia.png",
                role: "Coordenador"
              },
              {
                name: "Rodrigo Lyra",
                img: "rodrigo.png",
                group: "lia.png",
                role: "Coordenador"
              },
              {
                name: "Luis Pedro Almeida",
                img: "pedro.png",
                group: "atlantic.png",
                role: "Pesquisador"
              },
              {
                name: "Israel Efraim de Oliveira",
                img: "israel.png",
                group: "lia.png",
                role: "Bolsista ATP-B"
              },
              {
                name: "Vinícius Gabriel Martins",
                img: "vinicius.png",
                group: "lia.png",
                role: "Bolsista FUMDES"
              }
            ].map(pesq => (
              <Grid key={pesq.name} item xs={12} md={4} align="center">
                <Badge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  badgeContent={<SmallAvatar alt="Remy Sharp" src={"/grupos/"+pesq.group} />}
                >
                  <Avatar alt="Travis Howard" src={"/equipe/"+pesq.img}  className={classes.large}/>
                </Badge>
                <Typography variant='h5'>{pesq.name}</Typography>
                <Typography variant='body1'>{pesq.role}</Typography>
              </Grid>
            ))}
            
            
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage