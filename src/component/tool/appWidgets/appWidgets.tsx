import React from 'react';
import { IToken } from '../../../model/model.token';
import { connect, MapDispatchToProps } from 'react-redux';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';



interface IProps {
    internationalization: TInternationalization;
    token: IToken;
}

interface IState {
    minimize: boolean;
    restore: boolean;
    close: boolean;
}

class AppWidgetsComponent extends BaseComponent<IProps, IState> {
    state = {
        minimize: false,
        restore: true,
        close: false,
    }

    refreshFunction() {

    }

    minimizeFunction() {
        if (!this.state.restore) {
            return;
        }
        if (this.state.minimize) {
            this.setState({
                ...this.state,
                minimize: false,
            })
        } else {
            this.setState({
                ...this.state,
                minimize: true,
            })
        }
    }

    restoreFunction() {
        if (this.state.restore) {
            this.setState({
                ...this.state,
                restore: false,
                minimize: false,
            })
        } else {
            this.setState({
                ...this.state,
                restore: true,
            })
        }
    }

    closeFunction() {
        this.setState({
            ...this.state,
            close: true,
        })
    }

    render() {
        // console.log(this.props.children)
        return (
            <>
                <div className={
                    "app-widget " +
                    (this.state.close ? "d-none" : '') +
                    ' ' +
                    (this.state.restore ? "template-box rounded bg-dark" : "full-screen bg-dark")
                }>
                    <div className="widget-header px-1 mt-1 ">
                        <div className="d-inline-block pull-left">
                            <button className="btn btn-sm btn-outline-secondary mb-2" onClick={() => this.refreshFunction()}>
                                <i className="fa fa-refresh"></i>
                            </button>
                        </div>
                        <div className="d-inline-block pull-right">
                            <button className="btn btn-sm btn-outline-secondary mb-2" onClick={() => this.minimizeFunction()}>
                                {
                                    this.state.minimize
                                        ?
                                        <i className="fa fa-eye"></i>
                                        :
                                        <i className="fa fa-window-minimize"></i>
                                }
                            </button>
                            <button className="btn btn-sm btn-outline-secondary mb-2 mx-1" onClick={() => this.restoreFunction()}>
                                {
                                    this.state.restore
                                        ?
                                        <i className="fa fa-window-maximize"></i>
                                        :
                                        <i className="fa fa-window-restore"></i>
                                }
                            </button>
                            <button className="btn btn-sm btn-outline-danger mb-2" onClick={() => this.closeFunction()}>
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div className={"widget-body " + (this.state.minimize ? "d-none" : "my-1")}>
                        {this.props.children}
                    </div>
                    <div className={"widget-footer " + (this.state.minimize ? "d-none" : "")}>

                    </div>
                </div>
            </>
        )
    }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
    return {
    };
};

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        token: state.token,
    };
};

export const AppWidgets = connect(
    state2props,
    dispatch2props
)(AppWidgetsComponent);