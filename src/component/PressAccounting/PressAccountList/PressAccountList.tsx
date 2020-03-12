import React from "react";
import { Table, IProps_table } from "../../table/table";
import { History } from 'history';
import { ToastContainer } from "react-toastify";
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { redux_state } from "../../../redux/app_state";
import { BaseComponent } from "../../_base/BaseComponent";
import { TInternationalization } from "../../../config/setup";
import { Localization } from "../../../config/localization/localization";
import { BtnLoader } from "../../form/btn-loader/BtnLoader";
import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import { RetryModal } from "../../tool/retryModal/retryModal";
import { PersonService } from "../../../service/service.person";
import { PressAccountingService } from "../../../service/service.pressAccounting";
import { DeleteModal } from "../../tool/deleteModal/deleteModal";
import { UpdatePaymentModal } from "../UpdatePaymentModal/UpdatePaymentModal";
import { permissionChecker } from "../../../asset/script/accessControler";
import { T_ITEM_NAME, CHECKTYPE, CONDITION_COMBINE } from "../../../enum/T_ITEM_NAME";
import { payment_type } from "../RecordNewPayment/RecordNewPayment";
// import { IToken } from "../../../model/model.token";
// import { SORT } from "../../../enum/Sort";

/// define props & state ///////
export interface IProps {
    match: any;
    history: History;
    internationalization: TInternationalization;
    // token: IToken;
}


interface IState {
    press_fullName: string | undefined;
    total_paid: number | undefined | null;
    count: number | undefined | null;
    pressAccountList_table: IProps_table;
    PressAccountListError: string | undefined;
    tableProcessLoader: boolean;
    retryModal: boolean;
    updateModalShow: boolean;
    updateModalBtnLoader: boolean;
    deleteModalShow: boolean;
    deleteModalBtnLoader: boolean;
}

