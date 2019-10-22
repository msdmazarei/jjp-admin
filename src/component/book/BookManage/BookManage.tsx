import React from "react";
import { Table, IProps_table } from "../../table/table";
import { Input } from '../../form/input/Input';
import { BookService } from "../../../service/service.book";
import { History } from 'history';
import { Modal } from "react-bootstrap";
import { IBook } from "../../../model/model.book";
import { ToastContainer } from "react-toastify";
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { redux_state } from "../../../redux/app_state";
import { BaseComponent } from "../../_base/BaseComponent";
import { TInternationalization } from "../../../config/setup";
import { IToken } from "../../../model/model.token";
import { Localization } from "../../../config/localization/localization";
import { BtnLoader } from "../../form/btn-loader/BtnLoader";
import { BOOK_TYPES } from "../../../enum/Book";
import { AppRegex } from "../../../config/regex";
import { PriceService } from "../../../service/service.price";
import Select from 'react-select';
import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import { FixNumber } from "../../form/fix-number/FixNumber";

/// define props & state ///////
export interface IProps {
  history: History;
  internationalization: TInternationalization;
  // token: IToken;
}

interface IFilterBook {
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
  book_table: IProps_table;
  BookError: string | undefined;
  pager_offset: number;
  pager_limit: number;
  removeModalShow: boolean;
  prevBtnLoader: boolean;
  nextBtnLoader: boolean;
  filterSearchBtnLoader: boolean;
  tableProcessLoader: boolean;
  priceModalShow: boolean;
  price: {
    value: number | undefined;
    isValid: boolean;
  },
  filter: IFilterBook,
  setRemoveLoader: boolean;
  setPriceLoader: boolean;
  tags_inputValue: string;
}

// define class of Book 

class BookManageComponent extends BaseComponent<IProps, IState>{
  state = {
    book_table: {
      list: [],
      colHeaders: [
        {
          field: "title", title: Localization.title, cellTemplateFunc: (row: IBook) => {
            if (row.title) {
              return <div title={row.title} className="text-nowrap-ellipsis max-w-200px d-inline-block">
                {row.title}
              </div>
            }
            return '';
          }
        },
        {
          field: "images", title: Localization.images, templateFunc: () => {
            return <b>{Localization.images}</b>
          },
          cellTemplateFunc: (row: IBook) => {
            if (row.images && row.images.length) {
              return <div className="text-center" >
                <div className="d-inline-block w-50px h-50px">
                  <img className="max-w-50px max-h-50px" src={"/api/serve-files/" + row.images[0]} alt="" onError={e => this.bookImageOnError(e)} />
                </div>
              </div>
            }
            else {
              return <div className="text-center">
                <div className="d-inline-block w-50px h-50px">
                  <img className="max-w-50px max-h-50px" src={this.defaultBookImagePath} alt="" />
                </div>
              </div>
            }
          }
        },
        {
          field: "type", title: Localization.type,
          cellTemplateFunc: (row: IBook) => {
            if (row.type) {
              const b_type: any = row.type;
              const b_t: BOOK_TYPES = b_type;
              return Localization.book_type_list[b_t];
            }
            return '';
          }
        },
        {
          field: "creation_date", title: Localization.creation_date,
          cellTemplateFunc: (row: IBook) => {
            if (row.creation_date) {
              return <div title={this._getTimestampToDate(row.creation_date)}>{this.getTimestampToDate(row.creation_date)}</div>
            }
            return '';
          }
        },
        {
          field: "price", title: Localization.price,
          cellTemplateFunc: (row: IBook) => {
            // row.price = 3436465;
            if (row.price) {
              return <span className="text-info">
                {row.price.toLocaleString()}
              </span>
            }
            else {
              return <div className="text-muted text-center">-</div>;
            }
          }
        },
        {
          field: "description", title: Localization.description,
          cellTemplateFunc: (row: IBook) => {
            if (row.description) {
              return <div title={row.description} className="text-right d-inline-block text-nowrap-ellipsis max-w-100px">
                {row.description}
              </div>
            }
            return '';
          }
        },
        {
          field: "rate",
          title: Localization.vote_s,
          cellTemplateFunc: (row: IBook) => {
            if (row.rate) {
              return <span>
                {row.rate} {Localization.from} 5 <small>({row.rate_no})</small>
              </span>
            }
            return '';
          }
        },
        { field: "pages", title: Localization.pages },
        {
          field: "duration", title: Localization.duration,
          cellTemplateFunc: (row: IBook) => {
            let hour;
            let minute;
            let second;
            if (row.duration) {
              if(row.duration === 'NaN' ){
                return ''
              }
              let totalTime = Number(row.duration);
              if (totalTime < 60) {
                hour = 0;
                minute = 0;
                second = totalTime;
                return <div title={row.duration} className="text-right d-inline-block text-nowrap-ellipsis max-w-100px"> {second} : {minute} : {hour}</div>
              }
              if (totalTime >= 60 && totalTime < 3600) {
                let min = Math.floor(totalTime / 60);
                let sec = totalTime - (min * 60);
                hour = 0;
                minute = min;
                second = sec;
                return <div title={row.duration} className="text-right d-inline-block text-nowrap-ellipsis max-w-100px"> {second} : {minute} : {hour}</div>
              } else {
                let hours = Math.floor(totalTime / 3600);
                if ((totalTime - (hours * 3600)) < 60) {
                  let sec = totalTime % 3600;
                  hour = hours;
                  minute = 0;
                  second = sec;
                  return <div title={row.duration} className="text-right d-inline-block text-nowrap-ellipsis max-w-100px"> {second} : {minute} : {hour}</div>
                } else {
                  let min = Math.floor(((totalTime - (hours * 3600)) / 60));
                  let sec = (totalTime - ((hours * 3600) + (min * 60)));
                  hour = hours;
                  minute = min;
                  second = sec;
                  return <div title={row.duration} className="text-right d-inline-block text-nowrap-ellipsis max-w-100px"> {second} : {minute} : {hour}</div>
                }
              }
            }
            return '';
          }
        },
        {
          field: "pub_year", title: Localization.publication_date,
          cellTemplateFunc: (row: IBook) => {
            if (row.pub_year) {
              return <div title={this._getTimestampToDate(row.pub_year)}>{this.getTimestampToDate(row.pub_year)}</div>
            }
            return '';
          }
        },
      ],
      actions: [
        {
          text: <i title={Localization.remove} className="fa fa-trash text-danger"></i>,
          ac_func: (row: any) => { this.onShowRemoveModal(row) },
          name: Localization.remove
        },
        {
          text: <i title={Localization.update} className="fa fa-pencil-square-o text-primary"></i>,
          ac_func: (row: any) => { this.updateRow(row) },
          name: Localization.update
        },
        {
          text: <i title={Localization.Pricing} className="fa fa-money text-success"></i>,
          ac_func: (row: any) => { this.onShowPriceModal(row) },
          name: Localization.Pricing
        },
      ]
    },
    BookError: undefined,
    pager_offset: 0,
    pager_limit: 10,
    prevBtnLoader: false,
    nextBtnLoader: false,
    filterSearchBtnLoader: false,
    tableProcessLoader: false,
    removeModalShow: false,
    priceModalShow: false,
    price: {
      value: undefined,
      isValid: false,
    },
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
    setPriceLoader: false,
    tags_inputValue: '',
  }

