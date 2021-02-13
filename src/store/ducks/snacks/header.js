import duckify from '../../tools/duckify';

export const namespace = 'cassie'
export const store = 'snacks'

export const Types =
    duckify(namespace, store, ['DISPLAY', 'UPDATE', 'DISMISS', 'ERASE'])

export const Actions = {
    display: (key, message, options = {}) => ({
        type: Types.DISPLAY, payload: { type: 'regular', key, message, options }
    }),
    update: (key, message, options = {}) => ({
        type: Types.UPDATE, payload: { key, data: { message, options } }
    }),
    dismiss: (key) => ({
        type: Types.DISMISS, payload: { key, dismissAll: !key }
    }),
    erase: (key) => ({
        type: Types.ERASE, payload: { key }
    }),
    task: (key, message, options = { variant: 'indeterminate', value: 0 }) => ({
        type: Types.DISPLAY,
        payload: {
            type: 'task',
            key,
            message,
            options: { ...options, persist: true }
        }
    }),
    success: (key, message, options = {}) => ({
        type: Types.DISPLAY, payload: { type: 'alert', key, message, options: { ...options, variant: 'success'} }
    }),
    info: (key, message, options = {}) => ({
        type: Types.DISPLAY, payload: { type: 'alert', key, message, options: { ...options, variant: 'info'} }
    }),
    warn: (key, message, options = {}) => ({
        type: Types.DISPLAY, payload: { type: 'alert', key, message, options: { ...options, variant: 'warning'} }
    }),
    error: (key, message, options = {}) => ({
        type: Types.DISPLAY, payload: { type: 'alert', key, message, options: { ...options, variant: 'error'} }
    })
}

export default Actions