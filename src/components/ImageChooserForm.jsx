import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  content: {
    marginRight: theme.spacing(2)
  }
}))

const ImageChooserForm = ({ images = [], onLoadRequested = () => { }, disabledPredicate = () => false }) => {
  const [t] = useTranslation()
  const classes = useStyles()

  const [index, setIndex] = useState(0)

  const isDisabled = (index) => {
    return disabledPredicate(index)
  }

  return (
    <form>
      <Box display='flex' alignItems='flex-end'>
        <FormControl className={classes.content}>
          <InputLabel htmlFor='image-select'>{t('forms.imageChooser.image')}</InputLabel>
          <Select
            input={<Input name='image' id='image-select' />}
            onChange={e => setIndex(e.target.value)}
            value={index}
          >
            {
              images.map((image, i) => (
                <MenuItem key={i} disabled={isDisabled(i)} value={i}>
                  {`${image.shortname}/${image.date}`}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <Button color='primary'
          disabled={isDisabled(index)}
          onClick={() => onLoadRequested(index)}
        >
          {t('forms.imageChooser.load')}
        </Button>
      </Box>
    </form>
  )
}

export default ImageChooserForm
