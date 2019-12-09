import React from 'react';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import spacing from '@material-ui/core/styles/spacing';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from './Button';

export default class BusyPanel extends React.Component {
  render() {
    const { onAbort, shown = true, message = "Trabalhando", className = "", ...rest } = this.props;

    return (
      <Fade in={shown} timeout={300} unmountOnExit>
        <Paper className={`busy-panel ${className}`} {...rest}>
          <CircularProgress thickness={6} color="secondary"/>
          {message &&
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
      </Fade>
    );
  }
}
