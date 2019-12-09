import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./store";
import moment from "moment";
import registerServiceWorker from "./registerServiceWorker";
import { CLIENT_ID } from "./actions/user";
import Boot from "./Boot";
import * as shp from "shapefile"

shp.open("./resources/sample/baseline.shp", "./resources/sample/baseline.dbf")
  .then(source => source.read()
    .then(function log(result) {
      if (result.done) return;
      console.log(result)
      return source.read().then(log)
    })
  )

const store = configureStore();
console.log("Store configured");
window.store = store;
moment.locale("pt-BR");

let Cassie = () => (
  <Provider store={store}>
    <Boot />
  </Provider>
);

window.gapi.load("auth2", () => {
  window.gapi.auth2
    .init({
      client_id: CLIENT_ID
    })
    .then(() => {
      ReactDOM.render(<Cassie />, document.getElementById("root"));
      registerServiceWorker();
    });
});
