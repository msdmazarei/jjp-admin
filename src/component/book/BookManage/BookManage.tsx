import React from "react";
import { Table, IProps_table } from "../../table/table";
import { Input } from '../../form/input/Input';
import { BookService } from "../../../service/service.book";
import { History } from 'history';
import { Modal } from "react-bootstrap";
import { IBook } from "../../../model/model.book";
import { ToastContainer, toast } from "react-toastify";
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { redux_state } from "../../../redux/app_state";
import { BaseComponent } from "../../_base/BaseComponent";
import { TInternationalization } from "../../../config/setup";
// import { IToken } from "../../../model/model.token";
import { Localization } from "../../../config/localization/localization";
import { BtnLoader } from "../../form/btn-loader/BtnLoader";
import { BOOK_TYPES, BOOK_GENRE } from "../../../enum/Book";
import { AppRegex } from "../../../config/regex";
import { PriceService } from "../../../service/service.price";
import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import { FixNumber } from "../../form/fix-number/FixNumber";
import { AccessService } from "../../../service/service.access"
import Select from 'react-select';
import { AppRangePicker } from "../../form/app-rangepicker/AppRangePicker";
import { IPerson } from "../../../model/model.person";
import AsyncSelect from 'react-select/async';
import { PersonService } from "../../../service/service.person";
import { Store2 } from "../../../redux/store";
import { AppNumberRange } from "../../form/app-numberRange/app-numberRange";
import { TABLE_SORT } from "../../table/tableSortHandler";

/// define props & state ///////
export interface IProps {
  history: History;
  internationalization: TInternationalization;
  // token: IToken;
}

