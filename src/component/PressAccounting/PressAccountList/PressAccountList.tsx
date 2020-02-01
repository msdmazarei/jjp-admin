import React from "react";
import { Table, IProps_table } from "../../table/table";
import { History } from 'history';
import { Modal } from "react-bootstrap";
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
import { AccessService } from "../../../service/service.access";
import { TABLE_SORT } from "../../table/tableSortHandler";
import { RetryModal } from "../../tool/retryModal/retryModal";
import { PersonService } from "../../../service/service.person";
import { PressAccountingService } from "../../../service/service.pressAccounting";
import { FixNumber } from "../../form/fix-number/FixNumber";
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
    pressAccountList_table: IProps_table;
    PressAccountListError: string | undefined;
    recordedReceiptEditModalShow: boolean;
    setRecordedReceiptEditModalLoader: boolean;
    recordedReceiptDeleteModalShow: boolean;
    setRecordedReceiptDeleteModalLoader: boolean;
    tableProcessLoader: boolean;
    advance_search_box_show: boolean;
    sort: string[];
    retryModal: boolean;
    receipt_data_for_update: {
        receipt_id: string | undefined;
        amount: number | null;
        isValid: boolean;
    }
}

// define class of Comment 
class PressAccountListComponent extends BaseComponent<IProps, IState>{
    state = {
        pressAccountList_table: {
            list: [],
            colHeaders: [
                {
                    field: "pay_time", title: Localization.pay_time,
                    templateFunc: () => {
                        return <>
                            {Localization.pay_time}
                            {/* {
                                (this.is_this_sort_exsit_in_state(SORT.creation_date) === false && this.is_this_sort_exsit_in_state(SORT.creation_date_) === false)
                                    ?
                                    <span
                                        className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                        onClick={() => this.sort_handler_func(SORT.creation_date, SORT.creation_date_, true, 1)}
                                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('creation_date', true)}
                                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('creation_date', false)}>
                                        <i className={this.state.sortShowStyle.creation_date === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                                    </span>
                                    :
                                    this.is_this_sort_exsit_in_state(SORT.creation_date) === true
                                        ?
                                        <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                            onClick={() => this.sort_handler_func(SORT.creation_date_, SORT.creation_date, false, 0)}
                                            onMouseOver={() => this.sort_icon_change_on_mouse_over_out('creation_date', true)}
                                            onMouseOut={() => this.sort_icon_change_on_mouse_over_out('creation_date', false)}>
                                            <i className={this.state.sortShowStyle.creation_date === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                                        </span>
                                        :
                                        this.is_this_sort_exsit_in_state(SORT.creation_date_) === true
                                            ?
                                            <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                                onClick={() => this.sort_handler_func(SORT.creation_date_, SORT.creation_date, true, 2)}
                                                onMouseOver={() => this.sort_icon_change_on_mouse_over_out('creation_date', true)}
                                                onMouseOut={() => this.sort_icon_change_on_mouse_over_out('creation_date', false)}>
                                                <i className={this.state.sortShowStyle.creation_date === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                                            </span>
                                            :
                                            undefined
                            } */}
                        </>
                    },
                    cellTemplateFunc: (row: any) => {
                        if (row.creation_date) {
                            return <div title={this._getTimestampToDate(row.creation_date)}>{this.getTimestampToDate(row.creation_date)}</div>
                        }
                        return '';
                    }
                },
                {
                    field: "Amount_of_payment", title: Localization.Amount_of_payment,
                    templateFunc: () => {
                        return <>
                            {Localization.Amount_of_payment}
                            {/* {
                                (this.is_this_sort_exsit_in_state(SORT.creation_date) === false && this.is_this_sort_exsit_in_state(SORT.creation_date_) === false)
                                    ?
                                    <span
                                        className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                        onClick={() => this.sort_handler_func(SORT.creation_date, SORT.creation_date_, true, 1)}
                                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('creation_date', true)}
                                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('creation_date', false)}>
                                        <i className={this.state.sortShowStyle.creation_date === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                                    </span>
                                    :
                                    this.is_this_sort_exsit_in_state(SORT.creation_date) === true
                                        ?
                                        <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                            onClick={() => this.sort_handler_func(SORT.creation_date_, SORT.creation_date, false, 0)}
                                            onMouseOver={() => this.sort_icon_change_on_mouse_over_out('creation_date', true)}
                                            onMouseOut={() => this.sort_icon_change_on_mouse_over_out('creation_date', false)}>
                                            <i className={this.state.sortShowStyle.creation_date === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                                        </span>
                                        :
                                        this.is_this_sort_exsit_in_state(SORT.creation_date_) === true
                                            ?
                                            <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                                onClick={() => this.sort_handler_func(SORT.creation_date_, SORT.creation_date, true, 2)}
                                                onMouseOver={() => this.sort_icon_change_on_mouse_over_out('creation_date', true)}
                                                onMouseOut={() => this.sort_icon_change_on_mouse_over_out('creation_date', false)}>
                                                <i className={this.state.sortShowStyle.creation_date === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                                            </span>
                                            :
                                            undefined
                            } */}
                        </>
                    },
                    cellTemplateFunc: (row: any) => {
                        if (row) {
                            return <div title={row}>{row}</div>
                        }
                        return '';
                    }
                }
            ],
            actions: this.checkAllAccessForTools() ? [
                {
                    access: (row: any) => { return this.checkDeleteToolAccess() },
                    text: <i title={Localization.record_pay} className="fa fa-trash text-danger"></i>,
                    ac_func: (row: any) => { this.on_show_delete_receipt_modal(row) },
                    name: Localization.record_pay
                },
                {
                    access: (row: any) => { return this.checkEditToolAccess() },
                    text: <i title={Localization.receipts_list} className="fa fa-pencil-square-o text-primary"></i>,
                    ac_func: (row: any) => { this.on_show_edit_receipt_modal(row) },
                    name: Localization.receipts_list
                },
            ]
                :
                undefined
        },
        PressAccountListError: undefined,
        pager_offset: 0,
        pager_limit: 10,
        prevBtnLoader: false,
        nextBtnLoader: false,
        filterSearchBtnLoader: false,
        tableProcessLoader: false,
        recordedReceiptEditModalShow: false,
        setRecordedReceiptEditModalLoader: false,
        recordedReceiptDeleteModalShow: false,
        setRecordedReceiptDeleteModalLoader: false,
        filter_state: {
            press: {
                value: null,
                person_id: undefined,
                is_valid: false,
            },
            total_crediting: {
                from: undefined,
                from_isValid: false,
                to: undefined,
                to_isValid: false,
                is_valid: false,
            },
            total_receipt: {
                from: undefined,
                from_isValid: false,
                to: undefined,
                to_isValid: false,
                is_valid: false,
            },
            balance_of_crediting: {
                from: undefined,
                from_isValid: false,
                to: undefined,
                to_isValid: false,
                is_valid: false,
            },
        },
        advance_search_box_show: false,
        sort: [],
        sortShowStyle: {
            creation_date: false,
        },
        retryModal: false,
        receipt_data_for_update: {
            receipt_id: undefined,
            amount: null,
            isValid: false,
        }
    }

