import { createMuiTheme } from '@material-ui/core/styles';
import { teal, pink } from '@material-ui/core/colors';

export const space = (...spaces) => {
  return spaces.map(s => `${s * 8}px`).join(" ");
}

const theme = createMuiTheme({});

export default createMuiTheme({
  palette: {
    primary: teal,
    secondary: pink,
  },
  overrides: {
    MuiCardContent: {
      root: {
        '&:last-child': {
          paddingBottom: space(2),
        }
      },
    },
    MuiAppBar: {
      root: {
        marginBottom: 0,
      }
    },
    MuiExpansionPanelActions: {
      root: {
        padding: space(1),
      }
    },
    MuiExpansionPanelDetails: {
      root: {
        padding: space(2, 3),
      }
    },
    MuiPaper: {
      root: {
        marginBottom: space(2),
      }
    },
    MuiStepper: {
      root: {
        backgroundColor: theme.palette.background.default,
      }
    },
    MuiDialogContent: {
      root: {
        padding: space(3),
      }
    },
    MuiTableRow: {
      root: {
        height: space(5)
      },
    }
  }
});

export const smallIconButton = outerTheme => ({
  ...outerTheme,
  overrides: {
    MuiIconButton: {
      root: {
        width: space(4),
        height: space(4),
        fontSize: outerTheme.typography.pxToRem(20)
      }
    }
  }
});

export const mediumIconButton = outerTheme => ({
  ...outerTheme,
  overrides: {
    ...outerTheme.overrides,
    MuiIconButton: {
      root: {
        width: space(5),
        height: space(5)
      }
    }
  }
});

export const lessPaddedExpansion = outerTheme => ({
  ...outerTheme,
  overrides: {
    ...outerTheme.overrides,
    MuiExpansionPanelSummary: {
      root: {
        padding: space(0, 2),
      }
    },
    MuiExpansionPanelDetails: {
      root: {
        padding: space(2, 2),
      }
    },
  }
});
