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
import { IToken } from "../../../model/model.token";
import { Localization } from "../../../config/localization/localization";
import { BtnLoader } from "../../form/btn-loader/BtnLoader";
import { Input } from "../../form/input/Input";
import { IUser } from "../../../model/model.user";
import { UserService } from "../../../service/service.user"; import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import AsyncSelect from 'react-select/async';
import { GroupService } from "../../../service/service.group";

//// props & state define ////////
export interface IProps {
  history: History;
  internationalization: TInternationalization;
  token: IToken;
}

interface IFilterUser {
  user: {
    value: string | undefined;
    isValid: boolean;
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
  filter: IFilterUser,
  filterSearchBtnLoader: boolean;
  tableProcessLoader: boolean;
  group: {
    value: { label: string | number, value: object }[] | null,
    isValid: boolean
  };
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
              return <div title={row.person.address} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.person.address}
              </div>
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
          text: <i title={Localization.group} className="fa fa-users text-info"></i>,
          ac_func: (row: any) => { (this.onShowAddGroupModal(row)) },
          name: Localization.group
        },
      ]
    },
    filter: {
      user: {
        value: undefined,
        isValid: true,
      }
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
  }

  selectedUser: IUser | undefined;
  selectedUserForGroup: IUser | undefined;
  private groupRequstError_txt: string = Localization.no_item_found;
  private setTimeout_group_val: any;
  private _filter: IFilterUser = {
    user: { value: undefined, isValid: true },
  };

  private _userService = new UserService();
  private _groupService = new GroupService();

  constructor(props: IProps) {
    super(props);
    this._userService.setToken(this.props.token)
    this._groupService.setToken(this.props.token)
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      tableProcessLoader: true
    })
    this.fetchUsers();
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
      this.handleError({ error: error.response });
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
    if (this.selectedUserForGroup.id) {
      this.fetchUserGroups(this.selectedUserForGroup.id);
    };
  }

  async fetchUserGroups(user_id: string) {
    let res = await this._groupService.fetchUserGroups(user_id).catch(error => {
      this.handleError({ error: error.response });
    });

    if (res) {

      let newRes = res.data.result.map(item => { return { label: item.group.title, value: { id: item.group_id } } });

      this.setState({
        ...this.state,
        group: {
          ...this.state.group,
          // value: res.data.result,
          value: newRes,
        },
        addGroupModalShow: true,
      }
      );
    }
  }

  onHideAddGroupModal() {
    this.selectedUserForGroup = undefined;
    this.setState({
      ...this.state,
      group: { value: null, isValid: false },
      addGroupModalShow: false
    });
    // this.fetchUsers();
  }

  debounce_300(inputValue: any, callBack: any) {
    if (this.setTimeout_group_val) {
      clearTimeout(this.setTimeout_group_val);
    }
    this.setTimeout_group_val = setTimeout(() => {
      this.promiseOptions2(inputValue, callBack);
    }, 1000);
  }

  async promiseOptions2(inputValue: any, callBack: any) {
    let filter = undefined;
    if (inputValue) {
      filter = { title: inputValue };
    }
    let res: any = await this._groupService.search(10, 0, filter).catch(err => {
      let err_msg = this.handleError({ error: err.response, notify: false });
      this.groupRequstError_txt = err_msg.body;
    });

    if (res) {
      let groups = res.data.result.map((ps: any) => {
        return { label: ps.title, value: ps }
      });
      this.groupRequstError_txt = Localization.no_item_found;
      callBack(groups);
    } else {
      callBack();
    }
  }

  select_noOptionsMessage(obj: { inputValue: string }) {
    return this.groupRequstError_txt;
  }

  handleMultiSelectInputChange(newValue: any[]) {
    const user_id: string = this.selectedUserForGroup!.id;
    if (this.state.group.value === null) {
      this.onAddGroupToUser(newValue, user_id);
      return;
    }

    if (newValue === null) {
      this.onRemoveGroupFromUser(newValue, user_id);
      return;
    }

    const before: any[] = this.state.group.value!

    if (newValue.length > before.length) {
      this.onAddGroupToUser(newValue, user_id);
      return;
    }

    if (newValue.length < before.length) {
      this.onRemoveGroupFromUser(newValue, user_id);
      return;
    }

    // if (newValue.length = before.length) {
    //   return;
    // }
  }

  async onAddGroupToUser(newValue: any[], user_id: string) {

    if (this.state.group.value === null) {
      const newGroup: object = {
        groups: [newValue[0].value.id],
        users: [user_id],
      };

      let res = await this._groupService.addUserToGroup(newGroup).catch(error => {
        this.handleError({ error: error.response });
      });

      if (res) {
        this.setState({
          ...this.state,
          group: {
            ...this.state.group,
            value: newValue,
          }
        })
        this.apiSuccessNotify();
        return;
      }
    } else {
      const before: any[] = this.state.group.value!
      let addDiff = newValue.filter(x => !before.includes(x));
      const newGroup: object = {
        groups: [addDiff[0].value.id],
        users: [user_id],
      };

      let res = await this._groupService.addUserToGroup(newGroup).catch(error => {
        this.handleError({ error: error.response });
      });

      if (res) {
        this.setState({
          ...this.state,
          group: {
            ...this.state.group,
            value: newValue,
          }
        })
        this.apiSuccessNotify();
      }
    }
  }

  async onRemoveGroupFromUser(newValue: any[], user_id: string) {

    if (newValue === null) {

      const oneItemHaveState: any[] = this.state.group.value!;

      const removedGroup: object = {
        groups: [oneItemHaveState[0].value.id],
        users: [user_id],
      };

      let res = await this._groupService.removeUserFromGroup(removedGroup).catch(error => {
        this.handleError({ error: error.response });
      });

      if (res) {
        this.setState({
          ...this.state,
          group: {
            ...this.state.group,
            value: null,
          }
        })
        this.apiSuccessNotify();
        return;
      }

    } else {
      const before: any[] = this.state.group.value!
      let removeDiff = before.filter(x => !newValue.includes(x));

      const removedGroup: object = {
        groups: [removeDiff[0].value.id],
        users: [user_id],
      };

      let res = await this._groupService.removeUserFromGroup(removedGroup).catch(error => {
        this.handleError({ error: error.response });
      });

      if (res) {
        this.setState({
          ...this.state,
          group: {
            ...this.state.group,
            value: newValue,
          }
        })
        this.apiSuccessNotify();
      }
    }
  }

  render_AddGroupToUser_modal(selectedUserForGroup: any) {
    if (!this.selectedUserForGroup || !this.selectedUserForGroup.id) return;
    return (
      <>
        <Modal size='xl' show={this.state.addGroupModalShow} onHide={() => this.onHideAddGroupModal()}>
          <Modal.Header>
            <h2 className='text-bold text-dark text-center w-100'>افزودن گروه</h2>
          </Modal.Header>
          <Modal.Body>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.username}:&nbsp;
              </span>
              {selectedUserForGroup.name} {selectedUserForGroup.username}
            </p>
            <div className="row">
              <div className="col-6">
                <label >{Localization.group}{<span className="text-danger">*</span>}</label>
                <AsyncSelect
                  isClearable={false}
                  isMulti
                  placeholder={Localization.group}
                  cacheOptions
                  defaultOptions
                  value={this.state.group.value}
                  loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback)}
                  noOptionsMessage={(obj) => this.select_noOptionsMessage(obj)}
                  onChange={(selectedGroup: any[]) => this.handleMultiSelectInputChange(selectedGroup)}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideAddGroupModal()}>{Localization.close}</button>
          </Modal.Footer>
        </Modal>
      </>
    );
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

  handleFilterInputChange(value: string, isValid: boolean) {
    this.setState({
      ...this.state,
      filter: {
        ...this.state.filter,
        user: {
          value, isValid
        }
      },
    });
  }

  filterReset() {
    this.setState({
      ...this.state, filter: {
        ...this.state.filter,
        user: {
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
      this.fetchUsers()
    });
  }

  isFilterEmpty(): boolean {
    if (this._filter.user.value) {
      return false;
    }
    // if ....
    return true;
  }

  setFilter() {
    this._filter = { ...this.state.filter };
  }

  getFilter() {
    if (!this.isFilterEmpty()) {
      let obj: any = {};
      if (this._filter.user.isValid) {
        obj['username'] = this._filter.user.value;
      }
      // if  ....
      return obj;
    }
    return;
  }

  /////  end onChange & search & reset function for search box ///////////


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
          <div className="row">
            <div className="col-12">
              <div className="template-box mb-4">
                <div className="row">
                  <div className="col-sm-6 col-xl-4">
                    <Input
                      onChange={(value: string, isValid) => this.handleFilterInputChange(value, isValid)}
                      label={Localization.username}
                      placeholder={Localization.username}
                      defaultValue={this.state.filter.user.value}
                    />
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
              <Table loading={this.state.tableProcessLoader} list={this.state.user_table.list} colHeaders={this.state.user_table.colHeaders} actions={this.state.user_table.actions}></Table>
              <div>
                {this.pager_previous_btn_render()}
                {this.pager_next_btn_render()}
              </div>
            </div>
          </div>
        </div>
        {this.render_delete_modal(this.selectedUser)}
        {this.render_AddGroupToUser_modal(this.selectedUserForGroup)}
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

export const UserManage = connect(
  state2props,
  dispatch2props
)(UserManageComponent);