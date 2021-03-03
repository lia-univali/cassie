import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import { useTranslation } from 'react-i18next'
import { Actions as AuthActions } from '../../../store/ducks/auth'
import { Actions as LangActions } from '../../../store/ducks/i18n'

import { Container, Avatar, Box, Button, Grid,Tooltip, Typography, Link, Badge, Card, CardContent, CardActions } from '@material-ui/core'

import AvatarGroup from '@material-ui/lab/AvatarGroup';

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
    marginBottom: theme.spacing(5),
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
    marginBottom: theme.spacing(4),
  },
  bay_text:{
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: theme.spacing(5),
  },
  spaced_btn:{
    marginRight: '16px'
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    border: `2px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    border: `2px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  sponsor_img: {
    height: theme.spacing(6),
    maxWidth: '100%',
    marginBottom: theme.spacing(2),
  },
  sponsor_img_sqr: {
    height: theme.spacing(13),
    maxWidth: '100%',
    marginBottom: theme.spacing(2),
  },
  sponsor_img_partner: {
    height: theme.spacing(10),
    maxWidth: '100%',
    marginBottom: theme.spacing(2),
  },
  avatar_link: {
    border: 'none',
  }
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
    border: `2px solid ${theme.palette.divider}`,
    borderRadius: '.75rem'
  },
}))(Avatar);



