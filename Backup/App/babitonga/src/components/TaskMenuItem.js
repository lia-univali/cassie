import React from 'react';
import { connect } from 'react-redux';
import { MenuItem } from 'react-bootstrap';

class TaskMenuItem extends React.Component {
  render() {
    const { children, working, disabled, ...rest } = this.props;

    return (
      <MenuItem disabled={working || disabled} {...rest}>
        {children}
      </MenuItem>
    );
  }
}

export default connect(state => {
  return {working: state.data.working};
}, {})(TaskMenuItem);
