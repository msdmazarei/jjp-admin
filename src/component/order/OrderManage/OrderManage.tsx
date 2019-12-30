import React, { Fragment } from "react";
import { Table, IProps_table } from "../../table/table";
import { Input } from '../../form/input/Input';
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
import Select from 'react-select';
import { OrderService } from "../../../service/service.order";
import { IPerson } from "../../../model/model.person";
import { IBook } from "../../../model/model.book";
import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import { AccessService } from "../../../service/service.access";
import { AppRangePicker } from "../../form/app-rangepicker/AppRangePicker";
import AsyncSelect from 'react-select/async';
import { PersonService } from "../../../service/service.person";
import { AppNumberRange } from "../../form/app-numberRange/app-numberRange";
import { TABLE_SORT } from "../../table/tableSortHandler";
import { TPERMISSIONS } from "../../../enum/Permission";
import { SORT } from "../../../enum/Sort";
import { RetryModal } from "../../tool/retryModal/retryModal";

/// define props & state ///////
export interface IProps {
  history: History;
  internationalization: TInternationalization;
  // token: IToken;
}

interface IFilterOrder {
  creator: {
    value: string | undefined,
    isValid: boolean
  };
  person: {
    value: { label: string, value: IPerson } | null;
    person_id: string | undefined;
    is_valid: boolean,
  };
  cr_date: {
    from: number | undefined,
    from_isValid: boolean,
    to: number | undefined,
    to_isValid: boolean,
    is_valid: boolean,
  };
  mo_date: {
    from: number | undefined,
    from_isValid: boolean,
    to: number | undefined,
    to_isValid: boolean,
    is_valid: boolean,
  };
  status: {
    value: { value: string, label: string } | null,
    status: string | null,
    isValid: boolean
  };
  total_price: {
    from: number | undefined,
    from_isValid: boolean,
    to: number | undefined,
    to_isValid: boolean,
    is_valid: boolean,
  };
}

interface ISortOrder {
  creator: boolean;
  creation_date: boolean;
  modification_date: boolean;
  status: boolean;
  total_price: boolean;
}
interface IState {
  order_table: IProps_table;
  OrderError: string | undefined;
  pager_offset: number;
  pager_limit: number;
  removeModalShow: boolean;
  orderDetailsModalShow: boolean;
  GetInvoiceModalShow: boolean;
  prevBtnLoader: boolean;
  nextBtnLoader: boolean;
  filterSearchBtnLoader: boolean;
  tableProcessLoader: boolean;
  setRemoveLoader: boolean;
  setGetInvoiceLoader: boolean;
  setPriceLoader: boolean;
  filter_state: IFilterOrder;
  advance_search_box_show: boolean;
  sort: string[];
  sortShowStyle: ISortOrder;
  retryModal: boolean;
}

// define class of Order 

