import React from "react";
import { redux_state } from "../../../../../redux/app_state";
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { TInternationalization } from "../../../../../config/setup";
import { IUser } from "../../../../../model/model.user";
import { BaseComponent } from "../../../../_base/BaseComponent";
import { History } from "history";

export interface IProps {
    internationalization: TInternationalization;
    logged_in_user?: IUser | null;
    history: History;
}

class LayoutMainFooterComponent extends BaseComponent<IProps, any>{

    render() {
        return (
            <></>
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
        logged_in_user: state.logged_in_user,
    }
}

export const LayoutMainFooter = connect(state2props, dispatch2props)(LayoutMainFooterComponent);
