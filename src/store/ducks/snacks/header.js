import duckify from '../../tools/duckify';

import { Task } from '../../../app/components'

export const namespace = 'cassie'
export const store = 'snacks'

export const Types =
    duckify(namespace, store, ['DISPLAY', 'UPDATE', 'DISMISS', 'ERASE'])

export const Actions = {
    display: (key, message, options) => ({
        type: Types.DISPLAY, payload: { key, message, options }
    }),
    update: (key, data) => ({
        type: Types.UPDATE, payload: { key, data }
    }),
    dismiss: (key) => ({
        type: Types.DISMISS, payload: { key, dismissAll: !key }
    }),
    erase: (key) => ({
        type: Types.ERASE, payload: { key }
    }),
    task: (key, message, options = {}) => ({
        type: Types.DISPLAY,
        payload: {
            key,
            message: (
                <Task id={key} message={message} dismissable={options.dismissable} />
            ),
            options: { ...options, persist: true }
        }
    }),
    success: () => ({
        type: Types.DISPLAY
    }),
    info: () => ({
        type: Types.DISPLAY
    }),
    warn: () => ({
        type: Types.DISPLAY
    }),
    error: (key, message, options) => ({
        type: Types.DISPLAY, payload: { key, message, options: { ...options, variant: 'error'} }
    })
}

export default Actions