import React from 'react'

import { Card, CardHeader } from '@material-ui/core'
import { Divider, IconButton, Slide } from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'

const CloseableTitle = ({title, subtitle, onDismiss = () => {}}) => (
  <CardHeader
    action={
      <IconButton onClick={onDismiss} style={{ marginRight: 8 }}>
        <CloseIcon/>
      </IconButton>
    }
    title={title}
    subheader={subtitle}
  >
    <Typography variant='headline'>{title}</Typography>
  </CardHeader>
)

// @TODO unused component
const DismissablePanel = ({ shown, title, subtitle, onExited = () => {}, onDismiss = () => {}, children }) => {
  return (
    <Slide in={shown} direction='left' mountOnEnter unmountOnExit
      onExited={onExited}
    >
      <Card>
        <CloseableTitle title={title} subtitle={subtitle}
          onDismiss={onDismiss}
        />
        <Divider/>
        {children}
      </Card>
    </Slide>
  )
}

export default DismissablePanel