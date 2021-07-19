import { IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { HelpOutlineOutlined } from "@material-ui/icons";
import React from "react";
import { useTranslation } from "react-i18next";

// useStyles is a hook for styling this component with Material UI's styling solution
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: "5px",
  },
  right: {
    textAlign: "right",
  }
}));

// component that recieves a function and displays a help button with a tooltip
export default function HelpButton({onClickFunction}) {
  const [t] = useTranslation();
  const classes = useStyles();
  return (
    <div className={classes.right}>
        <Tooltip title={t("tour.help")} aria-label="help" id="help">
          <IconButton
            aria-label="help"
            className={classes.margin}
            size="medium"
            onClick={onClickFunction}
          >
            <HelpOutlineOutlined color="primary" fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </div>
  );
}

