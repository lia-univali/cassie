import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import ActionList from "./ActionList";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginBottom: 0,
    marginLeft: 12,
  },
  item: {
    margin: 0,
    padding: 0,
  },
  chip: {
    marginLeft: theme.spacing(1),
  },
}));

const ActionsCard = ({ className }) => {
  const availableDates = useSelector(
    (state) => state.acquisition.availableDates
  );
  const classes = useStyles();
  const [t] = useTranslation();

  return availableDates === undefined ? null : (
    <Card className={className} style={{ margin: 12 }}>
      <CardHeader title={t("forms.imageChooser.actions.title")} />
      <Divider />
      <CardContent className={classes.item}>
        <ActionList name="actions" />
      </CardContent>
    </Card>
  );
};

export default ActionsCard;
