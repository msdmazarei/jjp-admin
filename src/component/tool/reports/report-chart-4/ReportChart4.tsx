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
import { ResponsiveContainer} from "recharts";



export interface IProps {
    history?: History;
    internationalization: TInternationalization;
    token: IToken;
    init_title: (cmpTitle: JSX.Element) => void;
    init_tools: (tools: JSX.Element) => void;
}

interface IState {
    number_of_member: number;
    number_of_order: number;
    number_of_invoiced: number;
}

class ReportStoreCustomerPerformanceComponent extends BaseComponent<IProps, IState> {

    /// start of state

    state = {
        number_of_member: 0,
        number_of_order: 0,
        number_of_invoiced: 0,
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


    // start data set on chart from state

    data_option_returner(mem: number, ord: number, inv: number) {
        const member: number = mem;
        const order: number = ord;
        const invoiced: number = inv;
        const data: {
            name: string;
            value: number;
            fill: string;
        }[] = [
                {
                    'name': 'member',
                    'value': member,
                    'fill': 'red',
                },
                {
                    'name': 'order',
                    'value': order,
                    'fill': 'blue',
                },
                {
                    'name': 'invoiced',
                    'value': invoiced,
                    'fill': 'green',
                },
            ]
    }

    // end data set on chart from state

    // start return_report function

    report_status() {

        const data: any = this.data_option_returner(this.state.number_of_member, this.state.number_of_order, this.state.number_of_invoiced)

        return <>
            <div className="col-12">
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                       
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    }

    // end return_report function



    render() {

        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">

                        </div>
                    </div>
                    <div className="col-12">
                        <div style={{ width: '100%', height: 600 }}>
                            {
                                this.report_status()
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

export const ReportStoreCustomerPerformance = connect(
    state2props,
    dispatch2props
)(ReportStoreCustomerPerformanceComponent);