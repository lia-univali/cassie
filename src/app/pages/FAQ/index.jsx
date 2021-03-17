import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import { useTranslation } from 'react-i18next'
import { Actions as AuthActions } from '../../../store/ducks/auth'
import { Actions as LangActions } from '../../../store/ducks/i18n'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Container, Avatar, Box, Button, Grid, Accordion, AccordionSummary,AccordionDetails, Typography, Link, Badge, Card, CardContent, CardActions } from '@material-ui/core'

import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { makeStyles, withStyles } from '@material-ui/core/styles'
import googleLogo from '../../../resources/googleLogo.svg'
import googleLogoDisabled from '../../../resources/googleLogoDisabled.svg'

import pt from '../../../resources/i18n/pt.svg'
import en from '../../../resources/i18n/en.svg'
import NavBar from '../../components/homepage/NavBar'
import Footer from '../../components/homepage/Footer'

const useStyles = makeStyles(theme => ({
  heading: {
    backgroundColor: theme.palette.primary.main,
    background: 'url(/bg.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  },
  headingContainer: {
    paddingBottom: '5vh',
    paddingTop: '15vh'
  },
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
  modaltitle:{
    paddingBottom:  theme.spacing(2),
  },
  accordiontitle: {
    backgroundColor: theme.palette.background.paper,
    borderBottom:  `1px solid ${theme.palette.grey[300]}`,
  }
  
}))

const WhiteTextTypography = withStyles({
  root: {
    color: "#FFFFFF"
  }
})(Typography);


const HomePage = () => {

  const dispatch = useDispatch()
  const [t] = useTranslation()
  const classes = useStyles()

  useEffect(() => {
    dispatch(AuthActions.loadClientAuth())
  }, [])

  const handleLanguageChange = (local) => {
    dispatch(LangActions.setLang(local))
  }
  const faq = [
    {
      title: t('faq.0.title'),
      text: t('faq.0.text', { interpolation: {escapeValue: false} }),
    },
    {
      title: t('faq.1.title'),
      text: t('faq.1.text', { interpolation: {escapeValue: false} }),
    },
    {
      title: t('faq.2.title'),
      text: t('faq.2.text', { interpolation: {escapeValue: false} }),
    },
    {
      title: t('faq.3.title'),
      text: t('faq.3.text', { interpolation: {escapeValue: false} }),
    },
    {
      title: t('faq.4.title'),
      text: t('faq.4.text', { interpolation: {escapeValue: false} }),
    },
  ]

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
        <Container className={classes.headingContainer} maxWidth="md" display='flex' flexDirection='column'>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <WhiteTextTypography className={classes.title} variant='h2'>
                {t('home.footer.resources.faq')}
              </WhiteTextTypography>
            </Grid>            
          </Grid>         
        </Container>
        
      </Box>
      
      <Box className={classes.content}>
        <Container maxWidth="md" display='flex' flexDirection='column'>
            <div className={classes.modalcontent}>
                {
                    faq.map((f,i)=>(
                        <Accordion key={i}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            className={classes.accordiontitle}
                        >
                            <Typography variant="subtitle2">{f.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body1" dangerouslySetInnerHTML={ { __html: f.text } }>
                            </Typography>
                        </AccordionDetails>
                        </Accordion>
                    ))
                }
            </div>
        </Container>
      </Box>

      <Footer/>
      
    </Box>
  )
}

export default HomePage