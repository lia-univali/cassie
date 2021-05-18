import React from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Avatar,
  Collapse,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@material-ui/core";

import AcquisitionPage from "../AcquisitionPage";
import ProcessingPage from "../ProcessingPage";
import ActivityIndicator from "../../components/core/ActivityIndicator";
import {
  ExitToApp,
  ExpandLess,
  ExpandMore,
  Menu,
  Translate,
} from "@material-ui/icons";
import clsx from "clsx";
import Logo from "../../components/Logo";
import { useTranslation } from "react-i18next";
import { User } from "../../components";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Actions as LangActions } from "../../../store/ducks/i18n";
import pt from "../../../resources/i18n/pt.svg";
import en from "../../../resources/i18n/en.svg";
import { push } from "connected-react-router";
import * as auth from "../../../store/ducks/auth";

// Register Dialogs
// eslint-disable-next-line no-unused-vars
import CoastlineEvolutionDialog from "../../components/dialog/CoastlineEvolutionDialog";
// eslint-disable-next-line no-unused-vars
import CoastlineConfigDialog from "../../components/dialog/CoastlineConfigDialog";
// eslint-disable-next-line no-unused-vars
import NewLayerDialog from "../../components/dialog/NewLayerDialog";
// eslint-disable-next-line no-unused-vars
import ImageSelectionDialog from "../../components/dialog/ImageSelectionDialog";
import DialogRoot from "../../components/dialog/DialogRoot";

const NotFound = (props) => (
  <Typography variant="h2" align="center">
    Página não encontrada.
  </Typography>
);

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    padding: 0,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    flex: "auto",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  },
  left: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  flag: {
    width: "20px",
    height: "20px",
    marginLeft: "10px",
  },
}));

const MainPage = ({ match }) => {
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = React.useState(false);
  const [t] = useTranslation();

  const handleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLanguageDropdown = () => {
    setLanguageDropdownOpen(!languageDropdownOpen);
  };

  const dispatch = useDispatch();
  const handleLanguageChange = (local) => {
    dispatch(LangActions.setLang(local));
  };

  const handleLogout = () => {
    dispatch(
      auth.Actions.revoke(() => {
        dispatch(push("/"));
        document.location.reload();
      })
    );
  };

  return (
    <div className={classes.root}>
      <DialogRoot />
      <CssBaseline />
      <AppBar position="fixed" color="default" className={classes.appBar}>
        <Toolbar>
          <div className={classes.left}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawer}
              edge="start"
              className={classes.menuButton}
            >
              <Menu />
            </IconButton>
            <Typography className={classes.title} variant="h6" color="inherit">
              <div className={classes.logo}>
                <Logo kind="filled" />
              </div>
              {t("self.code")}
            </Typography>
          </div>

          <User {...user}></User>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}></div>
        <Divider />
        <List>
          <ListItem button onClick={handleLanguageDropdown}>
            <ListItemIcon>
              <Translate />
            </ListItemIcon>
            <ListItemText primary={t("menus.drawer.language")} />
            {languageDropdownOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={languageDropdownOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested} onClick={() => handleLanguageChange("pt-BR")}>
                <ListItemIcon>
                  <Avatar alt="" src={pt} className={classes.flag} />
                </ListItemIcon>
                <ListItemText primary="Português" />
              </ListItem>
              <ListItem button className={classes.nested} onClick={() => handleLanguageChange("en-US")}>
                <ListItemIcon>
                  <Avatar alt="" src={en} className={classes.flag} />
                </ListItemIcon>
                <ListItemText primary="English" />
              </ListItem>
            </List>
          </Collapse>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary={t("auth.signout")} />
          </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: drawerOpen,
        })}
      >
        <div className={classes.drawerHeader} />
        <Switch>
          <Route
            exact
            strict
            path={`${match.url}/acquisition/:step?`}
            component={AcquisitionPage}
          />
          <Route
            exact
            strict
            path={`${match.url}/processing`}
            component={ProcessingPage}
          />
          <Route path={match.url} component={NotFound} />
        </Switch>

        
      </main>
      <ActivityIndicator />
    </div>
  );
};

export default MainPage;
