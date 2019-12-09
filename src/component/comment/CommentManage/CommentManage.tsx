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
import { BOOK_TYPES } from "../../../enum/Book";
import { CommentService } from "../../../service/service.comment";
import { IComment } from "../../../model/model.comment";
import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import { AccessService } from "../../../service/service.access";
import { IPerson } from "../../../model/model.person";
import { IBook } from "../../../model/model.book";
import { BookService } from "../../../service/service.book";
import { PersonService } from "../../../service/service.person";
import AsyncSelect from 'react-select/async';
import { AppNumberRange } from "../../form/app-numberRange/app-numberRange";
import { AppRangePicker } from "../../form/app-rangepicker/AppRangePicker";

/// define props & state ///////
export interface IProps {
  history: History;
  internationalization: TInternationalization;
  // token: IToken;
}

interface IFilterComment {
  comment: {
    value: string | undefined,
    isValid: boolean
  };
  book: {
    value: { label: string, value: IBook } | null;
    book_id: string | undefined;
    is_valid: boolean,
  };
  user: {
    value: string | undefined,
    isValid: boolean
  };
  person: {
    value: { label: string, value: IPerson } | null;
    person_id: string | undefined;
    is_valid: boolean,
  };
  likes: {
    from: number | undefined,
    from_isValid: boolean,
    to: number | undefined,
    to_isValid: boolean,
    is_valid: boolean,
  };
  reports: {
    from: number | undefined,
    from_isValid: boolean,
    to: number | undefined,
    to_isValid: boolean,
    is_valid: boolean,
  };
  cr_date: {
    from: number | undefined,
    from_isValid: boolean,
    to: number | undefined,
    to_isValid: boolean,
    is_valid: boolean,
  };
}

interface IState {
  comment_table: IProps_table;
  CommentError: string | undefined;
  pager_offset: number;
  pager_limit: number;
  removeModalShow: boolean;
  commentModalShow: boolean;
  prevBtnLoader: boolean;
  nextBtnLoader: boolean;
  filterSearchBtnLoader: boolean;
  tableProcessLoader: boolean;
  setRemoveLoader: boolean;
  filter_state: IFilterComment;
  advance_search_box_show: boolean;
}