interface IFilterBook {
  title: {
    value: string | undefined,
    isValid: boolean
  };
  type: {
    value: BOOK_TYPES[] | null,
    isValid: boolean
  };
  genre: {
    value: BOOK_GENRE | null,
    isValid: boolean
  };
  tags: {
    value: { label: string, value: string }[];
    isValid: boolean;
  };
  price: {
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
  mo_date: {
    from: number | undefined,
    from_isValid: boolean,
    to: number | undefined,
    to_isValid: boolean,
    is_valid: boolean,
  };
  pub_date: {
    from: number | undefined,
    from_isValid: boolean,
    to: number | undefined,
    to_isValid: boolean,
    is_valid: boolean,
  };
  press: {
    value: { label: string, value: IPerson } | null;
    person_id: string | undefined;
    is_valid: boolean,
  };
  creator: {
    value: string | undefined,
    isValid: boolean
  }
}

interface ISortBook {
  title: boolean;
  type: boolean;
  creator: boolean;
  creation_date: boolean;
  modifier: boolean;
  modification_date: boolean;
  price: boolean;
  pub_year: boolean;
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
  setRemoveLoader: boolean;
  setPriceLoader: boolean;
  filter_state: IFilterBook;
  tags_inputValue: string;
  advance_search_box_show: boolean;
  sort: string[];
  sortShowStyle: ISortBook;
}

// define class of Book 

class BookManageComponent extends BaseComponent<IProps, IState>{
  genreOptions = [
    { value: 'Comedy', label: Localization.genre_type_list.Comedy },
    { value: 'Drama', label: Localization.genre_type_list.Drama },
    { value: 'Romance', label: Localization.genre_type_list.Romance },
    { value: 'Social', label: Localization.genre_type_list.Social },
    { value: 'Religious', label: Localization.genre_type_list.Religious },
    { value: 'Historical', label: Localization.genre_type_list.Historical },
    { value: 'Classic', label: Localization.genre_type_list.Classic },
    { value: 'Science', label: Localization.genre_type_list.Science }
  ];
  typeOptions = [
    { value: 'DVD', label: Localization.book_type_list.DVD },
    { value: 'Audio', label: Localization.book_type_list.Audio },
    { value: 'Hard_Copy', label: Localization.book_type_list.Hard_Copy },
    { value: 'Pdf', label: Localization.book_type_list.Pdf },
    { value: 'Epub', label: Localization.book_type_list.Epub }
  ];
  state = {
    book_table: {
      list: [],
      colHeaders: [
        {
          field: "title", title: Localization.title,
          templateFunc: () => {
            return <>
              {Localization.title}
              {
                (this.is_this_sort_exsit_in_state("title+") === false && this.is_this_sort_exsit_in_state("title-") === false)
                  ?
                  <span
                    className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                    onClick={() => this.sort_handler_func("title+", "title-", true, 1)}
                    onMouseOver={() => this.sort_icon_change_on_mouse_over_out('title', true)}
                    onMouseOut={() => this.sort_icon_change_on_mouse_over_out('title', false)}>
                    <i className={this.state.sortShowStyle.title === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                  </span>
                  :
                  this.is_this_sort_exsit_in_state("title+") === true
                    ?
                    <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                      onClick={() => this.sort_handler_func("title-", "title+", false, 0)}
                      onMouseOver={() => this.sort_icon_change_on_mouse_over_out('title', true)}
                      onMouseOut={() => this.sort_icon_change_on_mouse_over_out('title', false)}>
                      <i className={this.state.sortShowStyle.title === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                    </span>
                    :
                    this.is_this_sort_exsit_in_state("title-") === true
                      ?
                      <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                        onClick={() => this.sort_handler_func("title-", "title+", true, 2)}
                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('title', true)}
                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('title', false)}>
                        <i className={this.state.sortShowStyle.title === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                      </span>
                      :
                      undefined
              }
            </>
          },
          cellTemplateFunc: (row: IBook) => {
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
          templateFunc: () => {
            return <>
              {Localization.type}
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
          field: "creator", title: Localization.creator,
          templateFunc: () => {
            return <>
              {Localization.creator}
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
          field: "creation_date", title: Localization.creation_date,
          templateFunc: () => {
            return <>
              {Localization.creation_date}
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
          cellTemplateFunc: (row: IBook) => {
            if (row.creation_date) {
              return <div title={this._getTimestampToDate(row.creation_date)}>{this.getTimestampToDate(row.creation_date)}</div>
            }
            return '';
          }
        },
        {
          field: "modifier", title: Localization.modifier,
          templateFunc: () => {
            return <>
              {Localization.modifier}
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
          field: "modification_date", title: Localization.modification_date,
          templateFunc: () => {
            return <>
              {Localization.modification_date}
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
          field: "price", title: Localization.price,
          cellTemplateFunc: (row: IBook) => {
            if (AccessService.checkAccess('PRICE_GET_PREMIUM') === false) {
              return <div className="text-danger text-center">---</div>;
            } else if (row.price) {
              return <div className="text-info text-center">{row.price.toLocaleString()}</div>
            } else if (row.price === 0) {
              return <div className="text-info text-center">0</div>;
            } else {
              return <div className="text-danger text-center">---</div>;
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
              if (row.duration === 'NaN') {
                return ''
              }
              if (row.type !== 'Audio') {
                return ''
              }
              let totalTime = Number(row.duration);
              if (totalTime === 0) {
                return ''
              }
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
          templateFunc: () => {
            return <>
              {Localization.publication_date}
              {
                (this.is_this_sort_exsit_in_state("pub_year+") === false && this.is_this_sort_exsit_in_state("pub_year-") === false)
                  ?
                  <span
                    className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                    onClick={() => this.sort_handler_func("pub_year+", "pub_year-", true, 1)}
                    onMouseOver={() => this.sort_icon_change_on_mouse_over_out('pub_year', true)}
                    onMouseOut={() => this.sort_icon_change_on_mouse_over_out('pub_year', false)}>
                    <i className={this.state.sortShowStyle.pub_year === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                  </span>
                  :
                  this.is_this_sort_exsit_in_state("pub_year+") === true
                    ?
                    <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                      onClick={() => this.sort_handler_func("pub_year-", "pub_year+", false, 0)}
                      onMouseOver={() => this.sort_icon_change_on_mouse_over_out('pub_year', true)}
                      onMouseOut={() => this.sort_icon_change_on_mouse_over_out('pub_year', false)}>
                      <i className={this.state.sortShowStyle.pub_year === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                    </span>
                    :
                    this.is_this_sort_exsit_in_state("pub_year-") === true
                      ?
                      <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                        onClick={() => this.sort_handler_func("pub_year-", "pub_year+", true, 2)}
                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('pub_year', true)}
                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('pub_year', false)}>
                        <i className={this.state.sortShowStyle.pub_year === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                      </span>
                      :
                      undefined
              }
            </>
          },
          cellTemplateFunc: (row: IBook) => {
            if (row.pub_year) {
              return <div title={this._getTimestampToDate(row.pub_year)}>{this.getTimestampToDate(row.pub_year)}</div>
            }
            return '';
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
          access: (row: any) => { return this.checkUpdateToolAccess() },
          text: <i title={Localization.update} className="fa fa-pencil-square-o text-primary"></i>,
          ac_func: (row: any) => { this.updateRow(row) },
          name: Localization.update
        },
        {
          access: (row: any) => { return this.checkPriceAddToolAccess() },
          text: <i title={Localization.Pricing} className="fa fa-money text-success"></i>,
          ac_func: (row: any) => { this.onShowPriceModal(row) },
          name: Localization.Pricing
        },
      ]
        :
        undefined
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
    setRemoveLoader: false,
    setPriceLoader: false,
    filter_state: {
      title: {
        value: undefined,
        isValid: false
      },
      type: {
        value: null,
        isValid: false
      },
      genre: {
        value: null,
        isValid: false
      },
      tags: {
        value: [],
        isValid: false,
      },
      price: {
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
      mo_date: {
        from: undefined,
        from_isValid: false,
        to: undefined,
        to_isValid: false,
        is_valid: false,
      },
      pub_date: {
        from: undefined,
        from_isValid: false,
        to: undefined,
        to_isValid: false,
        is_valid: false,
      },
      press: {
        value: null,
        person_id: undefined,
        is_valid: false,
      },
      creator: {
        value: undefined,
        isValid: false,
      },
    },
    tags_inputValue: '',
    advance_search_box_show: false,
    sort: [],
    sortShowStyle: {
      title: false,
      type: false,
      creator: false,
      creation_date: false,
      modifier: false,
      modification_date: false,
      price: false,
      pub_year: false,
    }
  }

  selectedBook: IBook | undefined;
  private _bookService = new BookService();
  private _priceService = new PriceService();
  private _personService = new PersonService();

  componentDidMount() {
    moment.locale("en");
    this.setState({
      ...this.state,
      tableProcessLoader: true
    })
    TABLE_SORT.sortArrayReseter();
    this.fetchBooks();
  }

  checkAllAccess(): boolean {
    if (AccessService.checkOneOFAllAccess(['BOOK_DELETE_PREMIUM', 'BOOK_EDIT_PREMIUM', 'PRICE_GET_PREMIUM'])
      || AccessService.checkOneOFAllAccess(['BOOK_DELETE_PRESS', 'BOOK_EDIT_PRESS', 'PRICE_GET_PREMIUM'])
    ) {
      return true;
    }
    return false;
  }

  checkDeleteToolAccess(): boolean {
    if (AccessService.checkAccess('BOOK_DELETE_PREMIUM') || AccessService.checkAccess('BOOK_DELETE_PRESS')) {
      return true;
    }
    return false
  }

  checkUpdateToolAccess(): boolean {
    if (AccessService.checkAccess('BOOK_EDIT_PREMIUM') || AccessService.checkAccess('BOOK_EDIT_PRESS')) {
      return true;
    }
    return false
  }

  checkPriceAddToolAccess(): boolean {
    if (AccessService.checkAccess('PRICE_GET_PREMIUM')) {
      return true;
    }
    return false
  }

  // constructor(props: IProps) {
  //   super(props);
  //   // this._bookService.setToken(this.props.token)
  //   // this._priceService.setToken(this.props.token)
  // }

  sort_handler_func(comingType: string, reverseType: string, is_just_add_or_remove: boolean, typeOfSingleAction: number) {
    if (is_just_add_or_remove === false) {
      TABLE_SORT.coming_field_name_by_sortType_and_that_reverseType_exist_in_sortArray(comingType, reverseType);
    }
    if (is_just_add_or_remove === true) {
      TABLE_SORT.just_add_or_remove(comingType, typeOfSingleAction)
    }
    this.setState({ ...this.state, sort: TABLE_SORT.sortArrayReturner() }, () => this.fetchBooks());
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

  updateRow(book_id: any) {
    if (this.checkUpdateToolAccess() === false) {
      return;
    }
    this.props.history.push(`/book/${book_id.id}/edit`);
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

  onShowRemoveModal(book: IBook) {
    if (this.checkDeleteToolAccess() === false) {
      return;
    }
    this.selectedBook = book;
    this.setState({ ...this.state, removeModalShow: true });
  }

  onHideRemoveModal() {
    this.selectedBook = undefined;
    this.setState({ ...this.state, removeModalShow: false });
  }

  async onRemoveBook(book_id: string) {
    if (this.checkDeleteToolAccess() === false) {
      return;
    };
    this.setState({ ...this.state, setRemoveLoader: true });
    let res = await this._bookService.remove(book_id).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'onRemoveBook_error' } });
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
    if (this.checkPriceAddToolAccess() === false) {
      return;
    }
    this.selectedBook = book;
    if (typeof book.price !== 'number') {
      if (AccessService.checkAllAccess(['PRICE_ADD_PREMIUM', 'PRICE_EDIT_PREMIUM']) === false
        && AccessService.checkAllAccess(['PRICE_ADD_PRESS', 'PRICE_EDIT_PRESS']) === false) {
          toast.error(Localization.msg.ui.there_is_no_access_for_you, this.getNotifyConfig());
        return;
      }
    }
    if (typeof book.price === 'number') {
      if (AccessService.checkOneOFAllAccess(['PRICE_EDIT_PREMIUM','PRICE_EDIT_PRESS']) === false) {
          toast.error(Localization.msg.ui.there_is_no_access_for_you, this.getNotifyConfig());
        return;
      }
    }

    this.setState({
      ...this.state,
      priceModalShow: true,
      price: {
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
    if (this.checkPriceAddToolAccess() === false) {
      return;
    };
    if (!this.state.price.isValid) return;
    this.setState({ ...this.state, setPriceLoader: true });
    let res = await this._priceService.price(book_id, this.state.price.value!).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'onPriceBook_error' } });
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

  private _searchFilter: any | undefined;
  private get_searchFilter() {
    this.set_searchFilter();
    return this._searchFilter;
  }

  private set_searchFilter() {
    const obj: any = {};

    if (this.state.filter_state.title.isValid) {
      // obj['title'] = "/" + this.state.filter_state.title.value + "/";
      obj['title'] = { $prefix: this.state.filter_state.title.value };
    }

    if (this.state.filter_state.type.isValid) {
      let types: any[] = [];
      for (let i = 0; i < (this.state.filter_state.type.value! as { value: string, label: string }[]).length; i++) {
        types.push((this.state.filter_state.type.value! as { value: string, label: string }[])[i].value);
      }
      obj['type'] = { $in: types };
    }

    let persons_of_press: string[];
    persons_of_press = [];
    const wrapper = Store2.getState().logged_in_user!.permission_groups || [];
    if (AccessService.checkAccess('BOOK_ADD_PREMIUM') === true && this.state.filter_state.press.is_valid === true) {
      persons_of_press.push(this.state.filter_state.press.person_id!);
      obj['press'] = { $in: persons_of_press };
    }
    if (AccessService.checkAccess('BOOK_ADD_PREMIUM') === false && this.state.filter_state.press.is_valid === true) {
      persons_of_press.push(this.state.filter_state.press.person_id!);
      obj['press'] = { $in: persons_of_press };
    }
    if (AccessService.checkAccess('BOOK_ADD_PREMIUM') === false && this.state.filter_state.press.is_valid === false) {
      persons_of_press = [...wrapper];
      obj['press'] = { $in: persons_of_press };
    }

    if (this.state.filter_state.creator.isValid) {
      // obj['creator'] = "/" + this.state.filter_state.creator.value + "/";
      obj['creator'] = { $prefix: this.state.filter_state.creator.value };
    }

    if (this.state.filter_state.genre.isValid) {
      let genres: any[] = [];
      for (let i = 0; i < (this.state.filter_state.genre.value! as { value: string, label: string }[]).length; i++) {
        genres.push((this.state.filter_state.genre.value! as { value: string, label: string }[])[i].value);
      }
      obj['genre'] = { $all: genres };
    }

    if (this.state.filter_state.tags.value.length) {
      let tags: any[] = [];
      for (let i = 0; i < (this.state.filter_state.tags.value! as { value: string, label: string }[]).length; i++) {
        tags.push((this.state.filter_state.tags.value! as { value: string, label: string }[])[i].value);
      }
      obj['tags'] = { $all: tags };
    }

    if (this.state.filter_state.price.is_valid === true) {
      if (this.state.filter_state.price.from_isValid === true && this.state.filter_state.price.to_isValid === true) {
        obj['price'] = { $gte: this.state.filter_state.price.from, $lte: this.state.filter_state.price.to }
      } else if (this.state.filter_state.price.from_isValid === true && this.state.filter_state.price.to_isValid === false) {
        obj['price'] = { $gte: this.state.filter_state.price.from }
      } else if (this.state.filter_state.price.from_isValid === false && this.state.filter_state.price.to_isValid === true) {
        obj['price'] = { $lte: this.state.filter_state.price.to }
      }
    }

    if (this.state.filter_state.pub_date.is_valid === true) {
      if (this.state.filter_state.pub_date.from_isValid === true && this.state.filter_state.pub_date.to_isValid === true) {
        obj['pub_year'] = { $gte: this.state.filter_state.pub_date.from, $lte: (this.state.filter_state.pub_date.to! + 86400) }
      } else if (this.state.filter_state.pub_date.from_isValid === true && this.state.filter_state.pub_date.to_isValid === false) {
        obj['pub_year'] = { $gte: this.state.filter_state.pub_date.from }
      } else if (this.state.filter_state.pub_date.from_isValid === false && this.state.filter_state.pub_date.to_isValid === true) {
        obj['pub_year'] = { $lte: this.state.filter_state.pub_date.to }
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
    }, () => { this.fetchBooks() });
  }

  // define axios for give data

  async fetchBooks() {
    this.setState({ ...this.state, tableProcessLoader: true })
    let res = await this._bookService.search(
      this.state.pager_limit,
      this.state.pager_offset,
      this.get_searchFilter(),
      this.returner_sort_array_to_fetch_func()
    ).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'fetchBooks_error' } });
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
    if (AccessService.checkAccess('BOOK_ADD_PREMIUM') === false && AccessService.checkAccess('BOOK_ADD_PRESS') === false) {
      return;
    };
    this.props.history.push('/book/create'); // /admin
  }

  /////  start onChange & search & reset function for search box ///////////

  filter_state_reset() {
    this.setState({
      ...this.state,
      filter_state: {
        title: {
          value: undefined,
          isValid: false
        },
        type: {
          value: null,
          isValid: false
        },
        genre: {
          value: null,
          isValid: false
        },
        tags: {
          value: [],
          isValid: false,
        },
        price: {
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
        mo_date: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
        pub_date: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
        press: {
          value: null,
          person_id: undefined,
          is_valid: false,
        },
        creator: {
          value: undefined,
          isValid: false,
        },
      }
    }, () => this.repetReset())
  }

  repetReset() {
    this.setState({
      ...this.state,
      filter_state: {
        title: {
          value: undefined,
          isValid: false
        },
        type: {
          value: null,
          isValid: false
        },
        genre: {
          value: null,
          isValid: false
        },
        tags: {
          value: [],
          isValid: false,
        },
        price: {
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
        mo_date: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
        pub_date: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
        press: {
          value: null,
          person_id: undefined,
          is_valid: false,
        },
        creator: {
          value: undefined,
          isValid: false,
        },
      }
    })
  }

  handle_tagsKeyDown(event: any/* SyntheticKeyboardEvent<HTMLElement> */) {
    if (!this.state.tags_inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        const newVal = this.state.tags_inputValue;
        this.setState({
          ...this.state,
          filter_state: {
            ...this.state.filter_state,
            tags: {
              ...this.state.filter_state.tags,
              value: [...this.state.filter_state.tags.value,
              { label: newVal, value: newVal }
              ]
            }
          },
          tags_inputValue: ''
        });
        event.preventDefault();
    }
  };

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
    if (inputType === 'title') {
      if (value === undefined || value === '') {
        isValid = false;
      } else {
        isValid = true;
      }
    }
    if (inputType === 'creator') {
      if (value === undefined || value === '') {
        isValid = false;
      } else {
        isValid = true;
      }
    }
    this.setState({
      ...this.state,
      filter_state: {
        ...this.state.filter_state, [inputType]: { value: value, isValid: isValid }
      }
    })
  }

  handleSelectInputChange(value: any[], inputType: any) {
    let isValid;
    if (!value || !value.length) {
      isValid = false;
    } else {
      isValid = true;
    }
    this.setState({
      ...this.state,
      filter_state: {
        ...this.state.filter_state, [inputType]: { value: value || [], isValid: isValid }
      }
    })
  }

  filter: any;

  /////  end onChange & search & reset function for search box ///////////

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
              <h2 className="text-bold text-dark pl-3">{Localization.book}</h2>
              {
                AccessService.checkOneOFAllAccess(['BOOK_ADD_PREMIUM', 'BOOK_ADD_PRESS'])
                  ?
                  <BtnLoader
                    loading={false}
                    disabled={false}
                    btnClassName="btn btn-success shadow-default shadow-hover mb-4"
                    onClick={() => this.gotoBookCreate()}
                  >
                    {Localization.new}
                  </BtnLoader>
                  :
                  undefined
              }
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
                    <Input
                      onChange={(value, isValid) => this.handleInputChange(value, 'title')}
                      label={Localization.title}
                      placeholder={Localization.title}
                      defaultValue={this.state.filter_state.title.value}
                    />
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <div className="form-group">
                      <label htmlFor="">{Localization.type} <span className="text-danger"></span></label>
                      <Select
                        isMulti
                        onChange={(value: any) => this.handleSelectInputChange(value, 'type')}
                        options={this.typeOptions}
                        value={this.state.filter_state.type.value}
                        placeholder={Localization.type}
                      />
                    </div>
                  </div>
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
                    <Input
                      onChange={(value, isValid) => this.handleInputChange(value, 'creator')}
                      label={Localization.creator}
                      placeholder={Localization.creator}
                      defaultValue={this.state.filter_state.creator.value}
                    />
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <div className="form-group">
                      <label htmlFor="">{Localization.genre}</label>
                      <Select
                        isMulti
                        onChange={(value: any) => this.handleSelectInputChange(value, 'genre')}
                        options={this.genreOptions}
                        value={this.state.filter_state.genre.value}
                        placeholder={Localization.genre}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <div className="form-group">
                      <label htmlFor="">{Localization.tags}</label>
                      <Select
                        isMulti
                        onChange={(value: any) => this.handleSelectInputChange(value, 'tags')}
                        value={this.state.filter_state.tags.value}
                        placeholder={Localization.tags}
                        onKeyDown={(e) => this.handle_tagsKeyDown(e)}
                        inputValue={this.state.tags_inputValue}
                        menuIsOpen={false}
                        components={{ DropdownIndicator: null, }}
                        isClearable
                        onInputChange={(inputVal) => this.setState({ ...this.state, tags_inputValue: inputVal })}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <AppNumberRange
                      label={Localization.price}
                      from={this.state.filter_state.price.from}
                      to={this.state.filter_state.price.to}
                      onChange={(from, from_isValid, to, to_isValid, isValid) => this.range_picker_onChange(from, from_isValid, to, to_isValid, isValid, 'price')}
                    />
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <AppRangePicker
                      label={Localization.publication_date}
                      from={this.state.filter_state.pub_date.from}
                      to={this.state.filter_state.pub_date.to}
                      onChange={(from, from_isValid, to, to_isValid, isValid) => this.range_picker_onChange(from, from_isValid, to, to_isValid, isValid, 'pub_date')}
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
              <Table row_offset_number={this.state.pager_offset} loading={this.state.tableProcessLoader} list={this.state.book_table.list} colHeaders={this.state.book_table.colHeaders} actions={this.state.book_table.actions}></Table>
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