    selectedReceiptForDelete: any | undefined;
    selectedReceiptForEdit: any | undefined;
    private _pressAccountingService = new PressAccountingService();
    private _personService = new PersonService();

    // constructor(props: IProps) {
    //   super(props);
    //   // this._transactionService.setToken(this.props.token)
    // }


    // timestamp to date 

    componentDidMount() {
        // if (this.checkPageRenderAccess() === true) {
        //     if (AccessService.checkAccess('permission add after') === true) {
        //         this.setState({
        //             ...this.state,
        //             tableProcessLoader: true
        //         })
        TABLE_SORT.sortArrayReseter();
        this.fetchPressAccounting();
        //     }
        // } else {
        //     this.noAccessRedirect(this.props.history);
        // }
    }

    checkPageRenderAccess(): boolean {
        if (AccessService.checkAccess('permission add after') === true) {
            return true;
        }
        return false;
    }

    checkAllAccessForTools(): boolean {
        if (AccessService.checkOneOFAllAccess(['permission add after']) === true) {
            return true;
        }
        return false;
    }

    checkDeleteToolAccess(): boolean {
        if (AccessService.checkAccess('permission add after') === true) {
            return true;
        }
        return false
    }

    checkEditToolAccess(): boolean {
        if (AccessService.checkAccess('permission add after') === true) {
            return true;
        }
        return false
    }

    sort_handler_func(comingType: string, reverseType: string, is_just_add_or_remove: boolean, typeOfSingleAction: number) {
        if (is_just_add_or_remove === false) {
            TABLE_SORT.coming_field_name_by_sortType_and_that_reverseType_exist_in_sortArray(comingType, reverseType);
        }
        if (is_just_add_or_remove === true) {
            TABLE_SORT.just_add_or_remove(comingType, typeOfSingleAction)
        }
        this.setState({ ...this.state, sort: TABLE_SORT.sortArrayReturner() }, () => this.fetchPressAccounting());
    }

    is_this_sort_exsit_in_state(comingType: string): boolean {
        const sortArray: string[] = this.state.sort;
        let status: boolean = sortArray.includes(comingType);
        if (status === true) {
            return true;
        } else {
            return false;
        }
    }


