import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Container, Modal,  Tooltip, Box,  Grid, Typography, Link} from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
const useStyles = makeStyles((theme) => ({
    copy: {
        backgroundColor: theme.palette.grey[900],
        padding: theme.spacing(1)
    },
    lia_footer:{
        maxWidth: theme.spacing(3),
        marginLeft: theme.spacing(1),
        display: 'inline-block',
    },
    text_footer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer_ass_link: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    content: {
      padding: '60px 0px',
    },
    ul: {
      color: theme.palette.background.paper,
      paddingInlineStart: theme.spacing(3),
      marginTop: 0,
    },
    icon: {
      padding: theme.spacing(1)
    },
    
}));

const WhiteTextTypography = withStyles({
  root: {
    color: "#FFFFFF",
    display:'block',
  },
  
})(Typography);

const MutedTextTypography = withStyles({
  root: {
    color: '#888',
    display:'block',
  },
  
})(Typography);

export default function Footer(managers, techs) {
  const classes = useStyles();
  const [t] = useTranslation();

  

  const body = (
    <div className={classes.paper}>
      
      
    </div>
  );
  return (
    <Box bgcolor='black'>
      <Container className={classes.content} maxWidth="md" display='flex' flexDirection='column'>
        <Grid container  spacing={1} justify="center">
          <Grid item xs={12} md={3}>
            <Link color="inherit" href="/" >
              <Typography variant="h6" color="secondary">
                {t('self.title')}
              </Typography>
            </Link>
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <Typography variant="h6" color="primary">
                  {t('home.footer.contact.title')}
                </Typography>
                <MutedTextTypography variant="subtitle2">{t('home.footer.contact.manage')}</MutedTextTypography>
                <ul className={classes.ul}>
                  <li>
                    <WhiteTextTypography variant="overline">
                      <Link color="inherit" href={'mailto:rudimar@univali.br'}>Rudimar L.S. Dazzi</Link>
                    </WhiteTextTypography>
                  </li>
                  <li>
                    <WhiteTextTypography variant="overline">
                      <Link color="inherit" href={'mailto:rlyra@univali.br'}>Rodrigo Lyra</Link>
                    </WhiteTextTypography>
                  </li>
                  
                </ul>
                
                
                <MutedTextTypography variant="subtitle2">{t('home.footer.contact.techquest')}</MutedTextTypography>
                <ul className={classes.ul}>
                  <li>
                    <WhiteTextTypography variant="overline">
                      <Link color="inherit" href={'mailto:israel.oliveira@edu.univali.br'}>Israel Efraim de Oliveira</Link>
                    </WhiteTextTypography>
                  </li>
                </ul>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography variant="h6" color="primary">
                {t('home.footer.resources.title')}
                </Typography>
                <WhiteTextTypography variant="overline"><Link color="inherit" href="/faq" >{t('home.footer.resources.faq')}</Link></WhiteTextTypography>
                
                <WhiteTextTypography variant="overline"><Link target="_blank" rel="noopener" color="inherit" href="https://github.com/lia-univali/cassie">{t('home.footer.resources.code')}</Link></WhiteTextTypography>
              </Grid>
              <Grid item xs={12} md={2} align="right">
                <Link href="https://twitter.com/cassiengine" className={classes.icon}>
                  <Tooltip title="Twitter">
                    <TwitterIcon color="secondary"/>
                  </Tooltip>
                </Link>
                <Link href="https://github.com/lia-univali/cassie" className={classes.icon}>
                  <Tooltip title="GitHub">
                    <GitHubIcon color="secondary"/>
                  </Tooltip>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Grid container justify="center" className={classes.copy}>
        <Grid item xs={12} md={12} align="center">
          <Typography variant="body2" color="secondary" className={classes.text_footer}>
          coded at
          <a href="https://github.com/lia-univali" target="_blank">
          <img src={"/grupos/lia_smw.png"} className={classes.lia_footer}
          /></a>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}