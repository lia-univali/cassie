import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { sequence } from '../common/utils';
import SatelliteImageThumbnail from './SatelliteImageThumbnail';
import { withTranslation } from 'react-i18next'

class ImageTable extends React.Component {
  constructor(props) {
    super(props);

    const { t } = props;

    const getMetadata = (image, key) => {
      const m = this.props.metadata.find(value => value.date === image.date && value.missionName === image.name)
      return m === undefined ? undefined : m[key];
    }

    this.columns = [
      { label: t('forms.acquisition.4.table.id'), selector: index => this.props.images[index].shortname + "/" + this.props.images[index].date },
      { label: t('forms.acquisition.4.table.cloud'), selector: index => (this.props.images[index].content * 100).toFixed(1) + "%", getValue: index => this.props.images[index].content },
      { label: t('forms.acquisition.4.table.thumbnail'), selector: index => <SatelliteImageThumbnail url={getMetadata(this.props.images[index], "thumbnail")} height={125} /> },
    ];

    this.state = {
      page: 0,
      rows: 10,
      sorted: sequence(props.images.length, 0)
    };
  }

  createRows() {
    const start = this.state.page * this.state.rows;
    const {
      selected = [],
      onCheckboxChange = () => { },
    } = this.props;

    return this.state.sorted.slice(start, start + this.state.rows).map(v => {
      return (
        <TableRow key={v}>
          {this.columns.map((col, i) => (
            <TableCell key={i}>{col.selector(v)}</TableCell>
          ))}
          <TableCell>
            <Checkbox checked={selected[v] === true}
              onChange={e => onCheckboxChange(v, e.target.checked)}
            />
          </TableCell>
        </TableRow>
      );
    });
  }

  handleSort(index) {
    const col = this.columns[index];
    const { images } = this.props;

    const dates = images;

    let order = "desc";
    if (index === this.state.orderIndex && this.state.order === "desc") {
      order = "asc";
    }

    const sorted = sequence(dates.length, 0);
    const retrieveValue = col.getValue || col.selector;

    sorted.sort((a, b) => {
      const val = retrieveValue(dates[a]) < retrieveValue(dates[b]) ? 1 : -1;
      return order === "desc" ? val : -val;
    });

    this.setState({ sorted, order, orderIndex: index });
  }

  createColumns() {
    const { orderIndex, order } = this.state;
    const { t } = this.props

    return (
      <TableRow>
        {this.columns.map((col, i) => (
          <TableCell key={i} sortDirection={orderIndex === i ? order : false}>
            <TableSortLabel active={orderIndex === i} direction={order} onClick={() => this.handleSort(i)}>
              {col.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell>
          {t('forms.acquisition.4.table.selected')}
        </TableCell>
      </TableRow>
    );
  }

  render() {
    const { t } = this.props

    return (
      <Table>
        <TableHead>
          {this.createColumns()}
        </TableHead>
        <TableBody>
          {this.createRows()}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination colSpan={4}
              count={this.props.images.length}
              rowsPerPage={this.state.rows}
              page={this.state.page}
              labelDisplayedRows={({ from, to, count }) => `${from} ${t('forms.acquisition.4.to')} ${to} ${t('forms.acquisition.4.of')} ${count}`}
              labelRowsPerPage={t('forms.acquisition.4.imagesPerPage')}
              rowsPerPageOptions={[5, 10, 15, 20, 50]}
              onChangePage={(e, page) => this.setState({ page })}
              onChangeRowsPerPage={(e) => this.setState({ rows: e.target.value })}
            />
          </TableRow>
        </TableFooter>
      </Table>
    )
  }
}

export default withTranslation()(ImageTable);
