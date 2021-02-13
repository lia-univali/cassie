import React from 'react'
import { connect, useSelector, shallowEqual } from 'react-redux'
import { isDialogOpen } from '../../../selectors'
import { closeDialog, publishOutcome } from '../../../store/ducks/dialog'

const registeredDialogs = {}
window.rd = registeredDialogs

export const registerDialog = (name, mapStateToProps = () => ({}), actionCreators = {}) => {
  return (Component) => {
    const close = () => closeDialog(name)
    const publish = payload => publishOutcome(name, payload)

    const ConnectedComponent = connect(state => ({
      ...mapStateToProps(state),
      open: isDialogOpen(name)(state),
    }), {
      ...actionCreators, close, publish
    })(Component)

    registeredDialogs[name] = ConnectedComponent

    console.log("Registered", name)

    return ConnectedComponent
  }
}

const DialogRoot = ({}) => {
  const dialogs = useSelector(state => state.dialog.dialogs, shallowEqual)

  return (
    <div>
      {
        Object.keys(registeredDialogs).map(k => {
          const Component = registeredDialogs[k]
          return <Component key={k} />
        })
      }
    </div>
  )
}

export default DialogRoot