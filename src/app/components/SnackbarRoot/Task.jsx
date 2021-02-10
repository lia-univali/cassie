import React from 'react'

import { Box, CircularProgress, Typography } from '@material-ui/core'

const Task = ({ snack, onClose }) => {
    return (
        <Box className="vcenter">
            <CircularProgress color="secondary" size={32} />
            <Typography className="margin-left" variant="body1" color="inherit">
                {snack.message}
            </Typography>
        </Box>
    )
}

export default Task