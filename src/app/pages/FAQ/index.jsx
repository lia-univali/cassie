import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Actions as AuthActions } from "../../../store/ducks/auth";
import { Actions as LangActions } from "../../../store/ducks/i18n";
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
}));

const WhiteTextTypography = withStyles({
  root: {
    color: "#FFFFFF",
  },
})(Typography);

const HomePage = () => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const classes = useStyles();

  useEffect(() => {
    dispatch(AuthActions.loadClientAuth());
  }, []);

  const handleLanguageChange = (local) => {
    dispatch(LangActions.setLang(local));
  };
  const faq = [
    {
      title: t("faq.0.title"),
      text: t("faq.0.text", { interpolation: { escapeValue: false } }),
    },
    {
      title: t("faq.1.title"),
      text: t("faq.1.text", { interpolation: { escapeValue: false } }),
    },
    {
      title: t("faq.2.title"),
      text: t("faq.2.text", { interpolation: { escapeValue: false } }),
    },
    {
      title: t("faq.3.title"),
      text: t("faq.3.text", { interpolation: { escapeValue: false } }),
    },
    {
      title: t("faq.4.title"),
      text: t("faq.4.text", { interpolation: { escapeValue: false } }),
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
                {t("faq.title")}
              </WhiteTextTypography>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box className={classes.content}>
        <Container maxWidth="md" display="flex" flexDirection="column">
          <div className={classes.modalcontent}>
            {faq.map((f, i) => (
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

export default HomePage;
