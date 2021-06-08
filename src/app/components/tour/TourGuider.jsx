import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Tour from "reactour";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  tour: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2)
  },
  mask: {
    borderRadius: theme.spacing(2)
  }
}));

export default function TourGuider({steps, isOpen, setIsTourOpen}) {
  const classes = useStyles();
  const [t] = useTranslation();

  return (
    <Tour
        steps={steps}
        isOpen={isOpen}
        onRequestClose={() => setIsTourOpen(false)}
        accentColor='teal'
        className={classes.tour}
        rounded={10}
        badgeContent={(curr, tot) => `${curr} ${t("tour.of")} ${tot}`}
        lastStepNextButton={
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsTourOpen(false)}
          >
            {t("tour.done")}
          </Button>
        }
      />
  );
}
