import React from 'react';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';

const makeTheme = (color) => outerTheme => ({
  ...outerTheme,
  palette: {
    ...outerTheme.palette,
    primary: outerTheme.palette[color]
  }
});

const CustomButton = ({children, color = "default", ...rest}) => {
  let componentColor = color;
  if (color !== "default") {
    componentColor = "primary";
  }

  return (
    <MuiThemeProvider theme={makeTheme(color === "default" ? "primary" : color)}>
      <Button color={componentColor} {...rest}>
        {children}
      </Button>
    </MuiThemeProvider>
  );
};

export default CustomButton;
