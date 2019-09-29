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
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, ResponsiveContainer, Brush, BarChart, Legend, Bar, LabelList } from "recharts";


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
    compear_options: {
        label: string;
        value: string;
    }[] | undefined;
    barChart: boolean;
    lineChart: boolean;
}

class ReportPublisherSellsCompareComponent extends BaseComponent<IProps, IState> {

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


    // start option for compear

    compearOptions = [
        { value: 'جام جم', label: "جام جم" },
        { value: 'قناری', label: "قناری" },
        { value: 'خودنویس', label: "خودنویس" },
        { value: 'انتشارات الکترونیک', label: "انتشارات الکترونیک" },
    ];

    // end option for compear


    /// start of state

    state = {
        type_of_report: this.reportOptions[0],
        compear_options: this.compearOptions,
        barChart: false,
        lineChart: true,
    }

    /// end of state

    private _report_title: string = Localization.name_of_report.Compare_publishers_sales_by_time_period;


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


    // start function for set type & kind of report

    handleCompearOptions(value: any[]) {
        if (value.length <= 1) {
            return;
        }
        this.setState({
            ...this.state,
            compear_options: value,
        })
    }

    // end function for set type of report


    // start define custom tools & pass that to widget

    tools() {
        return (
            <>
                <div>
                    <i className="tool fa fa-line-chart" onClick={() => this.setChartToLine()}></i>
                </div>
                <div>
                    <i className="tool fa fa-bar-chart" onClick={() => this.setChartToBar()}></i>
                </div>
            </>
        )
    }

    setChartToLine() {
        this.setState({
            ...this.state,
            lineChart: true,
            barChart: false,
        });
    }

    setChartToBar() {
        this.setState({
            ...this.state,
            lineChart: false,
            barChart: true,
        });
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

        const yearly: any[] = [
            { name: 'فروردین', 'جام جم': 320, 'قناری': 310, 'خودنویس': 300, 'انتشارات الکترونیک': 400 },
            { name: 'اردیبهشت ', 'جام جم': 310, 'قناری': 300, 'خودنویس': 290, 'انتشارات الکترونیک': 390 },
            { name: ' خرداد', 'جام جم': 250, 'قناری': 240, 'خودنویس': 230, 'انتشارات الکترونیک': 380 },
            { name: 'تیر', 'جام جم': 220, 'قناری': 210, 'خودنویس': 200, 'انتشارات الکترونیک': 350 },
            { name: 'مرداد', 'جام جم': 200, 'قناری': 240, 'خودنویس': 250, 'انتشارات الکترونیک': 290 },
            { name: 'شهریور', 'جام جم': 260, 'قناری': 290, 'خودنویس': 260, 'انتشارات الکترونیک': 500 },
            { name: 'مهر', 'جام جم': 500, 'قناری': 420, 'خودنویس': 600, 'انتشارات الکترونیک': 550 },
            { name: 'آبان', 'جام جم': 600, 'قناری': 700, 'خودنویس': 550, 'انتشارات الکترونیک': 600 },
            { name: 'آذر', 'جام جم': 650, 'قناری': 650, 'خودنویس': 600, 'انتشارات الکترونیک': 580 },
            { name: 'دی', 'جام جم': 400, 'قناری': 620, 'خودنویس': 480, 'انتشارات الکترونیک': 350 },
            { name: 'بهمن', 'جام جم': 550, 'قناری': 600, 'خودنویس': 510, 'انتشارات الکترونیک': 250 },
            { name: 'اسفند', 'جام جم': 380, 'قناری': 410, 'خودنویس': 700, 'انتشارات الکترونیک': 750 },
        ];
        const last_quarter = yearly.length >= 4 ? yearly.slice(yearly.length - 3, yearly.length) : yearly.slice(0, yearly.length);
        const spring = yearly.length >= 4 ? yearly.slice(0, 3) : yearly.slice(0, yearly.length);
        const summer = yearly.length >= 7 ? yearly.slice(3, 6) : yearly.slice(3, yearly.length);
        const fall = yearly.length >= 10 ? yearly.slice(6, 9) : yearly.slice(6, yearly.length);
        const winter = yearly.length >= 12 ? yearly.slice(9, 12) : yearly.slice(9, yearly.length);

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
        const COLORS = ['red', 'green', 'gray', 'blue', 'red', '#FF8042',
            'gray', '#00C49F', '#green', '#FF8042', 'blue', 'red'];
        return COLORS
    }

    // end function for return user custom data chart color


    // start return_report function with selected option

    report_status_in_line_chart() {

        const data: any = this.data_option_returner(this.state.type_of_report.value)

        return <>
            <div className="col-12">
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={data}
                            syncId="anyId"
                            margin={{
                                top: 10, right: 50, left: 0, bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="1 1" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip position={{ x: -50, y: -150 }} />
                            {
                                !this.state.compear_options.length
                                    ?
                                    <Line type="monotone" dataKey='جام جم' stroke="red" fill="red" />
                                    :
                                    this.state.compear_options.map((item, index) =>

                                        <Line
                                            key={index}
                                            type="monotone" dataKey={item.value} stroke={this.data_option_color_returner()[index]} fill="#8884d8" />
                                    )
                            }
                            <Brush dataKey="name" height={20} stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    }

    report_status_in_bar_chart() {

        const data: any = this.data_option_returner(this.state.type_of_report.value)

        return <>
            <div className="col-12">
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={data}
                            margin={{
                                top: 10, right: 50, left: 0, bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="1 1" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip position={{ x: -50, y: -150 }} />
                            <Legend />
                            {
                                !this.state.compear_options.length
                                    ?
                                    <Bar dataKey="p1" stroke="red" fill="red" />
                                    :
                                    this.state.compear_options.map((item, index) =>

                                        <Bar
                                            dataKey={item.value}
                                            stroke={this.data_option_color_returner()[index]}
                                            fill={this.data_option_color_returner()[index]}
                                            minPointSize={10}
                                        >
                                            <LabelList dataKey={item.value} position="top" angle={90}/>
                                        </Bar>

                                    )
                            }
                            <Brush dataKey="name" height={20} stroke="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    }

    // end return_report function with selected option



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
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label htmlFor="">{Localization.publisher}</label>
                            <Select
                                isMulti
                                onChange={(value: any) => this.handleCompearOptions(value)}
                                options={this.compearOptions}
                                value={this.state.compear_options}
                                placeholder={Localization.publisher}
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
                                this.state.lineChart === true && this.state.barChart === false
                                    ?
                                    this.report_status_in_line_chart()
                                    :
                                    this.state.lineChart === false && this.state.barChart === true
                                        ?
                                        this.report_status_in_bar_chart()
                                        :
                                        undefined
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

export const ReportPublisherSellsCompare = connect(
    state2props,
    dispatch2props
)(ReportPublisherSellsCompareComponent);