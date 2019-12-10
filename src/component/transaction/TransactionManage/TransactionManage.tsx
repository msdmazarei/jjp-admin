import React from "react";
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
import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import { AccessService } from "../../../service/service.access";
import { AppNumberRange } from "../../form/app-numberRange/app-numberRange";
import { AppRangePicker } from "../../form/app-rangepicker/AppRangePicker";
import { TransactionService } from "../../../service/service.transaction";
import Select from 'react-select';

/// define props & state ///////
export interface IProps {
  history: History;
  internationalization: TInternationalization;
  // token: IToken;
}

interface IFilterTransaction {
  creator: {
    value: string | undefined,
    isValid: boolean
  };
  cr_date: {
    from: number | undefined,
    from_isValid: boolean,
    to: number | undefined,
    to_isValid: boolean,
    is_valid: boolean,
  };
  type: {
    value: { value: number, label: string } | null,
    type: number | null,
    isValid: boolean
  };
  transaction: {
    from: number | undefined,
    from_isValid: boolean,
    to: number | undefined,
    to_isValid: boolean,
    is_valid: boolean,
  };
}

interface IState {
  transaction_table: IProps_table;
  TransactionError: string | undefined;
  pager_offset: number;
  pager_limit: number;
  removeModalShow: boolean;
  transactionModalShow: boolean;
  prevBtnLoader: boolean;
  nextBtnLoader: boolean;
  filterSearchBtnLoader: boolean;
  tableProcessLoader: boolean;
  setRemoveLoader: boolean;
  filter_state: IFilterTransaction;
  advance_search_box_show: boolean;
}

// define class of Comment 
class TransactionManageComponent extends BaseComponent<IProps, IState>{
  typeOptions = [
    { value: 2, label: Localization.increase_credit },
    { value: 1, label: Localization.reduce_credit },
  ];
  state = {
    transaction_table: {
      list: [],
      colHeaders: [
        {
          field: "creator", title: Localization.creator, cellTemplateFunc: (row: any) => {
            if (row.creator) {
              return <div title={row.creator} className="text-nowrap-ellipsis max-w-100px d-inline-block">
                {row.creator}
              </div>
            }
            return '';
          }
        },
        {
          field: "creation_date", title: Localization.creation_date, cellTemplateFunc: (row: any) => {
            if (row.creation_date) {
              return <div title={this._getTimestampToDate(row.creation_date)}>{this.getTimestampToDate(row.creation_date)}</div>
            }
            return '';
          }
        },
        {
          field: "transaction_amount", title: Localization.transaction_amount, cellTemplateFunc: (row: any) => {
            if (row.credit > 0) {
              return <>
                <div className="text-success text-center"><span>{row.credit.toLocaleString()}<i className="fa fa-caret-up mx-1"></i></span></div>
              </>;
            } else if (row.debit > 0) {
              return <div className="text-danger text-center"><span>{row.debit.toLocaleString()}<i className="fa fa-caret-down mx-1"></i></span></div>;
            } else {
              return <div className="text-info text-center">0</div>;
            }
          }
        },
      ],
      actions: this.checkAllAccess() ? [
        {
          access: (row: any) => { return this.checkDeleteToolAccess() },
          text: <i title={Localization.remove} className="fa fa-trash text-danger"></i>,
          ac_func: (row: any) => { this.remove_transaction(row) },
          name: Localization.remove
        },
      ]
        :
        undefined
    },
    TransactionError: undefined,
    pager_offset: 0,
    pager_limit: 10,
    prevBtnLoader: false,
    nextBtnLoader: false,
    filterSearchBtnLoader: false,
    tableProcessLoader: false,
    removeModalShow: false,
    transactionModalShow: false,
    setRemoveLoader: false,
    filter_state: {
      creator: {
        value: undefined,
        isValid: false
      },
      cr_date: {
        from: undefined,
        from_isValid: false,
        to: undefined,
        to_isValid: false,
        is_valid: false,
      },
      type: {
        value: null,
        type: null,
        isValid: false
      },
      transaction: {
        from: undefined,
        from_isValid: false,
        to: undefined,
        to_isValid: false,
        is_valid: false,
      },
    },
    advance_search_box_show: false,
  }

  selectedTransaction: any | undefined;
  private _transactionService = new TransactionService();

  // constructor(props: IProps) {
  //   super(props);
  //   // this._transactionService.setToken(this.props.token)
  // }


  // timestamp to date 

  componentDidMount() {
    if (this.checkPageRenderAccess()) {
      if (AccessService.checkAccess('TRANSACTION_GET_PREMIUM')) {
        this.setState({
          ...this.state,
          tableProcessLoader: true
        })
        this.fetchTransactions();
      }
    } else {
      this.noAccessRedirect(this.props.history);
    }
  }

