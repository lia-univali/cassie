import React from 'react';
import { connect } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import ImageViewer from '../components/ImageViewer';
import { lessPaddedExpansion } from '../theme';

class LoadedImagesAccordion extends React.Component {
  createViewers() {
    return Object.keys(this.props.images).map((id, i) => {
      const image = this.props.images[id];

      return <ImageViewer key={id} index={id} image={image} />
    }).reverse();
  }

  render() {
    return (
      <MuiThemeProvider theme={lessPaddedExpansion}>
        <div style={{ maxHeight: "100%", overflowY: "auto" }}>
          {this.createViewers()}
          {/* {this.props.images.map((image, i) => (
            <Typography variant="body1" key={i} className="margin-below">
              {image.id}

              {image.layers.map((layer, j) => (
                <Typography variant="caption" key={j} className="margin-left">
                  {"    " + layer.title}
                </Typography>
              ))}
            </Typography>
          ))} */}
        </div>
      </MuiThemeProvider>
    )
  }
}

const stateMapper = state => ({ images: state.imagery.images });

export default connect(stateMapper, null)(LoadedImagesAccordion);
