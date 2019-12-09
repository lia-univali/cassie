import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

class CloudSelector extends React.Component {
  createItems() {
    return [0, 0.025, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 1].map((value, i) => (
      <MenuItem key={i} value={value}>
        {"<= " + (value * 100) + "%"}
      </MenuItem>
    ));
  }

  render() {
    const {
      level = 1,
      onChange = () => {},
    } = this.props;

    return (
      <div>
        <FormControl style={{minWidth: 140, marginBottom: 16}}>
          <InputLabel htmlFor="cloud-select">Nível de nuvens</InputLabel>
          <Select
            input={<Input name="cloud" id="cloud-select"/>}
            onChange={e => onChange(e.target.value)}
            value={level}
          >
            {this.createItems()}
          </Select>
        </FormControl>
      </div>
    );
  }
}

export default CloudSelector;
