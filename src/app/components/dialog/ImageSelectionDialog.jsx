import React, { useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import update from 'immutability-helper'
import { useTranslation } from 'react-i18next'

import { Button, Typography } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'

import { registerDialog } from './DialogRoot'
import ImageTable from '../../../components/ImageTable'

const ImageSelectionDialog = ({ open, close, publish }) => {
  const availableDates = useSelector(state => state.acquisition.availableDates, shallowEqual)
  const metadata = useSelector(state => state.acquisition.metadata, shallowEqual)

  const [t] = useTranslation()

  const [dates, setDates] = useState(availableDates)
  const [selected, setSelected] = useState(availableDates ? availableDates.map(() => true) : [])

  const handleChange = (index, checked) => {
    const updated = update(selected, {
      [index]: { $set: checked }
    })

    setSelected(updated)
  }

  const handleFinish = () => {
    publish(availableDates.filter((image, i) => selected[i] === true))
  }

  useEffect(() => {
    if (availableDates) {
      setSelected(availableDates.map(() => true))
      setDates(availableDates)
    }
  }, [availableDates])

  return (
    <Dialog open={open} maxWidth="md" onClose={() => close()}>
      <DialogTitle>{t('forms.imageChooser.actions.analyzeShoreline.imageSelection.title')}</DialogTitle>
      <DialogContent>
        <ImageTable metadata={metadata} images={dates} selected={selected}
          onCheckboxChange={(i, checked) => handleChange(i, checked)}
        />

      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => close()}>
          {t('forms.imageChooser.actions.analyzeShoreline.imageSelection.cancel')}
        </Button>
        <Button color="primary" onClick={() => handleFinish()}>
          {t('forms.imageChooser.actions.analyzeShoreline.imageSelection.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default registerDialog('imageSelection')(ImageSelectionDialog)