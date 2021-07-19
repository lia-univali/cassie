import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { useTranslation } from "react-i18next";
import { Actions as AuthActions } from "../../../store/ducks/auth";
import {
  Container,
  Avatar,
  Snackbar,
  Box,
  Button,
  Grid,
  Tooltip,
  Typography,
  Link,
  Badge,
  Card,
  CardContent,
  CardActions,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import googleLogo from "../../../resources/googleLogo.svg";
import googleLogoDisabled from "../../../resources/googleLogoDisabled.svg";
import Slide from "@material-ui/core/Slide";
import HomePageLayout from "../../components/homepage/HomePageLayout";
import { useLocalStorage } from "../../../common/utils";

// useStyles is a hook for Material-UI's styling.
const useStyles = makeStyles((theme) => ({
  backdrop: {
    height: "100vh",
    width: "100vw",
    position: "fixed",
    zIndex: "-1",
    top: 0,
    left: 0,
    backgroundColor: theme.palette.primary.light,
  },
  heading: {
    backgroundColor: theme.palette.primary.main,
    background: "url(/bg.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "75vh",
  },
  bay: {
    padding: "60px 0px",
    background: "url(/bay.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  risc: {
    padding: "60px 0px",
    background: "url(/port.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  headingContainer: {
    paddingBottom: "10vh",
    paddingTop: "15vh",
  },
  content: {
    padding: "60px 0px",
  },
  fullW: {
    with: "100%",
  },
  flex: {
    display: "flex",
  },
  logo: {
    fontSize: 120,
    color: "white",
    margin: "0px 0px 20px 0px",
  },
  title: {
    fontWeight: "600",
    marginBottom: theme.spacing(5),
  },
  subtitle: {
    fontSize: "1.5rem",
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    flexFlow: "column",
    backgroundColor: theme.palette.primary[200],
    padding: "40px 48px",
  },
  i18nSwitchers: {
    textAlign: "right",
    backgroundColor: "white",
  },
  i18nSwitch: {
    padding: "5px 10px",
    margin: "0 10px",
  },
  flag: {
    marginRight: "5px",
    height: "25px",
    width: "25px",
  },
  description: {
    margin: "30px 0px 40px 0px",
    color: "rgba(0, 0, 0, 0.85)",
  },
  google: {
    margin: "-4px 20px -4px -15px",
  },
  intro_gif: {
    maxWidth: "100%",
  },
  spaced_text: {
    marginBottom: theme.spacing(4),
  },
  bay_text: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(5),
    borderRadius: theme.spacing(1),
  },
  spaced_btn: {
    marginRight: "16px",
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
    maxWidth: "100%",
    marginBottom: theme.spacing(2),
  },
  sponsor_img_sqr: {
    height: theme.spacing(13),
    maxWidth: "100%",
    marginBottom: theme.spacing(2),
  },
  sponsor_img_partner: {
    height: theme.spacing(10),
    maxWidth: "100%",
    marginBottom: theme.spacing(2),
  },
  avatar_link: {
    border: "none",
  },
  snack: {
    maxWidth: "75%",
  },
  cpnq_logo: {
    maxWidth: "150px",
  },
}));

// Create a custom Typography component.
const WhiteTextTypography = withStyles({
  root: {
    color: "#FFFFFF",
  },
})(Typography);

