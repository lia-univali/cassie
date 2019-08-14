import React from 'react';
import { connect } from 'react-redux';
import MoreIcon from '@material-ui/icons/MoreVert';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { logout } from 'actions/basic';

class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {anchor: null};
  }

  handleOpen(event) {
    this.setState({anchor: event.currentTarget});
  }

  handleClose() {
    this.setState({anchor: null});
  }

  render() {
    const { anchor } = this.state;
    const { name, image, children, logout, ...rest } = this.props;

    if (!name) {
      return null;
    }

    return (
      <div>
        <div className="flex vcenter">
          <Avatar alt={name} src={image}/>
          <Typography variant="body2" color="inherit" className="margin-left">
            {name}
          </Typography>
          <IconButton color="inherit" onClick={e => this.handleOpen(e)} disableRipple>
            <MoreIcon/>
          </IconButton>
        </div>
        <Menu
          anchorEl={anchor}
          open={anchor !== null}
          onClose={() => this.handleClose()}
          anchorOrigin={{vertical: "bottom", horizontal: "right"}}
          getContentAnchorEl={null}
        >
          {children}
          <MenuItem onClick={() => logout()}>Sair</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default connect(() => ({}), {logout})(User);
