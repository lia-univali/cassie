import React from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { bindDispatch } from 'common/utils';

class SnackbarRoot extends React.Component {
  handleClose(event, reason) {
    if (reason === "timeout") {
      this.props.basic.hideNotification();
    }
  }

  render() {
    const Content = (
      <div className="vcenter">
        {this.props.isTask === true &&
          <CircularProgress color="secondary" size={32}/>
        }
        <Typography className="margin-left" variant="body1" color="inherit">
          {this.props.message}
        </Typography>
      </div>
    );

    return (
      <Snackbar
        open={this.props.snackbarShown}
        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
        message={Content}
        autoHideDuration={this.props.isTask ? null : this.props.duration}
        onClose={(e, r) => this.handleClose(e, r)}
      />
    );
  }
}

export default connect(state => {
  return {
    message: state.notification.message,
    snackbarShown: state.notification.open,
    duration: state.notification.duration,
    isTask: state.notification.isTask,
  };
})(SnackbarRoot);
