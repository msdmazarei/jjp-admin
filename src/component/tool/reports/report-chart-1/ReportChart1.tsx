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
import { PieChart, Pie, Legend, Tooltip, } from 'recharts';


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
        const data01 = [
            { name: 'Group A', value: 400 }, { name: 'Group B', value: 300 },
            { name: 'Group C', value: 300 }, { name: 'Group D', value: 200 },
            { name: 'Group E', value: 278 }, { name: 'Group F', value: 189 },
        ];
        return (
            <PieChart width={600} height={600}>
                <Pie dataKey="value" isAnimationActive={false} data={data01} cx={200} cy={200} outerRadius={180} fill="#8884d8" label />
            </PieChart>
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