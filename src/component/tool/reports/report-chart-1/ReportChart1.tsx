import React from "react";
import { History } from 'history';
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import 'moment/locale/fa';
import 'moment/locale/ar';
import { TInternationalization } from "../../../../config/setup";
import { IToken } from "../../../../model/model.token";
import { BaseComponent } from "../../../_base/BaseComponent";
import { redux_state } from "../../../../redux/app_state";

export interface IProps {
    history?: History;
    internationalization: TInternationalization;
    token: IToken;

}

interface IState {

}

class ReportBestSellsChartComponent extends BaseComponent<IProps, IState> {
    state = {
      
    }
    /// end of state

    constructor(props: IProps) {
        super(props);
    }

    componentDidMount() {
       
    }




    render() {
        return (
            <>
            </>
        );
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

export const ReportBestSellsChart = connect(
    state2props,
    dispatch2props
)(ReportBestSellsChartComponent);