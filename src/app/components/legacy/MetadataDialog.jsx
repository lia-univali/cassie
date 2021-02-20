import React from 'react'
import JsonView from 'react-json-view'

import { Dialog as DialogContent } from '@material-ui/core'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'

import DialogActions from './DialogActions'
import BasicDialog from '../dialog/BasicDialog'

const CompactJsonView = (props) => (
  <JsonView {...props}
    enableClipboard={false}
    displayObjectSize={false}
    displayDataTypes={false}
  />
)

// @TODO unused component
// Uses erased modal logic
const MetadataDialog = (params, modalProps) => {
  modalProps.maxWidth = 'md'

  const createRows = () => {
    const { data } = params

    return Object.keys(data).sort().map((k, i) => {
      return (
        <TableRow key={i} hover>
          <TableCell>{k}</TableCell>
          <TableCell>
            {typeof (data[k]) === 'object'
              ? <CompactJsonView src={data[k]} />
              : data[k]
            }
          </TableCell>
        </TableRow>
      );
    });
  }

  return (
    <BasicDialog title='Metadados' {...modalProps}>
      <DialogContent className='novpadding'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Propriedade</TableCell>
              <TableCell>Valor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {createRows()}
          </TableBody>
        </Table>
      </DialogContent>

      <DialogActions withCancel='Fechar' />
    </BasicDialog>
  )
}

export default MetadataDialog
