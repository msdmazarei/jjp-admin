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
import { ResponsiveContainer, Tooltip, LabelList } from "recharts";
import { FunnelChart, Funnel } from 'recharts';
import { PersonService } from "../../../../service/service.person";
import { OrderService, IOrderItems } from "../../../../service/service.order";



export interface IProps {
    history?: History;
    internationalization: TInternationalization;
    token: IToken;
    init_title: (cmpTitle: JSX.Element) => void;
    init_tools: (tools: JSX.Element) => void;
}

interface IState {
    number_of_member: any[];
    number_of_order: any[];
    number_of_invoiced: number;
}

class ReportStoreCustomerPerformanceComponent extends BaseComponent<IProps, IState> {

    /// start of state

    state = {
        number_of_member:[],
        number_of_order: [],
        number_of_invoiced:0,
    }
    /// end of state

    private _report_title: string = Localization.name_of_report.User_to_customer_conversion_process_chart;


    // constructor(props: IProps) {
    //     super(props);
    // }

    componentDidMount() {
        this.init_title();
        this.init_tools();
        // this._personService.setToken(this.props.token);
        // this._orderService.setToken(this.props.token);
        // this.fetchPersons();
        // this.fetchOrders();
    }


    // start service for request order & person number in system
        /* start test request change after
        private _personService = new PersonService();
        private _orderService = new OrderService();

        // start member count
        async fetchPersons() {
            let res = await this._personService.search(1000, 0).catch(error => {
                this.handleError({ error: error.response });
            });
            if (res) {
                this.setState({
                    ...this.state,
                    number_of_member: res.data.result,
                });
            }
        }
        // end member count

        // start number of order & invoced
        async fetchOrders() {
            let res = await this._orderService.search(1000,0, {}).catch(error => {
              this.handleError({ error: error.response })});
            if (res) {
              this.setState({
                ...this.state,
                  number_of_order: res.data.result
              },
              () =>  this.invocied_counter(this.state.number_of_order));
            }
        }
        // end number of order & invoced

        async invocied_counter(list:any){
            let invoced = 0;
            await list.map((item:any,index:number) =>
                item.status === "Invoiced"
                ?
                invoced++
                :
                undefined
            )
            this.setState({
                ...this.state,
                number_of_invoiced : invoced,
            })
        }
        end test request change after */
    // end service for request order & person number in system


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

    data_option_returner(mem: number, ord: number, inv: number) : any[] {
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
        return data;
    }

    // end data set on chart from state


    // start return_report function

    report_status() {

        return <>
            <div className="col-12">
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <FunnelChart>
                            <Tooltip position={{ x: -20, y: 40 }} />
                            <Funnel
                                dataKey="value"
                                // data={this.data_option_returner(this.state.number_of_member.length, this.state.number_of_order.length,this.state.number_of_invoiced)}
                                data={this.data_option_returner(72,61,35)}
                                isAnimationActive={true}
                            >
                             <LabelList dataKey="name"/>   
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