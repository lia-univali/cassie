import React from 'react';
import { useTranslation } from 'react-i18next'

import { Grid, ListItemText } from '@material-ui/core'

import { Remove as RemoveIcon } from '@material-ui/icons'

const labels = [
    { class: 'forms.map.transects.stable', color: '#43a047' },
    { class: 'forms.map.transects.accreted', color: '#1976d2' },
    { class: 'forms.map.transects.eroded', color: '#ffa000' },
    { class: 'forms.map.transects.criticallyEroded', color: '#d32f2f' }
]

const TransectShapeList = () => {
    const [t] = useTranslation()

    return (
        labels.map((label, index) => (
            <Grid key={index} container direction="row">
                <RemoveIcon style={{ color: label.color }} />
                <ListItemText
                    secondary={t(label.class)}
                />
            </Grid>
        ))
    )
}

export default TransectShapeList