import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { Input, InputLabel } from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';


const TitledSelect = ({id, title, value, onChange, content, noneText, className = "", ...rest}) => {
  if (value === "" && noneText === undefined && content[0]) {
    value = content[0].key;
  }

  return (
    <FormControl className={"margin-below " + className} {...rest}>
      <InputLabel htmlFor={id}>{title}</InputLabel>

      <Select input={<Input name={id} id={id}/>} value={value}
        onChange={e => onChange(id, e.target.value)}
      >
        {noneText !== undefined &&
          <MenuItem value={""}><em>{noneText}</em></MenuItem>
        }
        {content.map((v, i) => (
          <MenuItem key={i} disabled={v.disabled || false} value={v.key}>
            {v.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TitledSelect;
