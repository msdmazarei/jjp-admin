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
import { Modal } from "react-bootstrap";
import 'moment/locale/fa';
import 'moment/locale/ar';
// import moment from 'moment';
// import moment_jalaali from 'moment-jalaali';
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

interface IFilterPressAccounting {
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
    pressAccounting_table: IProps_table;
    PressAccountingError: string | undefined;
    pager_offset: number;
    pager_limit: number;
    payRecordModalShow: boolean;
    setAddPayModalLoader: boolean;
    prevBtnLoader: boolean;
    nextBtnLoader: boolean;
    filterSearchBtnLoader: boolean;
    tableProcessLoader: boolean;
    filter_state: IFilterPressAccounting;
    advance_search_box_show: boolean;
    sort: string[];
    sortShowStyle: ISortTransaction;
    retryModal: boolean;
    addPayToPress: {
        press_id: string | undefined;
        amount: number | null;
        isValid: boolean;
    }
}

// define class of Comment 
class PressAccountingManageComponent extends BaseComponent<IProps, IState>{
    state = {
        pressAccounting_table: {
            list: [],
            colHeaders: [
                {
                    field: "press", title: Localization.role_type_list.Press,
                    templateFunc: () => {
                        return <>
                            {Localization.role_type_list.Press}
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
                            return <div title={this.getPersonFullName(row)}>{this.getPersonFullName(row)}</div>
                        }
                        return '';
                    }
                },
                {
                    field: "total_crediting", title: Localization.total_crediting,
                    templateFunc: () => {
                        return <>
                            {Localization.total_crediting}
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
                },
                {
                    field: "total_receipt", title: Localization.total_receipt,
                    templateFunc: () => {
                        return <>
                            {Localization.total_receipt}
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
                },
                {
                    field: "balance_crediting", title: Localization.balance_crediting,
                    templateFunc: () => {
                        return <>
                            {Localization.balance_crediting}
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
                    access: (row: any) => { return this.checkRecordPayToolAccess() },
                    text: <i title={Localization.record_pay} className="fa fa-money text-success"></i>,
                    ac_func: (row: any) => { this.on_show_record_pay_modal(row) },
                    name: Localization.record_pay
                },
                {
                    access: (row: any) => { return this.checkShowReceiptListToolAccess() },
                    text: <i title={Localization.receipts_list} className="fa fa-list-ol text-info"></i>,
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
        addPayToPress: {
            press_id: undefined,
            amount: null,
            isValid: false,
        }
    }

    selectedPressForAddPay: any | undefined;
    selectedPressForShowReceiptList: any | undefined;
    private _pressAccountingService = new PressAccountingService();
    private _personService = new PersonService();

    // constructor(props: IProps) {
    //   super(props);
    //   // this._transactionService.setToken(this.props.token)
    // }


    // timestamp to date 

    componentDidMount() {
        // if (this.checkPageRenderAccess() === true) {
            // if (AccessService.checkAccess('') === true) {
            //     this.setState({
            //         ...this.state,
            //         tableProcessLoader: true
            //     })
                TABLE_SORT.sortArrayReseter();
                this.fetchPressAccounting();
        //     }
        // } else {
        //     this.noAccessRedirect(this.props.history);
        // }
    }

    checkPageRenderAccess(): boolean {
        if (AccessService.checkAccess('') === true) {
            return true;
        }
        return false;
    }

    checkAllAccessForTools(): boolean {
        if (AccessService.checkOneOFAllAccess(['']) === true) {
            return true;
        }
        return false;
    }

    checkRecordPayToolAccess(): boolean {
        if (AccessService.checkAccess('') === true) {
            return true;
        }
        return false
    }

    checkShowReceiptListToolAccess(): boolean {
        if (AccessService.checkAccess('') === true) {
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

    /// start add pay to press account modal /////

    on_show_record_pay_modal(press: any) {
        if (AccessService.checkAccess('') === false) {
            return;
        }
        this.selectedPressForAddPay = press;
        this.setState({ 
            ...this.state, 
            payRecordModalShow: true,
            addPayToPress : {
                ...this.state.addPayToPress,
                press_id : press.id  /* requierd to modifiction */ 
            }
        })
    }

    on_hide_record_pay_modal() {
        this.selectedPressForAddPay = undefined;
        this.setState({ ...this.state, 
            payRecordModalShow: false,
            addPayToPress : {
                ...this.state.addPayToPress,
                press_id : undefined,
                amount : null,
                isValid : false,
            }
        });
    }

    handleAddPayToPress(value: any) {
        let amount: any = Number(value);
        if (isNaN(amount) === true || amount === 0) {
            this.setState({
                ...this.state,
                addPayToPress: {
                    ...this.state.addPayToPress,
                    amount: null,
                    isValid: false,
                }
            });
        } else {
            this.setState({
                ...this.state,
                addPayToPress: {
                    ...this.state.addPayToPress,
                    amount: amount,
                    isValid: true,
                }
            });
        }
    }

    async onAddPayToSelectedPress(transaction_id: string) {
        if (AccessService.checkAccess(TPERMISSIONS.TRANSACTION_DELETE_PREMIUM) === false) {
            return;
        }
        this.setState({ ...this.state, setAddPayModalLoader: true });
        let res;  /// define request ////////////////////////////
        if (res) {
            this.setState({ ...this.state, setAddPayModalLoader: false });
            this.apiSuccessNotify();
            this.fetchPressAccounting();
            this.on_hide_record_pay_modal();
        }
    }

    render_record_pay_modal(selectedPressForAddPay: any) {
        if (!this.selectedPressForAddPay || !this.selectedPressForAddPay.id) return;
        return (
            <>
                <Modal show={this.state.payRecordModalShow} onHide={() => this.on_hide_record_pay_modal()}>
                    <Modal.Body>
                        <p className="delete-modal-content py-1">
                            <span className="text-muted">
                                {Localization.role_type_list.Press}:&nbsp;</span>{/* press name of row */}
                        </p>
                        <FixNumber
                            onChange={(value, isValid) => this.handleAddPayToPress(value)}
                            label={Localization.Amount_of_payment}
                            placeholder={Localization.Amount_of_payment}
                            defaultValue={this.state.addPayToPress.amount}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.on_hide_record_pay_modal()}>{Localization.close}</button>
                        <BtnLoader
                            btnClassName="btn btn-danger shadow-default shadow-hover"
                            onClick={() => this.onAddPayToSelectedPress(selectedPressForAddPay.id)}
                            loading={this.state.setAddPayModalLoader}
                            disabled={this.state.addPayToPress.isValid === true ? false : true}
                        >
                            {Localization.record_pay}
                        </BtnLoader>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    /// end add pay to press account modal /////


    /// start add pay to press account modal /////

    on_pass_to_show_selected_press_receipt_list(perss: any) {
        if (AccessService.checkAccess('') === false) {
            return;
        }
        this.selectedPressForShowReceiptList = perss;
        this.props.history.push('/press_account_list/:press_id/manage');
    }

    /// start add pay to press account modal /////


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
                {this.render_record_pay_modal(this.selectedPressForAddPay)}
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