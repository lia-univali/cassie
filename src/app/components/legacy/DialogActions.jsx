import React from 'react'

import { DialogActions as MuiDialogActions } from '@material-ui/core/Dialog'
import Divider from '@material-ui/core/Divider'
import DialogCancelButton from './DialogCancelButton'

// @TODO unused component
const DialogActions = ({children, withCancel, ...rest}) => {
  return (
    <div>
      <Divider/>
      <MuiDialogActions {...rest}>
        {withCancel &&
          <DialogCancelButton title={typeof(withCancel) === 'string' ? withCancel : 'Cancelar'}/>
        }
        {children}
      </MuiDialogActions>
    </div>
  )
}

export default DialogActions