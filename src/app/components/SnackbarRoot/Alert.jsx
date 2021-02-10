import React from 'react'

import MuiAlert from '@material-ui/lab/Alert'

const Alert = ({ snack, onClose }) => {
    const handleClose = (event, reason) => {
        if (reason !== 'clickaway') {
            onClose(event, 'timeout')
        }
    }

    return (
        <MuiAlert elevation={6} variant='filled' onClose={handleClose} severity={snack.severity}>
            {snack.message}
        </MuiAlert>
    )
}

export default Alert