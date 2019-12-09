import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Opacity from '@material-ui/icons/Gradient';
import { withTheme } from '@material-ui/core/styles';
import Slider from './Slider';
import { lerp, extractAlpha } from '../common/utils';

class OpacityControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  togglePopover(event) {
    if (this.state.open) {
      this.setState({ open: false, anchor: undefined });
    } else if (event) {
      this.setState({ open: true, anchor: event.currentTarget });
    }
  }

  render() {
    const { theme, opacity = 1, onOpacityChange = () => { } } = this.props;
    const { unit } = theme.spacing;
    const opaque = extractAlpha(theme.palette.action.active);

    const style = {
      color: `rgba(0, 0, 0, ${lerp(0.1, opaque, opacity)})`
    };

    const marginString = `${unit * 2}px ${unit * 3}px ${unit}px`;

    return (
      <span>
        <Tooltip title="Opacidade" placement="top">
          <IconButton onClick={e => this.togglePopover(e)}>
            <Opacity style={style} />
          </IconButton>
        </Tooltip>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchor}
          onClose={() => this.togglePopover()}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
        >
          <div style={{ width: 150, margin: marginString, display: "hcenter" }}>
            <Slider
              value={opacity * 100}
              onChange={v => onOpacityChange(v / 100)}
            />
            <Typography variant="body1" align="center" style={{ marginTop: unit }}>
              {parseInt(opacity * 100, 10)}%
            </Typography>
          </div>
        </Popover>
      </span>
    );
  }
}

export default withTheme()(OpacityControl);
