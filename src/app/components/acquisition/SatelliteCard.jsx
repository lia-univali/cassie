import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import { Card, CardActions, CardContent, CardMedia } from "@material-ui/core";

// useStyles is the hook to Material-UI's style.
const useStyles = makeStyles((theme) => ({
  image: {
    height: 200,
    backgroundPosition: "center",
  },
  description: {
    paddingTop: theme.spacing(1),
  },
  card: {
    marginBottom: theme.spacing(1),
  },
}));

// custom Typography component
const SummaryDataField = ({ title, value, unit }) => {
  return (
    <Typography variant="body1" color="textSecondary" component="p">
      <b>{title}: </b>
      {value} {unit}
    </Typography>
  );
};

// this is a custom component for the acquisition form
// it is a card with the satellite data and a button to choose the satellite
const SatelliteCard = ({
  name,
  image,
  resolution,
  startYear,
  endYear,
  provider,
  cycle,
  onChoose,
  enabled,
}) => {
  // use the translation function from react-i18next
  const [t] = useTranslation();
  // use the styles from the useStyles hook
  const classes = useStyles();
  // the date the satellite stopped working or today
  const endYearOrNow = endYear || new Date().getFullYear();

  return (
    <Card className={classes.card}>
      <CardMedia className={classes.image} image={image} title={name} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {name}
        </Typography>
        <div id={name + "_props"}>
          <SummaryDataField
            title={t("forms.acquisition.1.card.opticalResolution")}
            value={resolution}
            unit={t("forms.acquisition.1.card.opticalResolutionUnit")}
          />
          <SummaryDataField
            title={t("forms.acquisition.1.card.activityPeriod")}
            value={startYear + "-" + endYearOrNow}
          />
          <SummaryDataField
            title={t("forms.acquisition.1.card.provider")}
            value={provider}
          />
          <SummaryDataField
            title={t("forms.acquisition.1.card.revisitTime")}
            value={cycle}
            unit={t("forms.acquisition.1.card.revisitTimeUnit")}
          />
        </div>
      </CardContent>
      <CardActions>
        <Button color="primary" onClick={onChoose} disabled={!enabled}>
          {t("forms.acquisition.1.card.choose")}
        </Button>
      </CardActions>
    </Card>
  );
};

export default SatelliteCard;
