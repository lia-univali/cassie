import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  Container,
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import HomePageLayout from "../../components/homepage/HomePageLayout";

const useStyles = makeStyles((theme) => ({
  heading: {
    backgroundColor: theme.palette.primary.main,
    background: "url(/bg.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  },
  headingContainer: {
    paddingBottom: "5vh",
    paddingTop: "15vh",
  },
  content: {
    padding: "60px 0px",
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
  modaltitle: {
    paddingBottom: theme.spacing(2),
  },
  accordiontitle: {
    backgroundColor: theme.palette.background.paper,
    // backgroundColor: theme.palette.grey[200],
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  accordioncontent: {
    backgroundColor: theme.palette.grey[200],
    // backgroundColor: theme.palette.primary[100],
  },
  desc: {
    marginBottom: theme.spacing(2),
  },
}));

const WhiteTextTypography = withStyles({
  root: {
    color: "#FFFFFF",
  },
})(Typography);

const ProblemsPage = () => {
  const [t] = useTranslation();
  const classes = useStyles();
  const problems = [
    {
      title: t("problems.0.title"),
      text: t("problems.0.text", { interpolation: { escapeValue: false } }),
    },
  ];

  return (
    <HomePageLayout>
      <Box className={classes.heading}>
        <Container
          className={classes.headingContainer}
          maxWidth="md"
          display="flex"
          flexDirection="column"
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <WhiteTextTypography className={classes.title} variant="h2">
                {t("problems.title")}
              </WhiteTextTypography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box className={classes.content}>
        <Container maxWidth="md" display="flex" flexDirection="column">
          <Typography className={classes.desc} variant="body1">
            {t("problems.text")}
          </Typography>
          <div>
            {problems.map((f, i) => (
              <Accordion key={i}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className={classes.accordiontitle}
                >
                  <Typography variant="subtitle2">{f.title}</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordioncontent}>
                  <Typography
                    variant="body1"
                    dangerouslySetInnerHTML={{ __html: f.text }}
                  ></Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </Container>
      </Box>
    </HomePageLayout>
  );
};

export default ProblemsPage;
