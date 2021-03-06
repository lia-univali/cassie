import React from "react";
import { connect, useSelector, shallowEqual } from "react-redux";
import { isDialogOpen } from "../../../selectors";
import { Actions as Dialog } from "../../../store/ducks/dialog";

const registeredDialogs = {};
window.rd = registeredDialogs;

export const registerDialog = (
  name,
  mapStateToProps = () => ({}),
  actionCreators = {}
) => {
  return (Component) => {
    const close = () => Dialog.close(name);
    const publish = (payload) => Dialog.publish(name, payload);

    const ConnectedComponent = connect(
      (state) => ({
        ...mapStateToProps(state),
        open: isDialogOpen(name)(state),
      }),
      {
        ...actionCreators,
        close,
        publish,
      }
    )(Component);

    registeredDialogs[name] = ConnectedComponent;

    console.log("Registered", name);

    return ConnectedComponent;
  };
};

const DialogRoot = () => {
  // eslint-disable-next-line no-unused-vars
  const dialogs = useSelector((state) => state.dialog.dialogs, shallowEqual);

  return (
    <div>
      {Object.keys(registeredDialogs).map((k) => {
        const Component = registeredDialogs[k];
        return <Component key={k} />;
      })}
    </div>
  );
};

export default DialogRoot;
