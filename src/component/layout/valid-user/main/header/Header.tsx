import React from 'react';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../../../redux/app_state';
import { History } from "history";
import { NETWORK_STATUS } from '../../../../../enum/NetworkStatus';
import { IUser } from '../../../../../model/model.user';
import { CmpUtility } from '../../../../_base/CmpUtility';
import { NavLink } from "react-router-dom";
import { Localization } from '../../../../../config/localization/localization';
import { Dropdown } from 'react-bootstrap';
import { TInternationalization } from '../../../../../config/setup';
import { action_change_app_flag } from '../../../../../redux/action/internationalization';
import { BaseComponent } from '../../../../_base/BaseComponent';
import { ITheme_schema } from '../../../../../redux/action/theme/themeAction';
import { action_update_theme } from '../../../../../redux/action/theme';
import { ChangePassword } from "../../../../changePasswordModal/ChangePasswordModal";
import { BaseService } from '../../../../../service/service.base';
import { action_user_logged_out } from '../../../../../redux/action/user';
import { action_remove_token } from '../../../../../redux/action/token';
import { action_remove_authentication } from '../../../../../redux/action/authentication';
import { Store2 } from '../../../../../redux/store';

interface IProps {
    history: History;
    match: any;
    network_status: NETWORK_STATUS;
    logged_in_user: IUser | null;
    internationalization: TInternationalization;
    change_app_flag?: (internationalization: TInternationalization) => void;
    theme: ITheme_schema;
    update_theme?: (theme: ITheme_schema) => any;
    do_logout?: () => void;
    remove_token?: () => void;
    remove_authentication?: () => void;
}
interface IState {
    ChangePasswordModalShow: boolean;
}

class LayoutMainHeaderComponent extends BaseComponent<IProps, IState> {
    state = {
        ChangePasswordModalShow: false,
    }

    private changeLang(lang: string) {
        // debugger;
        if (!this.props.change_app_flag) return;
        if (lang === 'fa') {
            document.body.classList.add('rtl');
            Localization.setLanguage('fa');
            document.title = Localization.app_title;
            this.props.change_app_flag({
                rtl: true,
                language: 'فارسی',
                flag: 'fa',
            });
        } else if (lang === 'en') {
            document.body.classList.remove('rtl');
            Localization.setLanguage('en');
            document.title = Localization.app_title;
            this.props.change_app_flag({
                rtl: false,
                language: 'english',
                flag: 'en',
            });
        } else if (lang === 'ar') {
            document.body.classList.add('rtl');
            Localization.setLanguage('ar');
            document.title = Localization.app_title;
            this.props.change_app_flag({
                rtl: true,
                language: 'العربیه',
                flag: 'ar',
            });
        }

    }

    // private logout() {
    //     this.onApplogout(this.props.history);
    // }

    private toggleCompactSidebar() {
        if (!this.props.update_theme) return;
        if (this.props.theme.sidebar === 'compact') {
            this.props.update_theme({ ...this.props.theme, sidebar: 'default', isSidebarHide: false });
        } else {
            this.props.update_theme({ ...this.props.theme, sidebar: 'compact', isSidebarHide: false });
        }
    }

    person_image_or_avatar_returner(): string {
        let imgURL: string | undefined = Store2.getState().logged_in_user === null ? undefined : (Store2.getState().logged_in_user as IUser).person.image;
        if (imgURL === undefined) {
            return "/static/media/img/icon/avatar.png"
        } else {
            let imgOfPerson: string = "/api/serve-files/" + imgURL
            return imgOfPerson
        }
    }

    change_password_modal_toggle() {
        if (this.state.ChangePasswordModalShow === false) {
            this.setState({
                ...this.state,
                ChangePasswordModalShow: true,
            })
        } else {
            this.setState({
                ...this.state,
                ChangePasswordModalShow: false,
            })
        }
    }

