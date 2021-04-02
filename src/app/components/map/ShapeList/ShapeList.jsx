import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import {
  Grid,
  List,
  ListItem,
  Chip,
  ListItemText,
  Paper,
} from "@material-ui/core";

import TransectShapeList from "./TransectShapeList";

import { Actions as Map } from "../../../../store/ducks/map";

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

const ShapeList = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [t] = useTranslation();

  const shapes = useSelector((state) => state.map.shapes);

  return (
    <Paper className={classes.wrapper}>
      <List>
        {shapes.map((item, i) => (
          <ListItem
            key={i}
            onMouseOver={() => dispatch(Map.highlight(i))}
            onMouseOut={() => dispatch(Map.clearHighlight())}
          >
            <Grid container direction="column" className={classes.item}>
              <Grid container direction="row" className={classes.item}>
                {t(item.name)}
                <Chip
                  className={classes.chip}
                  size="small"
                  label={
                    item.overlays.length === 1
                      ? `1 ${t("forms.map.item.s")}`
                      : `${item.overlays.length} ${t("forms.map.item.p")}`
                  }
                />
              </Grid>
              {item.name === "forms.map.transects.title" && (
                <TransectShapeList />
              )}
            </Grid>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ShapeList;