// define class of Comment 
class CommentManageComponent extends BaseComponent<IProps, IState>{
  state = {
    comment_table: {
      list: [],
      colHeaders: [
        {
          field: "creator", title: Localization.user, cellTemplateFunc: (row: IComment) => {
            if (row.creator) {
              return <div title={row.creator} className="text-nowrap-ellipsis max-w-100px d-inline-block">
                {row.creator}
              </div>
            }
            return '';
          }
        },
        {
          field: "name last_name", title: Localization.full_name, cellTemplateFunc: (row: IComment) => {
            if (row.person) {
              return <div title={this.getPersonFullName(row.person)} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {this.getPersonFullName(row.person)}
              </div>
            }
            return '';
          }
        },
        {
          field: "body", title: Localization.comment, cellTemplateFunc: (row: IComment) => {
            if (row.person) {
              return <div title={row.body} className="text-nowrap-ellipsis max-w-200px d-inline-block">
                {row.body}
              </div>
            }
            return '';
          }
        },
        {
          field: "creation_date", title: Localization.creation_date,
          cellTemplateFunc: (row: IComment) => {
            if (row.creation_date) {
              return <div title={this._getTimestampToDate(row.creation_date)}>{this.getTimestampToDate(row.creation_date)}</div>
            }
            return '';
          }
        },
        {
          field: "book title", title: Localization.book_title, cellTemplateFunc: (row: IComment) => {
            if (row.book && row.book.title) {
              return <div title={row.book.title} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.book.title}
              </div>
            }
            return '';
          }
        },
        {
          field: "likes", title: Localization.number_of_likes, cellTemplateFunc: (row: IComment) => {
            if (row.likes) {
              return <div title={row.likes.toLocaleString()} className="text-center">
                {row.likes}{
                  row.liked_by_user
                    ?
                    <span> - <i title={Localization.liked_by_user} className="fa fa-check text-success"></i></span>
                    :
                    ""
                }
              </div>
            }
            else {
              return <div className="text-muted text-center">-</div>;
            }
          }
        },
        {
          field: "reports", title: Localization.number_of_reports, cellTemplateFunc: (row: IComment) => {
            if (row.reports) {
              return <div title={row.reports.toLocaleString()} className="text-center">
                {row.reports}{
                  row.reported_by_user
                    ?
                    <span> - <i title={Localization.reported_by_user} className="fa fa-check text-danger"></i></span>
                    :
                    ""
                }
              </div>
            }
            else {
              return <div className="text-muted text-center">-</div>;
            }
          }
        },
        {
          field: "book images", title: Localization.book_image, templateFunc: () => {
            return <b>{Localization.images}</b>
          },
          cellTemplateFunc: (row: IComment) => {
            if (row.book && row.book.images) {
              return <div className="text-center" >
                <div className="d-inline-block w-50px h-50px">
                  <img className="max-w-50px max-h-50px" src={"/api/serve-files/" + row.book.images[0]} alt="" onError={e => this.bookImageOnError(e)} />
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
          field: "book type", title: Localization.book_type, cellTemplateFunc: (row: IComment) => {
            if (row.book && row.book.type) {
              const b_type: any = row.book.type;
              const b_t: BOOK_TYPES = b_type;
              return Localization.book_type_list[b_t];
            }
            else {
              return <div className="text-muted text-center">-</div>;
            }
          }
        },
      ],
      actions: this.checkAllAccess() ? [
        {
          access: (row: any) => { return this.checkDeleteToolAccess() },
          text: <i title={Localization.remove} className="fa fa-trash text-danger"></i>,
          ac_func: (row: any) => { this.onShowRemoveModal(row) },
          name: Localization.remove
        },
        {
          access: (row: any) => { return this.checkShowToolAccess() },
          text: <i title={Localization.show_comment} className="fa fa-eye text-info"></i>,
          ac_func: (row: any) => { this.onShowCommentModal(row) },
          name: Localization.show_comment
        },
      ]
        :
        undefined
    },
    CommentError: undefined,
    pager_offset: 0,
    pager_limit: 10,
    prevBtnLoader: false,
    nextBtnLoader: false,
    filterSearchBtnLoader: false,
    tableProcessLoader: false,
    removeModalShow: false,
    commentModalShow: false,
    setRemoveLoader: false,
    filter_state: {
      comment: {
        value: undefined,
        isValid: false
      },
      book: {
        value: null,
        book_id: undefined,
        is_valid: false,
      },
      user: {
        value: undefined,
        isValid: false
      },
      person: {
        value: null,
        person_id: undefined,
        is_valid: false,
      },
      likes: {
        from: undefined,
        from_isValid: false,
        to: undefined,
        to_isValid: false,
        is_valid: false,
      },
      reports: {
        from: undefined,
        from_isValid: false,
        to: undefined,
        to_isValid: false,
        is_valid: false,
      },
      cr_date: {
        from: undefined,
        from_isValid: false,
        to: undefined,
        to_isValid: false,
        is_valid: false,
      },
    },
    advance_search_box_show: false,
  }

  selectedComment: IComment | undefined;
  private _commentService = new CommentService();
  private _bookService = new BookService();
  private _personService = new PersonService();

  // constructor(props: IProps) {
  //   super(props);
  //   // this._commentService.setToken(this.props.token)
  // }


  // timestamp to date 

  componentDidMount() {
    if (this.checkPageRenderAccess()) {
      if (AccessService.checkAccess('COMMENT_GET_PREMIUM')) {
        this.setState({
          ...this.state,
          tableProcessLoader: true
        })
        this.fetchComments();
      }
    } else {
      this.noAccessRedirect(this.props.history);
    }
  }

  checkPageRenderAccess(): boolean {
    if (AccessService.checkAccess('COMMENT_GET_PREMIUM')) {
      return true;
    }
    return false;
  }

  checkAllAccess(): boolean {
    if (AccessService.checkOneOFAllAccess(['COMMENT_GET_PREMIUM', 'COMMENT_DELETE_PREMIUM'])) {
      return true;
    }
    return false;
  }

  checkDeleteToolAccess(): boolean {
    if (AccessService.checkAccess('COMMENT_DELETE_PREMIUM')) {
      return true;
    }
    return false
  }

  checkShowToolAccess(): boolean {
    if (AccessService.checkAccess('COMMENT_GET_PREMIUM')) {
      return true;
    }
    return false
  }


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

  // comment show modal function define

  onShowCommentModal(comment: IComment) {
    this.selectedComment = comment;
    this.setState({ ...this.state, commentModalShow: true });
  }

  onHideCommentModal() {
    this.selectedComment = undefined;
    this.setState({ ...this.state, commentModalShow: false });
  }

  render_comment_show_modal(selectedComment: any) {
    if (!this.selectedComment || !this.selectedComment.id) return;
    return (
      <>
        <Modal show={this.state.commentModalShow} onHide={() => this.onHideCommentModal()}>
          <Modal.Body>
            <p className="show-modal-content-wrapper" >
              <div>
                <span>
                  <span className="text-muted">{Localization.user}:&nbsp;</span>{this.selectedComment.creator}
                </span>
              </div>
              <div>
                <span>
                  <span className="text-muted">{Localization.full_name}:&nbsp;</span>{this.getUserFullName(this.selectedComment.person)}
                </span>
              </div>
              <div>
                <span>
                  <span className="text-muted">{Localization.book_title}:&nbsp;</span><span>{(this.selectedComment.book! || {}).title}</span>
                </span>
              </div>
              <span className="text-muted">
                {Localization.comment}:&nbsp;
              </span>
              <p className="border border-dark rounded show-modal-content p-2">
                {this.selectedComment.body}
              </p>
              <div>
                <span>
                  <span className="text-muted">{Localization.number_of_likes}:&nbsp;</span><span className="text-success">{this.selectedComment.likes}</span>
                </span>
              </div>
              <div>
                <span>
                  <span className="text-muted">{Localization.number_of_reports}:&nbsp;</span><span className="text-danger">{this.selectedComment.reports}</span>
                </span>
              </div>
              <div>
                <span>
                  <span className="text-muted">{Localization.liked_by_user}:&nbsp;</span>
                  {
                    this.selectedComment.liked_by_user
                      ?
                      <i title={Localization.liked_by_user} className="fa fa-check text-success"></i>
                      :
                      ""
                  }
                </span>
              </div>
              <div>
                <span>
                  <span className="text-muted">{Localization.reported_by_user}:&nbsp;</span>
                  {
                    this.selectedComment.reported_by_user
                      ?
                      <i title={Localization.liked_by_user} className="fa fa-check text-danger"></i>
                      :
                      ""
                  }
                </span>
              </div>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideCommentModal()}>{Localization.close}</button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }


  // delete modal function define

  onShowRemoveModal(comment: IComment) {
    this.selectedComment = comment;
    this.setState({ ...this.state, removeModalShow: true });
  }

  onHideRemoveModal() {
    this.selectedComment = undefined;
    this.setState({ ...this.state, removeModalShow: false });
  }

  async onRemoveComment(comment_id: string) {
    this.setState({ ...this.state, setRemoveLoader: true });
    let res = await this._commentService.remove(comment_id).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'onRemoveComment_error' } });
      this.setState({ ...this.state, setRemoveLoader: false });
    });
    if (res) {
      this.setState({ ...this.state, setRemoveLoader: false });
      this.apiSuccessNotify();
      this.fetchComments();
      this.onHideRemoveModal();
    }
  }

  render_delete_modal(selectedComment: any) {
    if (!this.selectedComment || !this.selectedComment.id) return;
    return (
      <>
        <Modal show={this.state.removeModalShow} onHide={() => this.onHideRemoveModal()}>
          <Modal.Body>
            <p className="delete-modal-content" >
              <span className="text-muted">
                {Localization.comment}:&nbsp;
            </span>
              {this.selectedComment.body}
            </p>
            <p className="text-danger">{Localization.msg.ui.item_will_be_removed_continue}</p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideRemoveModal()}>{Localization.close}</button>
            <BtnLoader
              btnClassName="btn btn-danger shadow-default shadow-hover"
              onClick={() => this.onRemoveComment(selectedComment.id)}
              loading={this.state.setRemoveLoader}
            >
              {Localization.remove}
            </BtnLoader>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  // define axios for give data

  private _searchFilter: any | undefined;
  private get_searchFilter() {
    return this._searchFilter;
  }
  private set_searchFilter() {
    const obj: any = {};

    if (this.state.filter_state.comment.isValid) {
      obj['body'] = { $prefix: this.state.filter_state.comment.value };
    }

    if (this.state.filter_state.book.is_valid) {
      obj['book_id'] = { $eq: this.state.filter_state.book.book_id };
    }

    if (this.state.filter_state.user.isValid) {
      obj['creator'] = { $prefix: this.state.filter_state.user.value };
    }

    if (this.state.filter_state.person.is_valid) {
      obj['person_id'] = { $eq: this.state.filter_state.person.person_id };
    }

    if (this.state.filter_state.likes.is_valid === true) {
      if (this.state.filter_state.likes.from_isValid === true && this.state.filter_state.likes.to_isValid === true) {
        obj['likes'] = { $gte: this.state.filter_state.likes.from, $lte: this.state.filter_state.likes.to }
      } else if (this.state.filter_state.likes.from_isValid === true && this.state.filter_state.likes.to_isValid === false) {
        obj['likes'] = { $gte: this.state.filter_state.likes.from }
      } else if (this.state.filter_state.likes.from_isValid === false && this.state.filter_state.likes.to_isValid === true) {
        obj['likes'] = { $lte: this.state.filter_state.likes.to }
      }
    }

    if (this.state.filter_state.reports.is_valid === true) {
      if (this.state.filter_state.reports.from_isValid === true && this.state.filter_state.reports.to_isValid === true) {
        obj['reports'] = { $gte: this.state.filter_state.reports.from, $lte: this.state.filter_state.reports.to }
      } else if (this.state.filter_state.reports.from_isValid === true && this.state.filter_state.reports.to_isValid === false) {
        obj['reports'] = { $gte: this.state.filter_state.reports.from }
      } else if (this.state.filter_state.reports.from_isValid === false && this.state.filter_state.reports.to_isValid === true) {
        obj['reports'] = { $lte: this.state.filter_state.reports.to }
      }
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
      this.fetchComments()
    });
  }

  async fetchComments() {
    this.setState({ ...this.state, tableProcessLoader: true });
    let res = await this._commentService.search(
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
        ...this.state, comment_table: {
          ...this.state.comment_table,
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
    if (this.state.comment_table.list && (this.state.comment_table.list! || []).length) {
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
    } else if (this.state.comment_table.list && !(this.state.comment_table.list! || []).length) {
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

    } else if (this.state.CommentError) {
      return;
    } else {
      return;
    }
  }

  // next button create

  pager_next_btn_render() {
    if (this.state.comment_table.list && (this.state.comment_table.list! || []).length) {
      return (
        <>
          {
            !(this.state.pager_limit > (this.state.comment_table.list! || []).length) &&
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
    } else if (this.state.comment_table.list && !(this.state.comment_table.list! || []).length) {
      return;
    } else if (this.state.comment_table.list) {
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
      this.fetchComments()
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
      this.fetchComments()
    });
  }

  /////  start onChange & search & reset function for search box ///////////

  filter_state_reset() {
    this.setState({
      ...this.state,
      filter_state: {
        comment: {
          value: undefined,
          isValid: false
        },
        book: {
          value: null,
          book_id: undefined,
          is_valid: false,
        },
        user: {
          value: undefined,
          isValid: false
        },
        person: {
          value: null,
          person_id: undefined,
          is_valid: false,
        },
        likes: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
        reports: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
        cr_date: {
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
        comment: {
          value: undefined,
          isValid: false
        },
        book: {
          value: null,
          book_id: undefined,
          is_valid: false,
        },
        user: {
          value: undefined,
          isValid: false
        },
        person: {
          value: null,
          person_id: undefined,
          is_valid: false,
        },
        likes: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
        reports: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
        cr_date: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
      }
    })
  }

  handleBookChange = (selectedBook: { label: string, value: IBook }) => {
    let newbook = { ...selectedBook };
    let isValid = true;      // newperson = selectedPerson;
    this.setState({
      ...this.state,
      filter_state: {
        ...this.state.filter_state,
        book: {
          value: newbook,
          book_id: newbook.value.id,
          is_valid: isValid,
        }
      }
    })
  }

  book_in_search_remover() {
    this.setState({
      ...this.state,
      filter_state: {
        ...this.state.filter_state,
        book: {
          value: null,
          book_id: undefined,
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

  /////  end onChange & search & reset function for search box ///////////


  ////// start request for options person of press in filter  ////////

  private bookRequstError_txt: string = Localization.no_item_found;

  async promiseOptions2_book_search(inputValue: any, callBack: any) {
    let filter = undefined;
    if (inputValue) {
      filter = { title: { $prefix: inputValue } };
    }
    let res: any = await this._bookService.search(10, 0, filter).catch(err => {
      let err_msg = this.handleError({ error: err.response, notify: false, toastOptions: { toastId: 'bookSearch_in_comment_error' } });
      this.bookRequstError_txt = err_msg.body;
    });

    if (res) {
      let books = res.data.result.map((ps: any) => {
        const b_type: any = ps.type;
        const b_t: BOOK_TYPES = b_type;
        let type = Localization.book_type_list[b_t];
        return { label: ps.title + " - " + type, value: ps }
      });
      this.bookRequstError_txt = Localization.no_item_found;
      callBack(books);
    } else {
      callBack();
    }
  }

  private setTimeout_book_val: any;
  debounce_300_book_search(inputValue: any, callBack: any) {
    if (this.setTimeout_book_val) {
      clearTimeout(this.setTimeout_book_val);
    }
    this.setTimeout_person_val = setTimeout(() => {
      this.promiseOptions2_book_search(inputValue, callBack);
    }, 1000);
  }

  select_noOptionsMessage_book_search(obj: { inputValue: string }) {
    return this.bookRequstError_txt;
  }



  private personRequstError_txt: string = Localization.no_item_found;

  async promiseOptions2_person_search(inputValue: any, callBack: any) {
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
  debounce_300_person_search(inputValue: any, callBack: any) {
    if (this.setTimeout_person_val) {
      clearTimeout(this.setTimeout_person_val);
    }
    this.setTimeout_person_val = setTimeout(() => {
      this.promiseOptions2_person_search(inputValue, callBack);
    }, 1000);
  }

  select_noOptionsMessage_person_search(obj: { inputValue: string }) {
    return this.personRequstError_txt;
  }

  ///////////// end request for options person of press in filter ////////////////////////

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
              <h2 className="text-bold text-dark pl-3">{Localization.comment}</h2>
            </div>
          </div>
          {
            AccessService.checkAccess('COMMENT_GET_PREMIUM')
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
                            onChange={(value, isValid) => this.handleInputChange(value, 'comment')}
                            label={Localization.comment}
                            placeholder={Localization.comment}
                            defaultValue={this.state.filter_state.comment.value}
                          />
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <label >{Localization.book}</label>
                          <i
                            title={Localization.reset}
                            className="fa fa-times cursor-pointer remover-in_box-async text-danger mx-1"
                            onClick={() => this.book_in_search_remover()}
                          ></i>
                          <AsyncSelect
                            placeholder={Localization.book}
                            cacheOptions
                            defaultOptions
                            value={this.state.filter_state.book.value}
                            loadOptions={(inputValue, callback) => this.debounce_300_book_search(inputValue, callback)}
                            noOptionsMessage={(obj) => this.select_noOptionsMessage_book_search(obj)}
                            onChange={(selectedBook: any) => this.handleBookChange(selectedBook)}
                          />
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <Input
                            onChange={(value, isValid) => this.handleInputChange(value, 'user')}
                            label={Localization.user}
                            placeholder={Localization.user}
                            defaultValue={this.state.filter_state.user.value}
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
                            loadOptions={(inputValue, callback) => this.debounce_300_person_search(inputValue, callback)}
                            noOptionsMessage={(obj) => this.select_noOptionsMessage_person_search(obj)}
                            onChange={(selectedPerson: any) => this.handlePersonChange(selectedPerson)}
                          />
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <AppNumberRange
                            label={Localization.number_of_likes}
                            from={this.state.filter_state.likes.from}
                            to={this.state.filter_state.likes.to}
                            onChange={(from, from_isValid, to, to_isValid, isValid) => this.range_picker_onChange(from, from_isValid, to, to_isValid, isValid, 'likes')}
                          />
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <AppNumberRange
                            label={Localization.number_of_reports}
                            from={this.state.filter_state.reports.from}
                            to={this.state.filter_state.reports.to}
                            onChange={(from, from_isValid, to, to_isValid, isValid) => this.range_picker_onChange(from, from_isValid, to, to_isValid, isValid, 'reports')}
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
                    <Table row_offset_number={this.state.pager_offset} loading={this.state.tableProcessLoader} list={this.state.comment_table.list} colHeaders={this.state.comment_table.colHeaders} actions={this.state.comment_table.actions}></Table>
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
        {this.render_delete_modal(this.selectedComment)}
        {this.render_comment_show_modal(this.selectedComment)}
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

export const CommentManage = connect(
  state2props,
  dispatch2props
)(CommentManageComponent);