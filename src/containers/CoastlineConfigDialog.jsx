import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { registerDialog } from './DialogRoot';

class CoastlineConfigDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      spacing: 100,
      extent: 1600,
      threshold: 0,
    };
  }

  createHandler(name) {
    return event => {
      this.setState({ [name]: event.target.value })
    };
  }

  createInput(label, property) {
    const value = this.state[property]

    return (
      <TextField type="number" label={label} value={value}
        onChange={this.createHandler(property)}
        style={{ margin: "10px 10px 0px" }}
      />
    )
  }

  render() {
    const { spacing, extent, threshold } = this.state;

    return (
      <div>
        <Dialog open={this.props.open}>
          <DialogTitle>Parâmetros de análise</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Defina os parâmetros de espaçamento e extensão dos transectos,
              em metros, e o coeficiente de limiarização (valores mais altos
              são mais rígidos quanto ao que é considerado um corpo de água).
            </DialogContentText>
            <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: 16, "&>*": { padding: "10px" } }}>
              {this.createInput("Espaçamento (m)", "spacing")}
              {this.createInput("Extensão (m)", "extent")}
              {this.createInput("Limiar", "threshold")}
            </div>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => this.props.close()}>
              Cancelar
            </Button>
            <Button color="primary" onClick={() => this.props.publish({ spacing, extent, threshold })}>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default registerDialog("coastlineConfig")(CoastlineConfigDialog);
