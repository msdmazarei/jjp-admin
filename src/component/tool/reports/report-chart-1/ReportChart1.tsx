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
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, } from 'recharts';
import { Localization } from "../../../../config/localization/localization";
import Select from 'react-select'


export interface IProps {
    history?: History;
    internationalization: TInternationalization;
    token: IToken;

}

interface IState {
    type_of_report: {
        label: string;
        value: string;
    } | undefined;
    type_of_report_kind: {
        label: string;
        value: number;
    } | undefined;
}

class ReportBestSellsChartComponent extends BaseComponent<IProps, IState> {

    // start option for report

    reportOptions = [
        { value: 'monthly', label: Localization.type_of_report.monthly },
        { value: 'weekly', label: Localization.type_of_report.weekly },
    ];
    reportOptionsKind = [
        { value: 1, label: Localization.type_of_report_kind.most_Selling },
        { value: 2, label: Localization.type_of_report_kind.lowest_selling },
        { value: 0, label: Localization.type_of_report_kind.both },
    ];

    // end option for report


    /// start of state

    state = {
        type_of_report: this.reportOptions[0],
        type_of_report_kind: this.reportOptionsKind[0]

    }
    /// end of state


    // constructor(props: IProps) {
    //     super(props);
    // }

    componentDidMount() {

    }



    // start function for set type & kind of report

    handleReportChange(value: { label: string, value: string }) {
        this.setState({
            ...this.state,
            type_of_report: value,
        },
            () => this.data_option_max_returner(this.state.type_of_report!.value)
        )
    }

    handleKindChange(value: { label: string, value: number }) {
        this.setState({
            ...this.state,
            type_of_report_kind: value,
        },
            () => this.data_option_max_returner(this.state.type_of_report!.value)
        )
    }

    // end function for set type of report


    // start function for select to return user custom data for most sell

    data_option_max_returner(value: string | undefined) {

        const monthly = [
            { name: 'book 1', value: 100 },
            { name: 'book 2', value: 200 },
            { name: 'book 3', value: 300 },
            { name: 'book 4', value: 400 },
            { name: 'book 5', value: 500 },
        ];

        const weekly = [
            { name: 'book 1', value: 100 },
            { name: 'book 2', value: 100 },
            { name: 'book 3', value: 100 },
            { name: 'book 4', value: 100 },
            { name: 'book 5', value: 100 },
        ];

        if (value === "monthly") {
            return monthly
        }
        else if (value === "weekly") {
            return weekly
        }
        else {
            return monthly
        };
    }

    // end function for select to return user custom data for most sell


    // start function for select to return user custom data for most sell

    data_option_min_returner(value: string | undefined) {

        const monthly = [
            { name: 'book 1', value: 454 },
            { name: 'book 2', value: 654 },
            { name: 'book 3', value: 645 },
            { name: 'book 4', value: 576 },
            { name: 'book 5', value: 455 },
        ];

        const weekly = [
            { name: 'book 1', value: 545 },
            { name: 'book 2', value: 256 },
            { name: 'book 3', value: 300 },
            { name: 'book 4', value: 895 },
            { name: 'book 5', value: 125 },
        ];

        if (value === "monthly") {
            return monthly
        }
        else if (value === "weekly") {
            return weekly
        }
        else {
            return monthly
        };
    }

    // end function for select to return user custom data for most sell


    // start function for return user custom data chart color

    data_option_color_returner() {
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red'];
        return COLORS
    }

    // end function for return user custom data chart color


    // start return_report function

