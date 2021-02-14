import React from 'react';
import RcSlider, { Range as RcRange } from 'rc-slider';
import { withTheme } from '@material-ui/core/styles';
import ColorConvert from 'color-convert';

const Slider = ({theme, ...rest}) => {
  const { primary } = theme.palette;

  return (
    <RcSlider {...rest}
      trackStyle={{backgroundColor: primary[500]}}
      handleStyle={{borderColor: primary[300]}}
    />
  );
}

const rangeTheme = (theme) => {
  const { primary, secondary } = theme.palette;

  const track = {
    backgroundColor: primary.dark,
    height: 6
  };

  const handle = {
    borderColor: primary.main,
    backgroundColor: primary.main,
    width: 22,
    height: 22,
    marginTop: -8,
    marginLeft: -11,
  };

  const secRgb = ColorConvert.hex.rgb(secondary.main);

  const dot = {
    border: "none",
    backgroundColor: `rgba(${secRgb[0]}, ${secRgb[1]}, ${secRgb[2]}, 0.25)`,
    width: 4,
    height: 12,
    bottom: -5,
  };

  return {
    trackStyle: [track, track],
    handleStyle: [handle, handle],
    railStyle: {
      ...track,
      backgroundColor: primary[100]
    },
    activeDotStyle: {
      ...dot
    },
    dotStyle: {
      ...dot,
      backgroundColor: `rgba(${secRgb[0]}, ${secRgb[1]}, ${secRgb[2]}, 0.02)`,
    }
  }
};

const ThemedRange = ({theme, ...rest}) => {
  const mergedProps = {...rest, ...rangeTheme(theme)};

  return <RcRange {...mergedProps}/>;
};


export const createRangeWithTooltip = () => {
  const Enhanced = RcSlider.createSliderWithTooltip(RcRange);

  return withTheme(({theme, ...rest}) => {
    const mergedProps = {...rest, ...rangeTheme(theme)};

    return <Enhanced {...mergedProps}/>
  });
};


export const Range = withTheme(ThemedRange);
export default withTheme(Slider);