  selectedBook: IBook | undefined;
  private _bookService = new BookService();
  private _priceService = new PriceService();

  constructor(props: IProps) {
    super(props);
    // this._bookService.setToken(this.props.token)
    // this._priceService.setToken(this.props.token)
  }

  componentDidMount() {
    moment.locale("en");
    this.setState({
      ...this.state,
      tableProcessLoader: true
    })
    this.fetchBooks();
  }

  updateRow(book_id: any) {
    this.props.history.push(`/book/${book_id.id}/edit`);
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

  // delete modal function define

  onShowRemoveModal(book: IBook) {
    this.selectedBook = book;
    this.setState({ ...this.state, removeModalShow: true });
  }

  onHideRemoveModal() {
    this.selectedBook = undefined;
    this.setState({ ...this.state, removeModalShow: false });
  }

  async onRemoveBook(book_id: string) {
    this.setState({ ...this.state, setRemoveLoader: true });
    let res = await this._bookService.remove(book_id).catch(error => {
      this.handleError({ error: error.response });
      this.setState({ ...this.state, setRemoveLoader: false });
    });
    if (res) {
      this.setState({ ...this.state, setRemoveLoader: false });
      this.apiSuccessNotify();
      this.fetchBooks();
      this.onHideRemoveModal();
    }
  }

  render_delete_modal(selectedBook: any) {
    if (!this.selectedBook || !this.selectedBook.id) return;
    return (
      <>
        <Modal show={this.state.removeModalShow} onHide={() => this.onHideRemoveModal()}>
          <Modal.Body>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.title}:&nbsp;
            </span>
              {this.selectedBook.title}
            </p>
            <p className="text-danger">{Localization.msg.ui.item_will_be_removed_continue}</p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideRemoveModal()}>{Localization.close}</button>
            <BtnLoader
              btnClassName="btn btn-danger shadow-default shadow-hover"
              onClick={() => this.onRemoveBook(selectedBook.id)}
              loading={this.state.setRemoveLoader}
            >
              {Localization.remove}
            </BtnLoader>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  onShowPriceModal(book: IBook) {
    this.selectedBook = book;
    this.setState({
      ...this.state, priceModalShow: true, price: {
        isValid: (book.price || book.price === 0) ? true : false,
        value: book.price
      }
    });
  }
  onHidePriceModal() {
    this.selectedBook = undefined;
    this.setState({ ...this.state, priceModalShow: false });
  }
  async onPriceBook(book_id: string) {
    if (!this.state.price.isValid) return;
    this.setState({ ...this.state, setPriceLoader: true });
    let res = await this._priceService.price(book_id, this.state.price.value!).catch(error => {
      this.handleError({ error: error.response });
      this.setState({ ...this.state, setPriceLoader: false });
    });
    if (res) {
      this.setState({ ...this.state, setPriceLoader: false });
      this.apiSuccessNotify();
      this.fetchBooks(); // todo update selected book & do not request
      this.onHidePriceModal();
    }
  }


  handlePriceInputChange(value: number, isValid: boolean) {
    this.setState({
      ...this.state,
      price: {
        value,
        isValid,
      }
    })
  }

  render_price_modal(selectedBook: any) {
    if (!this.selectedBook || !this.selectedBook.id) return;
    return (
      <>
        <Modal show={this.state.priceModalShow} onHide={() => this.onHidePriceModal()}>
          <Modal.Body>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.title}:
              </span>
              {this.selectedBook.title}
            </p>
            <FixNumber
              onChange={(value, isValid) => this.handlePriceInputChange(value, isValid)}
              label={Localization.Pricing}
              placeholder={Localization.price}
              defaultValue={this.state.price.value}
              pattern={AppRegex.number}
              patternError={Localization.Justـenterـtheـnumericـvalue}
              required
            />
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHidePriceModal()}>{Localization.close}</button>
            <BtnLoader
              loading={this.state.setPriceLoader}
              btnClassName="btn btn-system shadow-default shadow-hover"
              onClick={() => this.onPriceBook(selectedBook.id)}
              disabled={!this.state.price.isValid}
            >
              {Localization.Add_price}
            </BtnLoader>
          </Modal.Footer>
        </Modal>
      </>
    );
  }


  // define axios for give data




  async fetchBooks() {
    this.setState({ ...this.state, tableProcessLoader: true })
    let res = await this._bookService.search(
      this.state.pager_limit,
      this.state.pager_offset,
      this.getFilter()
    ).catch(error => {
      this.handleError({ error: error.response });
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
        ...this.state, book_table: {
          ...this.state.book_table,
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
    if (this.state.book_table.list && (this.state.book_table.list! || []).length) {
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
    } else if (this.state.book_table.list && !(this.state.book_table.list! || []).length) {
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

    } else if (this.state.BookError) {
      return;
    } else {
      return;
    }
  }

  // next button create

  pager_next_btn_render() {
    if (this.state.book_table.list && (this.state.book_table.list! || []).length) {
      return (
        <>
          {
            !(this.state.pager_limit > (this.state.book_table.list! || []).length) &&
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
    } else if (this.state.book_table.list && !(this.state.book_table.list! || []).length) {
      return;
    } else if (this.state.book_table.list) {
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
      this.fetchBooks()
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
      this.fetchBooks()
    });
  }


  ///// navigation function //////

  gotoBookCreate() {
    this.props.history.push('/book/create'); // /admin
  }



  //////   tag filter //////////////

  handle_tagsKeyDown(event: any/* SyntheticKeyboardEvent<HTMLElement> */) {
    if (!this.state.tags_inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        const newVal = this.state.tags_inputValue;
        this.setState({
          ...this.state,
          filter: {
            ...this.state.filter,
            tags: {
              ...this.state.filter.tags,
              value: [
                ...this.state.filter.tags.value,
                { label: newVal, value: newVal }
              ]
            }
          },
          tags_inputValue: ''
        });
        event.preventDefault();
    }
  };


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





  /////  onChange & search & reset function for search box ///////////

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
      this.fetchBooks()
    });
  }

  private _filter: IFilterBook = {
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
      if (this._filter.tags.isValid) {
        if (this._filter.tags.value.length) {
          obj['tags'] = this._filter.tags.value.map(t => t.value);
        }
        // obj['tags'] = this._filter.tags.value.length?;
      }
      return obj;
    }
    return;
  }

  //////render call Table component //////

  render() {
    return (
      <>
        <div className="content">
          <div className="row">
            <div className="col-12">
              <h2 className="text-bold text-dark pl-3">{Localization.book}</h2>
              <BtnLoader
                loading={false}
                disabled={false}
                btnClassName="btn btn-success shadow-default shadow-hover mb-4"
                onClick={() => this.gotoBookCreate()}
              >
                {Localization.new}
              </BtnLoader>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="template-box mb-4">
                <div className="row">
                  <div className="col-sm-6 col-xl-4">
                    <Input
                      onChange={(value: string, isValid) => this.handleFilterInputChange(value, isValid)}
                      label={Localization.title}
                      placeholder={Localization.title}
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
                        onKeyDown={(e) => this.handle_tagsKeyDown(e)}
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
              <Table loading={this.state.tableProcessLoader} list={this.state.book_table.list} colHeaders={this.state.book_table.colHeaders} actions={this.state.book_table.actions}></Table>
              <div>
                {this.pager_previous_btn_render()}
                {this.pager_next_btn_render()}
              </div>
            </div>
          </div>
        </div>
        {this.render_delete_modal(this.selectedBook)}
        {this.render_price_modal(this.selectedBook)}
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

export const BookManage = connect(
  state2props,
  dispatch2props
)(BookManageComponent);