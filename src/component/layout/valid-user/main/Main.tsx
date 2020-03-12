import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { LayoutMainHeader } from './header/Header';

import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../../redux/app_state';
import { History } from "history";
import { LayoutMainSidebar } from './sidebar/Sidebar';
import { action_update_theme } from '../../../../redux/action/theme';
import { ITheme_schema } from '../../../../redux/action/theme/themeAction';
import { TInternationalization } from '../../../../config/setup';
import { BaseComponent } from '../../../_base/BaseComponent';
import { AppRoute, TBreadcrumb, TBreadcrumbItem } from '../../../../config/route';
import { Localization } from '../../../../config/localization/localization';
import { NavLink } from "react-router-dom";

export const RouteLayoutMain = ({ component: Component, ...rest }: { [key: string]: any }) => {
    return (
        <Route {...rest} render={matchProps => (
            <LayoutMain {...matchProps}>
                <Component {...matchProps} />
            </LayoutMain>
        )} />
    )
};

interface IProps {
    history: History;
    match: any;
    internationalization: TInternationalization;
    theme: ITheme_schema;
    update_theme?: (theme: ITheme_schema) => any;
}

interface IState {
    fullscreen: boolean;
    headerTitle: string;
    breadCrumb: TBreadcrumb;
}

class LayoutMainComponent extends BaseComponent<IProps, IState> {
    state = {
        fullscreen: false,
        headerTitle: '',
        breadCrumb: []
    }

    historyUnlisten: any;
    componentDidMount() {
        this.handleHeaderTitleListener();
    }
    componentWillUnmount() {
        this.historyUnlisten();
    }

    private handleHeaderTitleListener() {
        this.setHeaderTitle(this.props.history.location.pathname);
        this.setBreadCrumb(this.props.history.location.pathname);
        this.historyUnlisten = this.props.history.listen((location, action) => {
            this.setHeaderTitle(location.pathname);
            this.setBreadCrumb(location.pathname);
        });
    }
    private setHeaderTitle(pathname: string) {
        const route = AppRoute.getRouteByPath(pathname);
        if (route) {
            this.setState({ headerTitle: route.name });
        } else {
            this.setState({ headerTitle: '' });
        }
    }
    private setBreadCrumb(pathname: string) {
        const breadCrumb = AppRoute.getBreadcrumbsByPath(pathname);
        this.setState({ breadCrumb: [...breadCrumb] });
    }

    private breadcrumbRender() {
        return this.state.breadCrumb.map((r: TBreadcrumbItem, index) => {
            if (!r.breadcrumbVisible) return <Fragment key={index}></Fragment>;
            if (r.hasOwnProperty('path')) {
                if ((r as any).itIsMe) {
                    return <Fragment key={index}>
                        <li className="active">
                            {r.icon ? <i className={r.icon}></i> : ''}
                            {Localization[r.name] || r.name}
                        </li>
                    </Fragment>;
                } else {
                    return <Fragment key={index}>
                        <li>
                            <NavLink to={(r as any).path} className="text-capitalize">
                                {r.icon ? <i className={r.icon}></i> : ''}
                                <span className="menu-text">{Localization[r.name] || r.name}</span>
                            </NavLink>
                        </li>
                    </Fragment>;
                }
            } else {
                if (r.hasOwnProperty('link')) {
                    return <Fragment key={index}>
                        <li>
                            <NavLink to={(r as any).link} className="text-capitalize">
                                {r.icon ? <i className={r.icon}></i> : ''}
                                <span className="menu-text">{Localization[r.name] || r.name}</span>
                            </NavLink>
                        </li>
                    </Fragment>;
                }
                else {
                    return <Fragment key={index}>
                        <li>
                            {r.icon ? <i className={r.icon}></i> : ''}
                            {Localization[r.name] || r.name}
                        </li>
                    </Fragment>;
                }
            }
        });
    }

    private reloadApp() {
        window.location.reload();
    }

