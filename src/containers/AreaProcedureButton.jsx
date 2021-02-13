import React from 'react';
import { connect } from 'react-redux';
import { DropdownButton } from 'react-bootstrap';

// @TODO unused component
class AreaProcedureButton extends React.Component {
  createImageItems() {
    return this.props.images.map((image, i) => (
      null
      // <TaskMenuItem eventKey={image.index} key={i} disabled={image.index === null}>
      //   Imagem {i}: {image.name}
      // </TaskMenuItem>
    ));
  }

  render() {
    const { enabled, images, title, id, action, ...rest } = this.props;


    return (
      <DropdownButton title={title} id={id} pullRight {...rest}
        disabled={!enabled || images.length === 0}
        onSelect={key => action(key)}>
        {this.createImageItems()}
      </DropdownButton>
    );
  }
}

export default connect(state => {
  return {images: state.data.images}
}, {})(AreaProcedureButton);
