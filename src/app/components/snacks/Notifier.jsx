import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'

import { Actions as Snack } from '../../../store/ducks/snacks'

let displayed = []

const Notifier = () => {
  const dispatch = useDispatch()
  const snacks = useSelector(state => state.snacks.notes || [])
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const storeDisplayed = (id) => {
    displayed = [...displayed, id]
  }

  const eraseDisplayed = (id) => {
    displayed = [...displayed.filter(key => id !== key)]
  }

  useEffect(() => {
    snacks.forEach(({ key, message, options = {}, dismissed = false }) => {
      if (dismissed) {
          closeSnackbar(key)
          return
      }

      if (displayed.includes(key)) {
        return
      }

      enqueueSnackbar(message, {
          key,
          ...options,
          onClose: (event, reason, myKey) => {
              if (options.onClose) {
                  options.onClose(event, reason, myKey)
              }
          },
          onExited: (event, myKey) => {
              dispatch(Snack.erase(myKey))
              eraseDisplayed(myKey)
          },
      })

      storeDisplayed(key)
    })
  }, [dispatch, snacks, enqueueSnackbar, closeSnackbar])

  return null
}

export default Notifier