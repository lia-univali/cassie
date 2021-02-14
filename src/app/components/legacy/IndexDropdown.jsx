import React from 'react'

import { Button } from '@material-ui/core'

import DropdownButton from '../core/DropdownButton'
import * as Indices from '../../../common/indices'

// @TODO unused component
const IndexDropdown = ({ disableIf = () => false, onSelect = () => {}, children, ...rest }) => {
  const items = Indices.all().map((el, index) => (
    <Button key={index}
      disabled={disableIf(index)}
      onClick={() => onSelect(index, Indices.get(index))}
    >
      {el.label}
    </Button>
  ))

  return (
    <DropdownButton {...rest}>
      {items}
      {children}
    </DropdownButton>
  )
}

export default IndexDropdown