  checkPageRenderAccess(): boolean {
    if (AccessService.checkAccess('TRANSACTION_GET_PREMIUM')) {
      return true;
    }
    return false;
  }

  checkAllAccess(): boolean {
    if (AccessService.checkOneOFAllAccess(['TRANSACTION_GET_PREMIUM', 'TRANSACTION_DELETE_PREMIUM'])) {
      return true;
    }
    return false;
  }

  checkDeleteToolAccess(): boolean {
    if (AccessService.checkAccess('TRANSACTION_DELETE_PREMIUM')) {
      return true;
    }
    return false
  }

  checkShowToolAccess(): boolean {
    if (AccessService.checkAccess('TRANSACTION_GET_PREMIUM')) {
      return true;
    }
    return false
  }

  getTimestampToDate(timestamp: number) {
    if (this.props.internationalization.flag === "fa") {
      return moment_jalaali(timestamp * 1000).format('HH:mm:ss - jYYYY/jMM/jD');
    }
    else {
      return moment(timestamp * 1000).locale("en").format('HH:mm:ss - YYYY/MM/DD');
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

  /// start delete modal /////

  remove_transaction(transaction: any) {
    this.selectedTransaction = transaction;
    this.setState({ ...this.state, removeModalShow: true, })
  }

  onHideRemoveModal() {
    this.selectedTransaction = undefined;
    this.setState({ ...this.state, removeModalShow: false, })
  }

  async onRemoveTransaction(transaction_id: string) {
    this.setState({ ...this.state, setRemoveLoader: true });
    let res = await this._transactionService.remove(transaction_id).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'onRemoveOrder_error' } });
      this.setState({ ...this.state, setRemoveLoader: false });
    });
    if (res) {
      this.setState({ ...this.state, setRemoveLoader: false });
      this.apiSuccessNotify();
      this.fetchTransactions();
      this.onHideRemoveModal();
    }
  }

  render_delete_modal(selectedTransaction: any) {
    if (!this.selectedTransaction || !this.selectedTransaction.id) return;
    return (
      <>
        <Modal show={this.state.removeModalShow} onHide={() => this.onHideRemoveModal()}>
          <Modal.Body>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.type + " " + Localization.transaction}:&nbsp;
            </span>
              {
                (selectedTransaction.credit === 0 && selectedTransaction.debit === 0)
                  ?
                  "---"
                  :
                  selectedTransaction.credit > 0
                    ?
                    Localization.increase_credit
                    :
                    selectedTransaction.debit > 0
                      ?
                      Localization.reduce_credit
                      :
                      undefined
              }
            </p>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.transaction_amount}:&nbsp;
            </span>
              {
                (selectedTransaction.credit === 0 && selectedTransaction.debit === 0)
                  ?
                  0
                  :
                  selectedTransaction.credit > 0
                    ?
                    selectedTransaction.credit
                    :
                    selectedTransaction.debit > 0
                      ?
                      selectedTransaction.debit
                      :
                      undefined
              }
            </p>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.creation_date}:&nbsp;
            </span>
              {this.getTimestampToDate(selectedTransaction.creation_date)}
            </p>
            <p className="text-danger">{Localization.msg.ui.item_will_be_removed_continue}</p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideRemoveModal()}>{Localization.close}</button>
            <BtnLoader
              btnClassName="btn btn-danger shadow-default shadow-hover"
              onClick={() => this.onRemoveTransaction(selectedTransaction.id)}
              loading={this.state.setRemoveLoader}
            >
              {Localization.remove}
            </BtnLoader>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  /// end delete modal /////

  // define axios for give data

  private _searchFilter: any | undefined;
  private get_searchFilter() {
    return this._searchFilter;
  }
  private set_searchFilter() {
    const obj: any = {};

    if (this.state.filter_state.creator.isValid) {
      obj['creator'] = { $prefix: this.state.filter_state.creator.value };
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

    if (this.state.filter_state.transaction.is_valid === true) {
      if (this.state.filter_state.type.type === 2) {
        if (this.state.filter_state.transaction.from_isValid === true && this.state.filter_state.transaction.to_isValid === true) {
          obj['credit'] = { $gte: this.state.filter_state.transaction.from, $lte: this.state.filter_state.transaction.to }
        } else if (this.state.filter_state.transaction.from_isValid === true && this.state.filter_state.transaction.to_isValid === false) {
          obj['credit'] = { $gte: this.state.filter_state.transaction.from }
        } else if (this.state.filter_state.transaction.from_isValid === false && this.state.filter_state.transaction.to_isValid === true) {
          obj['credit'] = { $lte: this.state.filter_state.transaction.to }
        }
      }

      if (this.state.filter_state.type.type === 1) {
        if (this.state.filter_state.transaction.from_isValid === true && this.state.filter_state.transaction.to_isValid === true) {
          obj['debit'] = { $gte: this.state.filter_state.transaction.from, $lte: this.state.filter_state.transaction.to }
        } else if (this.state.filter_state.transaction.from_isValid === true && this.state.filter_state.transaction.to_isValid === false) {
          obj['debit'] = { $gte: this.state.filter_state.transaction.from }
        } else if (this.state.filter_state.transaction.from_isValid === false && this.state.filter_state.transaction.to_isValid === true) {
          obj['debit'] = { $lte: this.state.filter_state.transaction.to }
        }
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
    }, () => {
      // this.gotoTop();
      // this.setFilter();
      this.set_searchFilter();
      this.fetchTransactions()
    });
  }

  async fetchTransactions() {
    this.setState({ ...this.state, tableProcessLoader: true });
    let res = await this._transactionService.search(
      this.state.pager_limit,
      this.state.pager_offset,
      this.get_searchFilter()
    ).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'fetchComments_error' } });
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
        ...this.state, transaction_table: {
          ...this.state.transaction_table,
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
    if (this.state.transaction_table.list && (this.state.transaction_table.list! || []).length) {
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
    } else if (this.state.transaction_table.list && !(this.state.transaction_table.list! || []).length) {
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

    } else if (this.state.TransactionError) {
      return;
    } else {
      return;
    }
  }

  // next button create

  pager_next_btn_render() {
    if (this.state.transaction_table.list && (this.state.transaction_table.list! || []).length) {
      return (
        <>
          {
            !(this.state.pager_limit > (this.state.transaction_table.list! || []).length) &&
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
    } else if (this.state.transaction_table.list && !(this.state.transaction_table.list! || []).length) {
      return;
    } else if (this.state.transaction_table.list) {
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
      this.fetchTransactions()
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
      this.fetchTransactions()
    });
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
        cr_date: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
        type: {
          value: null,
          type: null,
          isValid: false
        },
        transaction: {
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
        cr_date: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
        type: {
          value: null,
          type: null,
          isValid: false
        },
        transaction: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
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

  invoice_type_in_search_remover() {
    this.setState({
      ...this.state,
      filter_state: {
        ...this.state.filter_state,
        type: {
          value: null,
          type: null,
          isValid: false
        },
        transaction: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
      }
    })
  }

  handleSelectInputChange(type: { value: string, label: string } | null, inputType: any) {
    if (type === null) {
      this.setState({
        ...this.state,
        filter_state: {
          ...this.state.filter_state, [inputType]: { value: type, type: null, isValid: false }
        }
      })
    } else {
      this.setState({
        ...this.state,
        filter_state: {
          ...this.state.filter_state, [inputType]: { value: type, type: type.value, isValid: true }
        }
      })
    }
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
              <h2 className="text-bold text-dark pl-3">{Localization.transaction}</h2>
            </div>
          </div>
          {
            AccessService.checkAccess('TRANSACTION_GET_PREMIUM')
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
                            label={Localization.creator}
                            placeholder={Localization.creator}
                            defaultValue={this.state.filter_state.creator.value}
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
                          <div className="form-group">
                            <label htmlFor="">{Localization.type}</label>
                            <i
                              title={Localization.reset}
                              className="fa fa-times cursor-pointer remover-in_box text-danger mx-1"
                              onClick={() => this.invoice_type_in_search_remover()}
                            ></i>
                            <Select
                              onChange={(value: any) => this.handleSelectInputChange(value, 'type')}
                              options={this.typeOptions}
                              value={this.state.filter_state.type.value}
                              placeholder={Localization.type}
                            />
                          </div>
                        </div>
                        {
                          this.state.filter_state.type.type === null
                            ?
                            undefined
                            :
                            <div className="col-md-3 col-sm-6">
                              <AppNumberRange
                                label={Localization.transaction}
                                from={this.state.filter_state.transaction.from}
                                to={this.state.filter_state.transaction.to}
                                onChange={(from, from_isValid, to, to_isValid, isValid) => this.range_picker_onChange(from, from_isValid, to, to_isValid, isValid, 'transaction')}
                              />
                            </div>
                        }
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
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <Table row_offset_number={this.state.pager_offset} loading={this.state.tableProcessLoader} list={this.state.transaction_table.list} colHeaders={this.state.transaction_table.colHeaders} actions={this.state.transaction_table.actions}></Table>
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
        {this.render_delete_modal(this.selectedTransaction)}
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

export const TransactionManage = connect(
  state2props,
  dispatch2props
)(TransactionManageComponent);