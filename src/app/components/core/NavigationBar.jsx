import React from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Typography,
  Toolbar,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { Actions as LangActions } from "../../../store/ducks/i18n";
import { Avatar, MenuItem } from "@material-ui/core";
import User from "./User";
import pt from "../../../resources/i18n/pt.svg";
import en from "../../../resources/i18n/en.svg";
import Logo from "../Logo";
import { useLocalStorage } from "../../../common/utils";

const useStyles = makeStyles((theme) => ({
  left: {
    flex: 1,
  },
  title: {
    flex: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  flag: {
    width: "20px",
    height: "20px",
    marginLeft: "10px",
  },
  logo: {
  }
}));

const NavigationBar = () => {
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const [, setLanguage] = useLocalStorage('selectedLanguage', 'pt-BR');
  const [t] = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const handleLanguageChange = (local) => {
    dispatch(LangActions.setLang(local));
    setLanguage(local);
  };
  return (
    <AppBar position="static" color="default">
      <Toolbar variant="dense">
        <div className={classes.left}>
          <Typography className={classes.title} variant="h6" color="inherit">
            <div className={classes.logo}>
              <Logo kind="filled"/>
            </div>
            {t("self.code")}
          </Typography>
        </div>
        
        <User {...user}>
          <MenuItem onClick={() => handleLanguageChange("pt-BR")}>
            <ListItemText primary="pt-BR" />
            <ListItemIcon>
              <Avatar alt="" src={pt} className={classes.flag} />
            </ListItemIcon>
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange("en-US")}>
            <ListItemText primary="en-US" />
            <ListItemIcon>
              <Avatar className={classes.flag} alt="" src={en} />
            </ListItemIcon>
          </MenuItem>
        </User>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
