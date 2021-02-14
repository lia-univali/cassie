import React from 'react'

import { Table, Panel } from 'react-bootstrap'

// @TODO unused component
const ImageProperties = ({ data }) => {
  const rows = Object.keys(data.properties).sort().map(key => {
    const prop = data.properties[key]

    return (
      <tr key={key}>
        <td>{key}</td>
        <td>{prop.toString()}</td>
      </tr>
    )
  })

  return (
    // @TODO has raw css
    <Panel className='margin-below'>
      <h3 className='title-nomargin'>Características da Imagem</h3>

      <h5><strong>Nome:</strong> {data.id}</h5>

      <div className='table-wrapper'>
        <Table striped condensed bordered className='novmargin'>
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
  )
}

export default ImageProperties
