import { createMuiTheme } from '@material-ui/core/styles'
import { teal, pink } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: pink,
  }
})

// @TODO remove
export const smallIconButton = outerTheme => ({
  ...outerTheme,
  overrides: {
    MuiIconButton: {
      root: {
        width: outerTheme.spacing(4),
        height: outerTheme.spacing(4),
        fontSize: outerTheme.typography.pxToRem(20)
      }
    }
  }
})

// @TODO remove
export const mediumIconButton = outerTheme => ({
  ...outerTheme,
  overrides: {
    ...outerTheme.overrides,
    MuiIconButton: {
      root: {
        width: outerTheme.spacing(5),
        height: outerTheme.spacing(5)
      }
    }
  }
})

// @TODO remove
export const lessPaddedExpansion = outerTheme => ({
  ...outerTheme,
  overrides: {
    ...outerTheme.overrides,
    MuiExpansionPanelSummary: {
      root: {
        padding: outerTheme.spacing(0, 2),
      }
    },
    MuiExpansionPanelDetails: {
      root: {
        padding: outerTheme.spacing(2, 2),
      }
    },
  }
})

export default theme