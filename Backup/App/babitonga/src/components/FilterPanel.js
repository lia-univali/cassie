import React from 'react';
import { connect } from 'react-redux';
import { Panel, Form, FormGroup, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import Collapse from 'react-collapse';
import { updateFilter } from '../actions';

class FilterPanel extends React.Component {
  createCloudOptions(amount) {
    const options = [];
    const interval = 100 / amount;

    for (let i = amount; i > 0; i--) {
      const value = Math.round(i * interval);
      const label = `≤ ${value}%`;

      options.push({label, value});
    }

    options.push({label: "= 0%", value: 0});
    return options;
  }

  render() {
    const { expanded, updateFilter, clouds } = this.props;

    return (
      <Collapse isOpened={expanded}>
        <div className="filter-wrapper">
          <Panel>
            <Form inline className="filter-form">
              <FormGroup>
                <ControlLabel>Percentual de nuvens</ControlLabel>
                <Select placeholder="Escolha um..."
                  value={clouds}
                  clearable={false}
                  options={this.createCloudOptions(10)}
                  onChange={option => updateFilter("clouds", option.value)}
                />
              </FormGroup>
            </Form>
          </Panel>
        </div>
      </Collapse>
    );
  }
}

export default connect(state => {
  return {...state.filters};
}, {
  updateFilter
})(FilterPanel);