    log_out() {
        this.props.do_logout && this.props.do_logout();
        this.props.remove_token && this.props.remove_token();
        BaseService.removeToken();
        this.props.remove_authentication && this.props.remove_authentication();
        this.props.history.push('/login');
    }

    render() {
        const logged_in_user = this.props.logged_in_user;
        const username = logged_in_user ? logged_in_user.username : '';
        const fullname = logged_in_user ? CmpUtility.getPersonFullName(logged_in_user.person) : '';
        const email = logged_in_user ? logged_in_user.person.email : '';

        return (
            <>
                <div className="navbar">
                    <div className="navbar-inner">
                        <div className="navbar-container">

                            {/* <div className="navbar-header pull-left">
                                <a href="#" className="navbar-brand">
                                    <small>
                                        <img src="assets/img/logo.png" alt="" />
                                    </small>
                                </a>
                            </div> */}

                            <div className={
                                "sidebar-collapse "
                                + (this.props.theme.sidebar === 'compact' ? 'active' : '')
                            }
                                onClick={() => this.toggleCompactSidebar()}
                            >
                                <i className="collapse-icon fa fa-bars"></i>
                            </div>

                            <div className="navbar-header pull-right">
                                <div className="navbar-account">
                                    <ul className="account-area">
                                        <Dropdown as="li">
                                            <Dropdown.Toggle
                                                as="a"
                                                id="dropdown-login-area"
                                                className="login-area"
                                            >
                                                <div className="avatar" title="View your public profile">
                                                    <img src={this.person_image_or_avatar_returner()} alt="" className="rounded-circle" />
                                                </div>
                                                <section>
                                                    <h2><span className="profile"><span>{fullname}</span></span></h2>
                                                </section>
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu flip={false} as="ul"
                                                className="pull-right dropdown-arrow dropdown-login-area"
                                            >
                                                {/* a changed to span and add my-2 to first li */}
                                                <li className="username my-2"><span>{username}</span></li>
                                                <li className="email"><span>{email}</span></li>
                                                {/* end change */}
                                                <li>
                                                    <div className="avatar-area">
                                                        <img src={this.person_image_or_avatar_returner()} className="rounded-circle avatar" alt="" />
                                                        {/* <span className="caption">Change Photo</span> */}
                                                    </div>
                                                </li>

                                                <li className="edit">
                                                    {/* <a href="/profile.html" className="pull-left">Profile</a> */}
                                                    {/* <a href="#" className="pull-right">Setting</a> */}

                                                    <NavLink to="/profile" className="text-capitalize"
                                                        activeClassName="active pointer-events-none">
                                                        <i className="fa fa-address-card-o mx-1 text-info"></i>
                                                        {Localization.profile}
                                                    </NavLink>
                                                </li>

                                                <li className="edit">
                                                    {/* <a href="/profile.html" className="pull-left">Profile</a> */}
                                                    {/* <a href="#" className="pull-right">Setting</a> */}

                                                    <NavLink to="#" className="text-capitalize"
                                                        activeClassName="active pointer-events-none"
                                                        onClick={() => this.change_password_modal_toggle()}
                                                    >
                                                        <i className="fa fa-key mx-1 text-info"></i>
                                                        {Localization.reset_password}
                                                    </NavLink>
                                                </li>

                                                {/* <li className="theme-area d-none">
                                                    <ul className="colorpicker" id="skin-changer">
                                                        <li>
                                                            <a
                                                                // eslint-disable-line jsx-a11y/anchor-has-content
                                                                className="colorpick-btn" style={{ backgroundColor: "#5DB2FF" }} rel="assets/css/skins/blue.min.css"
                                                            >
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                // eslint-disable-line jsx-a11y/anchor-has-content
                                                                className="colorpick-btn"  style={{ backgroundColor: "#2dc3e8" }} rel="assets/css/skins/azure.min.css"
                                                            >
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                // eslint-disable-line jsx-a11y/anchor-has-content
                                                                className="colorpick-btn"  style={{ backgroundColor: "#03B3B2" }} rel="assets/css/skins/teal.min.css"
                                                            >
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                // eslint-disable-line jsx-a11y/anchor-has-content
                                                                className="colorpick-btn"  style={{ backgroundColor: "#53a93f" }} rel="assets/css/skins/green.min.css"
                                                            >
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                // eslint-disable-line jsx-a11y/anchor-has-content
                                                                className="colorpick-btn"  style={{ backgroundColor: "#FF8F32" }} rel="assets/css/skins/orange.min.css"
                                                            >
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                // eslint-disable-line jsx-a11y/anchor-has-content
                                                                className="colorpick-btn"  style={{ backgroundColor: "#cc324b" }} rel="assets/css/skins/pink.min.css"
                                                            >
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                // eslint-disable-line jsx-a11y/anchor-has-content
                                                                className="colorpick-btn"  style={{ backgroundColor: "#AC193D" }} rel="assets/css/skins/darkred.min.css"
                                                            >
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                // eslint-disable-line jsx-a11y/anchor-has-content
                                                                className="colorpick-btn"  style={{ backgroundColor: "#8C0095" }} rel="assets/css/skins/purple.min.css"
                                                            >
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                // eslint-disable-line jsx-a11y/anchor-has-content
                                                                className="colorpick-btn"  style={{ backgroundColor: "#0072C6" }} rel="assets/css/skins/darkblue.min.css"
                                                            >
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                // eslint-disable-line jsx-a11y/anchor-has-content
                                                                className="colorpick-btn"  style={{ backgroundColor: "#585858" }} rel="assets/css/skins/gray.min.css"
                                                            >
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                // eslint-disable-line jsx-a11y/anchor-has-content
                                                                className="colorpick-btn"  style={{ backgroundColor: "#474544" }} rel="assets/css/skins/black.min.css"
                                                            >
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                // eslint-disable-line jsx-a11y/anchor-has-content 
                                                                className="colorpick-btn"  style={{ backgroundColor: "#001940" }} rel="assets/css/skins/deepblue.min.css"
                                                            >
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </li> */}

                                                <li className="language-area">
                                                    <ul className="languagepicker">
                                                        <li>
                                                            {/* tag a changed to span */}
                                                            <span className="cursor-pointer" onClick={() => this.changeLang('fa')} title="فارسی">
                                                                <img src="/static/media/img/flag/ir.png" alt="فارسی" />
                                                            </span>
                                                        </li>
                                                        <li>
                                                            {/* tag a changed to span */}
                                                            <span className="cursor-pointer" onClick={() => this.changeLang('en')} title="English">
                                                                <img src="/static/media/img/flag/us.png" alt="English" />
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </li>

                                                <li className="dropdown-footer">
                                                    <span className="pull-left pt-1 pb-2 cursor-pointer" onClick={() => this.log_out()}>
                                                        <i className="fa fa-sign-out mx-1 text-info"></i>
                                                        {Localization.log_out}
                                                    </span>
                                                </li>
                                            </Dropdown.Menu>
                                        </Dropdown>

                                    </ul>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ChangePassword
                    show={this.state.ChangePasswordModalShow}
                    onHide={() => this.change_password_modal_toggle()}
                />
            </>
        )
    }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
    return {
        change_app_flag: (internationalization: TInternationalization) => dispatch(action_change_app_flag(internationalization)),
        update_theme: (theme: ITheme_schema) => dispatch(action_update_theme(theme)),
        do_logout: () => dispatch(action_user_logged_out()),
        remove_token: () => dispatch(action_remove_token()),
        remove_authentication: () => dispatch(action_remove_authentication()),
    }
}

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        network_status: state.network_status,
        logged_in_user: state.logged_in_user,
        theme: state.theme,
    }
}

export const LayoutMainHeader = connect(state2props, dispatch2props)(LayoutMainHeaderComponent);
