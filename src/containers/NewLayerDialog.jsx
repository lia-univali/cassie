import React from 'react';
import { connect } from 'react-redux';
import FormHelperText from '@material-ui/core/FormHelperText';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { withTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// import IndexDropdown from './IndexDropdown';
import { registerDialog } from './DialogRoot';
import * as Indices from '../common/indices';

class NewLayerDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expression: "",
      name: "",
    };
  }

  handleChange(name, event) {
    this.setState({ [name]: event.target.value });
  }

  handleCreate() {
    const { expression, name } = this.state;
    console.log(this.expression);

    this.props.publish({ expression, name });
  }

  handleSelect(index) {
    this.expression.value = index.expression;
  }

  render() {
    console.log(this.props);
    const { open, close, theme } = this.props;

    const variables = [
      "RED: banda vermelha",
      "GREEN: banda verde",
      "BLUE: banda azul",
      "NIR: banda infravermelho próximo",
      "SWIR: banda infravermelho de ondas curtas"
    ];

    const expressions = Indices.all().map(({ label, expression }) => (
      `${label}: ${expression}`
    ));

    const inputStyle = {
      marginBottom: theme.spacing.unit * 3
    };

    return (
      <Dialog open={open} maxWidth="md" onClose={() => close()}>
        <DialogTitle>Nova camada</DialogTitle>
        <DialogContent>
          <form>
            <TextField id="name" fullWidth style={inputStyle}
              label="Nome da camada"
              value={this.state.name}
              onChange={e => this.handleChange("name", e)}
            />
            <TextField id="expression" fullWidth style={inputStyle}
              multiline rowsMax={3}
              label="Expressão"
              value={this.state.expression}
              onChange={e => this.handleChange("expression", e)}
            />

            <FormHelperText>Variáveis disponíveis:</FormHelperText>
            {variables.map((text, i) => (
              <FormHelperText key={i}>
                {text}
              </FormHelperText>
            ))}
            <br />
            <FormHelperText>Expressões:</FormHelperText>
            {expressions.map((text, i) => (
              <FormHelperText key={i}>
                {text}
              </FormHelperText>
            ))}
          </form>
        </DialogContent>

        <DialogActions>
          {/* <IndexDropdown text="Índices" className="flex-left"
            onSelect={(i, v) => this.setState({expression: v.expression})}
          /> */}
          <Button color="primary" onClick={() => this.handleCreate()}>
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const Themed = withTheme()(NewLayerDialog);

export default registerDialog("newLayer")(Themed);
