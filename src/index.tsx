import React from 'react';
import ReactDOM from 'react-dom';
// import { createBrowserHistory } from "history";
// import { Router, Route, Switch, Redirect, HashRouter } from "react-router-dom";
// import {AdminLayout} from "./layouts/Admin/Admin";
// import RTLLayout from './layouts/RTL/RTL.jsx';
import * as serviceWorker from './serviceWorker';
import './asset/style/app/skin-default/style.scss';
import { Provider } from 'react-redux';
import { Store2, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { App } from './component/app/App';

// const hist = createBrowserHistory();

ReactDOM.render(
  // <Provider store={Store2}>
  //   <PersistGate loading={null} persistor={persistor}>
  //     <Router history={hist}>
  //       <HashRouter>
  //         <Switch>
  //           <Route path="/" render={props => <AdminLayout {...props} />} />
  //           {/* <Route path="/rtl" render={props => <RTLLayout {...props} />} /> */}
  //           <Redirect from="/" to="/dashboard" />
  //         </Switch>
  //       </HashRouter>
  //     </Router>
  //   </PersistGate>
  // </Provider>



  <Provider store={Store2}>
    <PersistGate loading={null} persistor={persistor}>
     <App />
    </PersistGate>
  </Provider>
  ,
  document.getElementById("root")
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();