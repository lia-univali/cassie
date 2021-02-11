import React from 'react';
import { useDispatch } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Show from '@material-ui/icons/Visibility';
import Hide from '@material-ui/icons/VisibilityOff';
import Delete from '@material-ui/icons/Delete';
import Threshold from '@material-ui/icons/InvertColors';
import Unthreshold from '@material-ui/icons/InvertColorsOff';
import OpacityControl from '../components/OpacityControl';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { smallIconButton } from '../theme';

import { Actions as imagery } from '../store/ducks/imagery';

const LayerActions = ({ layer, index, parent }) => {
  const dispatch = useDispatch()

  const { visible, opacity, histogram, threshold, removable } = layer
  const canThreshold = histogram && Object.keys(histogram).length === 1
  const isThresholded = threshold !== undefined

  const handleThreshold = () => {
    /*if (isThresholded) {
      basic.clearThreshold(index)
    } else {
      basic.solicitThreshold(index)
    }*/
  }

  return (
    <MuiThemeProvider theme={smallIconButton}>
      <div>
        {canThreshold &&
          <Tooltip title={isThresholded ? "Remover limiarização" : "Limiarizar"} placement="top">
            <IconButton onClick={() => handleThreshold()}>
              {isThresholded ? <Unthreshold /> : <Threshold />}
            </IconButton>
          </Tooltip>
        }

        <Tooltip title={visible ? "Esconder" : "Mostrar"} placement="top">
          <IconButton onClick={() => dispatch(imagery.toggleVisibility(index))}>
            {visible ? <Show /> : <Hide />}
          </IconButton>
        </Tooltip>

        <OpacityControl opacity={opacity}
          onOpacityChange={v => dispatch(imagery.updateOpacity(index, v))}
        />

        {removable &&
          <Tooltip title="Remover" placement="top">
            <IconButton onClick={() => { } /* @TODO Fix layer removal */}>
              <Delete />
            </IconButton>
          </Tooltip>
        }
      </div>
    </MuiThemeProvider>
  )
}

export default LayerActions
