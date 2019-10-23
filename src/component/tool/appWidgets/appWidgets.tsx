import React from 'react';
// import { IToken } from '../../../model/model.token';
import { connect, MapDispatchToProps } from 'react-redux';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';



interface IProps {
    internationalization: TInternationalization;
    onClose?: () => void;
    // token: IToken;
}

interface IState {
    minimize: boolean;
    restore: boolean;
    close: boolean;
    child_tools: JSX.Element | undefined;
    child_title: JSX.Element | undefined;
}

class AppWidgetsComponent extends BaseComponent<IProps, IState> {
    state = {
        minimize: false,
        restore: true,
        close: false,
        child_tools: undefined,
        child_title: undefined,
    }

    minimizeFunction() {
        // if (!this.state.restore) {
        //     return;
        // }
        if (this.state.minimize) {
            if (!this.state.restore) {
                document.body.classList.remove("widget-minimize");
            }
            this.setState({
                ...this.state,
                minimize: false,
            })
        } else {
            if (!this.state.restore) {
                document.body.classList.add("widget-minimize");
            }
            this.setState({
                ...this.state,
                minimize: true,
            })
        }
    }

    restoreFunction() {
        if (this.state.restore) {
            document.body.classList.add("widget-open");
            this.setState({
                ...this.state,
                restore: false,
                minimize: false,
            })
        } else {
            document.body.classList.remove("widget-open");
            this.setState({
                ...this.state,
                restore: true,
            })
        }
    }

    closeFunction() {
        if (this.state.restore === false && this.state.close === false) {
            this.setState({
                ...this.state,
                close: true,
            },() => this.closeWidgetParent());
            document.body.classList.remove("widget-open");

        } else {
            this.setState({
                ...this.state,
                close: true,
            },() => this.closeWidgetParent());
        }
    }

    closeWidgetParent(){
        const parent = document.body.querySelectorAll('.widget-wrapper');
        if(parent){
            parent.forEach(element => {
                let child = element.firstElementChild;
                if(child && child.classList.contains('app-widget-close') && !element.classList.contains('close')){
                    element.classList.add('d-none');
                }
            });
        }
        if(this.props.onClose){
            this.props.onClose();
        }
    }

    init_title(cmpTitle: JSX.Element) {
        this.setState({
            ...this.state,
            child_title: cmpTitle
        });
    }

    init_tools(tools: JSX.Element) {
        this.setState({
            ...this.state,
            child_tools: tools
        });
    }

    widget_header_tools() {
        return (
            <>
                <div className="tool" onClick={() => this.minimizeFunction()}>
                    {
                        this.state.minimize
                            ?
                            <i className="fa fa-plus"></i>
                            :
                            <i className="fa fa-window-minimize"></i>
                    }
                </div>
                <div className="tool" onClick={() => this.restoreFunction()}>
                    {
                        this.state.restore
                            ?
                            <i className="fa fa-window-maximize"></i>
                            :
                            <i className="fa fa-window-restore"></i>
                    }
                </div>
                <div className="tool" onClick={() => this.closeFunction()}>
                    <i className="fa fa-times"></i>
                </div>
            </>
        )
    }

    render() {
        return (
            <>
                <div className={"app-widget mb-3-- template-box rounded " +
                    (this.state.close ? "app-widget-close" : '') +
                    ' ' +
                    (this.state.restore ? "" : "app-widget-full-screen") +
                    ' ' +
                    (this.state.minimize ? "app-widget-minimize" : "")
                }>
                    <div className="widget-header">
                        <div className="tools external-tools">{this.state.child_tools}</div>
                        <div className="widget-header-title">{this.state.child_title}</div>
                        <div className="tools widget-header-tools">{this.widget_header_tools()}</div>
                    </div>
                    <div className="widget-body">
                        {
                            React.cloneElement(this.props.children as any, {
                                init_tools: (ts: JSX.Element) => this.init_tools(ts),
                                init_title: (title: JSX.Element) => this.init_title(title),
                            })
                        }
                    </div>
                    <div className="widget-footer">

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
        // token: state.token,
    };
};

export const AppWidgets = connect(
    state2props,
    dispatch2props
)(AppWidgetsComponent);