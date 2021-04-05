import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Box, Link, Toolbar, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import Logo from "../Logo";
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
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  }
}));

export default function NavBar(props) {
  const classes = useStyles();
  const [t] = useTranslation();
  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="default">
        <Toolbar>
          <Box className={classes.title}>
            <Link color="inherit" href="/" className={classes.brand}>
              
              <Typography variant="h6" color="initial" className={classes.real_brand}>
                <Logo /> {t("self.title")}
              </Typography>
            </Link>
          </Box>

          {props.children}
        </Toolbar>
      </AppBar>
    </div>
  );
}
