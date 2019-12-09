import React from 'react';
import { connect } from 'react-redux';
import { login } from '../actions/user';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import LogoIcon from '@material-ui/icons/Language';
import { withTheme } from '@material-ui/core/styles';
import logo from '../resources/logo.png';
import googleLogo from '../resources/googleLogo.svg';
import googleLogoDisabled from '../resources/googleLogoDisabled.svg';

class HomePage extends React.Component {
  render() {
    const { theme, login, busy } = this.props;
    const styles = {
      backdrop: {
        height: "100vh",
        width: "100vw",
        position: "fixed",
        zIndex: "-1",
        top: 0,
        left: 0,
        backgroundColor: theme.palette.primary.light
      },
      wrapper: {
        backgroundColor: theme.palette.primary[200],
        padding: "48px",
      },
      heading: {
        padding: "60px 0px",
        backgroundColor: theme.palette.primary.main
      },
      content: {
        padding: "60px 0px",
      },
      logo: {
        // height: 170,
        fontSize: 120,
        color: "white",
        margin: "0px 0px 20px 0px"
      },
      title: {
        color: "rgba(0, 0, 0, 0.6)",
      },
      subtitle: {
        color: "rgba(0, 0, 0, 0.5)",
      },
      description: {
        margin: "0px 0px 40px 0px",
        color: "rgba(0, 0, 0, 0.85)",
      },
      google: {
        margin: "-4px 20px -4px -20px",
      }
    };

    return (
      <div>
        <div style={styles.backdrop}></div>
        <div className="presentation-heading vcenter flow-column" style={styles.heading}>
          <LogoIcon style={styles.logo} />
          <Typography variant="display4" style={styles.title}>
            C.A.S.S.I.E.
          </Typography>
          <Typography variant="headline" style={styles.subtitle}>
            Coastal Analysis via Satellite Imagery Engine
          </Typography>
        </div>
        <div className="presentation-content" style={styles.content}>
          <Grid container justify="center" spacing={0}>
            <Grid item xs={10} md={6} className="vcenter flow-column" style={styles.wrapper}>
              <Typography variant="subheading" align="center" style={styles.description}>
                Uma ferramenta integrada à plataforma Google Earth Engine capaz de
                oferecer, de maneira acessível, acesso direto a dados públicos de
                satélites internacionais, contando com sofisticadas capacidades de
                análise de ocupação do solo tanto no domínio espacial quanto temporal.
                Produzida para atender às necessidades de cientistas, gestores e
                estudantes, com foco na conservação dos recursos naturais do planeta Terra.
              </Typography>
              <Button onClick={() => login("/main/acquisition")} disabled={busy} variant="raised" size="large">
                <img src={busy ? googleLogoDisabled : googleLogo} style={styles.google} alt="Google" />
                Entrar com o Google
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

const Themed = withTheme()(HomePage);

export default connect(state => ({
  busy: state.user.authenticating
}), { login })(Themed);
