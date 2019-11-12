import React from 'react';
import { connect } from 'react-redux';
import More from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import { MuiThemeProvider } from '@material-ui/core/styles';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Button from '../components/Button';
import IndexDropdown from '../components/IndexDropdown';
import DropdownButton from '../components/DropdownButton';
import { bindDispatch } from '../common/utils';
import { mediumIconButton } from '../theme';
import * as Modal from '../actions/modal';
import * as Imagery from '../actions/imagery';
import * as Application from '../actions/application';

const ImageActions = ({ application, imagery, modal, index, metadata }) => {
  const handleInclude = ({ expression, label, params }) => {
    imagery.addCustomLayer(expression, index, label, params);
  };

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
            <MenuItem onClick={() => modal.open("VIEW_METADATA", { data: metadata })}>
              Ver metadados
            </MenuItem>
          }
        </DropdownButton>
      </ExpansionPanelActions>
    </MuiThemeProvider>
  );
};

export default connect(() => ({}), bindDispatch({ Application, Modal, Imagery }))(ImageActions);
