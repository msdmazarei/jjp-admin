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

/// define props & state ///////
export interface IProps {
  history: History;
  internationalization: TInternationalization;
  // token: IToken;
}

interface IFilterOrder {
  title: {
    value: string | undefined;
    isValid: boolean;
  };
  tags: {
    value: { label: string, value: string }[];
    isValid: boolean;
  };
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
  filter: any,
  setRemoveLoader: boolean;
  setGetInvoiceLoader: boolean;
  setPriceLoader: boolean;
  tags_inputValue: string;
}

// define class of Order 

class OrderManageComponent extends BaseComponent<IProps, IState>{

  state = {
    order_table: {
      list: [],
      colHeaders: [
        {
          field: "creator", title: Localization.user, cellTemplateFunc: (row: any) => {
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
          cellTemplateFunc: (row: any) => {
            if (row.creation_date) {
              return <div title={this._getTimestampToDate(row.creation_date)}>{this.getTimestampToDate(row.creation_date)}</div>
            }
            return '';
          }
        },
        {
          field: "modification_date", title: Localization.modification_date,
          cellTemplateFunc: (row: any) => {
            if (row.modification_date) {
              return <div title={this._getTimestampToDate(row.modification_date)}>{this.getTimestampToDate(row.modification_date)}</div>
            }
            return '';
          }
        },
        {
          field: "status", title: Localization.status, cellTemplateFunc: (row: any) => {
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
          field: "total_price", title: Localization.total_price, cellTemplateFunc: (row: any) => {
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
    filter: {
      title: {
        value: undefined,
        isValid: true,
      },
      tags: {
        value: [],
        isValid: true
      }
    },
    setRemoveLoader: false,
    setGetInvoiceLoader: false,
    setPriceLoader: false,
    tags_inputValue: '',
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

  // constructor(props: IProps) {
  //   super(props);
  //   // this._orderService.setToken(this.props.token)
  // }

  componentDidMount() {
    if (this.checkTableAccess()) {
      this.setState({
        ...this.state,
        tableProcessLoader: true
      })
      this.fetchOrders();
    } else {
      this.noAccessRedirect(this.props.history);
    }
  }

  checkTableAccess(): boolean {
    if (AccessService.checkAccess('ORDER_GET_PREMIUM')) {
      return true;
    }
    return false
  }

  checkAllAccess(): boolean {
    if (AccessService.checkOneOFAllAccess(['ORDER_DELETE_PREMIUM', 'ORDER_EDIT_PREMIUM', 'ORDER_ITEM_GET_PREMIUM']) || this.checkGetInvoiceToolAccess()) {
      return true;
    }
    return false;
  }

  checkDeleteToolAccess(): boolean {
    if (AccessService.checkAccess('ORDER_DELETE_PREMIUM')) {
      return true;
    }
    return false
  }

  checkUpdateToolAccess(): boolean {
    if (AccessService.checkAccess('ORDER_EDIT_PREMIUM')) {
      return true;
    }
    return false
  }

  checkShowToolAccess(): boolean {
    if (AccessService.checkAccess('ORDER_ITEM_GET_PREMIUM')) {
      return true;
    }
    return false
  }

  checkGetInvoiceToolAccess(): boolean {
    if (AccessService.checkAllAccess(['ORDER_ITEM_GET_PREMIUM', 'ORDER_CHECKOUT_PREMIUM'])) {
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

  // timestamp to date 

  getTimestampToDate(timestamp: number) {
    if (this.props.internationalization.flag === "fa") {
      return moment_jalaali(timestamp * 1000).locale("en").format('jYYYY/jM/jD');
    }
    else {
      return moment(timestamp * 1000).format('YYYY/MM/DD');
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
      this.getFilter()
    ).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'fetchOrders_error' } });
      this.setState({
        ...this.state,
        prevBtnLoader: false,
        nextBtnLoader: false,
        tableProcessLoader: false,
        filterSearchBtnLoader: false,
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
    this.props.history.push(`/order/${order_id.id}/edit`);
  }

  /////  end for update row function  /////////


  ////// start delete modal function define  //////

  onShowRemoveModal(order: any) {
    this.selectedOrder = order;
    this.setState({ ...this.state, removeModalShow: true });
  }

  onHideRemoveModal() {
    this.selectedOrder = undefined;
    this.setState({ ...this.state, removeModalShow: false });
  }

  async onRemoveOrder(order_id: string) {
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

  /////  end show details of order by user function define  /////////





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
    this.props.history.push('/order/create'); // /admin
  }






  handleSelectInputChange(value: any[], inputType: any) {
    // let isValid;
    // if (!value || !value.length) {
    //   isValid = false;
    // } else {
    //   isValid = true;
    // }
    this.setState({
      ...this.state,
      filter: {
        ...this.state.filter,
        [inputType]: { value: value || [], isValid: true }
      }
    })

  }


  ///// start onChange & search & reset function for search box ///////////

  handleFilterInputChange(value: string, isValid: boolean) {
    this.setState({
      ...this.state,
      filter: {
        ...this.state.filter,
        title: {
          value, isValid
        }
      },
    });
  }

  filterReset() {
    this.setState({
      ...this.state, filter: {
        ...this.state.filter,
        title: {
          value: undefined,
          isValid: true
        },
      },
      prevBtnLoader: false,
      nextBtnLoader: false,
    });
  }

  filterSearch() {
    this.setState({
      ...this.state,
      filterSearchBtnLoader: true,
      tableProcessLoader: true,
      pager_offset: 0
    }, () => {
      // this.gotoTop();
      this.setFilter();
      this.fetchOrders()
    });
  }

  private _filter: any = {
    title: { value: undefined, isValid: true },
    tags: { value: [], isValid: true },
  };
  isFilterEmpty(): boolean {
    if (this._filter.title.value) {
      return false;
    }
    if (this._filter.tags.value.length) {
      return false;
    }
    return true;
  }
  setFilter() {
    this._filter = { ...this.state.filter };
  }
  getFilter() {
    if (!this.isFilterEmpty()) {
      let obj: any = {};
      if (this._filter.title.isValid) {
        obj['title'] = this._filter.title.value;
      }
      // if (this._filter.tags.isValid) {
      //   if (this._filter.tags.value.length) {
      //     obj['tags'] = this._filter.tags.value.map(t => t.value);
      //   }
      //   // obj['tags'] = this._filter.tags.value.length?;
      // }
      return obj;
    }
    return;
  }

  ///// end onChange & search & reset function for search box ///////////


  //////render call Table component //////

  render() {
    return (
      <>
        <div className="content">
          <div className="row">
            <div className="col-12">
              <h2 className="text-bold text-dark pl-3">{Localization.order}</h2>
              {
                AccessService.checkOneOFAllAccess(['ORDER_ADD_PREMIUM', 'ORDER_ADD_PRESS'])
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
          <div className="row">
            <div className="col-12">
              <div className="template-box mb-4">
                <div className="row">
                  <div className="col-sm-6 col-xl-4">
                    <Input
                      onChange={(value: string, isValid) => this.handleFilterInputChange(value, isValid)}
                      label={Localization.order}
                      placeholder={Localization.order}
                      defaultValue={this.state.filter.title.value}
                    />
                  </div>
                  <div className="col-8 d-none">
                    <div className="form-group">
                      <label htmlFor="">{Localization.tags}</label>
                      <Select
                        isMulti
                        onChange={(value: any) => this.handleSelectInputChange(value, "tags")}
                        value={this.state.filter.tags.value}
                        placeholder={Localization.tags}
                        inputValue={this.state.tags_inputValue}
                        menuIsOpen={false}
                        components={{
                          DropdownIndicator: null,
                        }}
                        isClearable
                        onInputChange={(inputVal) => this.setState({ ...this.state, tags_inputValue: inputVal })}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
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
                      onClick={() => this.filterReset()}
                    >
                      {Localization.reset}
                    </BtnLoader>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">

            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Table loading={this.state.tableProcessLoader} list={this.state.order_table.list} colHeaders={this.state.order_table.colHeaders} actions={this.state.order_table.actions}></Table>
              <div>
                {this.pager_previous_btn_render()}
                {this.pager_next_btn_render()}
              </div>
            </div>
          </div>
        </div>
        {this.render_delete_modal(this.selectedOrder)}
        {this.render_order_details_modal()}
        {this.render_order_GetInvoice()}
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