import duckify from '../../tools/duckify'

export const namespace = 'cassie'
export const store = 'results'

export const Types =
  duckify(namespace, store, ['PUSH'])

export const Actions = {
  push: (identifier, data) => ({
    type: Types.PUSH, payload: { identifier, data }
  })
}

export default Actions