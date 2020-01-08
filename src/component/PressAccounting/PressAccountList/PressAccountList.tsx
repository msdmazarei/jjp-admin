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
// import { IToken } from "../../../model/model.token";
import { Localization } from "../../../config/localization/localization";
import { BtnLoader } from "../../form/btn-loader/BtnLoader";
import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import { AccessService } from "../../../service/service.access";
import { AppNumberRange } from "../../form/app-numberRange/app-numberRange";
import { TABLE_SORT } from "../../table/tableSortHandler";
import { TPERMISSIONS } from "../../../enum/Permission";
import { RetryModal } from "../../tool/retryModal/retryModal";
import { IPerson } from "../../../model/model.person";
import AsyncSelect from 'react-select/async';
import { PersonService } from "../../../service/service.person";
import { PressAccountingService } from "../../../service/service.pressAccounting";
import { FixNumber } from "../../form/fix-number/FixNumber";
// import { SORT } from "../../../enum/Sort";

/// define props & state ///////
export interface IProps {
    history: History;
    internationalization: TInternationalization;
    // token: IToken;
}

interface IFilterPressAccountList {
    press: {
        value: { label: string, value: IPerson } | null;
        person_id: string | undefined;
        is_valid: boolean,
    };
    total_crediting: {
        from: number | undefined,
        from_isValid: boolean,
        to: number | undefined,
        to_isValid: boolean,
        is_valid: boolean,
    };
    total_receipt: {
        from: number | undefined,
        from_isValid: boolean,
        to: number | undefined,
        to_isValid: boolean,
        is_valid: boolean,
    };
    balance_of_crediting: {
        from: number | undefined,
        from_isValid: boolean,
        to: number | undefined,
        to_isValid: boolean,
        is_valid: boolean,
    };
}

interface ISortTransaction {
}

