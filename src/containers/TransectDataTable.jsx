import React from 'react';
import { connect } from 'react-redux';
import { formatDate } from '../common/utils';
import JsonView from 'react-json-view';
import Table from '@material-ui/core/Table';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { withTranslation } from 'react-i18next'

class TransectDataTable extends React.Component {
  constructor(props) {
    super(props);

    const { t } = this.props;

    this.state = {
      sortProperty: "id",
      ordering: "asc",
    }

    const col = (key, label, numeric = true, format = undefined) => ({ key, label, numeric, format });

    this.columns = [
      col("id", "ID", true, x => parseInt(x, 10)),
      col("latStart", t('forms.shorelineAnalysis.transectsReport.headers.initialLatitude')),
      col("lngStart", t('forms.shorelineAnalysis.transectsReport.headers.initialLongitude')),
      col("latEnd", t('forms.shorelineAnalysis.transectsReport.headers.finalLatitude')),
      col("lngEnd", t('forms.shorelineAnalysis.transectsReport.headers.finalLongitude')),
      col("firstDate", t('forms.shorelineAnalysis.transectsReport.headers.initialDate'), false, formatDate),
      col("lastDate", t('forms.shorelineAnalysis.transectsReport.headers.finalDate'), false, formatDate),
      col("intercept", t('forms.shorelineAnalysis.transectsReport.headers.intercept')),
      col("slope", t('forms.shorelineAnalysis.transectsReport.headers.slope')),
      col("rSquared", t('forms.shorelineAnalysis.transectsReport.headers.rSquared')),
      col("lrr", t('forms.shorelineAnalysis.transectsReport.headers.lrr')),
      col("sce", t('forms.shorelineAnalysis.transectsReport.headers.sce')),
      col("nsm", t('forms.shorelineAnalysis.transectsReport.headers.nsm')),
      col("epr", t('forms.shorelineAnalysis.transectsReport.headers.epr')),
      col("class", t('forms.shorelineAnalysis.transectsReport.headers.classification'), false)
    ];
  }

  sortRows() {
    const { sortProperty, ordering } = this.state;

    return [...this.props.data].sort((a, b) => {
      if (a[sortProperty] === b[sortProperty]) {
        return 0;
      }

      const val = a[sortProperty] < b[sortProperty] ? -1 : 1;

      if (ordering === "desc") {
        return -val;
      }

      return val;
    });
  }

  handleSort(newProperty) {
    const { sortProperty, ordering } = this.state;

    if (newProperty === sortProperty) {
      this.setState({ ordering: ordering === "desc" ? "asc" : "desc" });
    } else {
      this.setState({ ordering: "desc", sortProperty: newProperty });
    }
  }

  render() {
    const { sortProperty, ordering } = this.state;

    return (
      <div style={{ maxHeight: "55vh", overflow: "auto", marginTop: 8 }}>
        <Table>
          <TableHead>
            <TableRow>
              {this.columns.map(({ key, label, numeric }) => (
                <TableCell key={key} numeric={numeric}>
                  <TableSortLabel
                    active={key === sortProperty}
                    direction={ordering}
                    onClick={e => this.handleSort(key)}
                  >
                    {label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {this.sortRows().map(row => (
              <TableRow key={row.id}>
                {this.columns.map(({ key, numeric, format }) => (
                  <TableCell numeric={numeric} key={key}>
                    {format ? format(row[key]) : (numeric ? parseFloat(row[key]).toFixed(4) : row[key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default withTranslation()(TransectDataTable);
