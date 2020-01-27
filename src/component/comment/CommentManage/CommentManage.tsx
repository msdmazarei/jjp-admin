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
import { IPerson } from "../../../model/model.person";
import { IBook } from "../../../model/model.book";
import { BookService } from "../../../service/service.book";
import { PersonService } from "../../../service/service.person";
import AsyncSelect from 'react-select/async';
import { AppNumberRange } from "../../form/app-numberRange/app-numberRange";
import { AppRangePicker } from "../../form/app-rangepicker/AppRangePicker";
import { TABLE_SORT } from "../../table/tableSortHandler";
import { SORT } from "../../../enum/Sort";
import { RetryModal } from "../../tool/retryModal/retryModal";
import { permissionChecker } from "../../../asset/script/accessControler";
import { T_ITEM_NAME, CHECKTYPE, CONDITION_COMBINE } from "../../../enum/T_ITEM_NAME";
import { DeleteModal } from "../../tool/deleteModal/deleteModal";
import { CommentShowModal } from "../CommentShowModal/CommentShowModal";


/// define props & state ///////
export interface IProps {
  match: any;
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

interface ISortComment {
  creator: boolean;
  body: boolean;
  creation_date: boolean;
  likes: boolean;
  reports: boolean;
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
  sort: string[];
  sortShowStyle: ISortComment;
  is_wizard: boolean;
  retryModal: boolean;
}

// define class of Comment 
class CommentManageComponent extends BaseComponent<IProps, IState>{
  state = {
    comment_table: {
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
          cellTemplateFunc: (row: IComment) => {
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
          field: "body", title: Localization.comment,
          templateFunc: () => {
            return <>
              {Localization.comment}
              {
                (this.is_this_sort_exsit_in_state(SORT.body) === false && this.is_this_sort_exsit_in_state(SORT.body_) === false)
                  ?
                  <span
                    className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                    onClick={() => this.sort_handler_func(SORT.body, SORT.body_, true, 1)}
                    onMouseOver={() => this.sort_icon_change_on_mouse_over_out('body', true)}
                    onMouseOut={() => this.sort_icon_change_on_mouse_over_out('body', false)}>
                    <i className={this.state.sortShowStyle.body === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                  </span>
                  :
                  this.is_this_sort_exsit_in_state(SORT.body) === true
                    ?
                    <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                      onClick={() => this.sort_handler_func(SORT.body_, SORT.body, false, 0)}
                      onMouseOver={() => this.sort_icon_change_on_mouse_over_out('body', true)}
                      onMouseOut={() => this.sort_icon_change_on_mouse_over_out('body', false)}>
                      <i className={this.state.sortShowStyle.body === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                    </span>
                    :
                    this.is_this_sort_exsit_in_state(SORT.body_) === true
                      ?
                      <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                        onClick={() => this.sort_handler_func(SORT.body_, SORT.body, true, 2)}
                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('body', true)}
                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('body', false)}>
                        <i className={this.state.sortShowStyle.body === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                      </span>
                      :
                      undefined
              }
            </>
          },
          cellTemplateFunc: (row: IComment) => {
            if (row.body) {
              return <div title={row.body} className="text-nowrap-ellipsis max-w-200px d-inline-block">
                {row.body}
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
          field: "likes", title: Localization.number_of_likes,
          templateFunc: () => {
            return <>
              {Localization.number_of_likes}
              {
                (this.is_this_sort_exsit_in_state(SORT.likes) === false && this.is_this_sort_exsit_in_state(SORT.likes_) === false)
                  ?
                  <span
                    className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                    onClick={() => this.sort_handler_func(SORT.likes, SORT.likes_, true, 1)}
                    onMouseOver={() => this.sort_icon_change_on_mouse_over_out('likes', true)}
                    onMouseOut={() => this.sort_icon_change_on_mouse_over_out('likes', false)}>
                    <i className={this.state.sortShowStyle.likes === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                  </span>
                  :
                  this.is_this_sort_exsit_in_state(SORT.likes) === true
                    ?
                    <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                      onClick={() => this.sort_handler_func(SORT.likes_, SORT.likes, false, 0)}
                      onMouseOver={() => this.sort_icon_change_on_mouse_over_out('likes', true)}
                      onMouseOut={() => this.sort_icon_change_on_mouse_over_out('likes', false)}>
                      <i className={this.state.sortShowStyle.likes === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                    </span>
                    :
                    this.is_this_sort_exsit_in_state(SORT.likes_) === true
                      ?
                      <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                        onClick={() => this.sort_handler_func(SORT.likes_, SORT.likes, true, 2)}
                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('likes', true)}
                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('likes', false)}>
                        <i className={this.state.sortShowStyle.likes === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                      </span>
                      :
                      undefined
              }
            </>
          },
          cellTemplateFunc: (row: IComment) => {
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
          field: "reports", title: Localization.number_of_reports,
          templateFunc: () => {
            return <>
              {Localization.number_of_reports}
              {
                (this.is_this_sort_exsit_in_state(SORT.reports) === false && this.is_this_sort_exsit_in_state(SORT.reports_) === false)
                  ?
                  <span
                    className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                    onClick={() => this.sort_handler_func(SORT.reports, SORT.reports_, true, 1)}
                    onMouseOver={() => this.sort_icon_change_on_mouse_over_out('reports', true)}
                    onMouseOut={() => this.sort_icon_change_on_mouse_over_out('reports', false)}>
                    <i className={this.state.sortShowStyle.reports === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                  </span>
                  :
                  this.is_this_sort_exsit_in_state(SORT.reports) === true
                    ?
                    <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                      onClick={() => this.sort_handler_func(SORT.reports_, SORT.reports, false, 0)}
                      onMouseOver={() => this.sort_icon_change_on_mouse_over_out('reports', true)}
                      onMouseOut={() => this.sort_icon_change_on_mouse_over_out('reports', false)}>
                      <i className={this.state.sortShowStyle.reports === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                    </span>
                    :
                    this.is_this_sort_exsit_in_state(SORT.reports_) === true
                      ?
                      <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                        onClick={() => this.sort_handler_func(SORT.reports_, SORT.reports, true, 2)}
                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('reports', true)}
                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('reports', false)}>
                        <i className={this.state.sortShowStyle.reports === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                      </span>
                      :
                      undefined
              }
            </>
          },
          cellTemplateFunc: (row: IComment) => {
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
      actions: permissionChecker.is_allow_item_render([T_ITEM_NAME.commentManageAllTools], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) ? [
        {
          access: (row: any) => { return permissionChecker.is_allow_item_render([T_ITEM_NAME.commentManageDeleteTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) },
          text: <i title={Localization.remove} className="fa fa-trash text-danger"></i>,
          ac_func: (row: any) => { this.onShowRemoveModal(row) },
          name: Localization.remove
        },
        {
          access: (row: any) => { return permissionChecker.is_allow_item_render([T_ITEM_NAME.commentManageShowCommentTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) },
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
    sort: [],
    sortShowStyle: {
      creator: false,
      body: false,
      creation_date: false,
      likes: false,
      reports: false,
    },
    is_wizard: false,
    retryModal: false,
  }

  selectedComment: IComment | undefined;
  private _commentService = new CommentService();
  private _bookService = new BookService();
  private _personService = new PersonService();
  private book_id: string | undefined;

  // constructor(props: IProps) {
  //   super(props);
  //   // this._commentService.setToken(this.props.token)
  // }


  // timestamp to date 

  componentDidMount() {
    if (this.props.match.path.includes('/comment/:book_id/wizard')) {
      this.setState({ ...this.state, is_wizard: true, advance_search_box_show: true });
      this.book_id = this.props.match.params.book_id;
      if (this.book_id === undefined) { return };
      this.fetchBookById_wizard(this.book_id);
    } else if (permissionChecker.is_allow_item_render([T_ITEM_NAME.commentManage], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true) {
      this.setState({
        ...this.state,
        tableProcessLoader: true
      })
      TABLE_SORT.sortArrayReseter();
      this.fetchComments();
    } else {
      this.noAccessRedirect(this.props.history);
    };
  }

  sort_handler_func(comingType: string, reverseType: string, is_just_add_or_remove: boolean, typeOfSingleAction: number) {
    if (is_just_add_or_remove === false) {
      TABLE_SORT.coming_field_name_by_sortType_and_that_reverseType_exist_in_sortArray(comingType, reverseType);
    }
    if (is_just_add_or_remove === true) {
      TABLE_SORT.just_add_or_remove(comingType, typeOfSingleAction)
    }
    this.setState({ ...this.state, sort: TABLE_SORT.sortArrayReturner() }, () => this.fetchComments());
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

  async fetchBookById_wizard(id: string) {
    let res = await this._bookService.byId(id).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'onFetchBookById_wizard_error' } })
    })
    if (res) {
      let type: string = Localization.book_type_list[res.data.type as BOOK_TYPES];
      let book_name_by_type: string = res.data.title + " - " + type;
      const book: { label: string, value: IBook } = { label: book_name_by_type, value: res.data };
      this.handleBookChange(book);
    }
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

  // delete modal function define

  onShowRemoveModal(comment: IComment) {
    if (permissionChecker.is_allow_item_render([T_ITEM_NAME.commentManageDeleteTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
      return;
    }
    this.selectedComment = comment;
    this.setState({ ...this.state, removeModalShow: true });
  }

  onHideRemoveModal() {
    this.selectedComment = undefined;
    this.setState({ ...this.state, removeModalShow: false });
  }

  async onRemoveComment(comment_id: string) {
    if (permissionChecker.is_allow_item_render([T_ITEM_NAME.commentManageDeleteTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
      return;
    }
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

  // comment show modal function define

  onShowCommentModal(comment: IComment) {
    if (permissionChecker.is_allow_item_render([T_ITEM_NAME.commentManageShowCommentTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
      return;
    }
    this.selectedComment = comment;
    this.setState({ ...this.state, commentModalShow: true });
  }

  onHideCommentModal() {
    this.selectedComment = undefined;
    this.setState({ ...this.state, commentModalShow: false });
  }

  // define axios for give data

  private _searchFilter: any | undefined;
  private get_searchFilter() {
    this.set_searchFilter();
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
    }, () => { this.fetchComments() });
  }

  async fetchComments() {
    if (this.state.is_wizard === false) {
      if (permissionChecker.is_allow_item_render([T_ITEM_NAME.commentManageGetGrid], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
        return;
      }
    };
    this.setState({ ...this.state, tableProcessLoader: true });
    let res = await this._commentService.search(
      this.state.pager_limit,
      this.state.pager_offset,
      this.get_searchFilter(),
      this.returner_sort_array_to_fetch_func(),
    ).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'fetchComments_error' } });
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
          value: this.state.is_wizard === false ? null : this.state.filter_state.book.value,
          book_id: this.state.is_wizard === false ? undefined : this.state.filter_state.book.book_id,
          is_valid: this.state.is_wizard === false ? false : this.state.filter_state.book.is_valid,
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
          value: this.state.is_wizard === false ? null : this.state.filter_state.book.value,
          book_id: this.state.is_wizard === false ? undefined : this.state.filter_state.book.book_id,
          is_valid: this.state.is_wizard === false ? false : this.state.filter_state.book.is_valid,
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
    }, () => this.wizardHandler());
  }

  wizardHandler() {
    if (this.state.is_wizard === false) {
      return;
    } else if (this.state.is_wizard === true) {
      this.fetchComments();
    } else {
      return;
    }
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


  ////// start request for options book & person of press in filter  ////////

  private bookRequstError_txt: string = Localization.no_item_found;

  async promiseOptions2_book_search(inputValue: any, callBack: any) {

    let res: any = await this._bookService.searchWithPress(10, 0, inputValue).catch(err => {
      let err_msg = this.handleError({ error: err.response, notify: false, toastOptions: { toastId: 'bookSearch_in_comment_error' } });
      this.bookRequstError_txt = err_msg.body;
    });

    if (res) {
      let books = res.data.result.map((book: any) => {
        const b_type: any = book.type;
        const b_t: BOOK_TYPES = b_type;
        let type = Localization.book_type_list[b_t];
        return { label: book.title + " - " + type, value: book }
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

  ///////////// end request for options book & person of press in filter ////////////////////////

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
            permissionChecker.is_allow_item_render([T_ITEM_NAME.commentManageGetGrid], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true || this.state.is_wizard === true
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
                          {
                            this.state.is_wizard === true
                              ?
                              undefined
                              :
                              <i
                                title={Localization.reset}
                                className="fa fa-times cursor-pointer remover-in_box-async text-danger mx-1"
                                onClick={() => this.book_in_search_remover()}
                              ></i>
                          }
                          <AsyncSelect
                            isDisabled={this.state.is_wizard === true}
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
        {
          this.selectedComment === undefined
            ?
            undefined
            :
            <DeleteModal
              crud_name={Localization.comment}
              modalShow={this.state.removeModalShow}
              deleteBtnLoader={this.state.setRemoveLoader}
              rowData={{ [Localization.comment]: this.selectedComment.body }}
              rowId={this.selectedComment.id}
              onHide={() => this.onHideRemoveModal()}
              onDelete={(rowId: string) => this.onRemoveComment(rowId)}
            />
        }
        {
          this.selectedComment === undefined
            ?
            undefined
            :
            <CommentShowModal
              modalShow={this.state.commentModalShow}
              rowData={this.selectedComment}
              onHide={() => this.onHideCommentModal()}
            />
        }
        <RetryModal
          modalShow={this.state.retryModal}
          onHide={() => this.setState({ ...this.state, retryModal: false })}
          onRetry={() => { this.fetchComments(); this.setState({ ...this.state, retryModal: false }) }}
        />
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