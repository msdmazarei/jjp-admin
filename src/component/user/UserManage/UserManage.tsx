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
import { IUser } from "../../../model/model.user";
import { UserService } from "../../../service/service.user"; import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import AsyncSelect from 'react-select/async';
import { AccessService } from "../../../service/service.access";
import { IPerson } from "../../../model/model.person";
import { AppRangePicker } from "../../form/app-rangepicker/AppRangePicker";
import { PersonService } from "../../../service/service.person";
import { AddOrRemoveGroupFromUserModal } from "../AddOrRemoveGroupFromUserModal/AddOrRemoveGroupFromUserModal";

//// props & state define ////////
export interface IProps {
  history: History;
  internationalization: TInternationalization;
  // token: IToken;
}

interface IFilterUser {
  username: {
    value: string | undefined,
    isValid: boolean
  };
  person_id: {
    value: { label: string, value: IPerson } | null;
    person_id: string | undefined;
    is_valid: boolean,
  };
  creation_date: {
    from: number | undefined,
    from_isValid: boolean,
    to: number | undefined,
    to_isValid: boolean,
    is_valid: boolean,
  };
  creator: {
    value: string | undefined,
    isValid: boolean
  };
}

interface IState {
  user_table: IProps_table;
  UserError: string | undefined;
  pager_offset: number;
  pager_limit: number;
  removeModalShow: boolean;
  addGroupModalShow: boolean;
  prevBtnLoader: boolean;
  nextBtnLoader: boolean;
  setRemoveLoader: boolean;
  setAddGroupLoader: boolean;
  isSearch: boolean;
  searchVal: string | undefined;
  filterSearchBtnLoader: boolean;
  tableProcessLoader: boolean;
  group: {
    value: { label: string | number, value: object }[] | null,
    isValid: boolean
  };
  filter_state: IFilterUser;
  advance_search_box_show: boolean;
}

class UserManageComponent extends BaseComponent<IProps, IState>{

