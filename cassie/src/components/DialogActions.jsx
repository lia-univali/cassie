import React from 'react';
import DialogCancelButton from 'containers/DialogCancelButton';
import { DialogActions as MuiDialogActions } from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';

const DialogActions = ({children, withCancel, ...rest}) => {
  return (
    <div>
      <Divider/>
      <MuiDialogActions {...rest}>
        {withCancel &&
          <DialogCancelButton title={typeof(withCancel) === "string" ? withCancel : "Cancelar"}/>
        }
        {children}
      </MuiDialogActions>
    </div>
  )
};

export default DialogActions;
