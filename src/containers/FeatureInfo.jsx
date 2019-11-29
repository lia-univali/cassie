import React from 'react';
import JsonView from 'react-json-view';
import { FeatureType } from '../common/metadata';
import TransectEvolution from '../components/TransectEvolution';

class FeatureInfo extends React.Component {
  constructor(props) {
    super(props);

    this.componentMap = {
      [FeatureType.TRANSECT]: <TransectEvolution data={this.props.data} />,

    };
  }

  render() {
    const { data } = this.props;

    return (
      <div>
        {data && data.featureType in this.componentMap ? (
          this.componentMap[data.featureType]
        ) : (
            <JsonView src={data} enableClipboard={false} displayDataTypes={false} />
          )}
      </div>
    );
  }
}

export default FeatureInfo;