interface IState {
    pressAccountList_table: IProps_table;
    PressAccountListError: string | undefined;
    pager_offset: number;
    pager_limit: number;
    recordedReceiptEditModalShow: boolean;
    setRecordedReceiptEditModalLoader: boolean;
    recordedReceiptDeleteModalShow: boolean;
    setRecordedReceiptDeleteModalLoader: boolean;
    prevBtnLoader: boolean;
    nextBtnLoader: boolean;
    filterSearchBtnLoader: boolean;
    tableProcessLoader: boolean;
    filter_state: IFilterPressAccountList;
    advance_search_box_show: boolean;
    sort: string[];
    sortShowStyle: ISortTransaction;
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
                    // access: (row: any) => { return this.checkDeleteToolAccess() },
                    text: <i title={Localization.record_pay} className="fa fa-trash text-danger"></i>,
                    ac_func: (row: any) => { this.on_show_delete_receipt_modal(row) },
                    name: Localization.record_pay
                },
                {
                    // access: (row: any) => { return this.checkDeleteToolAccess() },
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
        if (this.checkPageRenderAccess() === true) {
            if (AccessService.checkAccess(TPERMISSIONS.TRANSACTION_GET_PREMIUM) === true) {
                this.setState({
                    ...this.state,
                    tableProcessLoader: true
                })
                TABLE_SORT.sortArrayReseter();
                this.fetchPressAccounting();
            }
        } else {
            this.noAccessRedirect(this.props.history);
        }
    }

    checkPageRenderAccess(): boolean {
        if (AccessService.checkAccess(TPERMISSIONS.TRANSACTION_GET_PREMIUM) === true) {
            return true;
        }
        return false;
    }

    checkAllAccessForTools(): boolean {
        if (AccessService.checkOneOFAllAccess([TPERMISSIONS.TRANSACTION_DELETE_PREMIUM]) === true) {
            return true;
        }
        return false;
    }

    checkDeleteToolAccess(): boolean {
        if (AccessService.checkAccess(TPERMISSIONS.TRANSACTION_DELETE_PREMIUM) === true) {
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

    sort_icon_change_on_mouse_over_out(sort: string, isOver: boolean) {
        if (isOver === true) {
            this.setState({
                ...this.state,
                sortShowStyle: {
                    ...this.state.sortShowStyle,
                    [sort]: true,
                }
            })
        } else {
            this.setState({
                ...this.state,
                sortShowStyle: {
                    ...this.state.sortShowStyle,
                    [sort]: false,
                }
            })
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
        if (AccessService.checkAccess(TPERMISSIONS.TRANSACTION_DELETE_PREMIUM) === false) {
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
        if (AccessService.checkAccess(TPERMISSIONS.TRANSACTION_DELETE_PREMIUM) === false) {
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
        if (AccessService.checkAccess(TPERMISSIONS.TRANSACTION_DELETE_PREMIUM) === false) {
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
        if (AccessService.checkAccess(TPERMISSIONS.TRANSACTION_DELETE_PREMIUM) === false) {
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

    filterSearch() {
        this.setState({
            ...this.state,
            filterSearchBtnLoader: true,
            tableProcessLoader: true,
            pager_offset: 0
        }, () => { this.fetchPressAccounting() });
    }

    async fetchPressAccounting() {
        this.setState({ ...this.state, tableProcessLoader: true });
        let res = await this._pressAccountingService.search(
            this.state.pager_limit,
            this.state.pager_offset,
            this.get_searchFilter(),
            this.returner_sort_array_to_fetch_func(),
        ).catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'fetchPressAccountingList_error' } });
            this.setState({
                ...this.state,
                prevBtnLoader: false,
                nextBtnLoader: false,
                tableProcessLoader: false,
                filterSearchBtnLoader: false,
                retryModal: true,
            });
        });
        if (res) {
            this.setState({
                ...this.state, pressAccountList_table: {
                    ...this.state.pressAccountList_table,
                    list: res.data.result
                },
                prevBtnLoader: false,
                nextBtnLoader: false,
                tableProcessLoader: false,
                filterSearchBtnLoader: false,
            });
        }
    }

    // previous button create

    pager_previous_btn_render() {
        if (this.state.pressAccountList_table.list && (this.state.pressAccountList_table.list! || []).length) {
            return (
                <>
                    {
                        this.state.pager_offset > 0 &&
                        <BtnLoader
                            disabled={this.state.tableProcessLoader}
                            loading={this.state.prevBtnLoader}
                            btnClassName="btn btn-outline-info pull-left shadow-default shadow-hover"
                            onClick={() => this.onPreviousClick()}
                        >
                            {Localization.previous}
                        </BtnLoader>
                    }
                </>
            );
        } else if (this.state.pressAccountList_table.list && !(this.state.pressAccountList_table.list! || []).length) {
            return (
                <>
                    {
                        this.state.pager_offset > 0 &&
                        <BtnLoader
                            disabled={this.state.tableProcessLoader}
                            loading={this.state.prevBtnLoader}
                            btnClassName="btn btn-outline-info pull-left shadow-default shadow-hover"
                            onClick={() => this.onPreviousClick()}
                        >
                            {Localization.previous}
                        </BtnLoader>
                    }
                </>
            );

        } else if (this.state.PressAccountListError) {
            return;
        } else {
            return;
        }
    }

    // next button create

    pager_next_btn_render() {
        if (this.state.pressAccountList_table.list && (this.state.pressAccountList_table.list! || []).length) {
            return (
                <>
                    {
                        !(this.state.pager_limit > (this.state.pressAccountList_table.list! || []).length) &&
                        <BtnLoader
                            disabled={this.state.tableProcessLoader}
                            loading={this.state.nextBtnLoader}
                            btnClassName="btn btn-outline-info pull-right shadow-default shadow-hover"
                            onClick={() => this.onNextClick()}
                        >
                            {Localization.next}
                        </BtnLoader>
                    }
                </>
            );
        } else if (this.state.pressAccountList_table.list && !(this.state.pressAccountList_table.list! || []).length) {
            return;
        } else if (this.state.pressAccountList_table.list) {
            return;
        } else {
            return;
        }
    }


    // on previous click

    onPreviousClick() {
        this.setState({
            ...this.state,
            pager_offset: this.state.pager_offset - this.state.pager_limit,
            prevBtnLoader: true,
            tableProcessLoader: true,

        }, () => {
            this.gotoTop();
            this.fetchPressAccounting()
        });
    }

    // on next click

    onNextClick() {
        this.setState({
            ...this.state,
            pager_offset: this.state.pager_offset + this.state.pager_limit,
            nextBtnLoader: true,
            tableProcessLoader: true,
        }, () => {
            this.gotoTop();
            this.fetchPressAccounting()
        });
    }

    ////// start request for options person of press in filter  ////////

    private personRequstError_txt: string = Localization.no_item_found;

    async promiseOptions2(inputValue: any, callBack: any) {

        let res: any = await this._personService.searchPress(10, 0, inputValue).catch(err => {
            let err_msg = this.handleError({ error: err.response, notify: false, toastOptions: { toastId: 'promiseOptions2GroupAddOrRemove_error' } });
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

    ///////////// end request for options person of press in filter ////////////////////////


    /////  start onChange & search & reset function for search box ///////////

    filter_state_reset() {
        this.setState({
            ...this.state,
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
            }
        }, () => this.repetReset())
    }
    repetReset() {
        this.setState({
            ...this.state,
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
            }
        })
    }

    person_of_press_in_search_remover() {
        this.setState({
            ...this.state,
            filter_state: {
                ...this.state.filter_state,
                press: {
                    value: null,
                    person_id: undefined,
                    is_valid: false,
                }
            }
        })
    }

    handlePersonChange = (selectedPerson: { label: string, value: IPerson }) => {
        let newperson = { ...selectedPerson };
        let isValid = true;      // newperson = selectedPerson;
        this.setState({
            ...this.state,
            filter_state: {
                ...this.state.filter_state,
                press: {
                    value: newperson,
                    person_id: newperson.value.id,
                    is_valid: isValid,
                }
            }
        })
    }

    range_picker_onChange(from: number | undefined, from_isValid: boolean, to: number | undefined, to_isValid: boolean, isValid: boolean, inputType: any) {
        this.setState({
            ...this.state,
            filter_state: {
                ...this.state.filter_state,
                [inputType]: {
                    from: from,
                    from_isValid: from_isValid,
                    to: to,
                    to_isValid: to_isValid,
                    is_valid: isValid,
                }
            }
        })
    }

    /////  end onChange & search & reset function for search box ///////////


    advanceSearchBoxShowHideManager() {
        if (this.state.advance_search_box_show === false) {
            this.setState({
                ...this.state,
                advance_search_box_show: true,
            })
        } else {
            this.setState({
                ...this.state,
                advance_search_box_show: false,
            })
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
                    {
                        AccessService.checkAccess(TPERMISSIONS.TRANSACTION_GET_PREMIUM)
                            ?
                            <>
                                {/* start search box */}
                                <div className="row">
                                    <div className="col-12">
                                        <div className="template-box mb-4">
                                            <div className="d-flex justify-content-center mb-1">
                                                {
                                                    this.state.advance_search_box_show === false
                                                        ?
                                                        <div className="cursor-pointer" onClick={() => this.advanceSearchBoxShowHideManager()}>
                                                            <span className="mx-2">{Localization.advanced_search}</span>
                                                            <i className="fa fa-angle-down mx-2"></i>
                                                        </div>
                                                        :
                                                        <div className="cursor-pointer" onClick={() => this.advanceSearchBoxShowHideManager()}>
                                                            <span className="mx-2">{Localization.advanced_search}</span>
                                                            <i className="fa fa-angle-up mx-2"></i>
                                                        </div>
                                                }
                                            </div>
                                            {/* start search box inputs */}
                                            <div className={this.state.advance_search_box_show === false ? "row d-none" : "row"}>
                                                <div className="col-md-3 col-sm-6">
                                                    <label >{Localization.role_type_list.Press}</label>
                                                    <i
                                                        title={Localization.reset}
                                                        className="fa fa-times cursor-pointer remover-in_box-async text-danger mx-1"
                                                        onClick={() => this.person_of_press_in_search_remover()}
                                                    ></i>
                                                    <AsyncSelect
                                                        placeholder={Localization.role_type_list.Press}
                                                        cacheOptions
                                                        defaultOptions
                                                        value={this.state.filter_state.press.value}
                                                        loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback)}
                                                        noOptionsMessage={(obj) => this.select_noOptionsMessage(obj)}
                                                        onChange={(selectedPerson: any) => this.handlePersonChange(selectedPerson)}
                                                    />
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <AppNumberRange
                                                        label={Localization.total_crediting}
                                                        from={this.state.filter_state.total_crediting.from}
                                                        to={this.state.filter_state.total_crediting.to}
                                                        onChange={(from, from_isValid, to, to_isValid, isValid) => this.range_picker_onChange(from, from_isValid, to, to_isValid, isValid, 'total_crediting')}
                                                    />
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <AppNumberRange
                                                        label={Localization.total_crediting}
                                                        from={this.state.filter_state.total_receipt.from}
                                                        to={this.state.filter_state.total_receipt.to}
                                                        onChange={(from, from_isValid, to, to_isValid, isValid) => this.range_picker_onChange(from, from_isValid, to, to_isValid, isValid, 'total_receipt')}
                                                    />
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <AppNumberRange
                                                        label={Localization.total_crediting}
                                                        from={this.state.filter_state.balance_of_crediting.from}
                                                        to={this.state.filter_state.balance_of_crediting.to}
                                                        onChange={(from, from_isValid, to, to_isValid, isValid) => this.range_picker_onChange(from, from_isValid, to, to_isValid, isValid, 'balance_of_crediting')}
                                                    />
                                                </div>
                                            </div>
                                            {/* end search box inputs */}
                                            {/* start search btns box */}
                                            <div className="row mt-1">
                                                <div className={this.state.advance_search_box_show === false ? "col-12 d-none" : "col-12"}>
                                                    <BtnLoader
                                                        disabled={this.state.tableProcessLoader}
                                                        loading={this.state.filterSearchBtnLoader}
                                                        btnClassName="btn btn-info shadow-default shadow-hover pull-right ml-3"
                                                        onClick={() => this.filterSearch()}
                                                    >
                                                        {Localization.search}
                                                    </BtnLoader>
                                                    <BtnLoader
                                                        // disabled={this.state.tableProcessLoader}
                                                        loading={false}
                                                        btnClassName="btn btn-warning shadow-default shadow-hover pull-right"
                                                        onClick={() => this.filter_state_reset()}
                                                    >
                                                        {Localization.reset}
                                                    </BtnLoader>
                                                </div>
                                            </div>
                                            {/* end search btns box */}
                                        </div>
                                    </div>
                                </div>
                                {/* end search  box */}
                                <div className="row">
                                    <div className="col-12">
                                        <Table row_offset_number={this.state.pager_offset} loading={this.state.tableProcessLoader} list={this.state.pressAccountList_table.list} colHeaders={this.state.pressAccountList_table.colHeaders} actions={this.state.pressAccountList_table.actions}></Table>
                                        <div>
                                            {this.pager_previous_btn_render()}
                                            {this.pager_next_btn_render()}
                                        </div>
                                    </div>
                                </div>
                            </>
                            :
                            undefined
                    }
                </div>
                {this.render_delete_receipt_modal(this.selectedReceiptForDelete)}
                {this.render_edit_receipt_modal()}
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