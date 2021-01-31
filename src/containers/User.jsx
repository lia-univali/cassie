import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux';
import MoreIcon from '@material-ui/icons/MoreVert';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { logout } from '../actions/basic';
import { withTranslation } from 'react-i18next'

class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = { anchor: null };
  }

  handleOpen(event) {
    this.setState({ anchor: event.currentTarget });
  }

  handleClose() {
    this.setState({ anchor: null });
  }

  render() {
    const { anchor } = this.state;
    const { t, name, image, children, logout } = this.props;

    if (!name) {
      return null;
    }

    return (
      <div>
        <div className="flex vcenter">
          <Avatar alt={name} src={image} />
          <Typography variant="body2" color="inherit" className="margin-left">
            {name}
          </Typography>
          <IconButton color="inherit" onClick={e => this.handleOpen(e)} disableRipple>
            <MoreIcon />
          </IconButton>
        </div>
        <Menu
          anchorEl={anchor}
          open={anchor !== null}
          onClose={() => this.handleClose()}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          getContentAnchorEl={null}
        >
          {children}
          <MenuItem onClick={() => logout()}>{t('auth.signout')}</MenuItem>
        </Menu>
      </div>
    );
  }
}

const enhancer = compose(
  connect(() => ({}), { logout }),
  withTranslation()
)

export default enhancer(User);
