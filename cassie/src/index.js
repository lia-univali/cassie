import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./store";
import moment from "moment";
import registerServiceWorker from "./registerServiceWorker";
import { CLIENT_ID } from "actions/user";
import Boot from "./Boot";

const store = configureStore();
console.log("Store configured");
window.store = store;
moment.locale("pt-BR");

let Cassie = () => (
  <Provider store={store}>
    <Boot />
  </Provider>
);

// const renderApplication = () => {
//   ReactDOM.render(
//     <Provider store={store}>
//       <MuiThemeProvider theme={theme}>
//         <AppContainer>
//           <App/>
//         </AppContainer>
//       </MuiThemeProvider>
//     </Provider>,
//   document.getElementById('root'));
//
//   if (module.hot) {
//     module.hot.accept("./App.jsx", () => {
//       const NextApp = require("./App.jsx").default;
//       console.log(NextApp);
//
//       ReactDOM.render(
//         <Provider store={store}>
//           <MuiThemeProvider theme={theme}>
//             <AppContainer>
//               <NextApp/>
//             </AppContainer>
//           </MuiThemeProvider>
//         </Provider>,
//       document.getElementById('root'));
//     });
//   }
//
//   registerServiceWorker();
// }

window.gapi.load("auth2", () => {
  window.gapi.auth2
    .init({
      client_id: CLIENT_ID
    })
    .then(() => {
      console.log("THEN!");
      ReactDOM.render(<Cassie />, document.getElementById("root"));

      registerServiceWorker();
    });
  // }).then(() => renderApplication
});
