import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Container, Modal, Tooltip, Box, Grid, Typography, Link } from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
const useStyles = makeStyles((theme) => ({
  copy: {
    backgroundColor: "#000",
    padding: theme.spacing(1)
  },
  footer: {
    backgroundColor: theme.palette.grey[900],
  },
  lia_footer: {
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
    display: 'block',
  },

})(Typography);

const MutedTextTypography = withStyles({
  root: {
    color: '#888',
    display: 'block',
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
    <Box className={classes.footer}>
      <Container className={classes.content} maxWidth="md" display='flex' flexDirection='column'>
        <Grid container spacing={1} justify="center">
          <Grid item xs={12} md={3}>
            <Grid container spacing={1} justify="center">
              <Grid item xs={12}>
                <Link color="inherit" href="/" >
                  <WhiteTextTypography variant="h6">
                    {t('self.title')}
                  </WhiteTextTypography>
                </Link>
              </Grid>
              <Grid item xs={12}>

              </Grid>
              <Grid item xs={12} >
                <MutedTextTypography variant="subtitle2">
                  {t('home.footer.social')}
                </MutedTextTypography>
                <Link href="https://twitter.com/cassiengine" className={classes.icon}>
                  <Tooltip title="Twitter">
                    <TwitterIcon color="secondary" />
                  </Tooltip>
                </Link>
                <Link href="https://github.com/lia-univali/cassie" className={classes.icon}>
                  <Tooltip title="GitHub">
                    <GitHubIcon color="secondary" />
                  </Tooltip>
                </Link>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" color="primary">
                  {t('home.footer.help.title')}
                </Typography>
                <WhiteTextTypography variant="overline"><Link color="inherit" href="/faq" >{t('home.footer.help.faq')}</Link></WhiteTextTypography>
                <WhiteTextTypography variant="overline"><Link color="inherit" href="/problems" >{t('home.footer.help.problems')}</Link></WhiteTextTypography>

              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="h6" color="primary">
                  {t('home.footer.contact.title')}
                </Typography>
                <WhiteTextTypography variant="overline"><Link color="inherit" href={'mailto:rudimar@univali.br'} >{t('home.footer.contact.manage')}</Link></WhiteTextTypography>
                <WhiteTextTypography variant="overline"><Link color="inherit" href={'mailto:israel.oliveira@edu.univali.br'} >{t('home.footer.contact.techquest')}</Link></WhiteTextTypography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" color="primary">
                  {t('home.footer.resources.title')}
                </Typography>
                <WhiteTextTypography variant="overline"><Link target="_blank" rel="noopener" color="inherit" href="https://github.com/lia-univali/cassie">{t('home.footer.resources.code')}</Link></WhiteTextTypography>
              </Grid>
              
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Grid container justify="center" className={classes.copy}>
        <Grid item xs={12} md={12} align="center">
          <WhiteTextTypography variant="body2">
            {t('home.footer.copyright')}
            <a href="https://github.com/lia-univali" target="_blank">
              <img src={"/grupos/lia_smw.png"} className={classes.lia_footer}
              /></a>
          </WhiteTextTypography>
        </Grid>
      </Grid>
    </Box>
  );
}