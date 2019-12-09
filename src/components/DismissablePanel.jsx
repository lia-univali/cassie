import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Slide from '@material-ui/core/Slide';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const CloseableTitle = ({title, subtitle, onDismiss = () => {}}) => (
  <CardHeader
    action={
      <IconButton onClick={() => onDismiss()} style={{marginRight: 8}}>
        <CloseIcon/>
      </IconButton>
    }
    title={title}
    subheader={subtitle}
  >
    {/* <Typography variant="headline">{title}</Typography> */}
  </CardHeader>
);

export default class DismissablePanel extends React.Component {
  render() {
    return (
      <Slide in={this.props.shown} direction="left" mountOnEnter unmountOnExit
        onExited={() => this.props.onExited()}
      >
        <Card>
          <CloseableTitle title={this.props.title} subtitle={this.props.subtitle}
            onDismiss={this.props.onDismiss}
          />
          <Divider/>
          {this.props.children}
        </Card>
      </Slide>
    );
  };
}
