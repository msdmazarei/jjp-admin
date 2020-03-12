import React from 'react';
import { Route } from 'react-router-dom';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../../redux/app_state';
import { History } from "history";

export const RouteLayoutNoWrap = ({ component: Component, ...rest }: { [key: string]: any }) => {
    return (
        <Route {...rest} render={matchProps => (
            <LayoutNoWrap {...matchProps}>
                <Component {...matchProps} />
            </LayoutNoWrap>
        )} />
    )
};

interface IProps {
    history: History;
    match: any;
}

class LayoutNoWrapComponent extends React.Component<IProps> {

    render() {
        return (
            <>
                <div className="layout-nowrap-wrapper">
                    <div className="row">
                        <div className="col-12">
                            {this.props.children}
                        </div>
                    </div>
                </div>
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
    }
}

export const LayoutNoWrap = connect(state2props, dispatch2props)(LayoutNoWrapComponent);
