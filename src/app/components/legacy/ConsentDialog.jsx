import React from "react";

import { Dialog as DialogContent, Typography } from "@material-ui/core";

import Button from "./Button";
import DialogActions from "./DialogActions";
import BasicDialog from "../dialog/BasicDialog";

// @TODO unused component
// Uses erased modal logic
const ConsentDialog = ({ modal, modalProps }) => {
  const handleContinue = () => {
    //ee.data.authenticateViaPopup(onSuccess, error => alert(error))
    modal.complete();
  };

  return (
    <BasicDialog title="Autenticação" {...modalProps}>
      <DialogContent>
        <Typography variant="body1">
          Você deverá entrar com suas credenciais Google para utilizar o
          sistema. Pressione em 'Continuar' para prosseguir para o processo de
          autenticação seguro da Google.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={handleContinue}>
          Continuar
        </Button>
      </DialogActions>
    </BasicDialog>
  );
};

export default ConsentDialog;
