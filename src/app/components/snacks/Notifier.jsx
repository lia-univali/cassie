import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'

import Task from './Task'

import { Actions as Snack } from '../../../store/ducks/snacks'

const createSnack = (type, key, options) => {
  switch (type) {
    case 'task':
      return { ...options, message: <Task key={key} id={key} {...options}/> }
    default:
      return { ...options }
  }
}

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
    snacks.forEach(({ type, key, message, options = {}, dismissed = false }) => {
      if (dismissed) {
        closeSnackbar(key)
      } else {
        if (!displayed.includes(key)) {
          const target = createSnack(type, key, { ...options, message } )

          enqueueSnackbar(target.message, {
              key,
              ...target,
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
        }
      }
    })
  }, [dispatch, snacks, enqueueSnackbar, closeSnackbar])

  return null
}

export default Notifier