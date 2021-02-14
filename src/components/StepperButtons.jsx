import React from 'react'
import i18n from 'i18next'

import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'

import { NEXT, PREVIOUS } from '../app/pages/AcquisitionPage'

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(2),
    '& > :not(:last-child)': {
      marginRight: theme.spacing(2),
    }
  }
}))

const StepperButtons = ({ navigate, children,
  nextText = i18n.t('forms.acquisition.next'), nextDisabled = false, nextTarget = NEXT, onNext = () => { },
  backText = i18n.t('forms.acquisition.prev'), backDisabled = false, backTarget = PREVIOUS, onBack = () => { },
}) => {
  const classes = useStyles()

  const navigateBackwards = () => {
    onBack()
    navigate(backTarget)
  }

  const navigateForwards = () => {
    onNext()
    navigate(nextTarget)
  }

  return (
    <div className={classes.wrapper}>
      <Button onClick={navigateBackwards} disabled={backDisabled} variant='outlined'>
        {backText}
      </Button>
      {children}
      <Button onClick={navigateForwards} disabled={nextDisabled} variant='contained' color='primary'>
        {nextText}
      </Button>
    </div>
  )
}

export default StepperButtons
