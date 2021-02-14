import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, FormHelperText, TextField } from '@material-ui/core'
import { Dialog, DialogContent, DialogTitle, DialogActions } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import { registerDialog } from './DialogRoot'
import * as Indices from '../../../common/indices'

const useStyles = makeStyles(theme => ({
  input: {
    marginBottom: theme.spacing(3)
  }
}))

const NewLayerDialog = ({ open, close, publish }) => {
  const [t] = useTranslation()
  const classes = useStyles()

  const [name, setName] = useState('')
  const [expression, setExpression] = useState('')

  const handleCreate = () => {
    publish({ expression, name })
  }

  const variables = [
    t('forms.imageryOverlay.add.bands.red'),
    t('forms.imageryOverlay.add.bands.green'),
    t('forms.imageryOverlay.add.bands.blue'),
    t('forms.imageryOverlay.add.bands.nir'),
    t('forms.imageryOverlay.add.bands.swir')
  ];

  const expressions = Indices.all().map(({ label, expression }) => (
    `${label}: ${expression}`
  ))

  return (
    <Dialog open={open} maxWidth="md" onClose={() => close()}>
      <DialogTitle>{t('forms.imageryOverlay.add.title')}</DialogTitle>
      <DialogContent>
        <form>
          <TextField className={classes.input} id='name' fullWidth
            label={t('forms.imageryOverlay.add.name')}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <TextField className={classes.input} id='expression' fullWidth
            multiline rowsMax={3}
            label={t('forms.imageryOverlay.add.expression')}
            value={expression}
            onChange={e => setExpression(e.target.value)}
          />
          <FormHelperText>{t('forms.imageryOverlay.add.bands.title')}:</FormHelperText>
          {
            variables.map((text, i) => (
              <FormHelperText key={i}>
                {text}
              </FormHelperText>
            ))
          }
          <br />
          <FormHelperText>{t('forms.imageryOverlay.add.suggested')}:</FormHelperText>
          {
            expressions.map((text, i) => (
              <FormHelperText key={i}>
                {text}
              </FormHelperText>
            ))
          }
        </form>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleCreate}>
          {t('forms.imageryOverlay.add.create')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default registerDialog("newLayer")(NewLayerDialog)
