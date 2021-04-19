import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Box,
  IconButton,
  Link,
  Menu,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import Logo from "../Logo";
import { MoreVert } from "@material-ui/icons";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontWeight: 700,
  },
  brand: {
    display: "inline-block",
    "&:hover": {
      textDecoration: "none",
    },
  },
  real_brand: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center"
  },
  right_menu: {
    marginRight: theme.spacing(0)
  }
}));

export default function NavBar(props) {
  const classes = useStyles();
  const [t] = useTranslation();
  const [anchor, setAnchor] = useState(null);

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="default">
        <Toolbar>
          <Box className={classes.title}>
            <Link color="inherit" href="/" className={classes.brand}>
              <Typography
                variant="h6"
                color="initial"
                className={classes.real_brand}
              >
                <Logo /> {t("self.title")}
              </Typography>
            </Link>
          </Box>
          <IconButton
            color="inherit"
            className={classes.right_menu}
            aria-haspopup="true" 
            onClick={(e) => setAnchor(e.currentTarget)}
            disableRipple
          >
            <MoreVert />
          </IconButton>
        </Toolbar>
        <Menu
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={() => setAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          getContentAnchorEl={null}
        >
          {props.children}
        </Menu>
      </AppBar>
    </div>
  );
}
