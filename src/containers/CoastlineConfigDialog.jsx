import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { registerDialog } from './DialogRoot';
import { withTranslation } from 'react-i18next'

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
    const { t } = this.props;

    return (
      <div>
        <Dialog open={this.props.open}>
          <DialogTitle>{t('forms.shorelineParameters.title')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('forms.shorelineParameters.description')}
            </DialogContentText>
            <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: 16, "&>*": { padding: "10px" } }}>
              {this.createInput(t('forms.shorelineParameters.spacing'), "spacing")}
              {this.createInput(t('forms.shorelineParameters.extension'), "extent")}
              {this.createInput(t('forms.shorelineParameters.threshold'), "threshold")}
            </div>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => this.props.close()}>
              {t('forms.shorelineParameters.cancel')}
            </Button>
            <Button color="primary" onClick={() => this.props.publish({ spacing, extent, threshold })}>
              {t('forms.shorelineParameters.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const enhanced = withTranslation()(CoastlineConfigDialog)

export default registerDialog("coastlineConfig")(enhanced);
