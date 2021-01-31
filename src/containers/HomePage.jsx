import React from "react";
import { connect } from "react-redux";
import { login } from "../actions/user";
import { Actions as LangActions } from "../store/ducks/language";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LogoIcon from "@material-ui/icons/Language";
import { List, ListItem } from "@material-ui/core";
import { withTheme } from "@material-ui/core/styles";
import googleLogo from "../resources/googleLogo.svg";
import googleLogoDisabled from "../resources/googleLogoDisabled.svg";
import pt from "../resources/i18n/pt.svg";
import en from "../resources/i18n/en.svg";
import { withTranslation } from "react-i18next";

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
  }

  render() {
    const { t, theme, login, changeLanguage, busy } = this.props;

    const styles = {
      backdrop: {
        height: "100vh",
        width: "100vw",
        position: "fixed",
        zIndex: "-1",
        top: 0,
        left: 0,
        backgroundColor: theme.palette.primary.light,
      },
      wrapper: {
        backgroundColor: theme.palette.primary[200],
        padding: "48px",
      },
      heading: {
        padding: "60px 0px",
        backgroundColor: theme.palette.primary.main,
      },
      content: {
        padding: "60px 0px",
      },
      logo: {
        // height: 170,
        fontSize: 120,
        color: "white",
        margin: "0px 0px 20px 0px",
      },
      title: {
        color: "rgba(0, 0, 0, 0.6)",
        fontSize: "7rem",
      },
      subtitle: {
        color: "rgba(0, 0, 0, 0.5)",
      },
      description: {
        margin: "20px 0px 40px 0px",
        color: "rgba(0, 0, 0, 0.85)",
      },
      google: {
        margin: "-4px 20px -4px -20px",
      },
      horizontalList: {
        display: "flex",
        flexDirection: "row",
        padding: 0,
        margin: "0 0 15px 0",
        borderRadius: "5px",
        backgroundColor: "#74c7be",
      },
      listItem: {
        padding: "5",
      },
    };

    const handleLanguageChange = (index, local) => {
      changeLanguage(local)
      this.setState({ selectedIndex: index })
    }

    return (
      <div>
        <div style={styles.backdrop}></div>
        <div
          className="presentation-heading vcenter flow-column"
          style={styles.heading}
        >
          <LogoIcon style={styles.logo} />
          <Typography variant="h1" style={styles.title}>
            C.A.S.S.I.E.
          </Typography>
          <Typography variant="h5" style={styles.subtitle}>
            Coastal Analysis System via Satellite Imagery Engine
          </Typography>
        </div>
        <div className="presentation-content" style={styles.content}>
          <Grid container justify="center" spacing={0}>
            <Grid
              item
              xs={10}
              md={6}
              className="vcenter flow-column"
              style={styles.wrapper}
            >
              <List style={styles.horizontalList}>
                <ListItem
                  onClick={() => {
                    handleLanguageChange(0, "pt-BR");
                  }}
                  style={styles.listItem}
                >
                  <Button>
                    <img
                      src={pt}
                      alt=""
                      style={{ margin: "0 10px 0 0", maxHeight: "25px" }}
                    />
                    Português
                  </Button>
                </ListItem>
                <ListItem
                  onClick={() => {
                    handleLanguageChange(1, "en-US");
                  }}
                  style={styles.listItem}
                >
                  <Button>
                    <img
                      src={en}
                      alt=""
                      style={{ margin: "0 10px 0 0", maxHeight: "25px" }}
                    />
                    English
                  </Button>
                </ListItem>
              </List>
              <Typography
                variant="body1"
                align="center"
                style={styles.description}
              >
                {t("self.abstract")}
              </Typography>
              <Button
                onClick={() => login("/main/acquisition")}
                disabled={busy}
                variant="contained"
                size="large"
              >
                <img
                  src={busy ? googleLogoDisabled : googleLogo}
                  style={styles.google}
                  alt="Google"
                />
                {t("auth.signin")}
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

const Themed = withTheme(withTranslation()(HomePage));

export default connect(
  (state) => ({
    busy: state.user.authenticating,
  }),
  { login, changeLanguage: LangActions.setLang }
)(Themed);
