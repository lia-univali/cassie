import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import spacing from '@material-ui/core/styles/spacing';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { space } from 'theme';

const Textual = ({classes}) => (
  <Typography variant="subheading" align="center" className={classes.text}>
    Carregando...
  </Typography>
)

const textualStyle = (theme) => ({
  text: {
    padding: space(4, 0),
    color: theme.palette.grey[600],
  }
});

const StyledTextual = withStyles(textualStyle)(Textual);

// ========================================================== //

class ActivityIndicator extends React.Component {
  render() {
    const { classes, onAbort, shown = true, message = "Trabalhando", textual = false} = this.props;

    if (textual !== false) {
      return <StyledTextual/>
    }

    return (
      <Fade in={shown} timeout={1000} unmountOnExit>
        <div className={classes.wrapper}>
          <Paper className={classes.content}>
            <CircularProgress thickness={5} size={100} color="secondary"/>
            {false &&
              <Typography variant="body1" style={{marginTop: spacing.unit * 2}}>
                {message}...
              </Typography>
            }
            {onAbort &&
              <Button color="error" onClick={onAbort} style={{marginTop: spacing.unit * 2}} dense>
                Cancelar
              </Button>
            }
          </Paper>
        </div>
      </Fade>
    );
  }
}

const style = theme => ({
  wrapper: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: space(2),
  },
  content: {
    padding: space(3)
  }
});

const connector = connect(state => ({
  shown: state.common.working,
}));

const enhancer = compose(
  connector,
  withStyles(style)
);

export default enhancer(ActivityIndicator);
