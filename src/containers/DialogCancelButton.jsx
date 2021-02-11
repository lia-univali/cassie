import React from 'react'
import { useDispatch } from 'react-redux'
import * as modal from '../store/ducks/modal'
import Button from '../components/Button'

const DialogCancelButton = ({ title, ...rest }) => {
  const dispatch = useDispatch()

  return (
    <Button color="default" onClick={() => dispatch(modal.close())} {...rest}>
      {title}
    </Button>
  )
}

export default DialogCancelButton
