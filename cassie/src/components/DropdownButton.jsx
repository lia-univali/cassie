import React from 'react';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

class DropdownButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {open: false};
  }

  createButton() {
    const { icon, text, children, className, onClick, ...rest } = this.props;

    const SpecializedButton = icon ? IconButton : Button;
    const Icon = icon;

    return (
      <SpecializedButton onClick={(e) => this.openMenu(e)} {...rest}>
        {text || null}
        {icon && <Icon/>}
      </SpecializedButton>
    );
  }

  closeMenu() {
    this.setState({open: false});
  }

  openMenu(event) {
    this.setState({open: true, anchor: event.currentTarget});
  }

  handleClick() {
    if (this.props.onClick) {
      this.props.onClick();
    }
    
    this.closeMenu();
  }

  render() {
    const { className, children } = this.props;

    return (
      <div className={className}>
        {this.createButton()}
        <Menu anchorEl={this.state.anchor}
          onClick={() => this.handleClick()}
          open={this.state.open}
          onClose={() => this.closeMenu()}
        >
          {children}
        </Menu>
      </div>
    );
  }
}

export default DropdownButton;
