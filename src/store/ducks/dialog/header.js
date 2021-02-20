import duckify from '../../tools/duckify'

export const namespace = 'cassie'
export const store = 'dialog'

export const Types =
  duckify(namespace, store, ['OPEN', 'CLOSE', 'PUBLISH'])

export const Actions = {
  open: (name) => ({
    type: Types.OPEN, payload: { name }
  }),
  close: (name) => ({
    type: Types.CLOSE, payload: { name }
  }),
  publish: (name, data) => ({
    type: Types.PUBLISH, payload: { name, data }
  })
}

export default Actions