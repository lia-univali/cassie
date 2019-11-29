import React from 'react';
import Dialog, { DialogTitle } from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';

class BasicDialog extends React.Component {
  render() {
    const { children, title, ...rest } = this.props;

    return (
      <Dialog {...rest}>
        <DialogTitle>
          {title}
        </DialogTitle>
        <Divider/>
        {children}
      </Dialog>
    );
  }
}

export default BasicDialog;
