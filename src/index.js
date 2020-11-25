import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./store";
import moment from "moment";
import registerServiceWorker from "./registerServiceWorker";
import { CLIENT_ID } from "./actions/user";
import Boot from "./Boot";
import i18n from './lang'

const store = configureStore();
window.store = store;
window.i18n = i18n;
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
