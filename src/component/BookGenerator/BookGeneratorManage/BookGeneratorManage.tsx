import React from "react";
import { Table, IProps_table } from "../../table/table";
import { Input } from '../../form/input/Input';
import { History } from 'history';
import { Modal } from "react-bootstrap";
import { IBook } from "../../../model/model.book";
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
import Select from 'react-select';
import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import { BookGeneratorService } from "../../../service/service.bookGenerator";
import { GetBookContentGenerateOrStatusModal } from '../BookGeneratorTools/GetGenerateOrStatusModal/GetGenerateOrStatusModal';
import { BookService } from "../../../service/service.book";
import AsyncSelect from 'react-select/async';
import { AppRangePicker } from "../../form/app-rangepicker/AppRangePicker";
import { TABLE_SORT } from "../../table/tableSortHandler";
import { AccessService } from "../../../service/service.access";
import { Store2 } from "../../../redux/store";
// import { AccessService } from "../../../service/service.access"


/// define props & state ///////
export interface IProps {
  history: History;
  internationalization: TInternationalization;
  // token: IToken;
}

interface IFilterContent {
  book: {
    value: { label: string, value: IBook } | null;
    book_id: string | undefined;
    is_valid: boolean,
  };
  contentType: {
    value: { value: string, label: string } | null,
    type: string | null,
    isValid: boolean
  };
  creator: {
    value: string | undefined,
    isValid: boolean
  };
  modifier: {
    value: string | undefined,
    isValid: boolean
  };
  isgenerated: {
    value: { value: string, label: string } | null,
    content_generated: boolean | null,
    isValid: boolean
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
}

interface ISortContent {
  type: boolean;
  creator: boolean;
  creation_date: boolean;
  modifier: boolean;
  modification_date: boolean;
}

interface IState {
  content_table: IProps_table;
  contentError: string | undefined;
  pager_offset: number;
  pager_limit: number;
  removeModalShow: boolean;
  generateModalShow: boolean;
  prevBtnLoader: boolean;
  nextBtnLoader: boolean;
  filterSearchBtnLoader: boolean;
  tableProcessLoader: boolean;
  setRemoveLoader: boolean;
  setGenerateLoader: boolean;
  filter_state: IFilterContent;
  advance_search_box_show: boolean;
  sort: string[];
  sortShowStyle: ISortContent;
}

// define class of content 

class BookGeneratorManageComponent extends BaseComponent<IProps, IState>{
  contentTypeOptions = [
    { value: 'Original', label: Localization.Original },
    { value: 'Brief', label: Localization.Brief },
  ];
  isgeneratedOptions = [
    { value: 'content_generated', label: Localization.content_generated },
    { value: 'content_not_generated', label: Localization.content_not_generated },
  ];
  state = {
    content_table: {
      list: [],
      colHeaders: [
        {
          field: "bookTitle", title: Localization.title, cellTemplateFunc: (row: any) => {
            if (row.book) {
              return <div title={row.title} className="text-nowrap-ellipsis max-w-200px d-inline-block">
                {(row.book as IBook).title}
              </div>
            }
            return '';
          }
        },
        {
          field: "images", title: Localization.images, templateFunc: () => {
            return <b>{Localization.images}</b>
          },
          cellTemplateFunc: (row: any) => {
            if (row.book && row.book.images && row.book.images.length) {
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
          field: "type", title: Localization.type + " " + Localization.book,
          cellTemplateFunc: (row: any) => {
            if (row.book.type) {
              const b_type: any = row.book.type;
              const b_t: BOOK_TYPES = b_type;
              return Localization.book_type_list[b_t];
            }
            return '';
          }
        },
        {
          field: "contentType", title: Localization.type + " " + Localization.content,
          templateFunc: () => {
            return <>
              {Localization.type + " " + Localization.content}
              {
                (this.is_this_sort_exsit_in_state("type+") === false && this.is_this_sort_exsit_in_state("type-") === false)
                  ?
                  <span
                    className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                    onClick={() => this.sort_handler_func("type+", "type-", true, 1)}
                    onMouseOver={() => this.sort_icon_change_on_mouse_over_out('type', true)}
                    onMouseOut={() => this.sort_icon_change_on_mouse_over_out('type', false)}
                  >
                    <i className={this.state.sortShowStyle.type === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                  </span>
                  :
                  this.is_this_sort_exsit_in_state("type+") === true
                    ?
                    <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                      onClick={() => this.sort_handler_func("type-", "type+", false, 0)}
                      onMouseOver={() => this.sort_icon_change_on_mouse_over_out('type', true)}
                      onMouseOut={() => this.sort_icon_change_on_mouse_over_out('type', false)}>
                      <i className={this.state.sortShowStyle.type === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                    </span>
                    :
                    this.is_this_sort_exsit_in_state("type-") === true
                      ?
                      <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                        onClick={() => this.sort_handler_func("type-", "type+", true, 2)}
                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('type', true)}
                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('type', false)}>
                        <i className={this.state.sortShowStyle.type === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                      </span>
                      :
                      undefined
              }
            </>
          },
          cellTemplateFunc: (row: any) => {
            if (row.type) {
              return Localization[row.type];
            }
            return '';
          }
        },
        {
          field: "creator", title: Localization.creator + " " + Localization.content,
          templateFunc: () => {
            return <>
              {Localization.creator + " " + Localization.content}
              {
                (this.is_this_sort_exsit_in_state("creator+") === false && this.is_this_sort_exsit_in_state("creator-") === false)
                  ?
                  <span
                    className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                    onClick={() => this.sort_handler_func("creator+", "creator-", true, 1)}
                    onMouseOver={() => this.sort_icon_change_on_mouse_over_out('creator', true)}
                    onMouseOut={() => this.sort_icon_change_on_mouse_over_out('creator', false)}>
                    <i className={this.state.sortShowStyle.creator === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                  </span>
                  :
                  this.is_this_sort_exsit_in_state("creator+") === true
                    ?
                    <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                      onClick={() => this.sort_handler_func("creator-", "creator+", false, 0)}
                      onMouseOver={() => this.sort_icon_change_on_mouse_over_out('creator', true)}
                      onMouseOut={() => this.sort_icon_change_on_mouse_over_out('creator', false)}>
                      <i className={this.state.sortShowStyle.creator === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                    </span>
                    :
                    this.is_this_sort_exsit_in_state("creator-") === true
                      ?
                      <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                        onClick={() => this.sort_handler_func("creator-", "creator+", true, 2)}
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
            return <div>{row.creator}</div>
            }
            return '';
          }
        },
        {
          field: "creation_date", title: Localization.creation_date + " " + Localization.content,
          templateFunc: () => {
            return <>
              {Localization.creation_date + " " + Localization.content}
              {
                (this.is_this_sort_exsit_in_state("creation_date+") === false && this.is_this_sort_exsit_in_state("creation_date-") === false)
                  ?
                  <span
                    className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                    onClick={() => this.sort_handler_func("creation_date+", "creation_date-", true, 1)}
                    onMouseOver={() => this.sort_icon_change_on_mouse_over_out('creation_date', true)}
                    onMouseOut={() => this.sort_icon_change_on_mouse_over_out('creation_date', false)}>
                    <i className={this.state.sortShowStyle.creation_date === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                  </span>
                  :
                  this.is_this_sort_exsit_in_state("creation_date+") === true
                    ?
                    <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                      onClick={() => this.sort_handler_func("creation_date-", "creation_date+", false, 0)}
                      onMouseOver={() => this.sort_icon_change_on_mouse_over_out('creation_date', true)}
                      onMouseOut={() => this.sort_icon_change_on_mouse_over_out('creation_date', false)}>
                      <i className={this.state.sortShowStyle.creation_date === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                    </span>
                    :
                    this.is_this_sort_exsit_in_state("creation_date-") === true
                      ?
                      <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                        onClick={() => this.sort_handler_func("creation_date-", "creation_date+", true, 2)}
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
          field: "modifier", title: Localization.modifier + " " + Localization.content,
          templateFunc: () => {
            return <>
              {Localization.modifier + " " + Localization.content}
              {
                (this.is_this_sort_exsit_in_state("modifier+") === false && this.is_this_sort_exsit_in_state("modifier-") === false)
                  ?
                  <span
                    className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                    onClick={() => this.sort_handler_func("modifier+", "modifier-", true, 1)}
                    onMouseOver={() => this.sort_icon_change_on_mouse_over_out('modifier', true)}
                    onMouseOut={() => this.sort_icon_change_on_mouse_over_out('modifier', false)}>
                    <i className={this.state.sortShowStyle.modifier === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                  </span>
                  :
                  this.is_this_sort_exsit_in_state("modifier+") === true
                    ?
                    <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                      onClick={() => this.sort_handler_func("modifier-", "modifier+", false, 0)}
                      onMouseOver={() => this.sort_icon_change_on_mouse_over_out('modifier', true)}
                      onMouseOut={() => this.sort_icon_change_on_mouse_over_out('modifier', false)}>
                      <i className={this.state.sortShowStyle.modifier === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                    </span>
                    :
                    this.is_this_sort_exsit_in_state("modifier-") === true
                      ?
                      <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                        onClick={() => this.sort_handler_func("modifier-", "modifier+", true, 2)}
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
            return <div>{row.modifier}</div>
            }
            return '';
          }
        },
        {
          field: "modification_date", title: Localization.modification_date + " " + Localization.content,
          templateFunc: () => {
            return <>
              {Localization.modification_date + " " + Localization.content}
              {
                (this.is_this_sort_exsit_in_state("modification_date+") === false && this.is_this_sort_exsit_in_state("modification_date-") === false)
                  ?
                  <span
                    className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                    onClick={() => this.sort_handler_func("modification_date+", "modification_date-", true, 1)}
                    onMouseOver={() => this.sort_icon_change_on_mouse_over_out('modification_date', true)}
                    onMouseOut={() => this.sort_icon_change_on_mouse_over_out('modification_date', false)}>
                    <i className={this.state.sortShowStyle.modification_date === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                  </span>
                  :
                  this.is_this_sort_exsit_in_state("modification_date+") === true
                    ?
                    <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                      onClick={() => this.sort_handler_func("modification_date-", "modification_date+", false, 0)}
                      onMouseOver={() => this.sort_icon_change_on_mouse_over_out('modification_date', true)}
                      onMouseOut={() => this.sort_icon_change_on_mouse_over_out('modification_date', false)}>
                      <i className={this.state.sortShowStyle.modification_date === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                    </span>
                    :
                    this.is_this_sort_exsit_in_state("modification_date-") === true
                      ?
                      <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                        onClick={() => this.sort_handler_func("modification_date-", "modification_date+", true, 2)}
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
          field: "duration", title: Localization.duration,
          cellTemplateFunc: (row: any) => {
            let hour;
            let minute;
            let second;
            if (row.book.duration) {
              if (row.book.duration === 'NaN') {
                return ''
              }
              if (row.book.type !== 'Audio') {
                return ''
              }
              let totalTime = Number(row.book.duration);
              if (totalTime === 0) {
                return ''
              }
              if (totalTime < 60) {
                hour = 0;
                minute = 0;
                second = totalTime;
                return <div title={row.book.duration} className="text-right d-inline-block text-nowrap-ellipsis max-w-100px"> {second} : {minute} : {hour}</div>
              }
              if (totalTime >= 60 && totalTime < 3600) {
                let min = Math.floor(totalTime / 60);
                let sec = totalTime - (min * 60);
                hour = 0;
                minute = min;
                second = sec;
                return <div title={row.book.duration} className="text-right d-inline-block text-nowrap-ellipsis max-w-100px"> {second} : {minute} : {hour}</div>
              } else {
                let hours = Math.floor(totalTime / 3600);
                if ((totalTime - (hours * 3600)) < 60) {
                  let sec = totalTime % 3600;
                  hour = hours;
                  minute = 0;
                  second = sec;
                  return <div title={row.book.duration} className="text-right d-inline-block text-nowrap-ellipsis max-w-100px"> {second} : {minute} : {hour}</div>
                } else {
                  let min = Math.floor(((totalTime - (hours * 3600)) / 60));
                  let sec = (totalTime - ((hours * 3600) + (min * 60)));
                  hour = hours;
                  minute = min;
                  second = sec;
                  return <div title={row.book.duration} className="text-right d-inline-block text-nowrap-ellipsis max-w-100px"> {second} : {minute} : {hour}</div>
                }
              }
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
          text: <i title={Localization.create} className="fa fa-wrench text-dark"></i>,
          ac_func: (row: any) => { this.getGenerateRow(row) },
          name: Localization.create + " " + Localization.content
        },
      ]
    },
    contentError: undefined,
    pager_offset: 0,
    pager_limit: 10,
    prevBtnLoader: false,
    nextBtnLoader: false,
    filterSearchBtnLoader: false,
    tableProcessLoader: false,
    removeModalShow: false,
    generateModalShow: false,
    setRemoveLoader: false,
    setGenerateLoader: false,
    filter_state: {
      book: {
        value: null,
        book_id: undefined,
        is_valid: false,
      },
      contentType: {
        value: null,
        type: null,
        isValid: false
      },
      creator: {
        value: undefined,
        isValid: false
      },
      modifier: {
        value: undefined,
        isValid: false
      },
      isgenerated: {
        value: null,
        content_generated: null,
        isValid: false
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
    },
    advance_search_box_show: false,
    sort: [],
    sortShowStyle: {
      type: false,
      creator: false,
      creation_date: false,
      modifier: false,
      modification_date: false,
    }
  }

  selectedContent: any | undefined;
  selectedContentGenerate: any;
  private _bookContentService = new BookGeneratorService();
  private _bookService = new BookService();

  componentDidMount() {
    moment.locale("en");
    this.setState({
      ...this.state,
      tableProcessLoader: true
    })
    TABLE_SORT.sortArrayReseter();
    this.fetchBooksContent();
  }

  sort_handler_func(comingType: string, reverseType: string, is_just_add_or_remove: boolean, typeOfSingleAction: number) {
    if (is_just_add_or_remove === false) {
      TABLE_SORT.coming_field_name_by_sortType_and_that_reverseType_exist_in_sortArray(comingType, reverseType);
    }
    if (is_just_add_or_remove === true) {
      TABLE_SORT.just_add_or_remove(comingType, typeOfSingleAction)
    }
    this.setState({ ...this.state, sort: TABLE_SORT.sortArrayReturner() }, () => this.fetchBooksContent());
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
  // checkAllAccess(): boolean {
  //   if (AccessService.checkOneOFAllAccess([])
  //     || AccessService.checkOneOFAllAccess([])
  //   ) {
  //     return true;
  //   }
  //   return false;
  // }

  // checkDeleteToolAccess(): boolean {
  //   if (AccessService.checkAccess('') || AccessService.checkAccess('')) {
  //     return true;
  //   }
  //   return false
  // }

  // checkUpdateToolAccess(): boolean {
  //   if (AccessService.checkAccess('') || AccessService.checkAccess('')) {
  //     return true;
  //   }
  //   return false
  // }

  // checkPriceAddToolAccess(): boolean {
  //   if (AccessService.checkAccess('') || AccessService.checkAccess('')) {
  //     return true;
  //   }
  //   return false
  // }

  // constructor(props: IProps) {
  //   super(props);
  //   // this._bookService.setToken(this.props.token)
  //   // this._priceService.setToken(this.props.token)
  // }



  updateRow(book_generator_id: any) {
    // if (this.checkUpdateToolAccess() === false) {
    //   return;
    // }
    this.props.history.push(`/book_generator/${book_generator_id.id}/edit`);
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

  // delete modal function define

  onShowRemoveModal(content: any) {
    // if (this.checkDeleteToolAccess() === false) {
    //   return;
    // }
    this.selectedContent = content;
    this.setState({ ...this.state, removeModalShow: true });
  }

  onHideRemoveModal() {
    this.selectedContent = undefined;
    this.setState({ ...this.state, removeModalShow: false });
  }

  async onRemoveContent(content_id: string) {
    // if (this.checkDeleteToolAccess() === false) {
    //   return;
    // };
    this.setState({ ...this.state, setRemoveLoader: true });
    let res = await this._bookContentService.remove(content_id).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'onRemoveContent_error' } });
      this.setState({ ...this.state, setRemoveLoader: false });
    });
    if (res) {
      this.setState({ ...this.state, setRemoveLoader: false });
      this.apiSuccessNotify();
      this.fetchBooksContent();
      this.onHideRemoveModal();
    }
  }

  render_delete_modal(selectedContent: any) {
    if (!this.selectedContent || !this.selectedContent.id) return;
    return (
      <>
        <Modal show={this.state.removeModalShow} onHide={() => this.onHideRemoveModal()}>
          <Modal.Body>
            <p className="delete-modal-content text-center text-danger">
              {Localization.remove + " " + Localization.content}
            </p>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.title}:&nbsp;
            </span>
              {(this.selectedContent.book as IBook).title}
            </p>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.type + " " + Localization.book}:&nbsp;
            </span>
              {Localization.book_type_list[((this.selectedContent.book as IBook).type as BOOK_TYPES)]}
            </p>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.type + " " + Localization.content}:&nbsp;
            </span>
              {Localization[this.selectedContent.type]}
            </p>
            <p className="text-danger">{Localization.msg.ui.item_will_be_removed_continue}</p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideRemoveModal()}>{Localization.close}</button>
            <BtnLoader
              btnClassName="btn btn-danger shadow-default shadow-hover"
              onClick={() => this.onRemoveContent(selectedContent.id)}
              loading={this.state.setRemoveLoader}
            >
              {Localization.remove}
            </BtnLoader>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  // generate modal function define

  getGenerateRow(content: any) {
    // if (this.checkDeleteToolAccess() === false) {
    //   return;
    // }
    this.selectedContentGenerate = content;
    this.setState({ ...this.state, generateModalShow: true });
  }

  onHideGenerateModal() {
    this.selectedContentGenerate = undefined;
    this.setState({ ...this.state, generateModalShow: false });
  }

  // define axios for give data

  async fetchBooksContent() {
    this.setState({ ...this.state, tableProcessLoader: true })
    let res = await this._bookContentService.search(
      this.state.pager_limit,
      this.state.pager_offset,
      this.get_searchFilter(),
      this.returner_sort_array_to_fetch_func(),
    ).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'fetchBooksContent_error' } });
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
        ...this.state, content_table: {
          ...this.state.content_table,
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
    if (this.state.content_table.list && (this.state.content_table.list! || []).length) {
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
    } else if (this.state.content_table.list && !(this.state.content_table.list! || []).length) {
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

    } else if (this.state.contentError) {
      return;
    } else {
      return;
    }
  }

  // next button create

  pager_next_btn_render() {
    if (this.state.content_table.list && (this.state.content_table.list! || []).length) {
      return (
        <>
          {
            !(this.state.pager_limit > (this.state.content_table.list! || []).length) &&
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
    } else if (this.state.content_table.list && !(this.state.content_table.list! || []).length) {
      return;
    } else if (this.state.content_table.list) {
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
      this.fetchBooksContent()
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
      this.fetchBooksContent()
    });
  }


  ///// navigation function //////

  gotoBookContentCreate() {
    // if (AccessService.checkAccess('') === false && AccessService.checkAccess('') === false) {
    //   return;
    // };
    this.props.history.push('/book_generator/create'); // /admin
  }


  private _searchFilter: any | undefined;
  private get_searchFilter() {
    return this._searchFilter;
  }
  private set_searchFilter() {
    const obj: any = {};

    if (this.state.filter_state.book.is_valid) {
      obj['book_id'] = { $eq: this.state.filter_state.book.book_id };
    }

    if (this.state.filter_state.contentType.isValid) {
      obj['type'] = { $eq: this.state.filter_state.contentType.type };
    }

    if (this.state.filter_state.creator.isValid) {
      obj['creator'] = { $prefix: this.state.filter_state.creator.value };
    }

    if (this.state.filter_state.modifier.isValid) {
      obj['modifier'] = { $prefix: this.state.filter_state.modifier.value };
    }

    if (this.state.filter_state.isgenerated.isValid) {
      obj['content_generated'] = { $eq: this.state.filter_state.isgenerated.content_generated };
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
      this.fetchBooksContent()
    });
  }


  /////  start onChange & search & reset function for search box ///////////

  filter_state_reset() {
    this.setState({
      ...this.state,
      filter_state: {
        book: {
          value: null,
          book_id: undefined,
          is_valid: false,
        },
        contentType: {
          value: null,
          type: null,
          isValid: false
        },
        creator: {
          value: undefined,
          isValid: false
        },
        modifier: {
          value: undefined,
          isValid: false
        },
        isgenerated: {
          value: null,
          content_generated: null,
          isValid: false
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
      }
    }, () => this.repetReset())
  }
  repetReset() {
    this.setState({
      ...this.state,
      filter_state: {
        book: {
          value: null,
          book_id: undefined,
          is_valid: false,
        },
        contentType: {
          value: null,
          type: null,
          isValid: false
        },
        creator: {
          value: undefined,
          isValid: false
        },
        modifier: {
          value: undefined,
          isValid: false
        },
        isgenerated: {
          value: null,
          content_generated: null,
          isValid: false
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

  contentType_in_search_remover() {
    this.setState({
      ...this.state,
      filter_state: {
        ...this.state.filter_state, contentType: { value: null, type: null, isValid: false }
      }
    })
  }

  handleContentTypeSelectInputChange(type: { value: string, label: string } | null) {
    if (type === null) {
      this.setState({
        ...this.state,
        filter_state: {
          ...this.state.filter_state, contentType: { value: type, type: null, isValid: false }
        }
      })
    } else {
      this.setState({
        ...this.state,
        filter_state: {
          ...this.state.filter_state, contentType: { value: type, type: type.value, isValid: true }
        }
      })
    }
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

  isgenerated_status_in_search_remover() {
    this.setState({
      ...this.state,
      filter_state: {
        ...this.state.filter_state, isgenerated: { value: null, content_generated: null, isValid: false }
      }
    })
  }

  handleIsGeneratedSelectInputChange(status: { value: string, label: string } | null) {
    if (status === null) {
      this.setState({
        ...this.state,
        filter_state: {
          ...this.state.filter_state, isgenerated: { value: status, content_generated: null, isValid: false }
        }
      })
    } else {
      this.setState({
        ...this.state,
        filter_state: {
          ...this.state.filter_state, isgenerated: {
            value: status,
            content_generated: status.value === 'content_generated' ? true : false,
            isValid: true
          }
        }
      })
    }
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


  ////// start request for options person of press in filter  ////////

  private personRequstError_txt: string = Localization.no_item_found;

  async promiseOptions2_book_search(inputValue: any, callBack: any) {
    let filter = undefined;
    if (inputValue) {
      if(AccessService.checkAccess('BOOK_ADD_PREMIUM') === true){
        filter = { title: { $prefix: inputValue } };
      }
      if(AccessService.checkAccess('BOOK_ADD_PREMIUM') === false){
        let persons_of_press: string[];
        persons_of_press = [];
        const wrapper = Store2.getState().logged_in_user!.permission_groups || [];
        persons_of_press = [...wrapper];
        filter = { title: { $prefix: inputValue } , press : { $in: persons_of_press }};
      }
    }else{
      if(AccessService.checkAccess('BOOK_ADD_PREMIUM') === true){
        filter = undefined;
      }
      if(AccessService.checkAccess('BOOK_ADD_PREMIUM') === false){
        let persons_of_press: string[];
        persons_of_press = [];
        const wrapper = Store2.getState().logged_in_user!.permission_groups || [];
        persons_of_press = [...wrapper];
        filter = {press : { $in: persons_of_press }};
      }
    };
    let res: any = await this._bookService.search(10, 0, filter).catch(err => {
      let err_msg = this.handleError({ error: err.response, notify: false, toastOptions: { toastId: 'promiseOptions2GroupAddOrRemove_error' } });
      this.personRequstError_txt = err_msg.body;
    });

    if (res) {
      let persons = res.data.result.map((ps: any) => {
        const b_type: any = ps.type;
        const b_t: BOOK_TYPES = b_type;
        let type = Localization.book_type_list[b_t];
        return { label: ps.title + " - " + type, value: ps }
      });
      this.personRequstError_txt = Localization.no_item_found;
      callBack(persons);
    } else {
      callBack();
    }
  }

  private setTimeout_person_val: any;
  debounce_300_book_search(inputValue: any, callBack: any) {
    if (this.setTimeout_person_val) {
      clearTimeout(this.setTimeout_person_val);
    }
    this.setTimeout_person_val = setTimeout(() => {
      this.promiseOptions2_book_search(inputValue, callBack);
    }, 1000);
  }

  select_noOptionsMessage_book_search(obj: { inputValue: string }) {
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
              <h2 className="text-bold text-dark pl-3">{Localization.content}</h2>
              {/* {
            AccessService.checkAccess('BOOK_ADD_PREMIUM') || AccessService.checkAccess('BOOK_ADD_PRESS')
              ? */}
              <BtnLoader
                loading={false}
                disabled={false}
                btnClassName="btn btn-success shadow-default shadow-hover mb-4"
                onClick={() => this.gotoBookContentCreate()}
              >
                {Localization.new}
              </BtnLoader>
              {/* :
              undefined
            } */}
            </div>
          </div>
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
                    <div className="form-group">
                      <label htmlFor="">{Localization.type + " " + Localization.content}</label>
                      <i
                        title={Localization.reset}
                        className="fa fa-times cursor-pointer remover-in_box text-danger mx-1"
                        onClick={() => this.contentType_in_search_remover()}
                      ></i>
                      <Select
                        onChange={(value: any) => this.handleContentTypeSelectInputChange(value)}
                        options={this.contentTypeOptions}
                        value={this.state.filter_state.contentType.value}
                        placeholder={Localization.type + " " + Localization.content}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <Input
                      onChange={(value, isValid) => this.handleInputChange(value, 'creator')}
                      label={Localization.creator}
                      placeholder={Localization.creator}
                      defaultValue={this.state.filter_state.creator.value}
                    />
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <Input
                      onChange={(value, isValid) => this.handleInputChange(value, 'modifier')}
                      label={Localization.modifier}
                      placeholder={Localization.modifier}
                      defaultValue={this.state.filter_state.modifier.value}
                    />
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <div className="form-group">
                      <label htmlFor="">{Localization.status + " " + Localization.content}</label>
                      <i
                        title={Localization.reset}
                        className="fa fa-times cursor-pointer remover-in_box text-danger mx-1"
                        onClick={() => this.isgenerated_status_in_search_remover()}
                      ></i>
                      <Select
                        onChange={(value: any) => this.handleIsGeneratedSelectInputChange(value)}
                        options={this.isgeneratedOptions}
                        value={this.state.filter_state.isgenerated.value}
                        placeholder={Localization.status + " " + Localization.content}
                      />
                    </div>
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
              <Table row_offset_number={this.state.pager_offset} loading={this.state.tableProcessLoader} list={this.state.content_table.list} colHeaders={this.state.content_table.colHeaders} actions={this.state.content_table.actions}></Table>
              <div>
                {this.pager_previous_btn_render()}
                {this.pager_next_btn_render()}
              </div>
            </div>
          </div>
        </div>
        {
          this.selectedContentGenerate === undefined
            ?
            undefined
            :
            <GetBookContentGenerateOrStatusModal
              book={this.selectedContentGenerate!.book}
              content_type={this.selectedContentGenerate.type}
              book_content_id={this.selectedContentGenerate.id}
              modalShow={this.state.generateModalShow}
              onHide={() => this.onHideGenerateModal()}
            />
        }
        {this.render_delete_modal(this.selectedContent)}
        {/* {this.render_generate_modal(this.selectedContentGenerate)} */}
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

export const BookGeneratorManage = connect(
  state2props,
  dispatch2props
)(BookGeneratorManageComponent);