  state = {
    user_table: {
      list: [],
      colHeaders: [
        {
          field: "email", title: Localization.username, cellTemplateFunc: (row: IUser) => {
            if (row.username) {
              return <div title={row.username} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.username}
              </div>
            }
            return '';
          }
        },
        {
          field: "name", title: Localization.full_name, cellTemplateFunc: (row: IUser) => {
            if (row.person.name) {
              return <div title={this.getUserFullName(row.person)} className="text-nowrap-ellipsis max-w-200px d-inline-block">
                {this.getUserFullName(row.person)}
              </div>
            }
            return '';
          }
        },
        {
          field: "image", title: Localization.image, templateFunc: () => { return <b>{Localization.image}</b> }, cellTemplateFunc: (row: IUser) => {
            if (row.person.image) {
              return <div title={Localization.image} className="text-center" >
                <div className="d-inline-block w-50px h-50px">
                  <img className="max-w-50px max-h-50px profile-img-rounded" src={"/api/serve-files/" + row.person.image} alt="" onError={e => this.userImageOnError(e)} />
                </div>
              </div>
            }
            else {
              return <div className="text-center">
                <div className="d-inline-block w-50px h-50px">
                  <img className="max-w-50px max-h-50px  profile-img-rounded" src={this.defaultPersonImagePath} alt="" />
                </div>
              </div>
            }
          }
        },
        {
          field: "creation_date", title: Localization.creation_date,
          cellTemplateFunc: (row: IUser) => {
            if (row.creation_date) {
              return <div title={this._getTimestampToDate(row.creation_date)}>{this.getTimestampToDate(row.creation_date)}</div>
            }
            return '';
          }
        },
        {
          field: "cell_no", title: Localization.cell_no, cellTemplateFunc: (row: IUser) => {
            if (row.person.cell_no) {
              return <div title={row.person.cell_no} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.person.cell_no}
              </div>
            }
            return '';
          }
        },
        {
          field: "email", title: Localization.email, cellTemplateFunc: (row: IUser) => {
            if (row.person.email) {
              return <div title={row.person.email} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.person.email}
              </div>
            }
            return '';
          }
        },
        {
          field: "phone", title: Localization.phone, cellTemplateFunc: (row: IUser) => {
            if (row.person.phone) {
              return <div title={row.person.phone} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.person.phone}
              </div>
            }
            return '';
          }
        },
        {
          field: "address", title: Localization.address, cellTemplateFunc: (row: IUser) => {
            if (row.person.address) {
              return <div title={row.person.address} className="text-nowrap-ellipsis max-w-100px d-inline-block">
                {row.person.address}
              </div>
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
          text: <i title={Localization.group} className="fa fa-users text-info"></i>,
          ac_func: (row: any) => { (this.onShowAddGroupModal(row)) },
          name: Localization.group
        },
      ]
        :
        undefined
    },
    UserError: undefined,
    pager_offset: 0,
    pager_limit: 10,
    prevBtnLoader: false,
    nextBtnLoader: false,
    removeModalShow: false,
    addGroupModalShow: false,
    setRemoveLoader: false,
    setAddGroupLoader: false,
    isSearch: false,
    searchVal: undefined,
    filterSearchBtnLoader: false,
    tableProcessLoader: false,
    group: {
      value: null,
      isValid: true,
    },
    filter_state: {
      username: {
        value: undefined,
        isValid: false
      },
      person_id: {
        value: null,
        person_id: undefined,
        is_valid: false,
      },
      creation_date: {
        from: undefined,
        from_isValid: false,
        to: undefined,
        to_isValid: false,
        is_valid: false,
      },
      creator: {
        value: undefined,
        isValid: false,
      },
    },
    advance_search_box_show: false,
  }

  selectedUser: IUser | undefined;
  selectedUserForGroup: IUser | undefined;
  private _userService = new UserService();
  private _personService = new PersonService();

  // constructor(props: IProps) {
  //   super(props);
  //   // this._userService.setToken(this.props.token)
  //   // this._groupService.setToken(this.props.token)
  // }

  componentDidMount() {
    if (AccessService.checkAccess('USER_GET_PREMIUM')) {
      this.setState({
        ...this.state,
        tableProcessLoader: true
      })
      this.fetchUsers();
    }
  }

  checkAllAccess(): boolean {
    if (AccessService.checkOneOFAllAccess(['USER_DELETE_PREMIUM', 'USER_EDIT_PREMIUM'])) {
      return true;
    }
    return false;
  }

  checkDeleteToolAccess(): boolean {
    if (AccessService.checkAccess('USER_DELETE_PREMIUM')) {
      return true;
    }
    return false
  }

  checkUpdateToolAccess(): boolean {
    if (AccessService.checkAccess('USER_EDIT_PREMIUM')) {
      return true;
    }
    return false
  }

  gotoUserCreate() {
    this.props.history.push('/user/create');
  }

  updateRow(user_id: any) {
    this.props.history.push(`/user/${user_id.id}/edit`);
  }

  // start define axios for give data for user table /////

  async fetchUsers() {
    this.setState({ ...this.state, tableProcessLoader: true });
    let res = await this._userService.search(
      this.state.pager_limit,
      this.state.pager_offset,
      this.get_searchFilter()
    ).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'fetchUsers_error' } });
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

  // end define axios for give data for user table /////


  // start timestamp to date and reverse

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

  // end timestamp to date and reverse


  // start delete modal function define ////////

  onShowRemoveModal(user: IUser) {
    this.selectedUser = user;
    this.setState({ ...this.state, removeModalShow: true });
  }

  onHideRemoveModal() {
    this.selectedUser = undefined;
    this.setState({ ...this.state, removeModalShow: false });

  }

  async onRemoveUser(user_id: string) {
    this.setState({ ...this.state, setRemoveLoader: true });
    let res = await this._userService.remove(user_id).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'onRemoveUser_error' } });
      this.setState({ ...this.state, setRemoveLoader: false });
    });
    if (res) {
      this.setState({ ...this.state, setRemoveLoader: false });
      this.apiSuccessNotify();
      this.fetchUsers();
      this.onHideRemoveModal();
    }
  }

  render_delete_modal(selectedUser: any) {
    if (!this.selectedUser || !this.selectedUser.id) return;
    return (
      <>
        <Modal show={this.state.removeModalShow} onHide={() => this.onHideRemoveModal()}>
          <Modal.Body>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.username}:&nbsp;
            </span>
              {this.selectedUser.name} {this.selectedUser.username}
            </p>
            <p className="text-danger">{Localization.msg.ui.item_will_be_removed_continue}</p>

          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideRemoveModal()}>{Localization.close}</button>
            <BtnLoader
              btnClassName="btn btn-danger shadow-default shadow-hover"
              onClick={() => this.onRemoveUser(selectedUser.id)}
              loading={this.state.setRemoveLoader}
            >
              {Localization.remove}
            </BtnLoader>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  // end delete modal function define ////////


  // start add group modal function define ////////

  onShowAddGroupModal(user: IUser) {
    this.selectedUserForGroup = user;
    this.setState({
      ...this.state,
      addGroupModalShow: true,
    });
  }

  onHideAddGroupModal() {
    this.selectedUserForGroup = undefined;
    this.setState({
      ...this.state,
      addGroupModalShow: false,
    });
  }

  // end add group modal function define ////////

  // start previous and next button create ///////

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

  // end previous and next button create ///////


  // start previous and next onclick function define ////

  onPreviousClick() {
    this.setState({
      ...this.state,
      pager_offset: this.state.pager_offset - this.state.pager_limit,
      prevBtnLoader: true,
      tableProcessLoader: true,
    }, () => {
      this.gotoTop();
      this.fetchUsers()
      // {
      //   this.state.isSearch ? this.fetchFilterUsers(this.state.searchVal) : this.fetchUsers()
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
      this.fetchUsers()
      // {
      //   this.state.isSearch ? this.fetchFilterUsers(this.state.searchVal) : this.fetchUsers()
      // }
    });
  }

  // end previous and next onclick function define ////


  /////  start onChange & search & reset function for search box ///////////

  private _searchFilter: any | undefined;
  private get_searchFilter() {
    return this._searchFilter;
  }
  private set_searchFilter() {
    const obj: any = {};

    if (this.state.filter_state.username.isValid) {
      obj['username'] = { $prefix: this.state.filter_state.username.value };
    }

    if (this.state.filter_state.person_id.is_valid) {
      obj['person_id'] = { $eq: this.state.filter_state.person_id.person_id };
    }

    if (this.state.filter_state.creation_date.is_valid === true) {
      if (this.state.filter_state.creation_date.from_isValid === true && this.state.filter_state.creation_date.to_isValid === true) {
        obj['creation_date'] = { $gte: this.state.filter_state.creation_date.from, $lte: (this.state.filter_state.creation_date.to! + 86400) }
      } else if (this.state.filter_state.creation_date.from_isValid === true && this.state.filter_state.creation_date.to_isValid === false) {
        obj['creation_date'] = { $gte: this.state.filter_state.creation_date.from }
      } else if (this.state.filter_state.creation_date.from_isValid === false && this.state.filter_state.creation_date.to_isValid === true) {
        obj['creation_date'] = { $lte: this.state.filter_state.creation_date.to }
      }
    }

    if (this.state.filter_state.creator.isValid) {
      obj['creator'] = { $prefix: this.state.filter_state.creator.value };
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
      this.fetchUsers()
    });
  }

  filter_state_reset() {
    this.setState({
      ...this.state,
      filter_state: {
        username: {
          value: undefined,
          isValid: false
        },
        person_id: {
          value: null,
          person_id: undefined,
          is_valid: false,
        },
        creation_date: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
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
        username: {
          value: undefined,
          isValid: false
        },
        person_id: {
          value: null,
          person_id: undefined,
          is_valid: false,
        },
        creation_date: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
        creator: {
          value: undefined,
          isValid: false,
        },
      }
    })
  }

  handlePersonChange_search = (selectedPerson: { label: string, value: IPerson }) => {
    let newperson = { ...selectedPerson };
    let isValid = true;      // newperson = selectedPerson;
    this.setState({
      ...this.state,
      filter_state: {
        ...this.state.filter_state,
        person_id: {
          value: newperson,
          person_id: newperson.value.id,
          is_valid: isValid,
        }
      }
    })
  }

  person_of_user_in_search_remover() {
    this.setState({
      ...this.state,
      filter_state: {
        ...this.state.filter_state,
        person_id: {
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

  private personRequstError_txt: string = Localization.no_item_found;

  async promiseOptions2_search(inputValue: any, callBack: any) {
    let filter = undefined;
    if (inputValue) {
      filter = { full_name: { $prefix: inputValue } };
    }
    let res: any = await this._personService.search(10, 0, filter).catch(err => {
      let err_msg = this.handleError({ error: err.response, notify: false, toastOptions: { toastId: 'user_search_error' } });
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
  debounce_300_search(inputValue: any, callBack: any) {
    if (this.setTimeout_person_val) {
      clearTimeout(this.setTimeout_person_val);
    }
    this.setTimeout_person_val = setTimeout(() => {
      this.promiseOptions2_search(inputValue, callBack);
    }, 1000);
  }

  select_noOptionsMessage_search(obj: { inputValue: string }) {
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
              <h2 className="text-bold text-dark pl-3">{Localization.user}</h2>
              <BtnLoader
                loading={false}
                disabled={false}
                btnClassName="btn btn-success shadow-default shadow-hover mb-4"
                onClick={() => this.gotoUserCreate()}
              >
                {Localization.new}
              </BtnLoader>
            </div>
          </div>
          {
            AccessService.checkAccess('USER_GET_PREMIUM')
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
                            onChange={(value, isValid) => this.handleInputChange(value, 'username')}
                            label={Localization.username}
                            placeholder={Localization.username}
                            defaultValue={this.state.filter_state.username.value}
                          />
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <label >{Localization.person}</label>
                          <i
                            title={Localization.reset}
                            className="fa fa-times cursor-pointer remover-in_box-async text-danger mx-1"
                            onClick={() => this.person_of_user_in_search_remover()}
                          ></i>
                          <AsyncSelect
                            placeholder={Localization.person}
                            cacheOptions
                            defaultOptions
                            value={this.state.filter_state.person_id.value}
                            loadOptions={(inputValue, callback) => this.debounce_300_search(inputValue, callback)}
                            noOptionsMessage={(obj) => this.select_noOptionsMessage_search(obj)}
                            onChange={(selectedPerson: any) => this.handlePersonChange_search(selectedPerson)}
                          />
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <AppRangePicker
                            label={Localization.creation_date}
                            from={this.state.filter_state.creation_date.from}
                            to={this.state.filter_state.creation_date.to}
                            onChange={(from, from_isValid, to, to_isValid, isValid) => this.range_picker_onChange(from, from_isValid, to, to_isValid, isValid, 'creation_date')}
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
              </>
              :
              undefined
          }
        </div>
        {this.render_delete_modal(this.selectedUser)}
        {
          this.selectedUserForGroup === undefined
            ?
            undefined
            :
            <AddOrRemoveGroupFromUserModal
              onShow={this.state.addGroupModalShow}
              onHide={() => this.onHideAddGroupModal()}
              userName={this.selectedUserForGroup.username}
              user_id={this.selectedUserForGroup.id}
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

export const UserManage = connect(
  state2props,
  dispatch2props
)(UserManageComponent);