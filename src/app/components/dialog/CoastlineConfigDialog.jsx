import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import { Button, TextField } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'

import { registerDialog } from './DialogRoot'

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: 16,
    '&>*': {
      padding: '10px'
    }
  },
  input: {
    margin: '10px 10px 0px'
  }
}))

const CoastlineConfigDialog = ({ open, close, publish }) => {
  const [t] = useTranslation()
  const classes = useStyles()

  const [spacing, setSpacing] = useState(100)
  const [extent, setExtent] = useState(1600)
  const [threshold, setThreshold] = useState(0)

  const createInput = (label, value, mutator) => {
    return (
      <TextField className={classes.input} type="number" label={label} value={value}
        onChange={event => mutator(event.target.value)}
      />
    )
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>{t('forms.shorelineParameters.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('forms.shorelineParameters.description')}
          </DialogContentText>
          <div className={classes.wrapper}>
            {createInput(t('forms.shorelineParameters.spacing'), spacing, setSpacing)}
            {createInput(t('forms.shorelineParameters.extension'), extent, setExtent)}
            {createInput(t('forms.shorelineParameters.threshold'), threshold, setThreshold)}
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => close()}>
            {t('forms.shorelineParameters.cancel')}
          </Button>
          <Button color="primary" onClick={() => publish({ spacing, extent, threshold })}>
            {t('forms.shorelineParameters.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default registerDialog("coastlineConfig")(CoastlineConfigDialog)