const HomePage = () => {
  const busy = useSelector(state => state.auth.authenticating)

  const dispatch = useDispatch()
  const [t] = useTranslation()
  const classes = useStyles()
  const groupsData = {
    loc: {
      name: 'LOC UFSC',
      img: 'ufsc.png',
      link: 'https://ufsc.br/'
    },
    lia: {
      name: 'LIA Univali',
      img: 'lia.png',
      link: 'http://ialab.com.br/'
    },
    atlantic: {
      name: 'CoLAB + Atlantic',
      img: 'atlantic.png',
      link: 'https://colabatlantic.com/'
    }
  }
  const authorsData = {
    klein: {
      name: "Antonio H.F. Klein",
      img: "klein.jpg",
      group: groupsData.loc,
      role: t('home.members.roles.researcher'),
      link: 'http://lattes.cnpq.br/2354029280846247'
    },
    rudimar: {
      name: "Rudimar L.S. Dazzi",
      img: "rudimar.jpg",
      group: groupsData.lia,
      role: t('home.members.roles.coord'),
      link: 'http://lattes.cnpq.br/9340343036686762'
    },
    lyra: {
      name: "Rodrigo Lyra",
      img: "rodrigo.jpg",
      group: groupsData.lia,
      role: t('home.members.roles.coord'),
      link: 'http://lattes.cnpq.br/0117343254850007'
    },
    pedro: {
      name: "Luis Pedro Almeida",
      img: "pedro.png",
      group: groupsData.atlantic,
      role: t('home.members.roles.researcher'),
      link: 'http://lattes.cnpq.br/4892957787322492'
    },
    israel: {
      name: "Israel Efraim de Oliveira",
      img: "israel.png",
      group: groupsData.lia,
      role: t('home.members.roles.atp'),
      link: 'https://github.com/IsraelEfraim'
    },
    vinicius: {
      name: "Vinícius Gabriel Martins",
      img: "vinicius.png",
      group: groupsData.lia,
      role: t('home.members.roles.fumdes'),
      link: 'https://github.com/vinigmartins'
    },
    fernando: {
      name: "Fernando Concatto",
      img: "fernando.jfif",
      group: groupsData.lia,
      role: t('home.members.roles.fumdes'),
      link: 'https://github.com/vinigmartins'
    }
  }
  const authors = [
    authorsData.klein,
    authorsData.rudimar,
    authorsData.lyra,
    authorsData.pedro,
    authorsData.israel,
    authorsData.vinicius
  ]

  const papers  = [
    {
      kind: t('home.papers.resumo_text'),
      title: "e-C.A.S.S.I.E.: Uma Ferramenta para Análise e Mapeamento de Regiões Costeiras Utilizando a Plataforma Google Earth Engine.",
      event: "II SBPA & XI ENCOGERCO 2018",
      authors: [
        authorsData.fernando, authorsData.pedro, authorsData.lyra, authorsData.rudimar, authorsData.klein
      ],
      link: 'http://www.praiaegestao.com.br/theme/images/ANAISSBPAEENCOGERCO_2018.pdf#page=252'
    },
    {
      kind: t('home.papers.resumo_text'),
      title: "Desenvolvimento de uma Ferramenta Integrada ao Google Earth Engine para a Análise de Ambientes Costeiros.",
      event: "Computer on the Beach 2018",
      authors: [
        authorsData.fernando, authorsData.pedro, authorsData.lyra, authorsData.rudimar, authorsData.klein
      ],
      link: 'https://siaiap32.univali.br/seer/index.php/acotb/article/view/12871'
    },
    {
      kind: t('home.papers.curso_text'),
      title: "Determinação e análise da evolução da linha de costa com ferramenta do Google Earth Engine (e-CASSIE).",
      event: "LAPECO 2019",
      authors: [
        authorsData.pedro, authorsData.lyra, authorsData.israel
      ],
      link: 'http://lapeco2019.blogspot.com/p/blog-page_30.html'
    },
  ]
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
        <Container className={classes.headingContainer} maxWidth="md" display='flex' flexDirection='column'>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <WhiteTextTypography className={classes.title} variant='h2'>
                Coastal Analyst System from Space Imagery Engine
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
              <img src="/usage_cassie.gif" alt={t('home.about.title')} className={classes.intro_gif}/>
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
          <Box display='flex' flexDirection='row' alignItems='center' justifyContent='center' >
            <Button variant="outlined" className={classes.spaced_btn} color="primary" href="https://earthengine.google.com/signup/" m='10'>
              {t('home.instructions.btnEngineSingUp')}
            </Button>
            <Button variant="outlined" className={classes.spaced_btn} color="secondary" href="https://earthengine.google.com/signup/">
              {t('home.instructions.btnManual')}
            </Button>
            <Button variant="outlined" className={classes.spaced_btn} color="default" href="https://earthengine.google.com/signup/">
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
                  <Button variant='contained' color="secondary" href="https://earthengine.google.com/signup/">
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
                  <Button variant='contained' color="secondary" href="https://earthengine.google.com/signup/">
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
            {t('home.papers.title')}
          </Typography>
          <Grid container spacing={3} >
          {papers.map(paper => (
              <Grid item xs={12} md={6} lg={4}>
                <Card >
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      {paper.kind}
                    </Typography>
                    
                    <Typography color="primary">
                      {paper.event}
                    </Typography>
                    <Typography variant="body1" component="p">
                      {paper.title}
                    </Typography>
                    <Box marginTop='10px'>
                      <AvatarGroup>
                        {paper.authors.map(author =>(
                          <Link href={author.link} className={classes.avatar_link} target="_blank" rel="noopener">
                            <Tooltip title={author.name}>
                              <Avatar className={classes.small} alt={author.name} src={"/equipe/"+author.img} />
                            </Tooltip>                            
                          </Link>
                          
                        ))}                      
                      </AvatarGroup>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button color="secondary" href={paper.link}>{t('home.papers.more')}</Button>
                  </CardActions>
                </Card>
              </Grid>
              ))}
          </Grid>
          
        </Container>
      </Box>

      <Box className={classes.content} bgcolor='white'>
        <Container maxWidth="md" display='flex' flexDirection='column'>
          <Typography className={classes.title} variant='h3'>
            {t('home.members.title')}
          </Typography>
          <Grid container spacing={3}>
            {authors.map(pesq => (
              <Grid key={pesq.name} item xs={12} md={4} align="center">
                <Link href={pesq.link} target="_blank" rel="noopener">
                  <Badge
                    overlap="circle"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    badgeContent={
                      <Link href={pesq.group.link} className={classes.avatar_link} target="_blank" rel="noopener">
                        <Tooltip title={pesq.group.name}>
                          <SmallAvatar alt={pesq.group.name} src={"/grupos/"+pesq.group.img} />
                        </Tooltip>                            
                      </Link>
                    
                    }
                  >
                    <Avatar alt={pesq.name} src={"/equipe/"+pesq.img}  className={classes.large}/>
                  </Badge>
                </Link>
                
                <Typography variant='h5'>{pesq.name}</Typography>
                <Typography variant='body1'>{pesq.role}</Typography>
              </Grid>
            ))}            
          </Grid>
        </Container>
      </Box>


      <Box className={classes.content}>
        <Container maxWidth="md" display='flex' flexDirection='column'>
          <Grid container  spacing={3} justify="center">
            <Grid item xs={12} md={6} align='center'>
              <Typography className={classes.title} variant='h4' >{t('home.sponsor.realiza')}</Typography>
              <Link href='http://ialab.com.br/' target="_blank" rel="noopener">
                <img src={"/grupos/lia_sm.png"} alt='LIA' className={classes.sponsor_img}/>
              </Link>
              
            </Grid>
            <Grid item xs={12} md={6} align='center'>
              <Typography className={classes.title} variant='h4' >{t('home.sponsor.apoio')}</Typography>
              <Link href='http://cnpq.br/' target="_blank" rel="noopener">
                <img src={"/grupos/cnpq.png"} alt='CNPQ' className={classes.sponsor_img}/>
              </Link>
              <Typography className={classes.spaced_text} variant='body1' >{t('home.sponsor.apoio_desc')}</Typography>
            </Grid>
            <Grid item xs={12}  align='center'>
              <Typography className={classes.title} variant='h4' >{t('home.sponsor.inst')}</Typography>
              <Grid container  spacing={3} justify="center">
                <Grid item xs={12} md={6} align='center'>
                  <Link href='http://redeclima.ccst.inpe.br/' target="_blank" rel="noopener">
                    <img src={"/grupos/rede.png"} alt='Rede Clima' className={classes.sponsor_img_sqr}/>
                  </Link>
                </Grid>
                <Grid item xs={12} md={6} align='center'>
                  <Link href='https://www.icmbio.gov.br/cepsul/' target="_blank" rel="noopener">
                    <img src={"/grupos/cepsul.png"} alt='CEPSUL' className={classes.sponsor_img_sqr}/>
                  </Link>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}  align='center'>
              <Typography className={classes.title} variant='h4' >{t('home.sponsor.partners')}</Typography>
              <Grid container  spacing={3} justify="center">
                <Grid item xs={12} md={3} align='center'>
                  <Link href='https://www.univali.br/Paginas/default.aspx' target="_blank" rel="noopener">
                    <img src={"/grupos/univali.png"} alt='Univali'  className={classes.sponsor_img_partner}/>
                  </Link>
                </Grid>
                <Grid item xs={12} md={3} align='center'>
                  <Link href='https://ufsc.br/' target="_blank" rel="noopener">
                    <img src={"/grupos/ufsc.png"} alt='UFSC' className={classes.sponsor_img_partner}/>
                  </Link>
                </Grid>
                <Grid item xs={12} md={3} align='center'>
                  <Link href='https://www.furg.br/' target="_blank" rel="noopener">
                    <img src={"/grupos/furg.png"} alt='FURG' className={classes.sponsor_img_partner}/>
                  </Link>
                </Grid>
                <Grid item xs={12} md={3} align='center'>
                  <Link href='https://colabatlantic.com/' target="_blank" rel="noopener">
                    <img src={"/grupos/atlantic.png"} alt='CoLAB + Atlantic' className={classes.sponsor_img_partner}/>
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box className={classes.content} bgcolor='black'>
        <Container maxWidth="md" display='flex' flexDirection='column'>
          <Grid container  spacing={3} justify="center">
            <Grid item xs={12} md={6} align='center'>
              
            </Grid>
            
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage