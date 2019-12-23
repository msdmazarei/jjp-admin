import React from "react";
import { History } from 'history';
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import 'moment/locale/fa';
import 'moment/locale/ar';
import { TInternationalization } from "../../../../config/setup";
// import { IToken } from "../../../../model/model.token";
import { BaseComponent } from "../../../_base/BaseComponent";
import { redux_state } from "../../../../redux/app_state";
import { Localization } from "../../../../config/localization/localization";
import Select from 'react-select'
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, ResponsiveContainer, Brush, BarChart, Legend, Bar, LabelList } from "recharts";
import { ReportService } from "../../../../service/service.reports";
import { IPerson } from "../../../../model/model.person";
import AsyncSelect from 'react-select/async';
import { PersonService } from "../../../../service/service.person";
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';

export interface IProps {
    history?: History;
    internationalization: TInternationalization;
    // token: IToken;
    init_title: (cmpTitle: JSX.Element) => void;
    init_tools: (tools: JSX.Element) => void;
}

interface ICmp_select<T> {
    label: string;
    value: T
}

interface back_returner_format {
    press: string;
    press_month: string;
    sale_month: string;
    total_price: number;
    value_occurrence: number;
};

interface IState {
    type_of_report: {
        label: string;
        value: string;
    } | undefined;
    compear_options: ICmp_select<IPerson>[] | null;
    perss_id_array: string[];
    back_data: back_returner_format[];
    chart_data: any[];
    current_month: number;
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


    /// start of state

    state = {
        type_of_report: this.reportOptions[0],
        compear_options: [],
        perss_id_array: [],
        back_data: [],
        chart_data: [],
        current_month: 0,
        barChart: false,
        lineChart: true,
    }

    /// end of state

    private _report_title: string = Localization.name_of_report.Compare_publishers_sales_by_time_period;
    private _reportService = new ReportService();
    private _personService = new PersonService();
    month: string[] = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',]

    // constructor(props: IProps) {
    //     super(props);
    // }

    componentDidMount() {
        if (this.props.internationalization.flag === 'fa') {
            this.setState({
                ...this.state,
                current_month: (moment_jalaali().jMonth() + 1),
            })
        } else {
            this.setState({
                ...this.state,
                current_month: (moment().month() + 1),
            })
        }
        this.request();
        this.init_title();
        this.init_tools();
    }

    async request() {
        const press_id: string[] = this.state.perss_id_array;
        if (press_id.length <= 1) {
            return
        } else {
            const obj: { press: string[] } = { press: press_id };
            let res = await this._reportService.press_sale_compare(obj).catch(error => {

            });
            if (res) {
                this.setState({
                    ...this.state,
                    back_data: res.data.result,
                }, () => this.data_creator_for_chart())
            }
        }
    }


    back_data_filter_by_press_and_month(id: string, month: number): number {
        let b_data: back_returner_format[] = this.state.back_data;
        for (let i = 0; i < b_data.length; i++) {
            let b_month: number = Number(b_data[i].sale_month);
            if (b_month === month && b_data[i].press === id) {
                return b_data[i].total_price;
            }
        }
        return 0;
    }


