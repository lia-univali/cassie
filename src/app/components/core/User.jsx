import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Box,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  contextItem: {
    marginRight: theme.spacing(2),
  },
}));

const User = ({ name, imageUrl, children }) => {
  const classes = useStyles();



  return !name ? null : (
    <Box>
      <Box display="flex" alignItems="center">
        <Typography
          className={classes.contextItem}
          variant="body1"
          color="inherit"
        >
          {name}
        </Typography>
        <Avatar className={classes.contextItem} alt={name} src={imageUrl} />
      </Box>
    </Box>
  );
};

export default User;