// define class of Comment 
class PressAccountListComponent extends BaseComponent<IProps, IState>{
    state = {
        press_fullName: undefined,
        total_paid: undefined,
        count: undefined,
        pressAccountList_table: {
            list: [],
            colHeaders: [
                // start payer
                {
                    field: "payer", title: Localization.payer,
                    templateFunc: () => {
                        return <>
                            {Localization.payer}
                        </>
                    },
                    cellTemplateFunc: (row: any) => {
                        if (row.payer_id) {
                            return <div title={row.payer_id}>wait!!!</div>
                        }
                        return '';
                    }
                },
                // end payer
                // start reciever
                // {
                //     field: "receiver_press", title: Localization.receiver_press,
                //     templateFunc: () => {
                //         return <>
                //             {Localization.receiver_press}
                //         </>
                //     },
                //     cellTemplateFunc: (row: any) => {
                //         if (row.receiver) {
                //             return <div title={this.getPersonFullName(row.receiver)}>{this.getPersonFullName(row.receiver)}</div>
                //         }
                //         return '';
                //     }
                // },
                // end reciever
                // start creator
                {
                    field: "creator", title: Localization.creator,
                    templateFunc: () => {
                        return <>
                            {Localization.creator}
                        </>
                    },
                    cellTemplateFunc: (row: any) => {
                        if (row.creator) {
                            return <div title={row.creator}>{row.creator}</div>
                        }
                        return '';
                    }
                },
                // end creator
                // start record date
                {
                    field: "payment record time", title: Localization.creation_date,
                    templateFunc: () => {
                        return <>
                            {Localization.creation_date}
                        </>
                    },
                    cellTemplateFunc: (row: any) => {
                        if (row.creation_date) {
                            return <div title={this._getTimestampToDate(row.creation_date)}>{this.getTimestampToDate(row.creation_date)}</div>
                        }
                        return '';
                    }
                },
                // end record date
                // start amount
                {
                    field: "amount", title: Localization.Amount_of_payment,
                    templateFunc: () => {
                        return <>
                            {Localization.Amount_of_payment}
                        </>
                    },
                    cellTemplateFunc: (row: any) => {
                        if (row.amount === 0 || row.amount === undefined || row.amount === null) {
                            return <div title={'0'}>{0}</div>
                        }
                        if (row.amount) {
                            return <div title={row.amount}>{row.amount}</div>
                        }
                        return '';
                    }
                },
                // end amount
                // start payment type
                {
                    field: "payment_t", title: Localization.payment_type_grid,
                    templateFunc: () => {
                        return <>
                            {Localization.payment_type_grid}
                        </>
                    },
                    cellTemplateFunc: (row: any) => {
                        if (row.payment_details !== null && row.payment_details !== undefined) {
                            let p_t: any = row.payment_details.payment_type;
                            let pay_type: payment_type = p_t;
                            return <div title={row.amount}>{Localization.payment_type[pay_type]}</div>
                        }
                        return '';
                    }
                },
                // end payment type
                // start payment date
                {
                    field: "pay_time", title: Localization.pay_time,
                    templateFunc: () => {
                        return <>
                            {Localization.pay_time}
                        </>
                    },
                    cellTemplateFunc: (row: any) => {
                        if (row.payment_details !== null && row.payment_details !== undefined) {
                            return <div title={this._getTimestampToDate(row.payment_details.date)}>{this.getTimestampToDate(row.payment_details.date)}</div>
                        }
                        return '';
                    }
                },
                // end payment date
                // start modifier
                {
                    field: "modifier", title: Localization.modifier,
                    templateFunc: () => {
                        return <>
                            {Localization.modifier}
                        </>
                    },
                    cellTemplateFunc: (row: any) => {
                        if (row.modifier) {
                            return <div title={row.modifier}>{row.modifier}</div>
                        }
                        return '';
                    }
                },
                // end modifier
                // start modification_date
                {
                    field: "modification_date", title: Localization.modification_date,
                    templateFunc: () => {
                        return <>
                            {Localization.modification_date}
                        </>
                    },
                    cellTemplateFunc: (row: any) => {
                        if (row.modification_date) {
                            return <div title={this._getTimestampToDate(row.modification_date)}>{this.getTimestampToDate(row.modification_date)}</div>
                        }
                        return '';
                    }
                },
                // end modification_date
            ],
            actions: permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountListTools], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true
                ?
                [
                    {
                        access: (row: any) => { return permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountListDeleteTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) },
                        text: <i title={Localization.remove} className="fa fa-trash text-danger"></i>,
                        ac_func: (row: any) => { this.deleteModalShow(row) },
                        name: Localization.remove
                    },
                    {
                        access: (row: any) => { return permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountListUpdateTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) },
                        text: <i title={Localization.update} className="fa fa-pencil-square-o text-primary"></i>,
                        ac_func: (row: any) => { this.updateModalShow(row) },
                        name: Localization.update
                    },
                ]
                :
                undefined
        },
        PressAccountListError: undefined,
        tableProcessLoader: false,
        retryModal: false,
        updateModalShow: false,
        updateModalBtnLoader: false,
        deleteModalShow: false,
        deleteModalBtnLoader: false,
    }

    selectedReceipt: any | undefined;;
    private _pressAccountingService = new PressAccountingService();
    private _personService = new PersonService();

    // constructor(props: IProps) {
    //   super(props);
    //   // this._transactionService.setToken(this.props.token)
    // }

    componentDidMount() {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountList], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true) {
            if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountListGrid], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true) {
                this.fetchPressAccounting();
            }
        } else {
            this.noAccessRedirect(this.props.history);
        }
    }

    // start functions for timestamp to date /////

    getTimestampToDate(timestamp: number) {
        if (this.props.internationalization.flag === "fa") {
            return moment_jalaali(timestamp * 1000).format('jYYYY/jM/jD');
        }
        else {
            return moment(timestamp * 1000).locale("en").format('YYYY/MM/DD');
        }
    }

    _getTimestampToDate(timestamp: number) {
        if (this.props.internationalization.flag === "fa") {
            return this.getFromNowDate(timestamp);
        }
        else {
            return this.getFromNowDate(timestamp);
        }
    }

    // end functions for timestamp to date /////

    // define axios for give data

    async fetchPressAccounting() {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountListGrid], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
            return;
        }
        this.setState({ ...this.state, tableProcessLoader: true });
        let res = await this._pressAccountingService.pressAccountingListFetchById(this.props.match.params.press_id).catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'fetchPressAccountingList_error' } });
            this.setState({
                ...this.state,
                tableProcessLoader: false,
                retryModal: true,
            });
        });
        if (res) {
            this.setState({
                ...this.state,
                press_fullName: this.getPersonFullName(res.data.payment_details[0].receiver),
                total_paid: res.data.total_paid,
                count: res.data.count,
                pressAccountList_table: {
                    ...this.state.pressAccountList_table,
                    list: res.data.payment_details
                },
                tableProcessLoader: false,
            });
        }
    }

    // start delete modal functions show-hide-request

    deleteModalShow(row: any) {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountListDeleteTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
            return;
        }
        this.selectedReceipt = row;
        this.setState({ ...this.state, deleteModalShow: true })
    }

    deleteModalHide() {
        this.selectedReceipt = undefined;
        this.setState({ ...this.state, deleteModalShow: false })
    }

    async removeReceipt(id: string) {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountListDeleteTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
            return;
        }
        this.setState({ ...this.state, deleteModalBtnLoader: true });
        let res = await this._pressAccountingService.removeFieldOfPressAccountList(id).catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'removeFieldOfPressAccountList' } });
            this.setState({ ...this.state, deleteModalBtnLoader: false });
        })

        if (res) {
            this.setState({ ...this.state, deleteModalBtnLoader: false });
            this.apiSuccessNotify();
            this.fetchPressAccounting();
            this.deleteModalHide();
        }
    }

    // end delete modal functions show-hide-request


    // start update modal functions show-hide-request

    updateModalShow(row: any) {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountListUpdateTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
            return;
        }
        this.props.history.push(`/update_recorded_payment_manage_wizard/${row.id}/${this.props.match.params.press_id}`)
        // this.selectedReceipt = row;
        // this.setState({ ...this.state, updateModalShow: true })
    }

    updateModalHide() {
        this.selectedReceipt = undefined;
        this.setState({ ...this.state, updateModalShow: false })
    }

    async updateReceipt(field: { payer_id: string, receiver_id: string, amount: number }, field_id: string) {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountListUpdateTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
            return;
        }
        this.setState({ ...this.state, updateModalBtnLoader: true });
        let res = await this._pressAccountingService.updateFieldOfPressAccountList(field, field_id).catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'updateFieldOfPressAccountList' } });
            this.setState({ ...this.state, updateModalBtnLoader: false });
        })

        if (res) {
            this.setState({ ...this.state, updateModalBtnLoader: false });
            this.apiSuccessNotify();
            this.fetchPressAccounting();
            this.updateModalHide();
        }
    }

    // end update modal functions show-hide-request

    record_new_payment_press_list_wizard() {
        if(permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingRecordNewPayment], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false){
            return;
        }
        this.props.history.push(`/record_new_payment_press_list_wizard/${this.props.match.params.press_id}`);
    }

    back() {
        if(permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManage], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false){
            return;
        }
        this.props.history.push(`/press_accounts/manage`);
    }

    //////render call Table component //////

    render() {
        return (
            <>
                <div className="content">
                    <div className="row">
                        <div className="col-12">
                            <h5 className="text-bold text-dark pl-3">
                                <span className="text-muted">{Localization.role_type_list.Press}:&nbsp;</span>{this.state.press_fullName}
                            </h5>
                            <h5 className="text-bold text-dark pl-3">
                                <span className="text-muted">{Localization.total_receipt}:&nbsp;</span>{this.state.total_paid}
                            </h5>
                            <h5 className="text-bold text-dark pl-3">
                                <span className="text-muted">{Localization.number_of_pay}:&nbsp;</span>{this.state.count}
                            </h5>
                            <div className="d-flex justify-content-between">
                                {
                                    permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingRecordNewPayment], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true
                                        ?
                                        <BtnLoader
                                            loading={false}
                                            disabled={false}
                                            btnClassName="btn btn-success shadow-default shadow-hover mb-4"
                                            onClick={() => this.record_new_payment_press_list_wizard()}
                                        >
                                            {Localization.record_pay}
                                        </BtnLoader>
                                        :
                                        undefined
                                }
                                {
                                    permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManage], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true
                                        ?
                                        <BtnLoader
                                            loading={false}
                                            disabled={false}
                                            btnClassName="btn btn-primary shadow-default shadow-hover mb-4"
                                            onClick={() => this.back()}
                                        >
                                            {Localization.back}
                                        </BtnLoader>
                                        :
                                        undefined
                                }
                            </div>
                        </div>
                    </div>
                    {
                        permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountListGrid], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true
                            ?
                            <div className="row">
                                <div className="col-12">
                                    <Table row_offset_number={0} loading={this.state.tableProcessLoader} list={this.state.pressAccountList_table.list} colHeaders={this.state.pressAccountList_table.colHeaders} actions={this.state.pressAccountList_table.actions}></Table>
                                </div>
                            </div>
                            :
                            undefined
                    }
                </div>
                {
                    this.selectedReceipt === undefined
                        ?
                        undefined
                        :
                        <DeleteModal
                            crud_name={Localization.pay}
                            modalShow={this.state.deleteModalShow}
                            deleteBtnLoader={this.state.deleteModalBtnLoader}
                            rowData={{ [Localization.payer]: this.selectedReceipt.creator, [Localization.Amount_of_payment]: this.selectedReceipt.amount, [Localization.pay_time]: this.getTimestampToDate(this.selectedReceipt.creation_date) }}
                            rowId={this.selectedReceipt.id}
                            onHide={() => this.deleteModalHide()}
                            onDelete={(rowId: string) => this.removeReceipt(rowId)}
                        />
                }
                {
                    this.selectedReceipt === undefined
                        ?
                        undefined
                        :
                        <UpdatePaymentModal
                            modalShow={this.state.updateModalShow}
                            btnLoader={this.state.updateModalBtnLoader}
                            rowData={this.selectedReceipt}
                            onHide={() => this.updateModalHide()}
                            onUpdate={(field: { payer_id: string, receiver_id: string, amount: number }, field_id: string) => this.updateReceipt(field, field_id)}
                        />
                }
                {
                    <RetryModal
                        modalShow={this.state.retryModal}
                        onHide={() => this.setState({ ...this.state, retryModal: false })}
                        onRetry={() => { this.fetchPressAccounting(); this.setState({ ...this.state, retryModal: false }) }}
                    />
                }
                <ToastContainer {...this.getNotifyContainerConfig()} />
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

export const PressAccountList = connect(
    state2props,
    dispatch2props
)(PressAccountListComponent);