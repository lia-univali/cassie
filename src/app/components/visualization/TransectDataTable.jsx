import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Table, TableSortLabel, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'

import { formatDate } from '../../../common/utils'

const column = (key, label, numeric = true, format = undefined) => (
  { key, label, numeric, format }
)

const COLUMNS = [
  column('id', 'ID', true, x => parseInt(x, 10)),
  column('latStart', 'forms.shorelineAnalysis.transectsReport.headers.initialLatitude'),
  column('longStart', 'forms.shorelineAnalysis.transectsReport.headers.initialLongitude'),
  column('latEnd', 'forms.shorelineAnalysis.transectsReport.headers.finalLatitude'),
  column('longEnd', 'forms.shorelineAnalysis.transectsReport.headers.finalLongitude'),
  column('firstDate', 'forms.shorelineAnalysis.transectsReport.headers.initialDate', false, formatDate),
  column('lastDate', 'forms.shorelineAnalysis.transectsReport.headers.finalDate', false, formatDate),
  column('intercept', 'forms.shorelineAnalysis.transectsReport.headers.intercept'),
  column('slope', 'forms.shorelineAnalysis.transectsReport.headers.slope'),
  column('rsquared', 'forms.shorelineAnalysis.transectsReport.headers.rsquared'),
  column('lrr', 'forms.shorelineAnalysis.transectsReport.headers.lrr'),
  column('sce', 'forms.shorelineAnalysis.transectsReport.headers.sce'),
  column('nsm', 'forms.shorelineAnalysis.transectsReport.headers.nsm'),
  column('epr', 'forms.shorelineAnalysis.transectsReport.headers.epr'),
  column('label', 'forms.shorelineAnalysis.transectsReport.headers.label', false)
]

const TransectDataTable = ({ data }) => {
  const [t] = useTranslation()

  const [sortProperty, setSortProperty] = useState('id')
  const [ordering, setOrdering] = useState('asc')

  const sortedRows = () => {
    return [...data].sort((a, b) => {
      if (a[sortProperty] === b[sortProperty]) {
        return 0
      }

      const val = a[sortProperty] < b[sortProperty] ? -1 : 1

      if (ordering === 'desc') {
        return -val
      }

      return val
    })
  }

  const handleSort = (newProperty) => {
    if (newProperty === sortProperty) {
      setOrdering(ordering => ordering === 'asc' ? 'desc' : 'asc')
    } else {
      setOrdering('asc')
      setSortProperty(newProperty)
    }
  }

  return (
    <div style={{ maxHeight: "55vh", overflow: "auto", marginTop: 8 }}>
      <Table>
        <TableHead>
          <TableRow>
            {
              COLUMNS.map(({ key, label }) => (
                <TableCell key={key} align='center'>
                  <TableSortLabel
                    active={key === sortProperty}
                    direction={ordering}
                    onClick={e => handleSort(key)}
                  >
                    {t(label)}
                  </TableSortLabel>
                </TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            sortedRows().map(row => (
              <TableRow key={row.id}>
                {
                  COLUMNS.map(({ key, numeric, format }) => (
                    <TableCell align={numeric ? 'left' : 'center'} key={key}>
                      {format
                        ? format(row[key])
                        : (numeric ? parseFloat(row[key]).toFixed(4) : row[key])}
                    </TableCell>
                  ))
                }
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}

export default TransectDataTable
