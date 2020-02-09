import React from "react";
import { Table, IProps_table } from "../../table/table";
import { History } from 'history';
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
import { AppNumberRange } from "../../form/app-numberRange/app-numberRange";
import { TABLE_SORT } from "../../table/tableSortHandler";
import { RetryModal } from "../../tool/retryModal/retryModal";
import { IPerson } from "../../../model/model.person";
import AsyncSelect from 'react-select/async';
import { PersonService } from "../../../service/service.person";
import { PressAccountingService } from "../../../service/service.pressAccounting";
import moment from "moment";
import moment_jalaali from 'moment-jalaali';
import { Input } from "../../form/input/Input";
import { AppRangePicker } from "../../form/app-rangepicker/AppRangePicker";
import { SORT } from "../../../enum/Sort";
import { permissionChecker } from "../../../asset/script/accessControler";
import { T_ITEM_NAME, CHECKTYPE, CONDITION_COMBINE } from "../../../enum/T_ITEM_NAME";
import { DeleteModal } from "../../tool/deleteModal/deleteModal";
import { UpdatePaymentModal } from "../UpdatePaymentModal/UpdatePaymentModal";
// import { SORT } from "../../../enum/Sort";

/// define props & state ///////
export interface IProps {
    history: History;
    internationalization: TInternationalization;
    // token: IToken;
}

interface ICmp_select<T> {
    label: string;
    value: T;
}

interface IFilterPressAccounting {
    creator: {
        value: string | undefined;
        is_valid: boolean;
    };
    receiver_id: {
        value: ICmp_select<IPerson> | null;
        id: string | undefined;
        is_valid: boolean;
    };
    amount: {
        from: number | undefined;
        to: number | undefined;
        from_isValid: boolean;
        to_isValid: boolean;
        is_valid: boolean;
    };
    creation_date: {
        from: number | undefined;
        to: number | undefined;
        from_isValid: boolean;
        to_isValid: boolean;
        is_valid: boolean;
    };
    modifier: {
        value: string | undefined;
        is_valid: boolean;
    };
    modification_date: {
        from: number | undefined;
        to: number | undefined;
        from_isValid: boolean;
        to_isValid: boolean;
        is_valid: boolean;
    };
}

interface ISortTransaction {
    creator: boolean;
    receiver_id: boolean;
    amount: boolean;
    creation_date: boolean;
    modifier: boolean;
    modification_date: boolean;
}

interface IState {
    pressAccounting_table: IProps_table;
    PressAccountingError: string | undefined;
    pager_offset: number;
    pager_limit: number;
    prevBtnLoader: boolean;
    nextBtnLoader: boolean;
    filterSearchBtnLoader: boolean;
    tableProcessLoader: boolean;
    filter_state: IFilterPressAccounting;
    advance_search_box_show: boolean;
    sort: string[];
    sortShowStyle: ISortTransaction;
    retryModal: boolean;
    updateModalShow: boolean;
    updateModalBtnLoader: boolean;
    deleteModalShow: boolean;
    deleteModalBtnLoader: boolean;
}

