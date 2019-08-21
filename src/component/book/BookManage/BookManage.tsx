import React from "react";
// import { IPerson } from "../model/model.person";
import { Table, IProps_table } from "../../table/table"
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




//  define props & state and type 

// export interface IBook {
//   last_name: number;
//   username: string;
//   id: string;
//   person?: IPerson;
// }

export interface IProps {
  history: History;
  internationalization: TInternationalization;
  token: IToken;
}


interface IState {
  // userlist: any[];//IBook
  // colHeaders: any[]//Table header
  book_table: IProps_table;
  BookError: string | undefined;
  pager_offset: number;
  pager_limit: number;
  removeModalShow: boolean;
  prevBtnLoader: boolean;
  nextBtnLoader: boolean;
}




// define class of Book 

class BookManageComponent extends BaseComponent<IProps, IState>{

  state = {
    book_table: {
      list: [],
      colHeaders: [
        {field: "title", title: Localization.title, cellTemplateFunc: (row: IBook) => {
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
        {field: "images", title: Localization.images, templateFunc: () => {
            return <b>{Localization.images}</b>
          },
          cellTemplateFunc: (row: IBook) => {
            if (row.images && row.images.length) {
              return <div className="text-center" >
                <div className="d-inline-block" style={{ width: '100px', height: '100px' }}>
                  <img src={"/api/serve-files/" + row.images[0]} alt="" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                </div>
              </div>
            }
            else {
              return <div className="text-center">
                <div className="d-inline-block" style={{ width: '100px', height: '100px' }}>
                  <img src="/static/media/img/icon/no-image.png" alt="" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                </div>
              </div>
            }
          }
        },
        {field: "type", title: Localization.type,
            cellTemplateFunc: (row: IBook) => {
              if (row.type) {
                const b_type: any = row.type;
                const b_t: BOOK_TYPES = b_type;
                return Localization.book_type_list[b_t];
              }
              return '';
              }
        },
        { field: "price", title: Localization.price,
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
        } },
        {field: "description", title: Localization.description, 
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
        {field: "rate",
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
        { text: <div className="text-center p-0 m-0"><i className="fa fa-trash text-danger fa-2x"></i></div>, ac_func: (row: any) => { this.onShowRemoveModal(row) } },
        { text: <div className="text-center p-0 m-0"><i className="fa fa-pencil-square-o text-info fa-2x"></i></div>, ac_func: (row: any) => { this.updateRow(row) } },
      ]
    },
    BookError: undefined,
    pager_offset: 0,
    pager_limit: 5,
    removeModalShow: false,
    prevBtnLoader: false,
    nextBtnLoader: false,
  }

  selectedBook: IBook | undefined;



  updateRow(book_id: any) {
    // this.props.history.push(`/admin/book/${book_id.id}/edit`);
    this.props.history.push(`/book/${book_id.id}/edit`);
  }


  // delete modal function define

  onShowRemoveModal(book: IBook) {
    this.selectedBook = book;
    // debugger;
    this.setState({ ...this.state, removeModalShow: true });
  }

  onHideRemoveModal() {
    this.selectedBook = undefined;
    this.setState({ ...this.state, removeModalShow: false });

  }

  async onRemoveBook(book_id: string) {
    let res = await this._bookService.remove(book_id).catch(error => {
      // debugger;
      //notify
      this.handleError({ error: error });
    });

    if (res) {
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
          {/* <Modal.Header closeButton>
            <Modal.Title>Do you want delete {this.selectedBook.title} ?</Modal.Title>
          </Modal.Header> */}
          <Modal.Body>
            <p><span className="text-muted">{Localization.title}:</span> {this.selectedBook.title}</p>
            <p className="text-danger">{Localization.msg.ui.item_will_be_removed_continue}</p>
            {/* <h3 className="text-dark">Book details :</h3> */}
            {/* <h6 className="text-dark">Edition : {this.selectedBook.edition}</h6>
            <h6 className="text-dark">Language : {this.selectedBook.language}</h6>
            <h6 className="text-dark">Pages : {this.selectedBook.pages}</h6>
            <h6 className="text-dark">Publish's year :{this.selectedBook.pub_year}</h6>
            <h6 className="text-dark">Description :{this.selectedBook.description}</h6> */}
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light" onClick={() => this.onHideRemoveModal()}>{Localization.close}</button>
            <button className="btn btn-danger" onClick={() => this.onRemoveBook(selectedBook.id)}>{Localization.remove}</button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }





  // define axios for give data

  _bookService = new BookService();

  componentDidMount() {
    this.fetchBooks();
    // this.fetchOneBook('4c64a437-0740-4be9-b836-5453ac93f05d');
  }


  async fetchBooks() {
    // debugger;

    let res = await this._bookService.search(this.state.pager_limit, this.state.pager_offset).catch(error => {
      // debugger;
      //notify
      this.handleError({ error: error });
      this.setState({
        ...this.state,
        prevBtnLoader: false,
        nextBtnLoader: false,
      });
    });

    if (res) {
      // debugger;
      // const booklist = res.data;
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



  /* async fetchOneBook(bookId: string) {
    // let oneBook = await this._bookService.bookById(bookId).catch(oneBook => { debugger })  
    await this._bookService.bookById(bookId).catch(() => { debugger })
  } */




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
      // this.gotoTop();
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
      // this.gotoTop();
      this.fetchBooks()
    });
  }



  // async fetchtableBooks() {
  //   this.setState({ ...this.state, BookError: undefined });
  //   let searchRequest;
  //   searchRequest = this._bookService.search(this.state.pager_limit,this.state.pager_offset).catch(error => {
  //     debugger;
  //     //notify
  //   })
  // }





  // link on button  for create book

  gotoBookCreate() {
    this.props.history.push('/book/create'); // /admin
  }


  //   call Table component 

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
        <ToastContainer {...this.getNotifyContainerConfig()} />
      </>
    );
  }
}
// export default Book


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