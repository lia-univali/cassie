import React from 'react';
import JsonView from 'react-json-view';
import DialogContent from '@material-ui/core/Dialog';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/Table';
import TableCell from '@material-ui/core/Table';
import TableHead from '@material-ui/core/Table';
import TableRow from '@material-ui/core/Table';
import DialogActions from './DialogActions';
import BasicDialog from '../app/components/dialog/BasicDialog';

const CompactJsonView = (props) => (
  <JsonView {...props}
    enableClipboard={false}
    displayObjectSize={false}
    displayDataTypes={false}
  />
);

class MetadataDialog extends React.Component {
  createRows() {
    const { data } = this.props.params;

    return Object.keys(data).sort().map((k, i) => {

      return (
        <TableRow key={i} hover>
          <TableCell>{k}</TableCell>
          <TableCell>
            {typeof (data[k]) === "object"
              ? <CompactJsonView src={data[k]} />
              : data[k]
            }
          </TableCell>
        </TableRow>
      );
    });
  }

  render() {
    const { modalProps } = this.props;
    modalProps.maxWidth = "md";

    return (
      <BasicDialog title="Metadados" {...modalProps}>
        <DialogContent className="novpadding">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Propriedade</TableCell>
                <TableCell>Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.createRows()}
            </TableBody>
          </Table>
        </DialogContent>

        <DialogActions withCancel="Fechar" />
      </BasicDialog>
    );
  }
}

export default MetadataDialog;
