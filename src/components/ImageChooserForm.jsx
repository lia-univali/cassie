import React from 'react';
import createSpacing from '@material-ui/core/styles/createSpacing';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { withTranslation } from 'react-i18next'

class ImageChooserForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };
  }

  isDisabled(index) {
    const { disabledPredicate = () => false } = this.props;

    return disabledPredicate(index);
  }

  createItems() {
    const {
      images = [],
    } = this.props;

    return images.map((image, i) => {
      return (
        <MenuItem key={i} disabled={this.isDisabled(i)} value={i}>
          {image.shortname + "/" + image.date}
        </MenuItem>
      );
    });
  }

  render() {
    const { t, onLoadRequested = () => { } } = this.props;

    return (
      <form>
        <FormControl style={{ marginRight: createSpacing.unit * 2 }}>
          <InputLabel htmlFor="image-select">{t('forms.imageChooser.image')}</InputLabel>
          <Select
            input={<Input name="image" id="image-select" />}
            onChange={e => this.setState({ index: e.target.value })}
            value={this.state.index}
          >
            {this.createItems()}
          </Select>
        </FormControl>
        <Button color="primary"
          disabled={this.isDisabled(this.state.index)}
          onClick={() => onLoadRequested(this.state.index)}
        >
          {t('forms.imageChooser.load')}
        </Button>
      </form>
    );
  }
}

export default withTranslation()(ImageChooserForm);
