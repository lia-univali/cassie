import React from "react";
import { DropdownButton } from "react-bootstrap";

// @TODO unused component
const AreaProcedureButton = ({
  enabled,
  images,
  title,
  id,
  action,
  ...rest
}) => {
  const createImageItems = () => {
    return images.map(
      (image, i) =>
        null
        // <TaskMenuItem eventKey={image.index} key={i} disabled={image.index === null}>
        //   Imagem {i}: {image.name}
        // </TaskMenuItem>
    );
  };

  return (
    <DropdownButton
      title={title}
      id={id}
      pullRight
      {...rest}
      disabled={!enabled || images.length === 0}
      onSelect={(key) => action(key)}
    >
      {createImageItems()}
    </DropdownButton>
  );
};

export default AreaProcedureButton;
