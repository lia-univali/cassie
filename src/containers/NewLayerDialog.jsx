import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux';
import FormHelperText from '@material-ui/core/FormHelperText';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { withTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { registerDialog } from './DialogRoot';
import * as Indices from '../common/indices';
import { withTranslation } from 'react-i18next'

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
    const { t, open, close, theme } = this.props;

    const variables = [
      t('forms.imageryOverlay.add.bands.red'),
      t('forms.imageryOverlay.add.bands.green'),
      t('forms.imageryOverlay.add.bands.blue'),
      t('forms.imageryOverlay.add.bands.nir'),
      t('forms.imageryOverlay.add.bands.swir')
    ];

    const expressions = Indices.all().map(({ label, expression }) => (
      `${label}: ${expression}`
    ));

    const inputStyle = {
      marginBottom: theme.spacing.unit * 3
    };

    return (
      <Dialog open={open} maxWidth="md" onClose={() => close()}>
        <DialogTitle>{t('forms.imageryOverlay.add.title')}</DialogTitle>
        <DialogContent>
          <form>
            <TextField id="name" fullWidth style={inputStyle}
              label={t('forms.imageryOverlay.add.name')}
              value={this.state.name}
              onChange={e => this.handleChange("name", e)}
            />
            <TextField id="expression" fullWidth style={inputStyle}
              multiline rowsMax={3}
              label={t('forms.imageryOverlay.add.expression')}
              value={this.state.expression}
              onChange={e => this.handleChange("expression", e)}
            />

            <FormHelperText>{t('forms.imageryOverlay.add.bands.title')}:</FormHelperText>
            {variables.map((text, i) => (
              <FormHelperText key={i}>
                {text}
              </FormHelperText>
            ))}
            <br />
            <FormHelperText>{t('forms.imageryOverlay.add.suggested')}:</FormHelperText>
            {expressions.map((text, i) => (
              <FormHelperText key={i}>
                {text}
              </FormHelperText>
            ))}
          </form>
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={() => this.handleCreate()}>
            {t('forms.imageryOverlay.add.create')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const enhancer = compose(
  withTheme,
  withTranslation()
)

export default registerDialog("newLayer")(enhancer(NewLayerDialog));
