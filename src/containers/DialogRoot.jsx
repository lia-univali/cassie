import React from 'react';
import { connect } from 'react-redux';
import { isDialogOpen } from '../selectors';
import { closeDialog, publishOutcome } from '../store/ducks/dialog';

const registeredDialogs = {};
window.rd = registeredDialogs;

class DialogRoot extends React.Component {
  renderDialogs() {
    return Object.keys(registeredDialogs).map(k => {
      const Component = registeredDialogs[k];

      return <Component key={k} />;
    });
  }

  render() {
    return (
      <div>
        {this.renderDialogs()}
      </div>
    );
  }
}

export default connect(state => ({
  dialogs: state.dialog.dialogs
}))(DialogRoot);

export function registerDialog(name, mapStateToProps = () => ({}), actionCreators = {}) {
  return function (Component) {
    const close = () => closeDialog(name);
    const publish = payload => publishOutcome(name, payload);

    const ConnectedComponent = connect(state => ({
      ...mapStateToProps(state),
      open: isDialogOpen(name)(state),
    }), {
      ...actionCreators, close, publish
    })(Component);

    registeredDialogs[name] = ConnectedComponent;
    console.log("Registered", name);
    return ConnectedComponent;
  }
}
