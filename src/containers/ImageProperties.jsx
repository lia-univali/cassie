import React from 'react';
import { connect } from 'react-redux';
import { Table, Panel } from 'react-bootstrap';

class ImageProperties extends React.Component {
  render() {
    const { data } = this.props;

    const rows = Object.keys(data.properties).sort().map(key => {
      const prop = data.properties[key];

      return (
        <tr key={key}>
          <td>{key}</td>
          <td>{prop.toString()}</td>
        </tr>
      );
    });

    return (
      <Panel className="margin-below">
        <h3 className="title-nomargin">Características da Imagem</h3>

        <h5><strong>Nome:</strong> {data.id}</h5>

        <div className="table-wrapper">
          <Table striped condensed bordered className="novmargin">
            <thead>
              <tr>
                <th>Propriedade</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </Table>
        </div>
      </Panel>
    );
  }
}

const stateMapper = (state) => {
  const { satelliteData, selectedImage } = state.data;

  if (!satelliteData || selectedImage === undefined) {
    return {};
  }

  return {data: satelliteData.features[selectedImage]};
}

export default connect(stateMapper, null)(ImageProperties);
