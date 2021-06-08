import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Checkbox } from "@material-ui/core";
import {
  Table,
  TableHead,
  TableSortLabel,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
} from "@material-ui/core";

import { formatDate, sequence } from "../../../common/utils";
import SatelliteImageThumbnail from "./SatelliteImageThumbnail";

const ImageTable = ({
  images,
  metadata,
  selected = [],
  onCheckboxChange = () => {},
}) => {
  const [t] = useTranslation();

  const [page, setPage] = useState(0);
  const [allChecked, setAllChecked] = useState(1);
  const [rows, setRows] = useState(10);
  const [sorted, setSorted] = useState(sequence(images.length, 0));
  const [orderIndex, setOrderIndex] = useState(null);
  const [order, setOrder] = useState("asc");

  const getMetadata = (image, key) => {
    const m = metadata.find(
      (value) => value.date === image.date && value.missionName === image.name
    );
    return m ? m[key] : undefined;
  };

  const COLUMNS = [
    {
      label: t("forms.acquisition.4.table.id"),
      selector: (index) =>
        `${images[index].shortname} - ${formatDate(images[index].date, true)}`,
    },
    {
      label: t("forms.acquisition.4.table.cloud"),
      selector: (index) => `${(images[index].content * 100).toFixed(1)}%`,
      getValue: (index) => images[index].content,
    },
    {
      label: t("forms.acquisition.4.table.thumbnail"),
      selector: (index) => (
        <SatelliteImageThumbnail
          url={getMetadata(images[index], "thumbnail")}
          height={125}
        />
      ),
    },
  ];

  const createColumns = () => {
    return (
      <TableRow>
        {COLUMNS.map((col, i) => (
          <TableCell
            key={i}
            id={"column" + i}
            sortDirection={orderIndex === i ? order : false}
          >
            <TableSortLabel
              active={orderIndex === i}
              direction={order}
              onClick={() => handleSort(i)}
            >
              {col.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell id={"columnaction"}>
          {t("forms.acquisition.4.table.selected")}
          <Checkbox
              checked={(allChecked === 1)}
              indeterminate = {(allChecked === -1)}
              onChange={(e) => handleCheckAll(e.target.checked)}
            />
        </TableCell>
      </TableRow>
    );
  };

  const createRows = () => {
    const start = page * rows;

    return sorted.slice(start, start + rows).map((v) => {
      return (
        <TableRow key={v}>
          {COLUMNS.map((col, i) => (
            <TableCell key={i}>{col.selector(v)}</TableCell>
          ))}
          <TableCell>
            <Checkbox
              checked={selected[v]}
              onChange={(e) => {
                setAllChecked(-1)
                onCheckboxChange(v, e.target.checked)
              }}
            />
          </TableCell>
        </TableRow>
      );
    });
  };

  const handleCheckAll = (evt) => {
    setAllChecked(evt? 1:0)
    sorted.forEach((v)=>{
      selected[v] = evt
      onCheckboxChange(v, evt)
    })

  }
  const handleSort = (index) => {
    const col = COLUMNS[index];
    const dates = images;

    const ordering = index === orderIndex && order === "desc" ? "asc" : "desc";
    const next = sequence(dates.length, 0);
    const retrieveValue = col.getValue || col.selector;

    next.sort((a, b) => {
      const val = retrieveValue(a) < retrieveValue(b) ? 1 : -1;
      return order === "desc" ? val : -val;
    });

    setSorted(next);
    setOrder(ordering);
    setOrderIndex(index);
  };

  return (
    <Table>
      <TableHead>{createColumns()}</TableHead>
      <TableBody>{createRows()}</TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={4}
            count={images.length}
            rowsPerPage={rows}
            page={page}
            labelDisplayedRows={({ from, to, count }) =>
              `${from} ${t("forms.acquisition.4.to")} ${to} ${t(
                "forms.acquisition.4.of"
              )} ${count}`
            }
            labelRowsPerPage={t("forms.acquisition.4.imagesPerPage")}
            rowsPerPageOptions={[5, 10, 15, 20, 50]}
            onChangePage={(e, page) => setPage(page)}
            onChangeRowsPerPage={(e) => setRows(e.target.value)}
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ImageTable;
