import React from 'react';
import spacing from '@material-ui/core/styles/spacing';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';

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
      //formatter = x => String(x)
    } = this.props;

    return images.map((image, i) => {
      return (
        <MenuItem key={i} disabled={this.isDisabled(i)} value={i}>
          {image}
        </MenuItem>
      );
    });
  }

  render() {
    const { onLoadRequested = () => {} } = this.props;

    return (
      <form>
        <FormControl style={{marginRight: spacing.unit * 2}}>
          <InputLabel htmlFor="image-select">Imagem</InputLabel>
          <Select
            input={<Input name="image" id="image-select"/>}
            onChange={e => this.setState({index: e.target.value})}
            value={this.state.index}
          >
            {this.createItems()}
          </Select>
        </FormControl>
        <Button color="primary"
          disabled={this.isDisabled(this.state.index)}
          onClick={() => onLoadRequested(this.state.index)}
        >
          Carregar
        </Button>
      </form>
    );
  }
}

export default ImageChooserForm;