class OrderManageComponent extends BaseComponent<IProps, IState>{
  statusOptions = [
    { value: 'Created', label: Localization.order_status.Created },
    { value: 'Invoiced', label: Localization.order_status.Invoiced },
  ];
  state = {
    order_table: {
      list: [],
      colHeaders: [
        {
          field: "creator", title: Localization.user,
          templateFunc: () => {
            return <>
              {Localization.user}
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
              return <div title={row.creator} className="text-nowrap-ellipsis max-w-200px d-inline-block">
                {row.creator}
              </div>
            }
            return '';
          }
        },
        {
          field: "name", title: Localization.full_name, cellTemplateFunc: (row: any) => {
            if (row.person) {
              return <div title={this.getPersonFullName(row.person)} className="text-nowrap-ellipsis max-w-200px d-inline-block">
                {this.getPersonFullName(row.person)}
              </div>
            }
            return '';
          }
        },
        {
          field: "creation_date", title: Localization.creation_date,
          templateFunc: () => {
            return <>
              {Localization.creation_date}
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
        {
          field: "status", title: Localization.status,
          templateFunc: () => {
            return <>
              {Localization.status}
              {
                (this.is_this_sort_exsit_in_state(SORT.status) === false && this.is_this_sort_exsit_in_state(SORT.status_) === false)
                  ?
                  <span
                    className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                    onClick={() => this.sort_handler_func(SORT.status, SORT.status_, true, 1)}
                    onMouseOver={() => this.sort_icon_change_on_mouse_over_out('status', true)}
                    onMouseOut={() => this.sort_icon_change_on_mouse_over_out('status', false)}>
                    <i className={this.state.sortShowStyle.status === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                  </span>
                  :
                  this.is_this_sort_exsit_in_state(SORT.status) === true
                    ?
                    <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                      onClick={() => this.sort_handler_func(SORT.status_, SORT.status, false, 0)}
                      onMouseOver={() => this.sort_icon_change_on_mouse_over_out('status', true)}
                      onMouseOut={() => this.sort_icon_change_on_mouse_over_out('status', false)}>
                      <i className={this.state.sortShowStyle.status === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                    </span>
                    :
                    this.is_this_sort_exsit_in_state(SORT.status_) === true
                      ?
                      <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                        onClick={() => this.sort_handler_func(SORT.status_, SORT.status, true, 2)}
                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('status', true)}
                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('status', false)}>
                        <i className={this.state.sortShowStyle.status === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                      </span>
                      :
                      undefined
              }
            </>
          },
          cellTemplateFunc: (row: any) => {
            if (row.status) {
              const o_status: string = (row.status === 'Created') ? Localization.order_status.Created : Localization.order_status.Invoiced;
              return <div title={row.status} className="text-nowrap-ellipsis max-w-200px d-inline-block">
                {o_status}
              </div>
            }
            return '';
          }
        },
        {
          field: "total_price", title: Localization.total_price,
          templateFunc: () => {
            return <>
              {Localization.total_price}
              {
                (this.is_this_sort_exsit_in_state(SORT.total_price) === false && this.is_this_sort_exsit_in_state(SORT.total_price_) === false)
                  ?
                  <span
                    className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                    onClick={() => this.sort_handler_func(SORT.total_price, SORT.total_price_, true, 1)}
                    onMouseOver={() => this.sort_icon_change_on_mouse_over_out('total_price', true)}
                    onMouseOut={() => this.sort_icon_change_on_mouse_over_out('total_price', false)}>
                    <i className={this.state.sortShowStyle.total_price === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                  </span>
                  :
                  this.is_this_sort_exsit_in_state(SORT.total_price) === true
                    ?
                    <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                      onClick={() => this.sort_handler_func(SORT.total_price_, SORT.total_price, false, 0)}
                      onMouseOver={() => this.sort_icon_change_on_mouse_over_out('total_price', true)}
                      onMouseOut={() => this.sort_icon_change_on_mouse_over_out('total_price', false)}>
                      <i className={this.state.sortShowStyle.total_price === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                    </span>
                    :
                    this.is_this_sort_exsit_in_state(SORT.total_price_) === true
                      ?
                      <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                        onClick={() => this.sort_handler_func(SORT.total_price_, SORT.total_price, true, 2)}
                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('total_price', true)}
                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('total_price', false)}>
                        <i className={this.state.sortShowStyle.total_price === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                      </span>
                      :
                      undefined
              }
            </>
          },
          cellTemplateFunc: (row: any) => {
            if (row.total_price) {
              return <div title={row.total_price} className="text-nowrap-ellipsis max-w-200px d-inline-block">
                {row.total_price}
              </div>
            }
            return '';
          }
        },
      ],
      actions: this.checkAllAccess() ? [
        {
          access: (row: any) => { return (this.orderCheckoutAccess(row) && this.checkDeleteToolAccess()) },
          text: <i title={Localization.remove} className="fa fa-trash text-danger"></i>,
          ac_func: (row: any) => { this.onShowRemoveModal(row) },
          name: Localization.remove
        },
        {
          access: (row: any) => { return (this.orderCheckoutAccess(row) && this.checkUpdateToolAccess()) },
          text: <i title={Localization.update} className="fa fa-pencil-square-o text-primary"></i>
          , ac_func: (row: any) => { this.updateRow(row) },
          name: Localization.update
        },
        {
          access: (row: any) => { return this.checkShowToolAccess() }, ///
          text: <i title={Localization.show_order} className="fa fa-eye text-info"></i>,
          ac_func: (row: any) => { this.fetchOrderById(row.id) },
          name: Localization.show_order
        },
        {
          access: (row: any) => { return (this.orderCheckoutAccess(row) && this.checkGetInvoiceToolAccess()) },
          text: <i title={Localization.invoice} className="fa fa-money text-success"></i>,
          ac_func: (row: any) => { this.fetchOrderById_GetInvoice(row.id) },
          name: Localization.invoice
        },
      ]
        :
        undefined
    },
    OrderError: undefined,
    pager_offset: 0,
    pager_limit: 10,
    prevBtnLoader: false,
    nextBtnLoader: false,
    filterSearchBtnLoader: false,
    tableProcessLoader: false,
    removeModalShow: false,
    orderDetailsModalShow: false,
    GetInvoiceModalShow: false,
    setRemoveLoader: false,
    setGetInvoiceLoader: false,
    setPriceLoader: false,
    filter_state: {
      creator: {
        value: undefined,
        isValid: false
      },
      person: {
        value: null,
        person_id: undefined,
        is_valid: false,
      },
      cr_date: {
        from: undefined,
        from_isValid: false,
        to: undefined,
        to_isValid: false,
        is_valid: false,
      },
      mo_date: {
        from: undefined,
        from_isValid: false,
        to: undefined,
        to_isValid: false,
        is_valid: false,
      },
      status: {
        value: null,
        status: null,
        isValid: false
      },
      total_price: {
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
      creator: false,
      creation_date: false,
      modification_date: false,
      status: false,
      total_price: false,
    },
    retryModal: false,
  };

  order_id!: string;
  person_id!: string;
  selectedOrder: any;
  selectedOrderList: {
    total_price: number;
    person: {
      label: string;
      value: IPerson;
    };
    items: {
      count: number;
      book: IBook;
    }[];
  } | undefined;

  private _orderService = new OrderService();
  private _personService = new PersonService();

  // constructor(props: IProps) {
  //   super(props);
  //   // this._orderService.setToken(this.props.token)
  // }

  componentDidMount() {
    if (this.checkPageRenderAccess() === true) {
      if (AccessService.checkAccess(TPERMISSIONS.ORDER_GET_PREMIUM) === true) {
        this.setState({
          ...this.state,
          tableProcessLoader: true
        })
        TABLE_SORT.sortArrayReseter();
        this.fetchOrders();
      }
    } else {
      this.noAccessRedirect(this.props.history);
    }
  }

  checkPageRenderAccess(): boolean {
    if (AccessService.checkOneOFAllAccess([TPERMISSIONS.ORDER_ADD_PREMIUM, TPERMISSIONS.ORDER_ADD_PRESS, TPERMISSIONS.ORDER_GET_PREMIUM]) === true) {
      return true;
    }
    return false
  }

  checkAllAccess(): boolean {
    if (AccessService.checkOneOFAllAccess([TPERMISSIONS.ORDER_DELETE_PREMIUM, TPERMISSIONS.ORDER_EDIT_PREMIUM, TPERMISSIONS.ORDER_ITEM_GET_PREMIUM]) === true || this.checkGetInvoiceToolAccess() === true) {
      return true;
    }
    return false;
  }

  checkDeleteToolAccess(): boolean {
    if (AccessService.checkAccess(TPERMISSIONS.ORDER_DELETE_PREMIUM) === true) {
      return true;
    }
    return false
  }

  checkUpdateToolAccess(): boolean {
    if (AccessService.checkAccess(TPERMISSIONS.ORDER_EDIT_PREMIUM) === true) {
      return true;
    }
    return false
  }

  checkShowToolAccess(): boolean {
    if (AccessService.checkAccess(TPERMISSIONS.ORDER_ITEM_GET_PREMIUM) === true) {
      return true;
    }
    return false
  }

  checkGetInvoiceToolAccess(): boolean {
    if (AccessService.checkAllAccess([TPERMISSIONS.ORDER_ITEM_GET_PREMIUM, TPERMISSIONS.ORDER_CHECKOUT_PREMIUM]) === true) {
      return true;
    }
    return false
  }

  orderCheckoutAccess(row: any): boolean {
    if (row.status === "Invoiced") {
      return false;
    }
    return true;
  }

  sort_handler_func(comingType: string, reverseType: string, is_just_add_or_remove: boolean, typeOfSingleAction: number) {
    if (is_just_add_or_remove === false) {
      TABLE_SORT.coming_field_name_by_sortType_and_that_reverseType_exist_in_sortArray(comingType, reverseType);
    }
    if (is_just_add_or_remove === true) {
      TABLE_SORT.just_add_or_remove(comingType, typeOfSingleAction)
    }
    this.setState({ ...this.state, sort: TABLE_SORT.sortArrayReturner() }, () => this.fetchOrders());
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

  // timestamp to date 

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

  /////  start request for table data  /////////

  async fetchOrders() {
    this.setState({ ...this.state, tableProcessLoader: true });
    let res = await this._orderService.search(
      this.state.pager_limit,
      this.state.pager_offset,
      this.get_searchFilter(),
      this.returner_sort_array_to_fetch_func(),
    ).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'fetchOrders_error' } });
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
        ...this.state, order_table: {
          ...this.state.order_table,
          list: res.data.result
        },
        prevBtnLoader: false,
        nextBtnLoader: false,
        tableProcessLoader: false,
        filterSearchBtnLoader: false,
      });
    }
  }

  /////  end request for table data  ///////// 


  /////  start for update row function  /////////

  updateRow(order_id: any) {
    if (AccessService.checkAccess(TPERMISSIONS.ORDER_EDIT_PREMIUM) === false) {
      return;
    }
    this.props.history.push(`/order/${order_id.id}/edit`);
  }

  /////  end for update row function  /////////


  ////// start delete modal function define  //////

  onShowRemoveModal(order: any) {
    if (AccessService.checkAccess(TPERMISSIONS.ORDER_DELETE_PREMIUM) === false) {
      return;
    }
    this.selectedOrder = order;
    this.setState({ ...this.state, removeModalShow: true });
  }

  onHideRemoveModal() {
    this.selectedOrder = undefined;
    this.setState({ ...this.state, removeModalShow: false });
  }

  async onRemoveOrder(order_id: string) {
    if (AccessService.checkAccess(TPERMISSIONS.ORDER_DELETE_PREMIUM) === false) {
      return;
    }
    this.setState({ ...this.state, setRemoveLoader: true });
    let res = await this._orderService.remove(order_id).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'onRemoveOrder_error' } });
      this.setState({ ...this.state, setRemoveLoader: false });
    });
    if (res) {
      this.setState({ ...this.state, setRemoveLoader: false });
      this.apiSuccessNotify();
      this.fetchOrders();
      this.onHideRemoveModal();
    }
  }

  render_delete_modal(selectedOrder: any) {
    if (!this.selectedOrder || !this.selectedOrder.id) return;
    return (
      <>
        <Modal show={this.state.removeModalShow} onHide={() => this.onHideRemoveModal()}>
          <Modal.Body>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.order}:&nbsp;
            </span>
              {this.selectedOrder.creator}
            </p>
            <p className="text-danger">{Localization.msg.ui.item_will_be_removed_continue}</p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideRemoveModal()}>{Localization.close}</button>
            <BtnLoader
              btnClassName="btn btn-danger shadow-default shadow-hover"
              onClick={() => this.onRemoveOrder(selectedOrder.id)}
              loading={this.state.setRemoveLoader}
            >
              {Localization.remove}
            </BtnLoader>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  ////// end delete modal function define  ///////


  /////  start show details of order by user function define  /////////

  onShowOrderDetailsModal(order: { total_price: number; person: { label: string; value: IPerson; }; items: { count: number; book: IBook; }[] }) {
    this.selectedOrderList = order;
    this.setState({ ...this.state, orderDetailsModalShow: true });
  }
  onHideOrderDetailsModal() {
    this.selectedOrder = undefined;
    this.setState({
      ...this.state,
      orderDetailsModalShow: false
    });
  }

  async fetchOrderById(order_id: string) {
    if (AccessService.checkAccess(TPERMISSIONS.ORDER_ITEM_GET_PREMIUM) === false) {
      return;
    }
    let res = await this._orderService.getOrder_items(order_id).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'fetchOrderById_error' } });
    });

    if (res) {
      let list = res.data.result;

      const order_items: { count: number, book: IBook }[] = [];
      list.forEach((item: any) => {
        order_items.push({
          book: item.book,
          count: item.count
        });
      });

      const order: {
        total_price: number;
        person: {
          label: string;
          value: IPerson;
        };
        items: {
          count: number;
          book: IBook;
        }[];
      } = {
        total_price: list[0].order.total_price,
        person: {
          label: this.getUserFullName(list[0].order.person),
          value: list[0].order.person,
        },
        items: order_items
      }

      this.onShowOrderDetailsModal(order);
    }
  }


  render_order_details_modal() {
    return (
      <>
        <Modal show={this.state.orderDetailsModalShow} onHide={() => this.onHideOrderDetailsModal()}>
          <Modal.Body>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.Customer_Specifications}:&nbsp;
              </span>
              <p>
                {this.selectedOrderList !== undefined
                  ?
                  Localization.full_name + ": " + this.selectedOrderList.person.label
                  :
                  ""
                }
              </p>
              <p>
                {this.selectedOrderList !== undefined
                  ?
                  <div className="white-content">
                    <table className="table table-hover table-sm table-bordered bg-white text-dark">
                      <thead className="thead-light">
                        <tr className="table-light">
                          <th className="font-weight-bold" scope="col">{Localization.title}</th>
                          <th className="font-weight-bold" scope="col">{Localization.count}</th>
                          <th className="font-weight-bold" scope="col">{Localization.price}</th>
                          <th className="font-weight-bold" scope="col">{Localization.total_price}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.selectedOrderList.items.map((item, index) => (
                          <Fragment key={index}>
                            {
                              <tr>
                                <td className="text-nowrap-ellipsis max-w-100px">{item.book.title}</td>
                                <td className="">{item.count}</td>
                                <td className="">{item.book.price}</td>
                                <td className="">{item.book.price! * item.count}</td>
                              </tr>
                            }
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                    <p className="pull-right">
                      {Localization.Total_purchase}:&nbsp;
                      <span>{this.selectedOrderList.total_price}</span>
                    </p>
                  </div>
                  :
                  ""
                }
              </p>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideOrderDetailsModal()}>{Localization.close}</button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  /////  end show details of order by user function define  ////////


  /////  start get invoice of order by user function define  /////////

  onShowOrderGetInvoice(order: { total_price: number; person: { label: string; value: IPerson; }; items: { count: number; book: IBook; }[] }, order_id: string, person_id: string) {
    this.order_id = order_id;
    this.person_id = person_id;
    this.selectedOrderList = order;
    this.setState({ ...this.state, GetInvoiceModalShow: true });
  }
  onHideOrderGetInvoice() {
    this.order_id = "";
    this.person_id = "";
    this.selectedOrder = undefined;
    this.setState({
      ...this.state,
      GetInvoiceModalShow: false
    });
  }

  async fetchOrderById_GetInvoice(order_id: string) {
    if (AccessService.checkAllAccess([TPERMISSIONS.ORDER_ITEM_GET_PREMIUM, TPERMISSIONS.ORDER_CHECKOUT_PREMIUM]) === false) {
      return;
    }
    let res = await this._orderService.getOrder_items(order_id).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'fetchOrderById_GetInvoice_error' } });
    });

    if (res) {
      let list = res.data.result;

      const order_items: { count: number, book: IBook }[] = [];
      list.forEach((item: any) => {
        order_items.push({
          book: item.book,
          count: item.count
        });
      });
      const order_id: string = list[0].order_id;
      const person_id: string = list[0].order.person_id;
      const order: {
        total_price: number;
        person: {
          label: string;
          value: IPerson;
        };
        items: {
          count: number;
          book: IBook;
        }[];
      } = {
        total_price: list[0].order.total_price,
        person: {
          label: this.getUserFullName(list[0].order.person),
          value: list[0].order.person,
        },
        items: order_items
      }

      this.onShowOrderGetInvoice(order, order_id, person_id);
    }
  }

  async getInvoice(order_id: string, person_id: string) {
    this.setState({ ...this.state, setGetInvoiceLoader: true });
    let res = await this._orderService.checkout(order_id, person_id).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'getInvoice_error' } });
      this.setState({ ...this.state, setGetInvoiceLoader: false });
    });
    if (res) {
      this.setState({ ...this.state, setGetInvoiceLoader: false });
      this.apiSuccessNotify();
      this.fetchOrders();
      this.onHideRemoveModal();
    }
  }


  render_order_GetInvoice() {
    return (
      <>
        <Modal show={this.state.GetInvoiceModalShow} onHide={() => this.onHideOrderGetInvoice()}>
          <Modal.Body>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.Customer_Specifications}:&nbsp;
              </span>
              <p>
                {this.selectedOrderList !== undefined
                  ?
                  Localization.full_name + ": " + this.selectedOrderList.person.label
                  :
                  ""
                }
              </p>
              <p>
                {this.selectedOrderList !== undefined
                  ?
                  <div className="white-content">
                    <table className="table table-hover table-sm table-bordered bg-white text-dark">
                      <thead className="thead-light">
                        <tr className="thead-light">
                          <th className="font-weight-bold" scope="col">{Localization.title}</th>
                          <th className="font-weight-bold" scope="col">{Localization.count}</th>
                          <th className="font-weight-bold" scope="col">{Localization.price}</th>
                          <th className="font-weight-bold" scope="col">{Localization.total_price}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.selectedOrderList.items.map((item, index) => (
                          <Fragment key={index}>
                            {
                              <tr>
                                <td className="text-nowrap-ellipsis max-w-100px">{item.book.title}</td>
                                <td className="">{item.count}</td>
                                <td className="">{item.book.price}</td>
                                <td className="">{item.book.price! * item.count}</td>
                              </tr>
                            }
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                    <p className="pull-right">
                      {Localization.Total_purchase}:&nbsp;
                      <span>{this.selectedOrderList.total_price}</span>
                    </p>
                  </div>
                  :
                  ""
                }
              </p>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideOrderGetInvoice()}>{Localization.close}</button>
            <BtnLoader
              btnClassName="btn btn-primary shadow-default shadow-hover"
              onClick={() => this.getInvoice(this.order_id, this.person_id)}
              loading={this.state.setGetInvoiceLoader}
            >
              {Localization.invoice}
            </BtnLoader>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  /////  end get invoice of order by user function define  /////////

  ///// start previous button create  //////////

  pager_previous_btn_render() {
    if (this.state.order_table.list && (this.state.order_table.list! || []).length) {
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
    } else if (this.state.order_table.list && !(this.state.order_table.list! || []).length) {
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

    } else if (this.state.OrderError) {
      return;
    } else {
      return;
    }
  }

  ///// end previous button create  //////////


  ///// start next button create ////////////////

  pager_next_btn_render() {
    if (this.state.order_table.list && (this.state.order_table.list! || []).length) {
      return (
        <>
          {
            !(this.state.pager_limit > (this.state.order_table.list! || []).length) &&
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
    } else if (this.state.order_table.list && !(this.state.order_table.list! || []).length) {
      return;
    } else if (this.state.order_table.list) {
      return;
    } else {
      return;
    }
  }

  ///// end next button create ////////////////

  ///// start on previous click ///////

  onPreviousClick() {
    this.setState({
      ...this.state,
      pager_offset: this.state.pager_offset - this.state.pager_limit,
      prevBtnLoader: true,
      tableProcessLoader: true,

    }, () => {
      this.gotoTop();
      this.fetchOrders()
    });
  }

  // end on previous click ///////

  ///// start on next click /////////

  onNextClick() {
    this.setState({
      ...this.state,
      pager_offset: this.state.pager_offset + this.state.pager_limit,
      nextBtnLoader: true,
      tableProcessLoader: true,
    }, () => {
      this.gotoTop();
      this.fetchOrders()
    });
  }

  ///// end on next click /////////



  ///// navigation function //////

  gotoOrderCreate() {
    if (AccessService.checkOneOFAllAccess([TPERMISSIONS.ORDER_ADD_PREMIUM, TPERMISSIONS.ORDER_ADD_PRESS]) === false) {
      return;
    }
    this.props.history.push('/order/create'); // /admin
  }


  private _searchFilter: any | undefined;
  private get_searchFilter() {
    this.set_searchFilter();
    return this._searchFilter;
  }
  private set_searchFilter() {
    const obj: any = {};

    if (this.state.filter_state.creator.isValid) {
      obj['creator'] = { $prefix: this.state.filter_state.creator.value };
    }

    if (this.state.filter_state.person.is_valid) {
      obj['person_id'] = { $eq: this.state.filter_state.person.person_id };
    }

    if (this.state.filter_state.cr_date.is_valid === true) {
      if (this.state.filter_state.cr_date.from_isValid === true && this.state.filter_state.cr_date.to_isValid === true) {
        obj['creation_date'] = { $gte: this.state.filter_state.cr_date.from, $lte: (this.state.filter_state.cr_date.to! + 86400) }
      } else if (this.state.filter_state.cr_date.from_isValid === true && this.state.filter_state.cr_date.to_isValid === false) {
        obj['creation_date'] = { $gte: this.state.filter_state.cr_date.from }
      } else if (this.state.filter_state.cr_date.from_isValid === false && this.state.filter_state.cr_date.to_isValid === true) {
        obj['creation_date'] = { $lte: this.state.filter_state.cr_date.to }
      }
    }

    if (this.state.filter_state.mo_date.is_valid === true) {
      if (this.state.filter_state.mo_date.from_isValid === true && this.state.filter_state.mo_date.to_isValid === true) {
        obj['modification_date'] = { $gte: this.state.filter_state.mo_date.from, $lte: (this.state.filter_state.mo_date.to! + 86400) }
      } else if (this.state.filter_state.mo_date.from_isValid === true && this.state.filter_state.mo_date.to_isValid === false) {
        obj['modification_date'] = { $gte: this.state.filter_state.mo_date.from }
      } else if (this.state.filter_state.mo_date.from_isValid === false && this.state.filter_state.mo_date.to_isValid === true) {
        obj['modification_date'] = { $lte: this.state.filter_state.mo_date.to }
      }
    }

    if (this.state.filter_state.status.isValid) {
      obj['status'] = { $eq: this.state.filter_state.status.status };
    }

    if (this.state.filter_state.total_price.is_valid === true) {
      if (this.state.filter_state.total_price.from_isValid === true && this.state.filter_state.total_price.to_isValid === true) {
        obj['total_price'] = { $gte: this.state.filter_state.total_price.from, $lte: this.state.filter_state.total_price.to }
      } else if (this.state.filter_state.total_price.from_isValid === true && this.state.filter_state.total_price.to_isValid === false) {
        obj['total_price'] = { $gte: this.state.filter_state.total_price.from }
      } else if (this.state.filter_state.total_price.from_isValid === false && this.state.filter_state.total_price.to_isValid === true) {
        obj['total_price'] = { $lte: this.state.filter_state.total_price.to }
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
    }, () => { this.fetchOrders() });
  }



  /////  start onChange & search & reset function for search box ///////////

  filter_state_reset() {
    this.setState({
      ...this.state,
      filter_state: {
        creator: {
          value: undefined,
          isValid: false
        },
        person: {
          value: null,
          person_id: undefined,
          is_valid: false,
        },
        cr_date: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
        mo_date: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
        status: {
          value: null,
          status: null,
          isValid: false
        },
        total_price: {
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
        creator: {
          value: undefined,
          isValid: false
        },
        person: {
          value: null,
          person_id: undefined,
          is_valid: false,
        },
        cr_date: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
        mo_date: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
        status: {
          value: null,
          status: null,
          isValid: false
        },
        total_price: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
      }
    })
  }

  handleInputChange(value: any, inputType: any, Validation: boolean = true) {
    let isValid;
    if (value === undefined || value === '') {
      isValid = false;
    } else {
      isValid = true;
    }

    this.setState({
      ...this.state,
      filter_state: {
        ...this.state.filter_state, [inputType]: { value: value, isValid: isValid }
      }
    })
  }

  person_in_search_remover() {
    this.setState({
      ...this.state,
      filter_state: {
        ...this.state.filter_state,
        person: {
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
        person: {
          value: newperson,
          person_id: newperson.value.id,
          is_valid: isValid,
        }
      }
    })
  };

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

  invoice_status_in_search_remover() {
    this.setState({
      ...this.state,
      filter_state: {
        ...this.state.filter_state, status: { value: null, status: null, isValid: false }
      }
    })
  }

  handleSelectInputChange(type: { value: string, label: string } | null, inputType: any) {
    if (type === null) {
      this.setState({
        ...this.state,
        filter_state: {
          ...this.state.filter_state, [inputType]: { value: type, status: null, isValid: false }
        }
      })
    } else {
      this.setState({
        ...this.state,
        filter_state: {
          ...this.state.filter_state, [inputType]: { value: type, status: type.value, isValid: true }
        }
      })
    }
  }

  /////  end onChange & search & reset function for search box ///////////

  ////// start request for options person of order in filter  ////////

  private personRequstError_txt: string = Localization.no_item_found;

  async promiseOptions2(inputValue: any, callBack: any) {
    let filter = undefined;
    if (inputValue) {
      filter = { full_name: { $prefix: inputValue } };
    }
    let res: any = await this._personService.search(10, 0, filter).catch(err => {
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

  ///////////// end request for options person of order in filter ////////////////////////

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
              <h2 className="text-bold text-dark pl-3">{Localization.order}</h2>
              {
                AccessService.checkOneOFAllAccess([TPERMISSIONS.ORDER_ADD_PREMIUM, TPERMISSIONS.ORDER_ADD_PRESS]) === true
                  ?
                  <BtnLoader
                    loading={false}
                    disabled={false}
                    btnClassName="btn btn-success shadow-default shadow-hover mb-4"
                    onClick={() => this.gotoOrderCreate()}
                  >
                    {Localization.new}
                  </BtnLoader>
                  :
                  undefined
              }
            </div>
          </div>
          {
            AccessService.checkAccess(TPERMISSIONS.ORDER_GET_PREMIUM) === true
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
                            onChange={(value, isValid) => this.handleInputChange(value, 'creator')}
                            label={Localization.user}
                            placeholder={Localization.user}
                            defaultValue={this.state.filter_state.creator.value}
                          />
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <label >{Localization.person}</label>
                          <i
                            title={Localization.reset}
                            className="fa fa-times cursor-pointer remover-in_box-async text-danger mx-1"
                            onClick={() => this.person_in_search_remover()}
                          ></i>
                          <AsyncSelect
                            placeholder={Localization.person}
                            cacheOptions
                            defaultOptions
                            value={this.state.filter_state.person.value}
                            loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback)}
                            noOptionsMessage={(obj) => this.select_noOptionsMessage(obj)}
                            onChange={(selectedPerson: any) => this.handlePersonChange(selectedPerson)}
                          />
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <AppRangePicker
                            label={Localization.creation_date}
                            from={this.state.filter_state.cr_date.from}
                            to={this.state.filter_state.cr_date.to}
                            onChange={(from, from_isValid, to, to_isValid, isValid) => this.range_picker_onChange(from, from_isValid, to, to_isValid, isValid, 'cr_date')}
                          />
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <AppRangePicker
                            label={Localization.modification_date}
                            from={this.state.filter_state.mo_date.from}
                            to={this.state.filter_state.mo_date.to}
                            onChange={(from, from_isValid, to, to_isValid, isValid) => this.range_picker_onChange(from, from_isValid, to, to_isValid, isValid, 'mo_date')}
                          />
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="form-group">
                            <label htmlFor="">{Localization.status}</label>
                            <i
                              title={Localization.reset}
                              className="fa fa-times cursor-pointer remover-in_box text-danger mx-1"
                              onClick={() => this.invoice_status_in_search_remover()}
                            ></i>
                            <Select
                              onChange={(value: any) => this.handleSelectInputChange(value, 'status')}
                              options={this.statusOptions}
                              value={this.state.filter_state.status.value}
                              placeholder={Localization.status}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <AppNumberRange
                            label={Localization.total_price}
                            from={this.state.filter_state.total_price.from}
                            to={this.state.filter_state.total_price.to}
                            onChange={(from, from_isValid, to, to_isValid, isValid) => this.range_picker_onChange(from, from_isValid, to, to_isValid, isValid, 'total_price')}
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
                    <Table row_offset_number={this.state.pager_offset} loading={this.state.tableProcessLoader} list={this.state.order_table.list} colHeaders={this.state.order_table.colHeaders} actions={this.state.order_table.actions}></Table>
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
        {this.render_delete_modal(this.selectedOrder)}
        {this.render_order_details_modal()}
        {this.render_order_GetInvoice()}
        {
          <RetryModal
            modalShow={this.state.retryModal}
            onHide={() => this.setState({ ...this.state, retryModal: false })}
            onRetry={() => { this.fetchOrders(); this.setState({ ...this.state, retryModal: false }) }}
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

export const OrderManage = connect(
  state2props,
  dispatch2props
)(OrderManageComponent);