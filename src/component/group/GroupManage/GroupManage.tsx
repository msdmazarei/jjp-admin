import React from "react";
import { Table, IProps_table } from "../../table/table";
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
import { Input } from "../../form/input/Input";
import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import AsyncSelect from 'react-select/async';
import { GroupService } from "../../../service/service.group";
import { PersonService } from "../../../service/service.person";
import { IPerson } from "../../../model/model.person";
import { AppRangePicker } from "../../form/app-rangepicker/AppRangePicker";
import { AddorRemovePermissionManage } from "../AddorRemovePermissionManage/AddorRemovePermissionManage"
import { TABLE_SORT } from "../../table/tableSortHandler";
import { SORT } from "../../../enum/Sort";
// import { PERMISSIONS } from "../../../enum/Permission";

//// start define IProps ///

export interface IProps {
  history: History;
  internationalization: TInternationalization;
  // token: IToken;
}

//// end define IProps ///

interface IFilterGroup {
  title: {
    value: string | undefined,
    isValid: boolean
  };
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
  }
}

interface ISortGroup {
  title: boolean;
  creator: boolean;
  creation_date: boolean;
  modification_date: boolean;
}
//// start define IState ///

interface IState {
  user_table: IProps_table;
  UserError: string | undefined;
  pager_offset: number;
  pager_limit: number;
  removeModalShow: boolean;
  addPermissionModalShow: boolean;
  prevBtnLoader: boolean;
  nextBtnLoader: boolean;
  setRemoveLoader: boolean;
  isSearch: boolean;
  searchVal: string | undefined;
  filterSearchBtnLoader: boolean;
  tableProcessLoader: boolean;
  filter_state: IFilterGroup;
  advance_search_box_show: boolean;
  sort: string[];
  sortShowStyle: ISortGroup;
}

//// end define IState ///


/// start class define ///

class GroupManageComponent extends BaseComponent<IProps, IState>{

