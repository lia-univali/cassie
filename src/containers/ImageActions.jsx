import React from 'react';
import { useDispatch } from 'react-redux'

import { MenuItem, ExpansionPanelActions } from '@material-ui/core'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { More } from '@material-ui/icons'

import Button from '../components/Button'
import IndexDropdown from '../components/IndexDropdown'
import DropdownButton from '../components/DropdownButton'

import { mediumIconButton } from '../theme'

import * as modal from '../store/ducks/modal'
import * as imagery from '../store/ducks/imagery'

// @TODO unused component
const ImageActions = ({ index, metadata }) => {
  const dispatch = useDispatch()

  const handleInclude = ({ expression, label, params }) => {
    dispatch(imagery.addCustomLayer(expression, index, label, params))
  }

  return (
    <MuiThemeProvider theme={mediumIconButton}>
      <ExpansionPanelActions>
        {/* <TaskButton color="primary" onClick={() => basic.beginCombination(index)}>
          Combinar
        </TaskButton> */}
        <IndexDropdown text="Incluir" color="primary" onSelect={(i, v) => handleInclude(v)}>
          {/* <MenuItem onClick={() => application.beginNewLayerCreation(index)}>
            Criar...
          </MenuItem> */}
        </IndexDropdown>
        <Button color="error" onClick={() => { }}>
          Remover
        </Button>

        <DropdownButton icon={More}>
          {metadata !== undefined &&
            <MenuItem onClick={() => dispatch(modal.open("VIEW_METADATA", { data: metadata }))}>
              Ver metadados
            </MenuItem>
          }
        </DropdownButton>
      </ExpansionPanelActions>
    </MuiThemeProvider>
  )
}

export default ImageActions
