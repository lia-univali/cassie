import React, { useState } from "react";

import { Button, IconButton, Menu } from "@material-ui/core";

const DropdownButton = ({
  icon,
  text,
  className,
  children,
  onClick = () => {},
  ...rest
}) => {
  const [state, setState] = useState({ open: false, anchor: null });
  const { open, anchor } = state;

  const openMenu = (e) => {
    setState({ open: true, anchor: e.currentTarget });
  };

  const closeMenu = () => {
    setState({ open: false, anchor: null });
  };

  const createButton = () => {
    const SpecializedButton = icon ? IconButton : Button;
    const Icon = icon;

    return (
      <SpecializedButton onClick={openMenu} {...rest}>
        {text || null}
        {icon && <Icon />}
      </SpecializedButton>
    );
  };

  const handleClick = () => {
    onClick();
    closeMenu();
  };

  return (
    <div className={className}>
      {createButton()}
      <Menu
        anchorEl={anchor}
        onClick={handleClick}
        open={open}
        onClose={closeMenu}
      >
        {children}
      </Menu>
    </div>
  );
};

export default DropdownButton;