// Create a custom Avatar component.
const SmallAvatar = withStyles((theme) => ({
  root: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.divider}`,
    borderRadius: ".75rem",
  },
}))(Avatar);

// Create a transition component.
function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}

// main function
function HomePage() {
  // check if the authentication is busy
  const busy = useSelector((state) => state.auth.authenticating);
  const dispatch = useDispatch();
  // use i18n
  const [t] = useTranslation();
  // use custom styles
  const classes = useStyles();

  // create an array for the different groups
  const groupsData = {
    loc: {
      name: "LOC UFSC",
      img: "loc.png",
      link: "https://loc.ufsc.br/",
    },
    lia: {
      name: "LIA Univali",
      img: "lia.png",
      link: "http://ialab.com.br/",
    },
    atlantic: {
      name: "CoLAB + Atlantic",
      img: "atlantic.png",
      link: "https://colabatlantic.com/",
    },
  };

  // create an array for the different authors
  const authorsData = {
    klein: {
      name: "Antonio H.F. Klein",
      img: "klein.jpg",
      group: groupsData.loc,
      role: t("home.members.roles.researcher"),
      link: "http://lattes.cnpq.br/2354029280846247",
    },
    rudimar: {
      name: "Rudimar L.S. Dazzi",
      img: "rudimar.jpg",
      group: groupsData.lia,
      mail: "rudimar@univali.br",
      role: t("home.members.roles.coord"),
      link: "http://lattes.cnpq.br/9340343036686762",
    },
    lyra: {
      name: "Rodrigo Lyra",
      img: "rodrigo.jpg",
      group: groupsData.lia,
      mail: "rlyra@univali.br",
      role: t("home.members.roles.coord"),
      link: "http://lattes.cnpq.br/0117343254850007",
    },
    sofia: {
      name: "Sofia Aguiar",
      img: "sofia.png",
      group: groupsData.atlantic,
      role: t("home.members.roles.researcher"),
      link: "https://www.behance.net/sofiaaguia8215",
    },
    pedro: {
      name: "Luis Pedro Almeida",
      img: "pedro.png",
      group: groupsData.atlantic,
      role: t("home.members.roles.researcher"),
      link: "http://lattes.cnpq.br/4892957787322492",
    },
    israel: {
      name: "Israel Efraim de Oliveira",
      img: "israel.png",
      group: groupsData.lia,
      mail: "israel.oliveira@edu.univali.br",
      role: t("home.members.roles.atp"),
      link: "https://github.com/IsraelEfraim",
    },
    alisson: {
      name: "Alisson Steffens",
      img: "alisson.jpeg",
      group: groupsData.lia,
      mail: "ali.steffens@gmail.com",
      role: t("home.members.roles.capes"),
      link: "https://alissonsteffens.com",
    },
    vinicius: {
      name: "Vinícius Gabriel Martins",
      img: "vinicius.png",
      group: groupsData.lia,
      role: t("home.members.roles.fumdes"),
      link: "https://github.com/vinigmartins",
    },
    fernando: {
      name: "Fernando Concatto",
      img: "fernando.jfif",
      group: groupsData.lia,
      role: t("home.members.roles.fumdes"),
      link: "https://github.com/concatto",
    },
  };

  // create an array with active members
  const authors = [
    authorsData.klein,
    authorsData.rudimar,
    authorsData.lyra,
    authorsData.pedro,
    authorsData.alisson,
    authorsData.sofia,
  ];

  // create an array with published papers
  const papers = [
    {
      kind: t("home.papers.paper_text"),
      title:
        "Coastal Analyst System from Space Imagery Engine (CASSIE): Shoreline management module",
      event: "Environmental Modelling & Software 2021",
      authors: [
        authorsData.pedro,
        authorsData.israel,
        authorsData.lyra,
        authorsData.rudimar,
        authorsData.vinicius,
        authorsData.klein,
      ],
      link: "https://www.sciencedirect.com/science/article/abs/pii/S1364815221000761",
    },
    {
      kind: t("home.papers.resumo_text"),
      title:
        "e-C.A.S.S.I.E.: Uma Ferramenta para Análise e Mapeamento de Regiões Costeiras Utilizando a Plataforma Google Earth Engine",
      event: "II SBPA & XI ENCOGERCO 2018",
      authors: [
        authorsData.fernando,
        authorsData.pedro,
        authorsData.lyra,
        authorsData.rudimar,
        authorsData.klein,
      ],
      link: "http://www.praiaegestao.com.br/theme/images/ANAISSBPAEENCOGERCO_2018.pdf#page=252",
    },
    {
      kind: t("home.papers.resumo_text"),
      title:
        "Desenvolvimento de uma Ferramenta Integrada ao Google Earth Engine para a Análise de Ambientes Costeiros",
      event: "Computer on the Beach 2018",
      authors: [
        authorsData.fernando,
        authorsData.pedro,
        authorsData.lyra,
        authorsData.rudimar,
        authorsData.klein,
      ],
      link: "https://siaiap32.univali.br/seer/index.php/acotb/article/view/12871",
    },
    {
      kind: t("home.papers.curso_text"),
      title:
        "Determinação e análise da evolução da linha de costa com ferramenta do Google Earth Engine (e-CASSIE)",
      event: "LAPECO 2019",
      authors: [authorsData.pedro, authorsData.lyra, authorsData.israel],
      link: "http://lapeco2019.blogspot.com/p/blog-page_30.html",
    },
  ];

  // dispatch Authentication action with useEffect
  useEffect(() => {
    dispatch(AuthActions.loadClientAuth());
  }, []);

  // create devAdvOpen state
  const [devAdvOpen, setDevAdvOpen] = React.useState(true);

  // create cookiesAdvOpen state
  const [cookiesAdvOpen, setCookiesAdvOpen] = useLocalStorage(
    "showNewCookiesADV",
    true
  );

  // function to handle devAdvClose event (from devAdvOpen) deppendin on the reason
  const handleDevAdvClose = (reason) => {
    // if the reason isn't "clickaway" we close the devAdv
    if (reason !== "clickaway") {
      setDevAdvOpen(false);
    }
  };

  // function to handle cookiesAccept event (from cookiesAdvOpen) deppendin on the reason
  const handleCookiesAccept = (reason) => {
    // if the reason isn't "clickaway" we close the cookiesAdv and post the cookiesAccept event to the API
    if (reason !== "clickaway") {
      setCookiesAdvOpen(false);
      postAcceptingToAPI();
    }
  };

  // function that send a POST request to the API to accept cookies
  const postAcceptingToAPI = () => {
    fetch("https://cassie-api.vercel.app/api/cookies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        read: true,
      }),
    })
      .then((response) => {
        // if we get a bad response we show the error
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
      })
      .catch((error) => console.error("Error: ", error));
  };

  return (
    <HomePageLayout>
      <Box className={classes.heading}>
        <Container
          className={classes.headingContainer}
          maxWidth="md"
          display="flex"
          flexdirection="column"
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <WhiteTextTypography className={classes.title} variant="h2">
                {t("self.fullTitle")}
              </WhiteTextTypography>
            </Grid>
            <Grid item xs={12} md={8}>
              <WhiteTextTypography className={classes.subtitle} variant="body1">
                {t("self.shortDesc")}
              </WhiteTextTypography>
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={busy}
                variant="contained"
                size="large"
                color="primary"
                className={classes.spaced_btn}
                // start Authentication proccess when the button is clicked
                onClick={() =>
                  dispatch(
                    AuthActions.begin(() => dispatch(push("/main/acquisition")))
                  )
                }
              >
                <Avatar
                  className={classes.google}
                  variant="square"
                  alt="Google Logo"
                  // we use the Google logo as the avatar
                  // the avatar is disabled when the Auth process is in progress
                  src={busy ? googleLogoDisabled : googleLogo}
                />
                {t("auth.signin")}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box className={classes.content}>
        <Container maxWidth="md" display="flex" flexdirection="column">
          <Typography className={classes.title} variant="h3" align="center">
            {t("home.about.title")}
          </Typography>
          <Grid container spacing={3} justify="center" alignItems="center">
            <Grid item xs={12} md={6}>
              <img
                src="/usage_cassie.gif"
                alt={t("home.about.title")}
                className={classes.intro_gif}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">{t("self.abstract")}</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box className={classes.content} bgcolor="white">
        <Container maxWidth="md" display="flex" flexdirection="column">
          <Typography className={classes.title} variant="h3">
            {t("home.instructions.title")}
          </Typography>
          <Grid container p={5} justify="center" alignItems="center">
            <Grid item xs={12}>
              <Typography variant="body1" className={classes.spaced_text}>
                {t("home.instructions.text")}
              </Typography>
            </Grid>
          </Grid>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Button
              variant="outlined"
              className={classes.spaced_btn}
              color="primary"
              href="https://earthengine.google.com/signup/"
              m="10"
            >
              {t("home.instructions.btnEngineSingUp")}
            </Button>
            <Button
              variant="outlined"
              className={classes.spaced_btn}
              color="secondary"
              href={t("home.instructions.linkManual")}
            >
              {t("home.instructions.btnManual")}
            </Button>
            <Button
              variant="outlined"
              className={classes.spaced_btn}
              color="default"
              href={t("home.instructions.linkVideo")}
            >
              {t("home.instructions.btnVideo")}
            </Button>
          </Box>
        </Container>
      </Box>
      <Box className={classes.bay}>
        <Container maxWidth="md" display="flex" flexdirection="column">
          <Grid container spacing={3} justify="center" alignItems="center">
            <Grid item xs={12} md={6}>
              {" "}
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className={classes.bay_text}>
                <img
                  src="/squeeze.png"
                  alt={t("home.baysqueeze.title")}
                  className={classes.cpnq_logo}
                />
                <Typography className={classes.title} variant="h3">
                  {t("home.baysqueeze.title")}
                </Typography>
                <Typography variant="body1" className={classes.spaced_text}>
                  {t("home.baysqueeze.text")}
                </Typography>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="primary"
                    href="https://baysqueeze.paginas.ufsc.br"
                    target="_blank"
                  >
                    {t("home.baysqueeze.btn")}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box className={classes.risc}>
        <Container maxWidth="md" display="flex" flexdirection="column">
          <Grid container spacing={3} justify="center" alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className={classes.bay_text}>
                <img
                  src="/risk.png"
                  alt={t("home.riscport.title")}
                  className={classes.cpnq_logo}
                />
                <Typography className={classes.title} variant="h3" align="left">
                  {t("home.riscport.title")}
                </Typography>
                <Typography
                  variant="body1"
                  className={classes.spaced_text}
                  align="left"
                >
                  {t("home.riscport.text")}
                </Typography>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="secondary"
                    href="https://riskports.ufsc.br/"
                    target="_blank"
                  >
                    {t("home.riscport.btn")}
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              {" "}
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box className={classes.content}>
        <Container maxWidth="md" display="flex" flexdirection="column">
          <Typography className={classes.title} variant="h3">
            {t("home.papers.title")}
          </Typography>
          <Grid container spacing={3} alignContent="stretch">
            {papers.map((paper, k) => (
              <Grid
                container
                item
                key={k}
                xs={12}
                md={6}
                lg={4}
                className={classes.flex}
              >
                <Card className={classes.fullW}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      {paper.kind}
                    </Typography>

                    <Typography variant="body2" color="primary">
                      {paper.event}
                    </Typography>
                    <Typography variant="body1" component="p">
                      {paper.title}
                    </Typography>
                    <Box marginTop="10px">
                      <AvatarGroup max={10}>
                        {
                          // map authors to avatars
                          paper.authors.map((author, k) => (
                            <Link
                              key={k}
                              href={author.link}
                              className={classes.avatar_link}
                              target="_blank"
                              rel="noopener"
                            >
                              <Tooltip title={author.name}>
                                <Avatar
                                  className={classes.small}
                                  alt={author.name}
                                  src={"/equipe/" + author.img}
                                />
                              </Tooltip>
                            </Link>
                          ))
                        }
                      </AvatarGroup>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button color="secondary" href={paper.link}>
                      {t("home.papers.more")}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Box className={classes.content} bgcolor="white">
        <Container maxWidth="md" display="flex" flexdirection="column">
          <Typography className={classes.title} variant="h3">
            {t("home.members.title")}
          </Typography>
          <Grid container spacing={3}>
            {authors.map((pesq) => (
              <Grid key={pesq.name} item xs={12} md={4} align="center">
                <Link href={pesq.link} target="_blank" rel="noopener">
                  <Badge
                    overlap="circle"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    badgeContent={
                      <Box
                        // href={pesq.group.link}
                        className={classes.avatar_link}
                        target="_blank"
                        rel="noopener"
                      >
                        <Tooltip title={pesq.group.name}>
                          <SmallAvatar
                            alt={pesq.group.name}
                            src={"/grupos/" + pesq.group.img}
                          />
                        </Tooltip>
                      </Box>
                    }
                  >
                    <Avatar
                      alt={pesq.name}
                      src={"/equipe/" + pesq.img}
                      className={classes.large}
                    />
                  </Badge>
                </Link>

                <Typography variant="h5">{pesq.name}</Typography>
                <Typography variant="body1">{pesq.role}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Box className={classes.content}>
        <Container maxWidth="md" display="flex" flexdirection="column">
          <Grid container spacing={3} justify="center">
            <Grid item xs={12} md={6} align="center">
              <Typography className={classes.title} variant="h4">
                {t("home.sponsor.realiza")}
              </Typography>
              <Link href="http://ialab.com.br/" target="_blank" rel="noopener">
                <img
                  src={"/grupos/lia_sm.png"}
                  alt="LIA"
                  className={classes.sponsor_img}
                />
              </Link>
            </Grid>
            <Grid item xs={12} md={6} align="center">
              <Typography className={classes.title} variant="h4">
                {t("home.sponsor.apoio")}
              </Typography>
              <Link href="http://cnpq.br/" target="_blank" rel="noopener">
                <img
                  src={"/grupos/cnpq.png"}
                  alt="CNPQ"
                  className={classes.sponsor_img}
                />
              </Link>
              <Typography className={classes.spaced_text} variant="body1">
                {t("home.sponsor.apoio_desc")}
              </Typography>
            </Grid>
            <Grid item xs={12} align="center">
              <Typography className={classes.title} variant="h4">
                {t("home.sponsor.inst")}
              </Typography>
              <Grid container spacing={3} justify="center">
                <Grid item xs={12} md={6} align="center">
                  <Link
                    href="http://redeclima.ccst.inpe.br/"
                    target="_blank"
                    rel="noopener"
                  >
                    <img
                      src={"/grupos/rede.png"}
                      alt="Rede Clima"
                      className={classes.sponsor_img_sqr}
                    />
                  </Link>
                </Grid>
                <Grid item xs={12} md={6} align="center">
                  <Link
                    href="https://www.icmbio.gov.br/cepsul/"
                    target="_blank"
                    rel="noopener"
                  >
                    <img
                      src={"/grupos/cepsul.png"}
                      alt="CEPSUL"
                      className={classes.sponsor_img_sqr}
                    />
                  </Link>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} align="center">
              <Typography className={classes.title} variant="h4">
                {t("home.sponsor.partners")}
              </Typography>
              <Grid container spacing={3} justify="center">
                <Grid item xs={12} md={3} align="center">
                  <Link
                    href="https://www.univali.br/Paginas/default.aspx"
                    target="_blank"
                    rel="noopener"
                  >
                    <img
                      src={"/grupos/univali.png"}
                      alt="Univali"
                      className={classes.sponsor_img_partner}
                    />
                  </Link>
                </Grid>
                <Grid item xs={12} md={3} align="center">
                  <Link href="https://ufsc.br/" target="_blank" rel="noopener">
                    <img
                      src={"/grupos/ufsc.png"}
                      alt="UFSC"
                      className={classes.sponsor_img_partner}
                    />
                  </Link>
                </Grid>
                <Grid item xs={12} md={3} align="center">
                  <Link
                    href="https://www.furg.br/"
                    target="_blank"
                    rel="noopener"
                  >
                    <img
                      src={"/grupos/furg.png"}
                      alt="FURG"
                      className={classes.sponsor_img_partner}
                    />
                  </Link>
                </Grid>
                <Grid item xs={12} md={3} align="center">
                  <Link
                    href="https://colabatlantic.com/"
                    target="_blank"
                    rel="noopener"
                  >
                    <img
                      src={"/grupos/atlantic.png"}
                      alt="CoLAB + Atlantic"
                      className={classes.sponsor_img_partner}
                    />
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        className={classes.snack}
        open={devAdvOpen}
        autoHideDuration={20000}
        onClose={handleDevAdvClose}
        TransitionComponent={TransitionLeft}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleDevAdvClose}
          severity="warning"
        >
          {t("home.warning.text")}{" "}
          <Link color="textPrimary" href="/problems">
            {t("home.warning.link")}
          </Link>
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        className={classes.snack}
        open={cookiesAdvOpen}
        onClose={handleCookiesAccept}
        message={t("home.cookies.text")}
        action={
          <React.Fragment>
            <Button
              color="secondary"
              size="small"
              onClick={handleCookiesAccept}
            >
              {t("home.cookies.link")}
            </Button>
          </React.Fragment>
        }
      ></Snackbar>
    </HomePageLayout>
  );
}

export default HomePage;
