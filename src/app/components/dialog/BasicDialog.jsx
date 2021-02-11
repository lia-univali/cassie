import React from 'react'

import Dialog, { DialogTitle } from '@material-ui/core/Dialog'
import { Divider } from '@material-ui/core'

const BasicDialog = ({ title, children, ...rest }) => {
  return (
    <Dialog {...rest}>
      <DialogTitle>
        {title}
      </DialogTitle>
      <Divider/>
      {children}
    </Dialog>
  )
}

export default BasicDialog