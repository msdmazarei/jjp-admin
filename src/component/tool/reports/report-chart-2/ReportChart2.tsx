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

    private _report_title: string = "40 Latest Report";


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

    // end function for select to return user custom data for yearly report


    // start function for return user custom data chart color

    data_option_color_returner() {
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red'];
        return COLORS
    }

    // end function for return user custom data chart color


    // start return_report function

    report_status(per: string) {

        const data: any = this.data_option_returner(this.state.type_of_report.value)

        if (per === "yearly") {
            return <>
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            {Localization.type_of_report_kind.lowest_selling + " " + Localization.type_of_report.weekly}
                        </div>
                    </div>
                    <div className="col-12">
                        <div style={{ width: '100%', height: 600 }}>

                        </div>
                    </div>
                </div>
            </>
        };
        if (per === "last_quarter") {
            return <>
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            {Localization.type_of_report_kind.lowest_selling + " " + Localization.type_of_report.weekly}
                        </div>
                    </div>
                    <div className="col-12">
                        <div style={{ width: '100%', height: 600 }}>

                        </div>
                    </div>
                </div>
            </>
        };
        if (per === "spring") {
            return <>
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            {Localization.type_of_report_kind.lowest_selling + " " + Localization.type_of_report.weekly}
                        </div>
                    </div>
                    <div className="col-12">
                        <div style={{ width: '100%', height: 600 }}>

                        </div>
                    </div>
                </div>
            </>
        };
        if (per === "summer") {
            return <>
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            {Localization.type_of_report_kind.lowest_selling + " " + Localization.type_of_report.weekly}
                        </div>
                    </div>
                    <div className="col-12">
                        <div style={{ width: '100%', height: 600 }}>

                        </div>
                    </div>
                </div>
            </>
        };
        if (per === "fall") {
            return <>
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            {Localization.type_of_report_kind.lowest_selling + " " + Localization.type_of_report.weekly}
                        </div>
                    </div>
                    <div className="col-12">
                        <div style={{ width: '100%', height: 600 }}>

                        </div>
                    </div>
                </div>
            </>
        };
        if (per === "winter") {
            return <>
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            {Localization.type_of_report_kind.lowest_selling + " " + Localization.type_of_report.weekly}
                        </div>
                    </div>
                    <div className="col-12">
                        <div style={{ width: '100%', height: 600 }}>

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
                </div>
                {
                    this.report_status(this.state.type_of_report.value)
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

export const ReportYearSellChart = connect(
    state2props,
    dispatch2props
)(ReportYearSellChartComponent);