// define class of Comment 
class PressAccountingManageComponent extends BaseComponent<IProps, IState>{
    state = {
        pressAccounting_table: {
            list: [],
            colHeaders: [
                {
                    field: "payer", title: Localization.payer,
                    templateFunc: () => {
                        return <>
                            {Localization.payer}
                            {
                                (this.is_this_sort_exsit_in_state(SORT.creator) === false && this.is_this_sort_exsit_in_state(SORT.creator_) === false)
                                    ?
                                    <span
                                        className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                        onClick={() => this.sort_handler_func(SORT.creator, SORT.creator_, true, 1)}
                                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('creator', true)}
                                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('creator', false)}>
                                        <i className={this.state.sortShowStyle.creator === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                                    </span>
                                    :
                                    this.is_this_sort_exsit_in_state(SORT.creator) === true
                                        ?
                                        <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                            onClick={() => this.sort_handler_func(SORT.creator_, SORT.creator, false, 0)}
                                            onMouseOver={() => this.sort_icon_change_on_mouse_over_out('creator', true)}
                                            onMouseOut={() => this.sort_icon_change_on_mouse_over_out('creator', false)}>
                                            <i className={this.state.sortShowStyle.creator === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                                        </span>
                                        :
                                        this.is_this_sort_exsit_in_state(SORT.creator_) === true
                                            ?
                                            <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                                onClick={() => this.sort_handler_func(SORT.creator_, SORT.creator, true, 2)}
                                                onMouseOver={() => this.sort_icon_change_on_mouse_over_out('creator', true)}
                                                onMouseOut={() => this.sort_icon_change_on_mouse_over_out('creator', false)}>
                                                <i className={this.state.sortShowStyle.creator === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                                            </span>
                                            :
                                            undefined
                            }
                        </>
                    },
                    cellTemplateFunc: (row: any) => {
                        if (row.creator) {
                            return <div title={row.creator}>{row.creator}</div>
                        }
                        return '';
                    }
                },
                {
                    field: "receiver_press", title: Localization.receiver_press,
                    templateFunc: () => {
                        return <>
                            {Localization.receiver_press}
                            {
                                (this.is_this_sort_exsit_in_state(SORT.receiver_id) === false && this.is_this_sort_exsit_in_state(SORT.receiver_id_) === false)
                                    ?
                                    <span
                                        className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                        onClick={() => this.sort_handler_func(SORT.receiver_id, SORT.receiver_id_, true, 1)}
                                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('receiver_id', true)}
                                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('receiver_id', false)}>
                                        <i className={this.state.sortShowStyle.receiver_id === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                                    </span>
                                    :
                                    this.is_this_sort_exsit_in_state(SORT.receiver_id) === true
                                        ?
                                        <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                            onClick={() => this.sort_handler_func(SORT.receiver_id_, SORT.receiver_id, false, 0)}
                                            onMouseOver={() => this.sort_icon_change_on_mouse_over_out('receiver_id', true)}
                                            onMouseOut={() => this.sort_icon_change_on_mouse_over_out('receiver_id', false)}>
                                            <i className={this.state.sortShowStyle.receiver_id === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                                        </span>
                                        :
                                        this.is_this_sort_exsit_in_state(SORT.receiver_id_) === true
                                            ?
                                            <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                                onClick={() => this.sort_handler_func(SORT.receiver_id_, SORT.receiver_id, true, 2)}
                                                onMouseOver={() => this.sort_icon_change_on_mouse_over_out('receiver_id', true)}
                                                onMouseOut={() => this.sort_icon_change_on_mouse_over_out('receiver_id', false)}>
                                                <i className={this.state.sortShowStyle.receiver_id === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                                            </span>
                                            :
                                            undefined
                            }
                        </>
                    },
                    cellTemplateFunc: (row: any) => {
                        if (row.receiver) {
                            return <div title={this.getPersonFullName(row.receiver)}>{this.getPersonFullName(row.receiver)}</div>
                        }
                        return '';
                    }
                },
                {
                    field: "amount", title: Localization.Amount_of_payment,
                    templateFunc: () => {
                        return <>
                            {Localization.Amount_of_payment}
                            {
                                (this.is_this_sort_exsit_in_state(SORT.amount) === false && this.is_this_sort_exsit_in_state(SORT.amount_) === false)
                                    ?
                                    <span
                                        className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                        onClick={() => this.sort_handler_func(SORT.amount, SORT.amount_, true, 1)}
                                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('amount', true)}
                                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('amount', false)}>
                                        <i className={this.state.sortShowStyle.amount === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                                    </span>
                                    :
                                    this.is_this_sort_exsit_in_state(SORT.amount) === true
                                        ?
                                        <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                            onClick={() => this.sort_handler_func(SORT.amount_, SORT.amount, false, 0)}
                                            onMouseOver={() => this.sort_icon_change_on_mouse_over_out('amount', true)}
                                            onMouseOut={() => this.sort_icon_change_on_mouse_over_out('amount', false)}>
                                            <i className={this.state.sortShowStyle.amount === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                                        </span>
                                        :
                                        this.is_this_sort_exsit_in_state(SORT.amount_) === true
                                            ?
                                            <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                                onClick={() => this.sort_handler_func(SORT.amount_, SORT.amount, true, 2)}
                                                onMouseOver={() => this.sort_icon_change_on_mouse_over_out('amount', true)}
                                                onMouseOut={() => this.sort_icon_change_on_mouse_over_out('amount', false)}>
                                                <i className={this.state.sortShowStyle.amount === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                                            </span>
                                            :
                                            undefined
                            }
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
                {
                    field: "pay_time", title: Localization.pay_time,
                    templateFunc: () => {
                        return <>
                            {Localization.pay_time}
                            {
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
                            }
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
                    field: "modifier", title: Localization.modifier,
                    templateFunc: () => {
                        return <>
                            {Localization.modifier}
                            {
                                (this.is_this_sort_exsit_in_state(SORT.modifier) === false && this.is_this_sort_exsit_in_state(SORT.modifier_) === false)
                                    ?
                                    <span
                                        className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                        onClick={() => this.sort_handler_func(SORT.modifier, SORT.modifier_, true, 1)}
                                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('modifier', true)}
                                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('modifier', false)}>
                                        <i className={this.state.sortShowStyle.modifier === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                                    </span>
                                    :
                                    this.is_this_sort_exsit_in_state(SORT.modifier) === true
                                        ?
                                        <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                            onClick={() => this.sort_handler_func(SORT.modifier_, SORT.modifier, false, 0)}
                                            onMouseOver={() => this.sort_icon_change_on_mouse_over_out('modifier', true)}
                                            onMouseOut={() => this.sort_icon_change_on_mouse_over_out('modifier', false)}>
                                            <i className={this.state.sortShowStyle.modifier === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                                        </span>
                                        :
                                        this.is_this_sort_exsit_in_state(SORT.modifier_) === true
                                            ?
                                            <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                                onClick={() => this.sort_handler_func(SORT.modifier_, SORT.modifier, true, 2)}
                                                onMouseOver={() => this.sort_icon_change_on_mouse_over_out('modifier', true)}
                                                onMouseOut={() => this.sort_icon_change_on_mouse_over_out('modifier', false)}>
                                                <i className={this.state.sortShowStyle.modifier === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                                            </span>
                                            :
                                            undefined
                            }
                        </>
                    },
                    cellTemplateFunc: (row: any) => {
                        if (row.modifier) {
                            return <div title={row.modifier}>{row.modifier}</div>
                        }
                        return '';
                    }
                },
                {
                    field: "modification_date", title: Localization.modification_date,
                    templateFunc: () => {
                        return <>
                            {Localization.modification_date}
                            {
                                (this.is_this_sort_exsit_in_state(SORT.modification_date) === false && this.is_this_sort_exsit_in_state(SORT.modification_date_) === false)
                                    ?
                                    <span
                                        className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                        onClick={() => this.sort_handler_func(SORT.modification_date, SORT.modification_date_, true, 1)}
                                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('modification_date', true)}
                                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('modification_date', false)}>
                                        <i className={this.state.sortShowStyle.modification_date === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                                    </span>
                                    :
                                    this.is_this_sort_exsit_in_state(SORT.modification_date) === true
                                        ?
                                        <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                            onClick={() => this.sort_handler_func(SORT.modification_date_, SORT.modification_date, false, 0)}
                                            onMouseOver={() => this.sort_icon_change_on_mouse_over_out('modification_date', true)}
                                            onMouseOut={() => this.sort_icon_change_on_mouse_over_out('modification_date', false)}>
                                            <i className={this.state.sortShowStyle.modification_date === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                                        </span>
                                        :
                                        this.is_this_sort_exsit_in_state(SORT.modification_date_) === true
                                            ?
                                            <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                                                onClick={() => this.sort_handler_func(SORT.modification_date_, SORT.modification_date, true, 2)}
                                                onMouseOver={() => this.sort_icon_change_on_mouse_over_out('modification_date', true)}
                                                onMouseOut={() => this.sort_icon_change_on_mouse_over_out('modification_date', false)}>
                                                <i className={this.state.sortShowStyle.modification_date === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                                            </span>
                                            :
                                            undefined
                            }
                        </>
                    },
                    cellTemplateFunc: (row: any) => {
                        if (row.modification_date) {
                            return <div title={this._getTimestampToDate(row.modification_date)}>{this.getTimestampToDate(row.modification_date)}</div>
                        }
                        return '';
                    }
                },
            ],
            actions: permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManageAllTools], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true
                ?
                [
                    {
                        access: (row: any) => { return permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManageDeleteTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) },
                        text: <i title={Localization.remove} className="fa fa-trash text-danger"></i>,
                        ac_func: (row: any) => { this.deleteModalShow(row) },
                        name: Localization.remove
                    },
                    {
                        access: (row: any) => { return permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManageUpdateTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) },
                        text: <i title={Localization.update} className="fa fa-pencil-square-o text-primary"></i>,
                        ac_func: (row: any) => { this.updateModalShow(row) },
                        name: Localization.update
                    },
                    {
                        access: (row: any) => { return permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManageRecordNewPaymentTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) },
                        text: <i title={Localization.record_pay} className="fa fa-money text-success"></i>,
                        ac_func: (row: any) => { this.record_new_payment_manage_wizard(row) },
                        name: Localization.record_pay
                    },
                    {
                        access: (row: any) => { return permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManagePressAccountListTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) },
                        text: <i title={Localization.view_publisher_received_list} className="fa fa-list-ol text-info"></i>,
                        ac_func: (row: any) => { this.on_pass_to_show_selected_press_receipt_list(row) },
                        name: Localization.receipts_list
                    },
                ]
                :
                undefined
        },
        PressAccountingError: undefined,
        pager_offset: 0,
        pager_limit: 10,
        prevBtnLoader: false,
        nextBtnLoader: false,
        filterSearchBtnLoader: false,
        tableProcessLoader: false,
        payRecordModalShow: false,
        setAddPayModalLoader: false,
        filter_state: {
            creator: {
                value: undefined,
                is_valid: false,
            },
            receiver_id: {
                value: null,
                id: undefined,
                is_valid: false
            },
            amount: {
                from: undefined,
                to: undefined,
                from_isValid: false,
                to_isValid: false,
                is_valid: false,
            },
            creation_date: {
                from: undefined,
                to: undefined,
                from_isValid: false,
                to_isValid: false,
                is_valid: false,
            },
            modifier: {
                value: undefined,
                is_valid: false,
            },
            modification_date: {
                from: undefined,
                to: undefined,
                from_isValid: false,
                to_isValid: false,
                is_valid: false,
            }
        },
        advance_search_box_show: false,
        sort: [],
        sortShowStyle: {
            creator: false,
            receiver_id: false,
            amount: false,
            creation_date: false,
            modifier: false,
            modification_date: false,
        },
        retryModal: false,
        updateModalShow: false,
        updateModalBtnLoader: false,
        deleteModalShow: false,
        deleteModalBtnLoader: false,
    }

    selectedPressForAddPay: any | undefined;
    selectedPressForShowReceiptList: any | undefined;
    selectedPaymentForDelete: any | undefined;
    selectedPaymentForUPdate: any | undefined;
    private _pressAccountingService = new PressAccountingService();
    private _personService = new PersonService();

    // constructor(props: IProps) {
    //   super(props);
    //   // this._transactionService.setToken(this.props.token)
    // }


    // timestamp to date 

    componentDidMount() {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManage], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true) {
            if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManageGrid], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true) {
                TABLE_SORT.sortArrayReseter();
                this.fetchPressAccounting();
            }
        } else {
            this.noAccessRedirect(this.props.history);
        }
    }

    goRecordNewPayment() {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingRecordNewPayment], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
            return;
        }
        this.props.history.push('/record_new_payment')
    }

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

    // start delete modal functions show-hide-request

    deleteModalShow(row: any) {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManageDeleteTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
            return;
        }
        this.selectedPaymentForDelete = row;
        this.setState({ ...this.state, deleteModalShow: true })
    }

    deleteModalHide() {
        this.selectedPaymentForDelete = undefined;
        this.setState({ ...this.state, deleteModalShow: false })
    }

    async removeReceipt(id: string) {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManageDeleteTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
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
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManageUpdateTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
            return;
        }
        this.props.history.push(`/update_recorded_payment/${row.id}`)
        // this.selectedPaymentForUPdate = row;
        // this.setState({ ...this.state, updateModalShow: true })
    }

    updateModalHide() {
        this.selectedPaymentForUPdate = undefined;
        this.setState({ ...this.state, updateModalShow: false })
    }

    async updateReceipt(field: { payer_id: string, receiver_id: string, amount: number }, field_id: string) {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManageUpdateTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
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

    record_new_payment_manage_wizard(row: any) {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManageRecordNewPaymentTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
            return;
        }
        this.props.history.push(`/record_new_payment_manage_wizard/${row.receiver_id}`);
    }

    on_pass_to_show_selected_press_receipt_list(row: any) {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManagePressAccountListTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
            return;
        }
        this.props.history.push(`/press_account_list/${row.receiver_id}/manage`);
    }

    // define axios for give data

    private _searchFilter: any | undefined;
    private get_searchFilter() {
        this.set_searchFilter();
        return this._searchFilter;
    }
    private set_searchFilter() {
        const obj: any = {};

        if (this.state.filter_state.creator.is_valid === true) {
            obj['creator'] = { $eq: this.state.filter_state.creator.value };
        }

        if (this.state.filter_state.receiver_id.is_valid === true) {
            obj['receiver_id'] = { $eq: this.state.filter_state.receiver_id.id };
        }

        if (this.state.filter_state.amount.is_valid === true) {
            if (this.state.filter_state.amount.from_isValid === true && this.state.filter_state.amount.to_isValid === true) {
                obj['amount'] = { $gte: this.state.filter_state.amount.from, $lte: this.state.filter_state.amount.to }
            } else if (this.state.filter_state.amount.from_isValid === true && this.state.filter_state.amount.to_isValid === false) {
                obj['amount'] = { $gte: this.state.filter_state.amount.from }
            } else if (this.state.filter_state.amount.from_isValid === false && this.state.filter_state.amount.to_isValid === true) {
                obj['amount'] = { $lte: this.state.filter_state.amount.to }
            }
        }

        if (this.state.filter_state.creation_date.is_valid === true) {
            if (this.state.filter_state.creation_date.from_isValid === true && this.state.filter_state.creation_date.to_isValid === true) {
                obj['creation_date'] = { $gte: this.state.filter_state.creation_date.from, $lte: (this.state.filter_state.creation_date.to! + 86400) }
            } else if (this.state.filter_state.creation_date.from_isValid === true && this.state.filter_state.creation_date.to_isValid === false) {
                obj['creation_date'] = { $gte: this.state.filter_state.creation_date.from }
            } else if (this.state.filter_state.creation_date.from_isValid === false && this.state.filter_state.creation_date.to_isValid === true) {
                obj['creation_date'] = { $lte: this.state.filter_state.creation_date.to }
            }
        }

        if (this.state.filter_state.modifier.is_valid === true) {
            obj['modifier'] = { $eq: this.state.filter_state.modifier.value };
        }

        if (this.state.filter_state.modification_date.is_valid === true) {
            if (this.state.filter_state.modification_date.from_isValid === true && this.state.filter_state.modification_date.to_isValid === true) {
                obj['modification_date'] = { $gte: this.state.filter_state.modification_date.from, $lte: (this.state.filter_state.modification_date.to! + 86400) }
            } else if (this.state.filter_state.modification_date.from_isValid === true && this.state.filter_state.modification_date.to_isValid === false) {
                obj['modification_date'] = { $gte: this.state.filter_state.modification_date.from }
            } else if (this.state.filter_state.modification_date.from_isValid === false && this.state.filter_state.modification_date.to_isValid === true) {
                obj['modification_date'] = { $lte: this.state.filter_state.modification_date.to }
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
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManageGrid], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
            return;
        }
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
                ...this.state, pressAccounting_table: {
                    ...this.state.pressAccounting_table,
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
        if (this.state.pressAccounting_table.list && (this.state.pressAccounting_table.list! || []).length) {
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
        } else if (this.state.pressAccounting_table.list && !(this.state.pressAccounting_table.list! || []).length) {
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

        } else if (this.state.PressAccountingError) {
            return;
        } else {
            return;
        }
    }

    // next button create

    pager_next_btn_render() {
        if (this.state.pressAccounting_table.list && (this.state.pressAccounting_table.list! || []).length) {
            return (
                <>
                    {
                        !(this.state.pager_limit > (this.state.pressAccounting_table.list! || []).length) &&
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
        } else if (this.state.pressAccounting_table.list && !(this.state.pressAccounting_table.list! || []).length) {
            return;
        } else if (this.state.pressAccounting_table.list) {
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
                creator: {
                    value: undefined,
                    is_valid: false,
                },
                receiver_id: {
                    value: null,
                    id: undefined,
                    is_valid: false
                },
                amount: {
                    from: undefined,
                    to: undefined,
                    from_isValid: false,
                    to_isValid: false,
                    is_valid: false,
                },
                creation_date: {
                    from: undefined,
                    to: undefined,
                    from_isValid: false,
                    to_isValid: false,
                    is_valid: false,
                },
                modifier: {
                    value: undefined,
                    is_valid: false,
                },
                modification_date: {
                    from: undefined,
                    to: undefined,
                    from_isValid: false,
                    to_isValid: false,
                    is_valid: false,
                }
            }
        }, () => this.repetReset())
    }
    repetReset() {
        this.setState({
            ...this.state,
            filter_state: {
                creator: {
                    value: undefined,
                    is_valid: false,
                },
                receiver_id: {
                    value: null,
                    id: undefined,
                    is_valid: false
                },
                amount: {
                    from: undefined,
                    to: undefined,
                    from_isValid: false,
                    to_isValid: false,
                    is_valid: false,
                },
                creation_date: {
                    from: undefined,
                    to: undefined,
                    from_isValid: false,
                    to_isValid: false,
                    is_valid: false,
                },
                modifier: {
                    value: undefined,
                    is_valid: false,
                },
                modification_date: {
                    from: undefined,
                    to: undefined,
                    from_isValid: false,
                    to_isValid: false,
                    is_valid: false,
                }
            }
        })
    }

    handleInputChange(newvValue: string | undefined, isValid: boolean, inpuType: string) {
        let valid: boolean = true;
        if (newvValue === '' || newvValue === undefined || isValid === false) {
            valid = false;
        }
        this.setState({
            ...this.state,
            filter_state: {
                ...this.state.filter_state,
                [inpuType]: {
                    value: newvValue,
                    is_valid: valid,
                }
            }
        })
    }

    person_of_press_in_search_remover() {
        this.setState({
            ...this.state,
            filter_state: {
                ...this.state.filter_state,
                receiver_id: {
                    value: null,
                    id: undefined,
                    is_valid: false,
                }
            }
        })
    }

    handlePersonChange = (selectedPerson: { label: string, value: IPerson }) => {
        let valid: boolean = true;
        let newId: string = selectedPerson.value.id;
        this.setState({
            ...this.state,
            filter_state: {
                ...this.state.filter_state,
                receiver_id: {
                    value: selectedPerson,
                    id: newId,
                    is_valid: valid,
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
                            <h2 className="text-bold text-dark pl-3">{Localization.payment_list}</h2>
                            {
                                permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingRecordNewPayment], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true
                                    ?
                                    <BtnLoader
                                        loading={false}
                                        disabled={false}
                                        btnClassName="btn btn-success shadow-default shadow-hover mb-4"
                                        onClick={() => this.goRecordNewPayment()}
                                    >
                                        {Localization.record_pay}
                                    </BtnLoader>
                                    :
                                    undefined
                            }
                        </div>
                    </div>
                    {
                        permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManageGrid], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true
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
                                                    <Input
                                                        onChange={(value, isValid) => this.handleInputChange(value, isValid, 'creator')}
                                                        label={Localization.payer}
                                                        placeholder={Localization.payer}
                                                        defaultValue={this.state.filter_state.creator.value}
                                                    />
                                                </div>
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
                                                        value={this.state.filter_state.receiver_id.value}
                                                        loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback)}
                                                        noOptionsMessage={(obj) => this.select_noOptionsMessage(obj)}
                                                        onChange={(selectedPress: any) => this.handlePersonChange(selectedPress)}
                                                    />
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <AppNumberRange
                                                        label={Localization.Amount_of_payment}
                                                        from={this.state.filter_state.amount.from}
                                                        to={this.state.filter_state.amount.to}
                                                        onChange={(from, from_isValid, to, to_isValid, isValid) => this.range_picker_onChange(from, from_isValid, to, to_isValid, isValid, 'amount')}
                                                    />
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <AppRangePicker
                                                        label={Localization.pay_time}
                                                        from={this.state.filter_state.creation_date.from}
                                                        to={this.state.filter_state.creation_date.to}
                                                        onChange={(from, from_isValid, to, to_isValid, isValid) => this.range_picker_onChange(from, from_isValid, to, to_isValid, isValid, 'creation_date')}
                                                    />
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <Input
                                                        onChange={(value, isValid) => this.handleInputChange(value, isValid, 'modifier')}
                                                        label={Localization.modifier}
                                                        placeholder={Localization.modifier}
                                                        defaultValue={this.state.filter_state.modifier.value}
                                                    />
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <AppRangePicker
                                                        label={Localization.modification_date}
                                                        from={this.state.filter_state.modification_date.from}
                                                        to={this.state.filter_state.modification_date.to}
                                                        onChange={(from, from_isValid, to, to_isValid, isValid) => this.range_picker_onChange(from, from_isValid, to, to_isValid, isValid, 'modification_date')}
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
                                        <Table row_offset_number={this.state.pager_offset} loading={this.state.tableProcessLoader} list={this.state.pressAccounting_table.list} colHeaders={this.state.pressAccounting_table.colHeaders} actions={this.state.pressAccounting_table.actions}></Table>
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
                {
                    this.selectedPaymentForDelete === undefined
                        ?
                        undefined
                        :
                        <DeleteModal
                            crud_name={Localization.pay}
                            modalShow={this.state.deleteModalShow}
                            deleteBtnLoader={this.state.deleteModalBtnLoader}
                            rowData={{ [Localization.payer]: this.selectedPaymentForDelete.creator, [Localization.Amount_of_payment]: this.selectedPaymentForDelete.amount, [Localization.pay_time]: this.getTimestampToDate(this.selectedPaymentForDelete.creation_date) }}
                            rowId={this.selectedPaymentForDelete.id}
                            onHide={() => this.deleteModalHide()}
                            onDelete={(rowId: string) => this.removeReceipt(rowId)}
                        />
                }
                {
                    this.selectedPaymentForUPdate === undefined
                        ?
                        undefined
                        :
                        <UpdatePaymentModal
                            modalShow={this.state.updateModalShow}
                            btnLoader={this.state.updateModalBtnLoader}
                            rowData={this.selectedPaymentForUPdate}
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

export const PressAccountingManage = connect(
    state2props,
    dispatch2props
)(PressAccountingManageComponent);