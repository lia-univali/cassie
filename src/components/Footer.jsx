import React from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  wrapper: {
    marginTop: 'auto',
    width: '100%',
  },
  footer: {
    marginTop: theme.spacing(3),
    height: 150,
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    backgroundColor: theme.palette.grey[200],
  }
}))

const Footer = ({ }) => {
  const [t] = useTranslation()
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <div className={classes.footer}>
        <Typography variant='body1' gutterBottom>
          {t('self.poweredBy')}
        </Typography>
        <Typography variant='body1'>
          {t('self.imageryProvider')}
        </Typography>
      </div>
    </div>
  )
}

export default Footer