  state = {
    user_table: {
      list: [],
      colHeaders: [
        {
          field: "title", title: Localization.title,
          templateFunc: () => {
            return <>
              {Localization.title}
              {
                (this.is_this_sort_exsit_in_state(SORT.title) === false && this.is_this_sort_exsit_in_state(SORT.title_) === false)
                  ?
                  <span
                    className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                    onClick={() => this.sort_handler_func(SORT.title, SORT.title_, true, 1)}
                    onMouseOver={() => this.sort_icon_change_on_mouse_over_out('title', true)}
                    onMouseOut={() => this.sort_icon_change_on_mouse_over_out('title', false)}>
                    <i className={this.state.sortShowStyle.title === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                  </span>
                  :
                  this.is_this_sort_exsit_in_state(SORT.title) === true
                    ?
                    <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                      onClick={() => this.sort_handler_func(SORT.title_, SORT.title, false, 0)}
                      onMouseOver={() => this.sort_icon_change_on_mouse_over_out('title', true)}
                      onMouseOut={() => this.sort_icon_change_on_mouse_over_out('title', false)}>
                      <i className={this.state.sortShowStyle.title === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                    </span>
                    :
                    this.is_this_sort_exsit_in_state(SORT.title_) === true
                      ?
                      <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                        onClick={() => this.sort_handler_func(SORT.title_, SORT.title, true, 2)}
                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('title', true)}
                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('title', false)}>
                        <i className={this.state.sortShowStyle.title === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                      </span>
                      :
                      undefined
              }
            </>
          },
          cellTemplateFunc: (row: any) => {
            if (row.title) {
              return <div title={row.title} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.title}
              </div>
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
              return <div title={row.creator} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.creator}
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
      ],
      actions: [
        {
          text: <i title={Localization.remove} className="fa fa-trash text-danger"></i>,
          ac_func: (row: any) => { this.onShowRemoveModal(row) },
          name: Localization.remove
        },
        {
          text: <i title={Localization.permission} className="fa fa-universal-access text-info"></i>,
          ac_func: (row: any) => { this.onShowAddPermissionModal(row) },
          name: Localization.permission
        },
        {
          text: <i title={Localization.update} className="fa fa-pencil-square-o text-primary"></i>,
          ac_func: (row: any) => { this.updateRow(row) },
          name: Localization.update
        },
      ]
    },
    UserError: undefined,
    pager_offset: 0,
    pager_limit: 10,
    prevBtnLoader: false,
    nextBtnLoader: false,
    removeModalShow: false,
    addPermissionModalShow: false,
    setRemoveLoader: false,
    setAddPermissionLoader: false,
    isSearch: false,
    searchVal: undefined,
    filterSearchBtnLoader: false,
    tableProcessLoader: false,
    filter_state: {
      title: {
        value: undefined,
        isValid: false
      },
      creator: {
        value: undefined,
        isValid: false,
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
    },
    advance_search_box_show: false,
    sort: [],
    sortShowStyle: {
      title: false,
      creator: false,
      creation_date: false,
      modification_date: false,
    }
  }

  selectedGroup: any | undefined;
  selectedGroupForPermission: any | undefined;

  private _groupService = new GroupService();
  private _personService = new PersonService();

  // constructor(props: IProps) {
  //   super(props);
  //   // this._groupService.setToken(this.props.token)
  // }

  componentDidMount() {
    this.setState({
      ...this.state,
      tableProcessLoader: true
    })
    TABLE_SORT.sortArrayReseter();
    this.fetchGroup();
  }

  sort_handler_func(comingType: string, reverseType: string, is_just_add_or_remove: boolean, typeOfSingleAction: number) {
    if (is_just_add_or_remove === false) {
      TABLE_SORT.coming_field_name_by_sortType_and_that_reverseType_exist_in_sortArray(comingType, reverseType);
    }
    if (is_just_add_or_remove === true) {
      TABLE_SORT.just_add_or_remove(comingType, typeOfSingleAction)
    }
    this.setState({ ...this.state, sort: TABLE_SORT.sortArrayReturner() }, () => this.fetchGroup());
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

  /// start navigation function for create ant update ///
  gotoGroupCreate() {
    this.props.history.push('/group/create');
  }

  updateRow(group_id: any) {
    this.props.history.push(`/group/${group_id.id}/edit`);
  }

  /// end navigation function for create ant update ///

  /// start for all function for request ///

  async fetchGroup() {
    this.setState({ ...this.state, tableProcessLoader: true });
    let res = await this._groupService.search(
      this.state.pager_limit,
      this.state.pager_offset,
      this.get_searchFilter(),
      this.returner_sort_array_to_fetch_func(),
    ).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'fetchGroup_error' } });
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
        ...this.state, user_table: {
          ...this.state.user_table,
          list: res.data.result
        },
        prevBtnLoader: false,
        nextBtnLoader: false,
        tableProcessLoader: false,
        filterSearchBtnLoader: false,
      });
    }
  }

  async onRemoveGroup(group_id: string) {
    this.setState({ ...this.state, setRemoveLoader: true });
    let res = await this._groupService.remove(group_id).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'onRemoveGroup_error' } });
      this.setState({ ...this.state, setRemoveLoader: false });
    });
    if (res) {
      this.setState({ ...this.state, setRemoveLoader: false });
      this.apiSuccessNotify();
      this.fetchGroup();
      this.onHideRemoveModal();
    }
  }

  /// end for all function for request ///


  /// start remove functions and render ///

  onShowRemoveModal(group: any) {
    this.selectedGroup = group;
    this.setState({ ...this.state, removeModalShow: true });
  }

  onHideRemoveModal() {
    this.selectedGroup = undefined;
    this.setState({ ...this.state, removeModalShow: false });

  }

  render_delete_modal(selectedGroup: any) {
    if (!this.selectedGroup || !this.selectedGroup.id) return;
    return (
      <>
        <Modal show={this.state.removeModalShow} onHide={() => this.onHideRemoveModal()}>
          <Modal.Body>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.name}{" "}{Localization.group}:&nbsp;
            </span>
              {this.selectedGroup.title}
            </p>
            <p className="text-danger">{Localization.msg.ui.item_will_be_removed_continue}</p>

          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideRemoveModal()}>{Localization.close}</button>
            <BtnLoader
              btnClassName="btn btn-danger shadow-default shadow-hover"
              onClick={() => this.onRemoveGroup(selectedGroup.id)}
              loading={this.state.setRemoveLoader}
            >
              {Localization.remove}
            </BtnLoader>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  /// end remove functions and render ///


  // start add permission modal function define ////////

  onShowAddPermissionModal(group: any) {
    this.selectedGroupForPermission = group;
    this.setState({
      ...this.state,
      addPermissionModalShow: true
    });
  }

  onHideAddPermissionModal() {
    this.selectedGroupForPermission = undefined;
    this.setState({
      ...this.state,
      addPermissionModalShow: false
    });
  }

  // end add permission modal function define ////////


  /// start timestampe to date functions ///

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

  /// end timestampe to date functions ///


  /// start previous and next btn render's function ///

  pager_previous_btn_render() {
    if (this.state.user_table.list && (this.state.user_table.list! || []).length) {
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
    } else if (this.state.user_table.list && !(this.state.user_table.list! || []).length) {
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

    } else if (this.state.UserError) {
      return;
    } else {
      return;
    }
  }

  pager_next_btn_render() {
    if (this.state.user_table.list && (this.state.user_table.list! || []).length) {
      return (
        <>
          {
            !(this.state.pager_limit > (this.state.user_table.list! || []).length) &&
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
    } else if (this.state.user_table.list && !(this.state.user_table.list! || []).length) {
      return;
    } else if (this.state.user_table.list) {
      return;
    } else {
      return;
    }
  }

  /// end previous and next btn render's function ///


  /// start previous and next btn onchange functions ///

  onPreviousClick() {
    this.setState({
      ...this.state,
      pager_offset: this.state.pager_offset - this.state.pager_limit,
      prevBtnLoader: true,
      tableProcessLoader: true,
    }, () => {
      this.gotoTop();
      this.fetchGroup()
      // {
      //   this.state.isSearch ? this.fetchFilterGroupthis.state.searchVal) : this.fetchUsers()
      // }
    });
  }

  onNextClick() {
    this.setState({
      ...this.state,
      pager_offset: this.state.pager_offset + this.state.pager_limit,
      nextBtnLoader: true,
      tableProcessLoader: true,
    }, () => {
      this.gotoTop();
      this.fetchGroup()
      // {
      //   this.state.isSearch ? this.fetchFilterGroup(this.state.searchVal) : this.fetchGroup()
      // }
    });
  }

  /// end previous and next btn onchange functions ///


  private _searchFilter: any | undefined;
  private get_searchFilter() {
    return this._searchFilter;
  }
  private set_searchFilter() {
    const obj: any = {};

    if (this.state.filter_state.title.isValid) {
      obj['title'] = { $prefix: this.state.filter_state.title.value };
    }

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
      this.fetchGroup()
    });
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
        creator: {
          value: undefined,
          isValid: false,
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
        creator: {
          value: undefined,
          isValid: false,
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

  handlePersonChange_person_serch = (selectedPerson: { label: string, value: IPerson }) => {
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

  async promiseOptions2_person_serch(inputValue: any, callBack: any) {
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
  debounce_300_person_serch(inputValue: any, callBack: any) {
    if (this.setTimeout_person_val) {
      clearTimeout(this.setTimeout_person_val);
    }
    this.setTimeout_person_val = setTimeout(() => {
      this.promiseOptions2_person_serch(inputValue, callBack);
    }, 1000);
  }

  select_noOptionsMessage_person_serch(obj: { inputValue: string }) {
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

  //// render call Table component ///////

  render() {
    return (
      <>
        <div className="content">
          <div className="row">
            <div className="col-12">
              <h2 className="text-bold text-dark pl-3">{Localization.group}</h2>
              <BtnLoader
                loading={false}
                disabled={false}
                btnClassName="btn btn-success shadow-default shadow-hover mb-4"
                onClick={() => this.gotoGroupCreate()}
              >
                {Localization.new}
              </BtnLoader>
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
                    <Input
                      onChange={(value, isValid) => this.handleInputChange(value, 'creator')}
                      label={Localization.creator}
                      placeholder={Localization.creator}
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
                      loadOptions={(inputValue, callback) => this.debounce_300_person_serch(inputValue, callback)}
                      noOptionsMessage={(obj) => this.select_noOptionsMessage_person_serch(obj)}
                      onChange={(selectedPerson: any) => this.handlePersonChange_person_serch(selectedPerson)}
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
              <Table row_offset_number={this.state.pager_offset} loading={this.state.tableProcessLoader} list={this.state.user_table.list} colHeaders={this.state.user_table.colHeaders} actions={this.state.user_table.actions}></Table>
              <div>
                {this.pager_previous_btn_render()}
                {this.pager_next_btn_render()}
              </div>
            </div>
          </div>
        </div>
        {this.render_delete_modal(this.selectedGroup)}
        {
          this.selectedGroupForPermission === undefined
            ?
            undefined
            :
            <AddorRemovePermissionManage
              onShow={this.state.addPermissionModalShow}
              onHide={() => this.onHideAddPermissionModal()}
              group_title={this.selectedGroupForPermission.title}
              group_id={this.selectedGroupForPermission.id}
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

export const GroupManage = connect(
  state2props,
  dispatch2props
)(GroupManageComponent);