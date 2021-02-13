import React from 'react';
import DialogContent from '@material-ui/core/Dialog';
import DialogActions from './DialogActions';
import Typography from '@material-ui/core/Typography';
import BasicDialog from '../app/components/dialog/BasicDialog';
import Button from './Button';

class ConsentDialog extends React.Component {
  handleContinue() {
    //ee.data.authenticateViaPopup(onSuccess, error => alert(error));
    this.props.modal.complete();
  }

  render() {
    const { modalProps } = this.props;

    return (
      <BasicDialog title="Autenticação" {...modalProps}>
        <DialogContent>
          <Typography variant="body1">
            Você deverá entrar com suas credenciais Google para utilizar o sistema.
            Pressione em "Continuar" para prosseguir para o processo de autenticação seguro da Google.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={() => this.handleContinue()}>
            Continuar
          </Button>
        </DialogActions>
      </BasicDialog>
    );
  }
}

export default ConsentDialog;
