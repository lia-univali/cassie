import React from 'react';
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, ListItemText } from '@material-ui/core'

import { Remove as RemoveIcon } from '@material-ui/icons'
import StopIcon from '@material-ui/icons/Stop'

const labels = [
    { class: 'forms.map.transects.stable', color: '#43a047' },
    { class: 'forms.map.transects.accreted', color: '#1976d2' },
    { class: 'forms.map.transects.eroded', color: '#ffa000' },
    { class: 'forms.map.transects.criticallyEroded', color: '#d32f2f' }
]

const useStyles = makeStyles(theme => ({
  icon: {
    margin: 0,
    fontSize: '1.75rem',
  }
}))

const TransectShapeList = () => {
    const [t] = useTranslation()
    const classes = useStyles()
    return (
        labels.map((label, index) => (
            <Grid key={index} container direction="row">
                <RemoveIcon style={{ color: label.color }} className={classes.icon} />
                <ListItemText
                    secondary={t(label.class)}
                />
            </Grid>
        ))
    )
}

export default TransectShapeList