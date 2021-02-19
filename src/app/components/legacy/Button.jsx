import React from 'react'

import { MuiThemeProvider } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'

const makeTheme = (color) => outerTheme => ({
  ...outerTheme,
  palette: {
    ...outerTheme.palette,
    primary: outerTheme.palette[color]
  }
})

// @TODO unused component
const CustomButton = ({children, color = 'default', ...rest}) => {
  const componentColor = color === 'default' ? color : 'primary'

  return (
    <MuiThemeProvider theme={makeTheme(color === 'default' ? 'primary' : color)}>
      <Button color={componentColor} {...rest}>
        {children}
      </Button>
    </MuiThemeProvider>
  )
}

export default CustomButton
