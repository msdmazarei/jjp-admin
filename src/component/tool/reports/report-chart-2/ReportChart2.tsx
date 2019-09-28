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
import { Localization } from "../../../../config/localization/localization";
import Select from 'react-select'
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, ResponsiveContainer } from "recharts";


export interface IProps {
    history?: History;
    internationalization: TInternationalization;
    token: IToken;
    init_title: (cmpTitle: JSX.Element) => void;
    init_tools: (tools: JSX.Element) => void;
}

interface IState {
    type_of_report: {
        label: string;
        value: string;
    } | undefined;
}

class ReportYearSellChartComponent extends BaseComponent<IProps, IState> {

    // start option for report

    reportOptions = [
        { value: 'yearly', label: Localization.annual_Reports.yearly },
        { value: 'last_quarter', label: Localization.annual_Reports.last_quarter },
        { value: 'spring', label: Localization.annual_Reports.spring },
        { value: 'summer', label: Localization.annual_Reports.summer },
        { value: 'fall', label: Localization.annual_Reports.fall },
        { value: 'winter', label: Localization.annual_Reports.winter },
    ];

    // end option for report


    /// start of state

    state = {
        type_of_report: this.reportOptions[0],
    }
    /// end of state

    private _report_title: string = Localization.name_of_report.Monthly_sale_seasonal_and_yearly;


    // constructor(props: IProps) {
    //     super(props);
    // }

    componentDidMount() {
        this.init_title();
        this.init_tools();
    }


    // start function for set type & kind of report

    handleReportChange(value: { label: string, value: string }) {
        this.setState({
            ...this.state,
            type_of_report: value,
        })
    }

    // end function for set type of report


    // start define custom tools & pass that to widget

    tools() {
        return (
            <>

            </>
        )
    }

    init_tools() {
        this.props.init_tools(this.tools());
    }

    title_render() {
        return (
            <>
                <div className="text-center">{this._report_title}</div>
            </>
        )
    }

    async init_title() {
        await this.waitOnMe();
        this.props.init_title(this.title_render());
    }

    // end define custom tools & pass that to widget


    // start function for select to return user custom data for yearly report

    data_option_returner(value: string | undefined) {

        const yearly:any[] = [
            { name: 'فروردین', value: 320 },
            { name: 'اردیبهشت ', value: 310 },
            { name: ' خرداد', value: 250 },
            { name: 'تیر', value: 220 },
            { name: 'مرداد', value: 200 },
            { name: 'شهریور', value: 260 },
            { name: 'مهر', value: 500 },
            { name: 'آبان', value: 600 },
            { name: 'آذر', value: 650 },
            { name: 'دی', value: 400 },
            { name: 'بهمن', value: 550 },
            { name: 'اسفند', value: 380 },
        ];
        const last_quarter= yearly.length >=4 ? yearly.slice(yearly.length-3,yearly.length) : yearly.slice(0,yearly.length);
        const spring = yearly.length >=4 ? yearly.slice(0,3) : yearly.slice(0,yearly.length);
        const summer = yearly.length >=7 ? yearly.slice(3,6) : yearly.slice(3,yearly.length);
        const fall = yearly.length >=10 ? yearly.slice(6,9) : yearly.slice(6,yearly.length);
        const winter = yearly.length >=12 ? yearly.slice(9,12) : yearly.slice(9,yearly.length);

        if (value === "yearly") {
            return yearly;
        };
        if (value === "last_quarter") {
            return last_quarter;
        };
        if (value === "spring") {
            return spring;
        };
        if (value === "summer") {
            return summer;
        };
        if (value === "fall") {
            return fall;
        };
        if (value === "winter") {
            return winter;
        }
        else {
            return yearly;
        };
    }

    // end function for select to return user custom data for yearly report


    // start function for return user custom data chart color

    data_option_color_returner() {
        const COLORS = ['#green', '#00C49F', '#gray', '#FF8042', 'red', 'blue',
            '#gray', '#00C49F', '#green', '#FF8042', 'blue', 'red'];
        return COLORS
    }

    // end function for return user custom data chart color


    // start return_report function

    report_status(per: string) {

        const data: any = this.data_option_returner(this.state.type_of_report.value)

        return <>
            <div className="col-12">
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <LineChart
                            // width={500}
                            // height={200}
                            data={data}
                            syncId="anyId"
                            margin={{
                                top: 10, right: 50, left: 0, bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="1 1" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip position={{x:-50,y:-100}} />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    }

    // end return_report function



    render() {

        return (
            <>
                <div className="row mb-3">
                    <div className="col-12 col-md-6">
                        <div className="ml-2">
                            <label htmlFor="">{Localization.type_of_report.Reporting_Period}</label>
                            <Select
                                onChange={(value: any) => this.handleReportChange(value)}
                                options={this.reportOptions}
                                value={this.state.type_of_report}
                                placeholder={Localization.type_of_report.Reporting_Period}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            {Localization.report + " "}
                            {
                                this.state.type_of_report.value === "yearly"
                                    ?
                                    Localization.annual_Reports.yearly
                                    :
                                    this.state.type_of_report.value === "last_quarter"
                                        ?
                                        Localization.annual_Reports.last_quarter
                                        :
                                        this.state.type_of_report.value === "spring"
                                            ?
                                            Localization.annual_Reports.spring
                                            :
                                            this.state.type_of_report.value === "summer"
                                                ?
                                                Localization.annual_Reports.summer
                                                :
                                                this.state.type_of_report.value === "fall"
                                                    ?
                                                    Localization.annual_Reports.fall
                                                    :
                                                    this.state.type_of_report.value === "winter"
                                                        ?
                                                        Localization.annual_Reports.winter
                                                        :
                                                        ""
                            }
                        </div>
                    </div>
                    <div className="col-12">
                        <div style={{ width: '100%', height: 600 }}>
                            {
                                this.report_status(this.state.type_of_report.value)
                            }
                        </div>
                    </div>
                </div>
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

export const ReportYearSellChart = connect(
    state2props,
    dispatch2props
)(ReportYearSellChartComponent);