    report_status(per: string, kind: number) {

        const max: any = this.data_option_max_returner(this.state.type_of_report.value)
        const min: any = this.data_option_min_returner(this.state.type_of_report.value)

        if (per === "monthly" && kind === 0) {
            return <>
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            {Localization.type_of_report_kind.most_Selling + " " + Localization.type_of_report.monthly}
                        </div>
                    </div>
                    <div className="col-12" style={{minHeight:'500px'}}>
                        <div style={{ width: '100%', height: 600 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={max}
                                        dataKey="value"
                                        isAnimationActive={true}
                                        outerRadius={150}
                                        fill="red"
                                        label
                                    >
                                        {
                                            this.data_option_max_returner(this.state.type_of_report.value)!.map((entry, index) => <Cell key={`cell-${index}`} fill={this.data_option_color_returner()[index % this.data_option_color_returner().length]} />)
                                        }
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="text-center">
                            {Localization.type_of_report_kind.lowest_selling + " " + Localization.type_of_report.monthly}
                        </div>
                    </div>
                    <div className="col-12">
                        <div style={{ width: '100%', height: 600 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={min}
                                        dataKey="value"
                                        isAnimationActive={true}
                                        outerRadius={150}
                                        fill="white"
                                        label
                                    >
                                        {
                                            this.data_option_min_returner(this.state.type_of_report.value)!.map((entry, index) => <Cell key={`cell-${index}`} fill={this.data_option_color_returner()[index % this.data_option_color_returner().length]} />)
                                        }
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </>
        };
        if (per === "weekly" && kind === 0) {
            return <>
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            {Localization.type_of_report_kind.most_Selling + " " + Localization.type_of_report.weekly}
                        </div>
                    </div>
                    <div className="col-12">
                        <div style={{ width: '100%', height: 600 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={max}
                                        dataKey="value"
                                        isAnimationActive={true}
                                        outerRadius={150}
                                        fill="red"
                                        label
                                    >
                                        {
                                            this.data_option_max_returner(this.state.type_of_report.value)!.map((entry, index) => <Cell key={`cell-${index}`} fill={this.data_option_color_returner()[index % this.data_option_color_returner().length]} />)
                                        }
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="text-center">
                            {Localization.type_of_report_kind.lowest_selling + " " + Localization.type_of_report.weekly}
                        </div>
                    </div>
                    <div className="col-12">
                        <div style={{ width: '100%', height: 600 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={min}
                                        dataKey="value"
                                        isAnimationActive={true}
                                        outerRadius={150}
                                        fill="white"
                                        label
                                    >
                                        {
                                            this.data_option_min_returner(this.state.type_of_report.value)!.map((entry, index) => <Cell key={`cell-${index}`} fill={this.data_option_color_returner()[index % this.data_option_color_returner().length]} />)
                                        }
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </>
        };
        if (per === "monthly" && kind === 1) {
            return <>
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            {Localization.type_of_report_kind.most_Selling + " " + Localization.type_of_report.monthly}
                        </div>
                    </div>
                    <div className="col-12">
                        <div style={{ width: '100%', height: 600 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={max}
                                        dataKey="value"
                                        isAnimationActive={true}
                                        outerRadius={150}
                                        fill="red"
                                        label
                                    >
                                        {
                                            this.data_option_max_returner(this.state.type_of_report.value)!.map((entry, index) => <Cell key={`cell-${index}`} fill={this.data_option_color_returner()[index % this.data_option_color_returner().length]} />)
                                        }
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </>
        };
        if (per === "monthly" && kind === 2) {
            return <>
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            {Localization.type_of_report_kind.lowest_selling + " " + Localization.type_of_report.monthly}
                        </div>
                    </div>
                    <div className="col-12">
                        <div style={{ width: '100%', height: 600 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={min}
                                        dataKey="value"
                                        isAnimationActive={true}
                                        outerRadius={150}
                                        fill="red"
                                        label
                                    >
                                        {
                                            this.data_option_max_returner(this.state.type_of_report.value)!.map((entry, index) => <Cell key={`cell-${index}`} fill={this.data_option_color_returner()[index % this.data_option_color_returner().length]} />)
                                        }
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </>
        };
        if (per === "weekly" && kind === 1) {
            return <>
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            {Localization.type_of_report_kind.most_Selling + " " + Localization.type_of_report.weekly}
                        </div>
                    </div>
                    <div className="col-12">
                        <div style={{ width: '100%', height: 600 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={max}
                                        dataKey="value"
                                        isAnimationActive={true}
                                        outerRadius={150}
                                        fill="red"
                                        label
                                    >
                                        {
                                            this.data_option_max_returner(this.state.type_of_report.value)!.map((entry, index) => <Cell key={`cell-${index}`} fill={this.data_option_color_returner()[index % this.data_option_color_returner().length]} />)
                                        }
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </>
        };
        if (per === "weekly" && kind === 2) {
            return <>
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            {Localization.type_of_report_kind.lowest_selling + " " + Localization.type_of_report.weekly}
                        </div>
                    </div>
                    <div className="col-12">
                        <div style={{ width: '100%', height: 600 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={min}
                                        dataKey="value"
                                        isAnimationActive={true}
                                        outerRadius={150}
                                        fill="red"
                                        label
                                    >
                                        {
                                            this.data_option_max_returner(this.state.type_of_report.value)!.map((entry, index) => <Cell key={`cell-${index}`} fill={this.data_option_color_returner()[index % this.data_option_color_returner().length]} />)
                                        }
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </>
        };

    }

    // end return_report function



    render() {

        return (
            <div>
                <div className="row my-3">
                    <div className="col-12 col-md-6">
                        <div className="ml-2">
                            <label htmlFor="">{Localization.report}</label>
                            <Select
                                onChange={(value: any) => this.handleReportChange(value)}
                                options={this.reportOptions}
                                value={this.state.type_of_report}
                                placeholder={Localization.report}
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <label htmlFor="">{Localization.report}</label>
                        <Select
                            onChange={(value: any) => this.handleKindChange(value)}
                            options={this.reportOptionsKind}
                            value={this.state.type_of_report_kind}
                            placeholder={Localization.report}
                        />
                    </div>
                </div>
                {
                    this.report_status(this.state.type_of_report.value, this.state.type_of_report_kind.value)
                }
            </div>
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