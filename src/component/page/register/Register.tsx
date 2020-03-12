import React from 'react';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { History } from 'history';
import { Localization } from '../../../config/localization/localization';
import { NavLink } from 'react-router-dom';

interface IState {
}
interface IProps {
    history: History;
    internationalization: TInternationalization;
}

class RegisterComponent extends BaseComponent<IProps, IState> {
    state: IState = {
    };

    render() {
        return (
            <>
                <div className="register-container animated fadeInDown">
                    <div className="registerbox bg-white">
                        <div className="registerbox-title">{Localization.register}</div>
                        <div className="registerbox-caption ">Please fill in your information</div>
                        <div className="registerbox-textbox">
                            <input type="text" className="form-control" placeholder="Username" />
                        </div>
                        <div className="registerbox-textbox">
                            <input type="password" className="form-control" placeholder="Enter Password" />
                        </div>
                        <div className="registerbox-textbox">
                            <input type="password" className="form-control" placeholder="Confirm Password" />
                        </div>
                        <hr className="wide" />
                        <div className="registerbox-textbox">
                            <input type="text" className="form-control" placeholder="Name" />
                        </div>
                        <div className="registerbox-textbox">
                            <input type="text" className="form-control" placeholder="Family" />
                        </div>
                        <div className="registerbox-textbox">
                            <div className="row">
                                <div className="col-lg-6 col-sm-6 col-xs-6 padding-right-10">
                                    <input type="text" className="form-control" placeholder="Month" />
                                </div>
                                <div className="col-lg-3 col-sm-3 col-xs-3 no-padding padding-right-10">
                                    <input type="text" className="form-control" placeholder="Day" />
                                </div>
                                <div className="col-lg-3 col-sm-3 col-xs-3 no-padding-left">
                                    <input type="text" className="form-control" placeholder="Year" />
                                </div>
                            </div>
                        </div>
                        <div className="registerbox-textbox no-padding-bottom">
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" className="colored-primary" defaultChecked />
                                    <span className="text darkgray-- text-muted">I agree to the Company&nbsp;
                                        {/* <a className="themeprimary-- text-primary">Terms of Service</a> */}
                                        <NavLink className="themeprimary-- text-primary" exact to="/register">Terms of Service</NavLink>
                                        &nbsp;and Privacy Policy
                                        </span>
                                </label>
                            </div>
                        </div>
                        <div className="registerbox-submit">
                            <input type="button" className="btn btn-primary pull-right text-uppercase" value={Localization.submit} />
                        </div>
                        <div className="clearfix"></div>
                        <div className="registerbox-textbox text-center">
                            <NavLink exact to="/login" className="text-muted">
                                {Localization.login}
                            </NavLink>
                        </div>
                    </div>
                    <div className="logobox">
                    </div>
                </div>

                <ToastContainer {...this.getNotifyContainerConfig()} />
            </>
        )
    }
}

//#region redux
const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
    }
}

const dispatch2props = (dispatch: Dispatch) => {
    return {
    }
}

export const Register = connect(state2props, dispatch2props)(RegisterComponent);
//#endregion