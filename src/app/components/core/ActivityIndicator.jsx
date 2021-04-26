import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Box,
  CircularProgress,
  Fade,
  Paper,
  Typography,
} from "@material-ui/core";

const useTextualStyles = makeStyles((theme) => ({
  text: {
    padding: theme.spacing(4, 0),
    color: theme.palette.grey[600],
  },
}));

const Textual = () => {
  const [t] = useTranslation();
  const classes = useTextualStyles();

  return (
    <Typography className={classes.text} variant="subtitle1" align="center">
      {t("general.loading")}
    </Typography>
  );
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(3),
  },
  abort: {
    marginTop: theme.spacing(2),
  },
  loading: {
    marginLeft: theme.spacing(3),
  },
}));

// @TODO container to component
const ActivityIndicator = ({ onAbort, textual }) => {
  const shown = useSelector((state) => state.common.working);

  const [t] = useTranslation();
  const classes = useStyles();

  return textual ? (
    <Textual />
  ) : (
    <Fade in={shown} timeout={1000} unmountOnExit>
      <Box className={classes.wrapper}>
        <Paper className={classes.content}>
          <Box display="flex" alignItems="center" flexDirection="row">
            <CircularProgress thickness={5} size={30} color="secondary" />
            {onAbort && (
              <Button
                className={classes.abort}
                color="error"
                onClick={onAbort}
                dense
              >
                {t("general.cancel")}
              </Button>
            )}
            <Typography className={classes.loading} variant="h5">
              {t("general.loading")}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

export default ActivityIndicator;
