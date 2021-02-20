import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import update from 'immutability-helper'
import { useTranslation } from 'react-i18next'

import ImageTable from '../visualization/ImageTable'
import StepperButtons from './StepperButtons'

import { FINALIZE } from '../../pages/AcquisitionPage'
import { Actions as Acquisition } from '../../../store/ducks/acquisition'

const ImageListRefiner = ({ navigate }) => {
  const metadata = useSelector(state => state.acquisition.metadata)
  const dates = useSelector(state => state.acquisition.availableDates)

  const dispatch = useDispatch()
  const [t] = useTranslation()

  const [selected, setSelected] = useState(dates.map(() => true))

  const handleChange = (index, checked) => {
    const updated = update(selected, {
      [index]: { $set: checked }
    })

    setSelected(updated)
  }

  const handleFinish = () => {
    const filtered = dates.filter((image, i) => selected[i] === true)

    dispatch(Acquisition.setAvailableDates(filtered))
  }

  useEffect(() => {
    dispatch(Acquisition.loadThumbnails())
  }, [dispatch])

  return (
    <div>
      <ImageTable metadata={metadata} images={dates} selected={selected}
        onCheckboxChange={handleChange}
      />

      <StepperButtons
        navigate={navigate}
        nextText={t('forms.acquisition.4.next')}
        onNext={handleFinish}
        nextTarget={FINALIZE}
      />
    </div>
  )
}

export default ImageListRefiner