    returner_sort_array_to_fetch_func() {
        if (this.state.sort.length > 0) {
            return this.state.sort;
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


    /// start delete receipt from press account modal /////

    on_show_delete_receipt_modal(press: any) {
        if (this.checkDeleteToolAccess() === false) {
            return;
        }
        this.selectedReceiptForDelete = press;
        this.setState({ ...this.state, setRecordedReceiptDeleteModalLoader: true, })
    }

    on_hide_delete_receipt_modal() {
        this.selectedReceiptForDelete = undefined;
        this.setState({ ...this.state, setRecordedReceiptDeleteModalLoader: false })
    }

    async on_delete_selected_receipt(receipt_id: string) {
        if (this.checkDeleteToolAccess() === false) {
            return;
        }
        this.setState({ ...this.state, setRecordedReceiptDeleteModalLoader: true });
        let res;  /// define request ////////////////////////////
        if (res) {
            this.setState({ ...this.state, setRecordedReceiptDeleteModalLoader: false });
            this.apiSuccessNotify();
            this.fetchPressAccounting();
            this.on_hide_delete_receipt_modal();
        }
    }

    render_delete_receipt_modal(selectedReceiptForDelete: any) {
        if (!this.selectedReceiptForDelete || !this.selectedReceiptForDelete.id) return;
        return (
            <>
                <Modal show={this.state.recordedReceiptDeleteModalShow} onHide={() => this.on_hide_delete_receipt_modal()}>
                    <Modal.Body>
                        <p className="delete-modal-content py-1">
                            <span className="text-muted">{/*receipt date*/}:&nbsp;</span>{/* timestamp */}
                        </p>
                        <p className="delete-modal-content py-1">
                            <span className="text-muted">{/* receipt amount*/}:&nbsp;</span>{/* amount */}
                        </p>
                        <p className="text-danger">{Localization.msg.ui.item_will_be_removed_continue}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.on_hide_delete_receipt_modal()}>{Localization.close}</button>
                        <BtnLoader
                            btnClassName="btn btn-danger shadow-default shadow-hover"
                            onClick={() => this.on_delete_selected_receipt(this.selectedReceiptForDelete.id)}
                            loading={this.state.setRecordedReceiptDeleteModalLoader}
                            disabled={this.selectedReceiptForDelete === undefined ? true : false}
                        >
                            {Localization.remove}
                        </BtnLoader>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    /// end delete receipt from press account modal /////

    /// start edit receipt of press account modal /////

    on_show_edit_receipt_modal(receipt: any) {
        if (this.checkEditToolAccess() === false) {
            return;
        }
        this.selectedReceiptForEdit = receipt;
        if (this.selectedReceiptForEdit === undefined) return;
        this.setState({
            ...this.state,
            recordedReceiptEditModalShow: true,
            receipt_data_for_update: {
                ...this.state.receipt_data_for_update,
                receipt_id: this.selectedReceiptForEdit.id,
                amount: this.selectedReceiptForEdit.amount,
                isValid: true,
            }
        })
    }

    on_hide_edit_receipt_modal() {
        this.selectedReceiptForEdit = undefined;
        this.setState({
            ...this.state,
            recordedReceiptEditModalShow: false,
            receipt_data_for_update: {
                ...this.state.receipt_data_for_update,
                receipt_id: undefined,
                amount: null,
                isValid: false,
            }
        })
    }

    handleEditReceiptOnChange(value: any) {
        let amount: any = Number(value);
        if (isNaN(amount) === true || amount === 0) {
            this.setState({
                ...this.state,
                receipt_data_for_update: {
                    ...this.state.receipt_data_for_update,
                    amount: null,
                    isValid: false,
                }
            });
        } else {
            this.setState({
                ...this.state,
                receipt_data_for_update: {
                    ...this.state.receipt_data_for_update,
                    amount: amount,
                    isValid: true,
                }
            });
        }
    }

    async onEditReceipt(transaction_id: string) {
        if (this.checkEditToolAccess() === false) {
            return;
        }
        this.setState({ ...this.state, setRecordedReceiptEditModalLoader: true });
        let res;  /// define request ////////////////////////////
        if (res) {
            this.setState({ ...this.state, setRecordedReceiptEditModalLoader: false });
            this.apiSuccessNotify();
            this.fetchPressAccounting();
            this.on_hide_edit_receipt_modal();
        }
    }

    render_edit_receipt_modal() {
        if (this.selectedReceiptForEdit === undefined) return;
        return (
            <>
                <Modal show={this.state.recordedReceiptEditModalShow} onHide={() => this.on_hide_edit_receipt_modal()}>
                    <Modal.Body>
                        <p className="delete-modal-content py-1">
                            <span className="text-muted">
                                {Localization.role_type_list.Press}:&nbsp;</span>{/* press name of row */}
                        </p>
                        <FixNumber
                            onChange={(value, isValid) => this.handleEditReceiptOnChange(value)}
                            label={Localization.Amount_of_payment}
                            placeholder={Localization.Amount_of_payment}
                            defaultValue={this.state.receipt_data_for_update.amount}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.on_hide_edit_receipt_modal()}>{Localization.close}</button>
                        <BtnLoader
                            btnClassName="btn btn-danger shadow-default shadow-hover"
                            onClick={() => this.onEditReceipt(this.state.receipt_data_for_update.receipt_id!)}
                            loading={this.state.setRecordedReceiptEditModalLoader}
                            disabled={this.state.receipt_data_for_update.isValid === true ? false : true}
                        >
                            {Localization.update}
                        </BtnLoader>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    /// end edit receipt of press account modal /////


    // define axios for give data

    private _searchFilter: any | undefined;
    private get_searchFilter() {
        this.set_searchFilter();
        return this._searchFilter;
    }
    private set_searchFilter() {
        const obj: any = {};

        if (this.state.filter_state.press.is_valid === true) {
            obj['first_field'] = { $in: [this.state.filter_state.press.person_id] };
        }

        if (this.state.filter_state.total_crediting.is_valid === true) {
            if (this.state.filter_state.total_crediting.from_isValid === true && this.state.filter_state.total_crediting.to_isValid === true) {
                obj['second_field'] = { $gte: this.state.filter_state.total_crediting.from, $lte: (this.state.filter_state.total_crediting.to! + 86400) }
            } else if (this.state.filter_state.total_crediting.from_isValid === true && this.state.filter_state.total_crediting.to_isValid === false) {
                obj['second_field'] = { $gte: this.state.filter_state.total_crediting.from }
            } else if (this.state.filter_state.total_crediting.from_isValid === false && this.state.filter_state.total_crediting.to_isValid === true) {
                obj['second_field'] = { $lte: this.state.filter_state.total_crediting.to }
            }
        }

        if (this.state.filter_state.total_receipt.is_valid === true) {
            if (this.state.filter_state.total_receipt.from_isValid === true && this.state.filter_state.total_receipt.to_isValid === true) {
                obj['third_field'] = { $gte: this.state.filter_state.total_receipt.from, $lte: (this.state.filter_state.total_receipt.to! + 86400) }
            } else if (this.state.filter_state.total_receipt.from_isValid === true && this.state.filter_state.total_receipt.to_isValid === false) {
                obj['third_field'] = { $gte: this.state.filter_state.total_receipt.from }
            } else if (this.state.filter_state.total_receipt.from_isValid === false && this.state.filter_state.total_receipt.to_isValid === true) {
                obj['third_field'] = { $lte: this.state.filter_state.total_receipt.to }
            }
        }

        if (this.state.filter_state.balance_of_crediting.is_valid === true) {
            if (this.state.filter_state.balance_of_crediting.from_isValid === true && this.state.filter_state.balance_of_crediting.to_isValid === true) {
                obj['forth_field'] = { $gte: this.state.filter_state.balance_of_crediting.from, $lte: (this.state.filter_state.balance_of_crediting.to! + 86400) }
            } else if (this.state.filter_state.balance_of_crediting.from_isValid === true && this.state.filter_state.balance_of_crediting.to_isValid === false) {
                obj['forth_field'] = { $gte: this.state.filter_state.balance_of_crediting.from }
            } else if (this.state.filter_state.balance_of_crediting.from_isValid === false && this.state.filter_state.balance_of_crediting.to_isValid === true) {
                obj['forth_field'] = { $lte: this.state.filter_state.balance_of_crediting.to }
            }
        }

        if (!Object.keys(obj).length) {
            this._searchFilter = undefined;
        } else {
            this._searchFilter = obj;
        }
    }

    async fetchPressAccounting() {
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
                ...this.state, pressAccountList_table: {
                    ...this.state.pressAccountList_table,
                    list: res.data.result
                },
                tableProcessLoader: false,
            });
        }
    }

    //////render call Table component //////

    render() {
        return (
            <>
                <div className="content">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="text-bold text-dark pl-3">{Localization.Publishers_bills}</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Table row_offset_number={this.state.pager_offset} loading={this.state.tableProcessLoader} list={this.state.pressAccountList_table.list} colHeaders={this.state.pressAccountList_table.colHeaders} actions={this.state.pressAccountList_table.actions}></Table>
                        </div>
                    </div>
                </div>
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