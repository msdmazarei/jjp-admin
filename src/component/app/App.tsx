import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, HashRouter } from 'react-router-dom';
import { ForgotPassword } from '../forgot-password/ForgotPassword';
import { Localization } from '../../config/localization/localization';
import { Register } from '../register/Register';
import { Login } from '../login/Login';
import { TInternationalization } from '../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { BaseService } from '../../service/service.base';
import { Modal } from 'react-bootstrap';
import { redux_state } from '../../redux/app_state';

import { AdminLayout } from '../../layouts/Admin/Admin';
// import { Dashboard } from '../dashboard/Dashboard';
// import NotFound from '../layout/main/not-found/NotFound';
import { AppInitService } from '../../service/service.app-init';
import { RouteLayoutAccount } from '../layout/account/Account';
// import { RouteLayoutAccount } from '../layout/account/Account';
// import { RouteLayoutMain } from '../layout/main/Main';


// import { appLocalStorage } from '../../service/appLocalStorage';


// import { NETWORK_STATUS } from '../../enum/NetworkStatus';
// import { action_set_network_status } from '../../redux/action/netwok-status';
// import { Store2 } from '../../redux/store';

const appRoutes = (
    <HashRouter>
        <Switch>
            <Redirect exact from="/" to="/dashboard" />
            <Route exact path="/" render={props => <AdminLayout {...props} />} />
            <Route exact path="/dashboard" render={props => <AdminLayout {...props} />} />
            <Route exact path="/book/manage" render={props => <AdminLayout {...props} />} />
            <Route exact path="/book/create" render={props => <AdminLayout {...props} />} />
            <Route exact path="/book/:book_id/edit" render={props => <AdminLayout {...props} />} />
            <Route exact path="/person/manage" render={props => <AdminLayout {...props} />} />
            <Route exact path="/person/create" render={props => <AdminLayout {...props} />} />
            <Route exact path="/person/:person_id/edit" render={props => <AdminLayout {...props} />} />
            <Route exact path="/user/manage" render={props => <AdminLayout {...props} />} />
            <Route exact path="/user/create" render={props => <AdminLayout {...props} />} />
            <Route exact path="/user/:user_id/edit" render={props => <AdminLayout {...props} />} />
            <Route exact path="/comment/manage" render={props => <AdminLayout {...props} />} />
            <Route exact path="/order/manage" render={props => <AdminLayout {...props} />} />
            {/* <Route exact path="/order/create" render={props => <AdminLayout {...props} />} /> */}               // not added
            {/* <Route exact path="/order/:order_id/edit" render={props => <AdminLayout {...props} />} /> */}       // not added
            {/* <Route exact path="/user/manage" render={props => <AdminLayout {...props} />} /> */}
            {/* <Route exact path="/" component={() => <Redirect to="/dashboard" />} /> */}
            {/* <RouteLayoutMain exact path="/dashboard" component={Dashboard} /> */}
            <RouteLayoutAccount path="/login" component={Login} />
            <RouteLayoutAccount path="/register" component={Register} />
            <RouteLayoutAccount path="/forgot-password" component={ForgotPassword} />
            {/* <RouteLayoutMain component={NotFound} /> */}

        </Switch>
    </HashRouter>
);

interface IProps {
    internationalization: TInternationalization;
    // network_status: NETWORK_STATUS;
    // set_network_status?: (network_status: NETWORK_STATUS) => any;
}
interface IState {
    showConfirmReloadModal: boolean;
}

class AppComponent extends React.Component<IProps, IState> {
    //   private initStore = new appLocalStorage();
    private _appInitService = new AppInitService();
    state = {
        showConfirmReloadModal: false,
    }

    constructor(props: IProps) {
        super(props);

        Localization.setLanguage(props.internationalization.flag);
        document.title = Localization.app_title;

        if (props.internationalization.rtl) {
            document.body.classList.add('rtl');
        }

        // if (BaseService.isAppOffline()) {
        //   // Store2.dispatch(action_set_network_status(NETWORK_STATUS.OFFLINE));
        //   this.props.set_network_status && this.props.set_network_status(NETWORK_STATUS.OFFLINE);
        // }
        BaseService.check_network_status();

    }

    componentDidMount() {
        this.event_confirmReloadModal();
    }

    event_confirmReloadModal() {
        window.addEventListener("app-event-newContentAvailable", () => {
            this.setState({ ...this.state, showConfirmReloadModal: true });
        });
    }

    closeModal_confirmReload() {
        this.setState({ ...this.state, showConfirmReloadModal: false });
    }

    confirmModal_confirmReload() {
        // window.location.reload(window.location.href);
        // window.location.reload(window.location.href);
        // location.reload(); // true
        window.location.reload();
    }

    modal_confirmReload_render() {
        return (
            <>
                <Modal show={this.state.showConfirmReloadModal} onHide={() => this.closeModal_confirmReload()}
                    centered
                    backdrop='static'>
                    <Modal.Body>{Localization.msg.ui.new_vesion_available_update}</Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-light-- btn-sm btn-link text-muted" onClick={() => this.closeModal_confirmReload()}>
                            {Localization.dont_want_now}
                        </button>
                        <button className="btn btn-system btn-sm" onClick={() => this.confirmModal_confirmReload()}>
                            {Localization.update}
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }

    /* check_network_status() {
      if (this.props.network_status === NETWORK_STATUS.ONLINE) {
        if (BaseService.isAppOffline()) {
          this.props.set_network_status && this.props.set_network_status(NETWORK_STATUS.OFFLINE);
        }
      } else if (this.props.network_status === NETWORK_STATUS.OFFLINE) {
        if (!BaseService.isAppOffline()) {
          this.props.set_network_status && this.props.set_network_status(NETWORK_STATUS.ONLINE);
        }
      }
    } */

    render() {
        return (
            <div className="app">
                <Router>
                    {appRoutes}
                </Router>

                {this.modal_confirmReload_render()}
            </div>
        );
    }
}


const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
    return {
        // set_network_status: (network_status: NETWORK_STATUS) => dispatch(action_set_network_status(network_status)),
    }
}

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        // network_status: state.network_status
    }
}

export const App = connect(state2props, dispatch2props)(AppComponent);