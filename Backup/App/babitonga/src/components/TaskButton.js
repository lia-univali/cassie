import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

class TaskButton extends React.Component {
  render() {
    const { children, working, disabled, ...rest } = this.props;

    return (
      <Button disabled={working || disabled} {...rest}>
        {children}
      </Button>
    );
  }
}

export default connect(state => {
  return {working: state.data.working};
}, {})(TaskButton);