    private toggleFullscreen() {
        if (this.state.fullscreen) {
            let go_after_step: boolean = true;
            const D_check: any = document;
            if (!D_check.exitFullscreen) { go_after_step = false; this.re_toggleFullscreen() }
            else if (!D_check.mozCancelFullScreen) { go_after_step = false; this.re_toggleFullscreen() }
            else if (!D_check.webkitExitFullscreen) { go_after_step = false; this.re_toggleFullscreen() }
            if (go_after_step === true) {
                this.setState({ fullscreen: false });
                const D: any = document;
                if (D.exitFullscreen) D.exitFullscreen();
                else if (D.mozCancelFullScreen) D.mozCancelFullScreen();
                else if (D.webkitExitFullscreen) D.webkitExitFullscreen();
            }
        } else {
            this.setState({ fullscreen: true });
            const DE: any = document.documentElement;
            if (DE.requestFullscreen) DE.requestFullscreen();
            else if (DE.mozRequestFullScreen) DE.mozRequestFullScreen();
            else if (DE.webkitRequestFullscreen) DE.webkitRequestFullscreen();
            else if (DE.msRequestFullscreen) DE.msRequestFullscreen();
        }
    }

    private re_toggleFullscreen() {
        if (this.state.fullscreen) {
            let go_after_step: boolean = true;
            const D: any = document;
            if(D.fullscreenElement || D.webkitFullscreenElement || D.mozFullScreenElement){
                this.setState({ fullscreen: false });
                go_after_step = false;
                if (D.exitFullscreen) D.exitFullscreen();
                else if (D.mozCancelFullScreen) D.mozCancelFullScreen();
                else if (D.webkitExitFullscreen) D.webkitExitFullscreen();
            }
            if (go_after_step === true) {
                const DE: any = document.documentElement;
                if (DE.requestFullscreen) DE.requestFullscreen();
                else if (DE.mozRequestFullScreen) DE.mozRequestFullScreen();
                else if (DE.webkitRequestFullscreen) DE.webkitRequestFullscreen();
                else if (DE.msRequestFullscreen) DE.msRequestFullscreen()
            }

        }
    }

    toggleSidebar() {
        if (!this.props.update_theme) return;
        if (this.props.theme.isSidebarHide) {
            this.props.update_theme({ ...this.props.theme, isSidebarHide: false });
        } else {
            this.props.update_theme({ ...this.props.theme, isSidebarHide: true });
        }
    }

    render() {
        return (
            <>
                <div className="loading-container loading-inactive">
                    <div className="loader"></div>
                </div>

                <LayoutMainHeader {...this.props} />

                <div className="main-container container-fluid">
                    <div className="page-container">

                        <LayoutMainSidebar {...this.props} />

                        <div className="page-content">

                            <div className="page-breadcrumbs">
                                <ul className="breadcrumb">
                                    {this.breadcrumbRender()}

                                    {/* <li>
                                        <i className="fa fa-home"></i>
                                        <a href="#">Home</a>
                                    </li>
                                    <li>
                                        <a href="#">More Pages</a>
                                    </li>
                                    <li className="active">Blank Page</li> */}
                                </ul>
                            </div>


                            <div className="page-header position-relative">
                                <div className="header-title">
                                    {/* <h1>Blank Page</h1> */}
                                    <h1>{Localization[this.state.headerTitle] || this.state.headerTitle}</h1>
                                </div>

                                <div className="header-buttons">
                                    {/* tag a changed to span */}
                                    <span className={
                                        "sidebar-toggler cursor-pointer "
                                        + (this.props.theme.isSidebarHide ? 'active' : '')
                                    }
                                        onClick={() => this.toggleSidebar()}>
                                        <i className="fa fa-arrows-h"></i>
                                    </span>
                                    <span className="refresh cursor-pointer" onClick={() => this.reloadApp()}>
                                        <i className="fa fa-refresh"></i>
                                    </span>
                                    <span className={
                                        "fullscreen cursor-pointer "
                                        + (this.state.fullscreen ? 'active' : '')
                                    }
                                        onClick={() => this.toggleFullscreen()}>
                                        <i className="fa fa-arrows-alt"></i>
                                    </span>
                                    {/* end tag changing */}
                                </div>

                            </div>

                            <div className="page-body">
                                {this.props.children}
                            </div>
                        </div>
                    </div>

                </div>
            </>
        )
    }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
    return {
        update_theme: (theme: ITheme_schema) => dispatch(action_update_theme(theme)),
    }
}

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        theme: state.theme,
    }
}

export const LayoutMain = connect(state2props, dispatch2props)(LayoutMainComponent);
