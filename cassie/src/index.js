import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./store";
import moment from "moment";
import registerServiceWorker from "./registerServiceWorker";
import { CLIENT_ID } from "./actions/user";
import Boot from "./Boot";

import { standard } from './common/satellites'
import { sortMissionsDates } from './common/algorithms'

console.log(standard);



const missionDates = [
  {
    name: 'LT05',
    date: '2019-11-09',
    content: 0.1
  },
  {
    name: 'LE08',
    date: '2019-11-08',
    content: 0.1
  },
  {
    name: 'LT05',
    date: '2019-11-08',
    content: 0.1
  },
  {
    name: 'LT05',
    date: '1999-11-01',
    content: 0.1
  },
  {
    name: 'LS07',
    date: '2019-11-11',
    content: 0.1
  }
];

console.log(sortMissionsDates(missionDates));

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
