import React from 'react';
import DropdownButton from './DropdownButton';
import Button from '@material-ui/core/Button';
import * as Indices from '../common/indices';

class IndexDropdown extends React.Component {
  render() {
    const {
      disableIf = () => false,
      onSelect = () => { },
      children,
      ...rest
    } = this.props;

    const items = Indices.all().map((el, index) => (
      <Button key={index}
        disabled={disableIf(index)}
        onClick={() => onSelect(index, Indices.get(index))}
      >
        {el.label}
      </Button>
    ));

    return (
      <DropdownButton {...rest}>
        {items}
        {children}
      </DropdownButton>
    );
  }
}

export default IndexDropdown;