    data_creator_for_chart() {
        let chartData: any[] = [];
        let press: ICmp_select<IPerson>[] = this.state.compear_options;
        for (let i = 0; i < this.month.length; i++) {
            const monthData: any = {};
            monthData['name'] = this.month[i];
            for (let j = 0; j < press.length; j++) {
                monthData[this.getPersonFullName(press[j].value)] = this.back_data_filter_by_press_and_month(press[j].value.id, (i + 1))
            }
            chartData.push(monthData);
        };
        this.setState({
            ...this.state,
            chart_data: chartData
        }, () => console.log(this.state.chart_data));
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

    bookPressChange(value: ICmp_select<IPerson>[] | null) {
        if (value === null) {
            this.setState({
                ...this.state,
                compear_options: [],
                perss_id_array: [],
                back_data: [],
                chart_data: [],
            })
        } else {
            let newpress: string[] = [];
            let data: ICmp_select<IPerson>[] = value;
            for (let i = 0; i < data.length; i++) {
                newpress.push(data[i].value.id);
            };
            this.setState({
                ...this.state,
                compear_options: value,
                perss_id_array: newpress,
            }, () => this.request())
        }
    }

    // end function for set type of report


    // start define custom tools & pass that to widget

    tools() {
        return (
            <>
                <i className="tool fa fa-line-chart" onClick={() => this.setChartToLine()}></i>
                <i className="tool fa fa-bar-chart" onClick={() => this.setChartToBar()}></i>
                <i className="tool fa fa-file-pdf-o" onClick={(e) => this.goToPdfFunction(e)}></i>
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


    // start report export in pdf format tool function 

    goToPdfFunction(e: any) {
        const widget = this.upToParent(e.currentTarget, 'app-widget');
        const content = widget && widget.querySelector('.widget-body .chart');
        const table = content!.cloneNode(true)
        const newTab = window.open();
        const head = document.querySelector('html head');
        const style = head!.cloneNode(true);
        if (newTab) {
            const oldHeadNewTab = newTab.document.querySelector('head')!;
            oldHeadNewTab!.parentNode!.removeChild(oldHeadNewTab);
            newTab.document.querySelector('html')!.prepend(style!);
            newTab.document.body.classList.add('rtl');
            newTab.document.body.classList.add('printStatus');
            newTab.document.body.classList.add('only-print-visibility');
            const body = newTab.document.querySelector('body')!;
            body.appendChild(table);
            newTab.print();
            // newTab.close();
        }
    }

    upToParent(el: any, className: string) {
        while (el && el.parentNode) {
            el = el.parentNode;
            if (el.classList.contains(className)) {

                return el;
            }
        }
        return null;
    }

    // end report export in pdf format tool function

    // start function for select to return user custom data for yearly report

    data_option_returner(value: string | undefined): any[] {

        const yearly: any[] = this.state.chart_data;
        const last_quarter = this.state.current_month > 3 ? yearly.slice((this.state.current_month - 3), this.state.current_month) : yearly.slice(0, yearly.length);
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
        const COLORS = ['red', 'green', 'gray', 'blue', 'red', '#FF8042', 'gray', '#00C49F', '#green', '#FF8042', 'blue', 'red'];
        return COLORS
    }

    // end function for return user custom data chart color


    // start return_report function with selected option

    report_status_in_line_chart() {

        const data: any[] = this.data_option_returner(this.state.type_of_report.value)
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
                            <Legend />
                            {
                                !this.state.compear_options.length
                                    ?
                                    <Line type="monotone" dataKey='جام جم' stroke="red" fill="red" />
                                    :
                                    this.state.compear_options.map((item: { label: string; value: IPerson }, index) =>

                                        <Line
                                            key={index}
                                            type="monotone"
                                            dataKey={item.label}
                                            stroke={this.data_option_color_returner()[index]}
                                            fill="#8884d8"
                                        />
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
                                    this.state.compear_options.map((item: { label: string; value: IPerson }, index) =>

                                        <Bar
                                            dataKey={item.label}
                                            stroke={this.data_option_color_returner()[index]}
                                            fill={this.data_option_color_returner()[index]}
                                            minPointSize={10}
                                        >
                                            <LabelList dataKey={item.label} position="top" angle={90} />
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


    ////// request for book roll person ////////

    private personRequstError_txt: string = Localization.no_item_found;

    async promiseOptions2(inputValue: any, callBack: any) {

        let res: any = await this._personService.searchPress(10, 0, inputValue).catch(err => {
            let err_msg = this.handleError({ error: err.response, notify: false, toastOptions: { toastId: 'promiseOptions2BookPress_error' } });
            this.personRequstError_txt = err_msg.body;
        });

        if (res) {
            let persons = res.data.result.map((ps: any) => {
                return { label: this.getPersonFullName(ps), value: ps }
            });
            this.personRequstError_txt = Localization.no_item_found;
            callBack(persons);
        } else {
            callBack();
        }
    }

    private setTimeout_person_val: any;
    debounce_300(inputValue: any, callBack: any) {
        if (this.setTimeout_person_val) {
            clearTimeout(this.setTimeout_person_val);
        }
        this.setTimeout_person_val = setTimeout(() => {
            this.promiseOptions2(inputValue, callBack);
        }, 1000);
    }

    select_noOptionsMessage(obj: { inputValue: string }) {
        return this.personRequstError_txt;
    }


    /////////////////////////////////////


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
                            <label htmlFor="">{Localization.role_type_list.Press}<span className="text-danger">*</span></label>
                            <AsyncSelect
                                isMulti
                                isClearable
                                placeholder={Localization.role_type_list.Press}
                                cacheOptions
                                defaultOptions
                                value={this.state.compear_options}
                                loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback)}
                                noOptionsMessage={(obj) => this.select_noOptionsMessage(obj)}
                                onChange={(selectedPerson: any) => this.bookPressChange(selectedPerson)}
                            />
                        </div>
                    </div>
                </div>
                <div className="row chart">
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
                                this.state.perss_id_array.length <= 1
                                    ?
                                    <div className="text-center">
                                        {Localization.msg.ui.at_least_two_publishers_must_be_selected_to_compare_publisher_sales}
                                    </div>
                                    :
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
        // token: state.token,
    };
};

export const ReportPublisherSellsCompare = connect(
    state2props,
    dispatch2props
)(ReportPublisherSellsCompareComponent);