import React from 'react'
import JsonView from 'react-json-view'

import TransectEvolution from './TransectEvolution'
import { FeatureType } from '../../../common/metadata'

const FeatureInfo = ({ data }) => {
  const componentMap = {
    [FeatureType.TRANSECT]: <TransectEvolution data={data} />,
  }

  const hasComponent = data && data.featureType in componentMap

  return (
    <div>
      {
        hasComponent &&
        componentMap[data.featureType]
      }
      {
        !hasComponent &&
        <JsonView src={data} enableClipboard={false} displayDataTypes={false} />
      }
    </div>
  )
}

export default FeatureInfo