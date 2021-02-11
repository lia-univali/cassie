import React from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux'

import { Snackbar as MuiSnackbar } from '@material-ui/core'

import Task from './Task'
import Alert from './Alert'

import { Actions as Snack } from '../../../store/ducks/snack'

const SnackbarRoot = () => {
  const dispatch = useDispatch()

  const snack = useSelector(state => state.snack.data, shallowEqual)

  const handleClose = (event, reason) => {
    if (snack.onClose) {
      snack.onClose()
    }

    if (reason === 'timeout') {
      dispatch(Snack.dismiss())
    }
  }

  const Snackbar = ({ open, message, children = null }) => (
    <MuiSnackbar
      open={snack.open && open}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      autoHideDuration={snack.duration}
      onClose={handleClose}
      message={message}
    >
      {children}
    </MuiSnackbar>
  )

  return (
    <React.Fragment>
      <Snackbar open={snack.type === 'task'}
        message={<Task snack={snack} onClose={handleClose} />}
      />
      <Snackbar open={snack.type === 'alert'}>
        <Alert snack={snack} onClose={handleClose} />
      </Snackbar>
    </React.Fragment>
  )
}

export default SnackbarRoot