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

/// define props & state ///////
export interface IProps {
  history: History;
  internationalization: TInternationalization;
  token: IToken;
}
interface IState {
  book_table: IProps_table;
  BookError: string | undefined;
  pager_offset: number;
  pager_limit: number;
  removeModalShow: boolean;
  prevBtnLoader: boolean;
  nextBtnLoader: boolean;
  priceModalShow: boolean;
  price: {
    value: number | undefined;
    isValid: boolean;
  },
  setRemoveLoader: boolean;
  setPriceLoader: boolean;
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
              return <div title={row.title} className=" d-inline-block" style={{
                maxWidth: '200px',
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }} >
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
                <div className="d-inline-block" style={{ width: '100px', height: '100px' }}>
                  <img src={"/api/serve-files/" + row.images[0]} alt=""
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                    onError={e => this.bookImageOnError(e)} />
                </div>
              </div>
            }
            else {
              return <div className="text-center">
                <div className="d-inline-block" style={{ width: '100px', height: '100px' }}>
                  <img src={this.defaultBookImagePath} alt="" style={{ maxWidth: '100px', maxHeight: '100px' }} />
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
              return <div title={row.description} className="text-right d-inline-block" style={{
                maxWidth: '100px',
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }} >
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
        { field: "duration", title: Localization.duration },
        { field: "pub_year", title: Localization.publication_date },
      ],
      actions: [
        { text: <i title={Localization.remove} className="table-action-shadow-hover fa fa-trash text-danger pt-2 mt-1"></i>, ac_func: (row: any) => { this.onShowRemoveModal(row) } },
        { text: <i title={Localization.update} className="table-action-shadow-hover fa fa-pencil-square-o text-info pt-2"></i>, ac_func: (row: any) => { this.updateRow(row) } },
        { text: <i title={Localization.Pricing} className="table-action-shadow-hover fa fa-money text-success pt-2"></i>, ac_func: (row: any) => { this.onShowPriceModal(row) } },
      ]
    },
    BookError: undefined,
    pager_offset: 0,
    pager_limit: 5,
    prevBtnLoader: false,
    nextBtnLoader: false,
    removeModalShow: false,
    priceModalShow: false,
    price: {
      value: undefined,
      isValid: false,
    },
    setRemoveLoader: false,
    setPriceLoader: false
  }

  selectedBook: IBook | undefined;
  private _bookService = new BookService();
  private _priceService = new PriceService();



  updateRow(book_id: any) {
    this.props.history.push(`/book/${book_id.id}/edit`);
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
            <p style={{ maxWidth: '200px', whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} >
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
            <p style={{ maxWidth: '200px', whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} >
              <span className="text-muted">
                {Localization.title}:
              </span>
              {this.selectedBook.title}
            </p>
            <Input
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


  componentDidMount() {
    this.fetchBooks();
  }

  async fetchBooks() {
    let res = await this._bookService.search(this.state.pager_limit, this.state.pager_offset).catch(error => {
      this.handleError({ error: error.response });
      this.setState({
        ...this.state,
        prevBtnLoader: false,
        nextBtnLoader: false,
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
      prevBtnLoader: true
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
      nextBtnLoader: true
    }, () => {
      this.gotoTop();
      this.fetchBooks()
    });
  }


  ///// navigation function //////

  gotoBookCreate() {
    this.props.history.push('/book/create'); // /admin
  }

  //////render call Table component //////

  render() {
    return (
      <>
        <div className="content">
          <div className="row">
            <h2 className="text-bold text-dark pl-3">{Localization.book_manage}</h2>
            <div className="col-12">
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
              <Table list={this.state.book_table.list} colHeaders={this.state.book_table.colHeaders} actions={this.state.book_table.actions}></Table>
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
    token: state.token,
  };
};

export const BookManage = connect(
  state2props,
  dispatch2props
)(BookManageComponent);