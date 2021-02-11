import duckify from '../../tools/duckify';

export const namespace = 'cassie'
export const store = 'snack'

export const Types =
    duckify(namespace, store, ['DISPLAY', 'UPDATE', 'DISMISS', 'TASK', 'SUCCESS', 'INFO', 'WARN', 'ERROR'])

export const Actions = {
    display: (id, type, message, duration = 3000, cancellable = false, onClose = () => { }) => ({
        type: Types.DISPLAY, payload: { id, type, message, duration, cancellable, onClose }
    }),
    update: (payload) => ({
        type: Types.UPDATE, payload
    }),
    dismiss: () => ({
        type: Types.DISMISS
    }),
    task: (id, message, cancellable = false, onClose = () => { }) => ({
        type: Types.DISPLAY, payload: { id, type: 'task', message, duration: null, cancellable, onClose }
    }),
    success: () => ({
        type: Types.DISMISS
    }),
    info: () => ({
        type: Types.DISMISS
    }),
    warn: () => ({
        type: Types.DISMISS
    }),
    error: (id, message, duration = 3000, cancellable = false, onClose = () => { }) => ({
        type: Types.DISPLAY, payload: { id, type: 'alert', severity: 'error', message, duration: duration, cancellable, onClose }
    })
}

export default Actions