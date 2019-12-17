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
import { ResponsiveContainer, Tooltip, LabelList } from "recharts";
import { FunnelChart, Funnel } from 'recharts';
import { ReportService } from "../../../../service/service.reports";



export interface IProps {
    history?: History;
    internationalization: TInternationalization;
    // token: IToken;
    init_title: (cmpTitle: JSX.Element) => void;
    init_tools: (tools: JSX.Element) => void;
}

interface IState {
    number_of_member: number;
    number_of_order: number;
    number_of_invoiced: number;
    is_request_success : boolean;
}

class ReportStoreCustomerPerformanceComponent extends BaseComponent<IProps, IState> {

    /// start of state

    state = {
        number_of_member: 0,
        number_of_order: 0,
        number_of_invoiced: 0,
        is_request_success : true,
    }
    /// end of state

    private _report_title: string = Localization.name_of_report.Order_to_customer_conversion_process_chart;
    private _reportService = new ReportService();

    // constructor(props: IProps) {
    //     super(props);
    // }

    componentDidMount() {
        this.fetch_number_of_user_order_invoiceedOrder();
        this.init_title();
        this.init_tools();
    }

    async fetch_number_of_user_order_invoiceedOrder(){
        let res = await this._reportService.user_to_customer().catch(error => {
            this.setState({...this.state, is_request_success : false});
            this.handleError({ error: error.response, toastOptions: { toastId: 'user_to_customer_request_error' } });
        });
        if(res){
            this.setState({
                ...this.state,
                number_of_member : res.data.user_count,
                number_of_order : res.data.order_count,
                number_of_invoiced : res.data.invoice_count,
                is_request_success : true,
            })
        }

    }


    // start request for fetch user & order & invoiceedOrder number in system


   
    // end request for fetch user & order & invoiceedOrder number in system


    // start define custom tools & pass that to widget

    tools() {
        return (
            <>
                <i className="tool fa fa-file-pdf-o" onClick={(e) => this.goToPdfFunction(e)}></i>
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


    // start data set on chart from state

    data_option_returner(mem: number, ord: number, inv: number): any[] {
        // const member: number = mem;
        const order: number = ord;
        const invoiced: number = inv;
        const data: {
            name: string;
            value: number;
            fill: string;
        }[] = [
                // {
                //     'name': 'member',
                //     'value': member,
                //     'fill': 'red',
                // },
                {
                    'name': Localization.order_status.Created,
                    'value': order,
                    'fill': 'blue',
                },
                {
                    'name': Localization.order_status.Invoiced,
                    'value': invoiced,
                    'fill': 'green',
                },
            ]
        return data;
    }

    // end data set on chart from state


    // start return_report function

    report_status() {

        return <>
            <div className="col-12">
                <div style={{ width: 'auto' , height: 300 }}>
                    <ResponsiveContainer width="99%" height={300}>
                        <FunnelChart>
                            <Tooltip position={{ x: -20, y: 40 }} />
                            <Funnel
                                dataKey="value"
                                data={this.data_option_returner(this.state.number_of_member,this.state.number_of_order, this.state.number_of_invoiced)}
                                isAnimationActive={true}
                            >
                                <LabelList dataKey="name" />
                            </Funnel>
                        </FunnelChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    }

    // end return_report function



    render() {

        return (
            <>
                <div className="row chart">
                    <div className="col-12">
                        <div className="text-center font-weight-bold">
                            {(Localization.count + " " + Localization.user + ":" + " " + this.state.number_of_member)}
                        </div>
                    </div>
                    <div className="col-12">
                        <div style={{ maxWidth: '100%', height: 600 }}>
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
        // token: state.token,
    };
};

export const ReportStoreCustomerPerformance = connect(
    state2props,
    dispatch2props
)(ReportStoreCustomerPerformanceComponent);