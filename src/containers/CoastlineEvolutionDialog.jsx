import React from "react";
import { Line, Bar } from "react-chartjs-2";
import { registerDialog } from "./DialogRoot";
import { exportCSV, exportJSON, exportCoordinates } from "../common/utils";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TransectDataTable from "./TransectDataTable";
import { Menu, MenuItem } from "@material-ui/core";

import Export from "../services/Export";

class CoastlineEvolutionDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 0,
      transectosAnchorEl: null,
      baselineAnchorEl: null
    };
  }

  createOptions() {
    return {
      layout: {
        padding: 16
      }
    };
  }

  shapeData() {
    const { coastlineData } = this.props;

    if (coastlineData === undefined) {
      return {};
    }

    return {
      labels: coastlineData.map(el => el.date),
      datasets: [
        {
          label: "Distância",
          fill: false,
          backgroundColor: coastlineData.map(el => el.color),
          borderColor: "rgba(0, 0, 0, 0)",
          data: coastlineData.map(el => el.mean)
        }
      ]
    };
  }

  doAndClose = (fn, el) => {
    this.setState({ [el]: null });
  };

  render() {
    const { close, open, transectData, baselineData, exportable } = this.props;

    const tabs = [
      <TransectDataTable data={transectData} />
    ];

    return (
      <Dialog open={open} maxWidth="md" onClose={() => close()}>
        <DialogTitle>Análise da Linha de Costa</DialogTitle>
        <DialogContent>
          <Paper>
            <AppBar position="static" color="default">
              <Tabs
                value={this.state.tab}
                indicatorColor="primary"
                textColor="primary"
                onChange={(e, tab) => this.setState({ tab })}
              >
                <Tab label="Relatório de Transectos" />
              </Tabs>
            </AppBar>

            {tabs[this.state.tab]}
          </Paper>

          {/*<Bar options={this.createOptions()} data={this.shapeData()} width={600} height={300}/>*/}
        </DialogContent>
        <DialogActions>
          {this.state.tab === 0 && (
            <div>
              <Button
                onClick={e =>
                  this.setState({ transectosAnchorEl: e.currentTarget })
                }
              >
                Exportar Dados de Transectos
              </Button>
              <Menu
                anchorEl={this.state.transectosAnchorEl}
                open={Boolean(this.state.transectosAnchorEl)}
                onClose={() => this.setState({ transectosAnchorEl: null })}
              >
                <MenuItem
                  onClick={() =>
                    this.doAndClose(
                      exportCSV(transectData, "transects.csv"),
                      "transectosAnchorEl"
                    )
                  }
                >
                  Exportar CSV
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    this.doAndClose(
                      exportJSON(transectData, "transects.json"),
                      "transectosAnchorEl"
                    )
                  }
                >
                  Exportar JSON
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    this.doAndClose(
                      Export.table.toDevice.asShapefileGroup(
                        [
                          exportable.shpBaseline,
                          exportable.shpCoasts,
                          exportable.shpTransects
                        ],
                        Export.defaultOptions.device.shapefileGroup(
                          "layers",
                          "baseline",
                          "coastlines",
                          "transects"
                        )
                      ),
                      "transectosAnchorEl"
                    )
                  }
                >
                  Exportar Shapefile
                </MenuItem>
              </Menu>
            </div>
          )}
          <Button color="primary" onClick={() => close()}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

function shapeTransectData(transectData) {
  return transectData.map((content, i) => {
    const { id, geometry, properties } = content;
    const [lngStart, latStart] = geometry.coordinates[0];
    const [lngEnd, latEnd] = geometry.coordinates[1];

    const { lrr, trend, sce, nsm, epr } = properties;
    const r = trend.correlation;
    const rSquared = Math.pow(r, 2);
    const intercept = trend.offset;
    const slope = trend.scale;
    const classification = properties.class;

    const dates = Object.values(properties.distances).map(el =>
      moment(el.date)
    );
    const firstDate = moment(moment.min(dates)).format();
    const lastDate = moment(moment.max(dates)).format();

    return {
      id: parseInt(id, 10),
      lngStart,
      latStart,
      lngEnd,
      latEnd,
      firstDate,
      lastDate,
      intercept,
      slope,
      lrr,
      r,
      rSquared,
      sce,
      nsm,
      epr,
      class: classification
    };
  });
}

export default registerDialog("coastlineEvolution", state => ({
  coastlineData: state.results.coastlineData
    ? state.results.coastlineData.evolution
    : undefined,
  coastlineCollection: state.results.coastlineData
    ? state.results.coastlineData.coastlineCollection
    : {},
  baselineData: state.results.baselineData ? state.results.baselineData : {},
  transectData: state.results.coastlineData
    ? shapeTransectData(state.results.coastlineData.transectData)
    : [],
  exportable: state.results.coastlineData
    ? state.results.coastlineData.exportable
    : {}
}))(CoastlineEvolutionDialog);
