import React from 'react';
import PropertyView from './PropertyView';
import { Button } from 'react-bootstrap';

class SatelliteChoice extends React.Component {
  render() {
    const {
       name, opticalResolution, image, startYear,
       endYear = new Date().getFullYear() // If it hasn't ended yet, assign current year
     } = this.props.spacecraft;

     const { disabled = false, onChoose } = this.props;

    return (
      <Button disabled={disabled} className="satellite-choice" onClick={() => onChoose()}>
        {image &&
          <img src={image}/>
        }

        <h2>{name}</h2>
        <PropertyView icon="visibility" attribute="Resolução ótica" value={opticalResolution + " metros"}/>
        <PropertyView icon="timer" attribute="Período de atividade" value={startYear + "–" + endYear}/>
      </Button>
    );
  }
};

export default SatelliteChoice;
