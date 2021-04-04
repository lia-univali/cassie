import React from "react";
import { shallowEqual, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import { Box, CircularProgress, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  content: {
    marginLeft: theme.spacing(2),
  },
}));

const Task = React.forwardRef(({ id }, ref) => {
  const {
    message,
    options: { variant, value },
  } = useSelector(
    (state) => state.snacks.notes.find((note) => note.key === id),
    shallowEqual
  );

  const classes = useStyles();

  return (
    <Box display="flex" alignItems="center" ref={ref}>
      <CircularProgress
        variant={variant}
        value={value}
        color="secondary"
        size={32}
      />
      <Typography className={classes.content} variant="body2" color="inherit">
        {message}
      </Typography>
    </Box>
  );
});

export default Task;
