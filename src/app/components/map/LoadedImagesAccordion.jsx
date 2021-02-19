import React from 'react'
import { useSelector } from 'react-redux'
import { MuiThemeProvider } from '@material-ui/core/styles'

import ImageViewer from './ImageViewer'
import { lessPaddedExpansion } from '../../../theme'

const LoadedImagesAccordion = ({ }) => {
  const images = useSelector(state => state.imagery.images)

  return (
    <MuiThemeProvider theme={lessPaddedExpansion}>
      <div style={{ maxHeight: '100%', overflowY: 'auto' }}>
        {
          Object.keys(images).reverse().map((id, i) => {
            return <ImageViewer key={id} index={id} image={images[id]} />
          })
        }
      </div>
    </MuiThemeProvider>
  )
}

export default LoadedImagesAccordion