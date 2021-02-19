import React from 'react'

import { FormControl, Input, InputLabel, Select, MenuItem } from '@material-ui/core'

// @TODO unused component
const TitledSelect = ({ id, title, value, onChange, content, noneText, className = '', ...rest }) => {
  const text = value === '' && !noneText && content[0] ? content[0].key : value

  return (
    <FormControl className={'margin-below ' + className} {...rest}>
      <InputLabel htmlFor={id}>{title}</InputLabel>

      <Select input={<Input name={id} id={id}/>} value={text}
        onChange={e => onChange(id, e.target.value)}
      >
        {
          noneText !== undefined &&
          <MenuItem value={''}><em>{noneText}</em></MenuItem>
        }
        {
          content.map((v, i) => (
            <MenuItem key={i} disabled={v.disabled || false} value={v.key}>
              {v.label}
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  )
}

export default TitledSelect
