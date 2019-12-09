import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { loadImage, selectImage, toggleFiltersExpanded } from '../actions';
import { FormGroup, ControlLabel, Row, Col, FormControl, Button } from 'react-bootstrap';
import TaskButton from './TaskButton';
import Icon from './Icon';
import { filterClouds } from '../operations';

class SatelliteImageChooser extends React.Component {
  createOptions() {
    const { satelliteData, spacecraft, images } = this.props;

    const options = satelliteData.features.map((feature, i) => {
      const label = spacecraft.format(feature.properties);

      return {label, value: i};
    });

    images.forEach(image => options[image.index].disabled = true);

    return options;
  }

  render() {
    const {
      loadImage, selectImage, selectedImage, filters,
      spacecraft, toggleFiltersExpanded, satelliteData
    } = this.props;

    if (!satelliteData) {
      return null;
    }

    const options = this.createOptions();
    const indices = filterClouds(satelliteData, spacecraft, filters.clouds);
    const labelSuffix = ` (${indices.length} resultados)`;

    return (
      <form>
        <FormGroup>
          <ControlLabel>{"Imagem" + labelSuffix}</ControlLabel>
          <Row className="vcenter">
            <Col xs={4}>
              <Select placeholder="Selecione uma imagem"
                options={options}
                value={selectedImage}
                clearValueText="Limpar"
                noResultsText="Nenhum resultado"
                filterOptions={options => indices.map(index => options[index])}
                onChange={option => selectImage(option ? option.value : null)}
              />
            </Col>
            <Col xs={8} className="vcenter near-left">
              <TaskButton onClick={() => loadImage(selectedImage)}
                disabled={selectedImage === null || options[selectedImage].disabled}
              >
                Carregar
              </TaskButton>

              <Button onClick={() => toggleFiltersExpanded()} className="flex flex-right">
                <Icon icon="filter_list"/> Filtros
              </Button>
            </Col>
          </Row>
        </FormGroup>
      </form>
    );
  }
}

const stateMapper = (state, ownProps) => {
  const { satelliteData, selectedImage, spacecraft, images } = state.data;
  return {...ownProps, satelliteData, selectedImage, spacecraft, images, filters: {...state.filters}};
};

export default connect(stateMapper, {
  loadImage, selectImage, toggleFiltersExpanded
})(SatelliteImageChooser);
