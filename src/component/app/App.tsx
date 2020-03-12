import React from 'react';
import { TInternationalization } from '../../config/setup';
import { Localization } from '../../config/localization/localization';
import { BaseService } from '../../service/service.base';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../redux/app_state';
import { BrowserRouter as Router, Route, Switch, Redirect, HashRouter } from 'react-router-dom';
import { RouteLayoutValidUser } from '../layout/valid-user/ValidUser';
import { RouteLayoutAccount } from '../layout/account/Account';
import { Login } from '../login/Login';
import { Register } from '../register/Register';

const appRoutes = (
  <HashRouter>
    <Switch>

      <Route exact path="/" component={() => <Redirect to="/dashboard" />} />
      <RouteLayoutValidUser exact path="/dashboard" />
      <RouteLayoutValidUser path="/profile" />
      <RouteLayoutValidUser path="/blank" />

      <RouteLayoutValidUser path="/user/manage" />
      <RouteLayoutValidUser path="/user/create" />

      <RouteLayoutAccount path="/login" component={Login} />
      <RouteLayoutAccount path="/register" component={Register} />
      {/* <RouteLayoutAccount path="/forgot-password" component={ForgotPassword} /> */}

      <RouteLayoutValidUser />

    </Switch>
  </HashRouter>
);

interface IProps {
  internationalization: TInternationalization;
}
interface IState {
  showConfirmReloadModal: boolean;
}

class AppComponent extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    Localization.setLanguage(props.internationalization.flag);
    document.title = Localization.app_title;

    if (props.internationalization.rtl) {
      document.body.classList.add('rtl');
    }

    BaseService.check_network_status();
  }

  render() {
    return (
      <>
        <Router>
          {appRoutes}
        </Router>
      </>
    )
  }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
  return {
  }
}

const state2props = (state: redux_state) => {
  return {
    internationalization: state.internationalization,
  }
}

export const App = connect(state2props, dispatch2props)(AppComponent);
