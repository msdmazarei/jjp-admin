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
import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import AsyncSelect from 'react-select/async';
import { GroupService } from "../../../service/service.group";
import { PermissionService } from "../../../service/service.permission";
// import { PERMISSIONS } from "../../../enum/Permission";

//// start define IProps ///

export interface IProps {
  history: History;
  internationalization: TInternationalization;
  token: IToken;
}

//// end define IProps ///


//// start define IFilterUser ///

interface IFilterUser {
  group: {
    value: string | undefined;
    isValid: boolean;
  };
}

//// end define IFilterUser ///


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
  setAddPermissionLoader: boolean;
  isSearch: boolean;
  searchVal: string | undefined;
  filter: IFilterUser,
  filterSearchBtnLoader: boolean;
  tableProcessLoader: boolean;
  permissions: {
    value: { label: string | number, value: object }[] | null,
    isValid: boolean
  };
}

//// end define IState ///


/// start class define ///

class GroupManageComponent extends BaseComponent<IProps, IState>{

  state = {
    user_table: {
      list: [],
      colHeaders: [
        {
          field: "title", title: Localization.title, cellTemplateFunc: (row: any) => {
            if (row.title) {
              return <div title={row.title} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.title}
              </div>
            }
            return '';
          }
        },
        {
          field: "creator", title: Localization.creator, cellTemplateFunc: (row: any) => {
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
          cellTemplateFunc: (row: any) => {
            if (row.creation_date) {
              return <div title={this._getTimestampToDate(row.creation_date)}>{this.getTimestampToDate(row.creation_date)}</div>
            }
            return '';
          }
        },
        {
          field: "modification_date", title: Localization.modification_date,
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
        // {
        //   text: <i title={Localization.update} className="fa fa-pencil-square-o text-primary"></i>,
        //   ac_func: (row: any) => { this.updateRow(row) },
        //   name: Localization.update
        // },
      ]
    },
    filter: {
      group: {
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
    addPermissionModalShow:false,
    setRemoveLoader: false,
    setAddPermissionLoader:false,
    isSearch: false,
    searchVal: undefined,
    filterSearchBtnLoader: false,
    tableProcessLoader: false,
    permissions: {
      value: null,
      isValid: true,
    },
  }

  selectedGroup: any | undefined;
  selectedGroupForPermission: any | undefined;
  private permissionRequstError_txt: string = Localization.no_item_found;
  private setTimeout_permission_val: any;

  private _groupService = new GroupService();
  private _permissionService = new PermissionService();

  constructor(props: IProps) {
    super(props);
    this._groupService.setToken(this.props.token)
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      tableProcessLoader: true
    })
    this.fetchGroup();
  }

  /// start navigation function for create ant update ///
  gotoGroupCreate() {
    this.props.history.push('/group/create');
  }

  // updateRow(group_id: any) {
  //   this.props.history.push(`/groups/${group_id.id}/edit`);
  // }

  /// end navigation function for create ant update ///

  /// start for all function for request ///

  async fetchGroup() {
    this.setState({ ...this.state, tableProcessLoader: true });
    let res = await this._groupService.search(
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

  async onRemoveGroup(group_id: string) {
    this.setState({ ...this.state, setRemoveLoader: true });
    let res = await this._groupService.remove(group_id).catch(error => {
      this.handleError({ error: error.response });
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
    this.setState({...this.state, addPermissionModalShow:true,})
    // if(this.selectedGroupForPermission.id){
    //   this.fetchGroupPermissions(this.selectedGroupForPermission.id);
    // };
  }

  async fetchGroupPermissions(group_id: string) {
    let res = await this._groupService.fetchGroupPermissions(group_id).catch(error => {
      this.handleError({ error: error.response });
    });

    if (res) {

      let newRes = res.data.result.map(item => { return { label: item.creation_date, value: { id:item.group_id } } });
    
      this.setState({
        ...this.state,
        permissions: {
          ...this.state.permissions,
          // value: res.data.result,
          value: newRes,
        },
        addPermissionModalShow:true,
      }
      );
    }
  }

  onHideAddPermissionModal() {
    this.selectedGroupForPermission = undefined;
    this.setState({
      ...this.state,
      permissions: { value: null, isValid: false },
      addPermissionModalShow: false
    });

  }

  debounce_300(inputValue: any, callBack: any) {
    if (this.setTimeout_permission_val) {
      clearTimeout(this.setTimeout_permission_val);
    }
    this.setTimeout_permission_val = setTimeout(() => {
      this.promiseOptions2(inputValue, callBack);
    }, 1000);
  }

  async promiseOptions2(inputValue: any, callBack: any) {
    let filter = undefined;
    if (inputValue) {
      filter = { permission: inputValue };
    }
    let res: any = await this._permissionService.search(10, 0, filter).catch(err => {
      let err_msg = this.handleError({ error: err.response, notify: false });
      this.permissionRequstError_txt = err_msg.body;
    });

    if (res) {
      let groups = res.data.result.map((ps: any) => {
        // let per :any= ps.permission
        // let permission : PERMISSIONS = per
        // return { label:Localization.permissions_list[permission]?Localization.permissions_list[permission]:ps.permission, value: ps }
        return { label: ps.permission, value: ps }
      });
      this.permissionRequstError_txt = Localization.no_item_found;
      callBack(groups);
    } else {
      callBack();
    }
  }

  select_noOptionsMessage(obj: { inputValue: string }) {
    return this.permissionRequstError_txt;
  }

  handleMultiSelectInputChange(newValue: any[]) {
    const user_id: string = this.selectedGroupForPermission!.id;
    if (this.state.permissions.value === null) {
      this.onAddPermissionToGroup(newValue, user_id);
      return;
    }

    if (newValue === null) {
      this.onRemovePermissionFromGroup(newValue, user_id);
      return;
    }

    const before: any[] = this.state.permissions.value!

    if (newValue.length > before.length) {
      this.onAddPermissionToGroup(newValue, user_id);
      return;
    }

    if (newValue.length < before.length) {
      this.onRemovePermissionFromGroup(newValue, user_id);
      return;
    }

    // if (newValue.length = before.length) {
    //   return;
    // }
  }

  async onAddPermissionToGroup(newValue: any[], group_id: string) {

    if (this.state.permissions.value === null) {
      const newPermission: object = {
        groups: [group_id],
        permissions: [newValue[0].value.id],
      };

      let res = await this._groupService.addPermissionToGroup(newPermission).catch(error => {
        this.handleError({ error: error.response });
      });

      if (res) {
        this.setState({
          ...this.state,
          permissions: {
            ...this.state.permissions,
            value: newValue,
          }
        })
        this.apiSuccessNotify();
        this.fetchGroup();
        return;
      }
    } else {
      const before: any[] = this.state.permissions.value!
      let addDiff = newValue.filter(x => !before.includes(x));
      const newPermission: object = {
        groups: [group_id],
        permissions: [addDiff[0].value.id],
      };

      let res = await this._groupService.addPermissionToGroup(newPermission).catch(error => {
        this.handleError({ error: error.response });
      });

      if (res) {
        this.setState({
          ...this.state,
          permissions: {
            ...this.state.permissions,
            value: newValue,
          }
        })
        this.apiSuccessNotify();
        this.fetchGroup();
      }
    }
  }

  async onRemovePermissionFromGroup(newValue: any[], group_id: string) {

    if (newValue === null) {

      const oneItemHaveState: any[] = this.state.permissions.value!;

      const removedPermission: object = {
        groups: [group_id],
        permissions: [oneItemHaveState[0].value.id],
      };

      let res = await this._groupService.removePermissionFromGroup(removedPermission).catch(error => {
        this.handleError({ error: error.response });
      });

      if (res) {
        this.setState({
          ...this.state,
          permissions: {
            ...this.state.permissions,
            value: null,
          }
        })
        this.apiSuccessNotify();
        this.fetchGroup();
        return;
      }

    } else {
      const before: any[] = this.state.permissions.value!
      let removeDiff = before.filter(x => !newValue.includes(x));

      const removedPermission: object = {
        groups: [group_id],
        permissions: [removeDiff[0].value.id],
      };

      let res = await this._groupService.removePermissionFromGroup(removedPermission).catch(error => {
        this.handleError({ error: error.response });
      });

      if (res) {
        this.setState({
          ...this.state,
          permissions: {
            ...this.state.permissions,
            value: newValue,
          }
        })
        this.apiSuccessNotify();
        this.fetchGroup();
      }
    }
  }

  render_AddPermissionToGroup_modal(selectedGroupForPermission: any) {
    if (!this.selectedGroupForPermission || !this.selectedGroupForPermission.id) return;
    return (
      <>
        <Modal size='xl' show={this.state.addPermissionModalShow} onHide={() => this.onHideAddPermissionModal()}>
          <Modal.Header>
            <h2 className='text-bold text-dark text-center w-100'>افزودن دسترسی</h2>
          </Modal.Header>
          <Modal.Body>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.name}{" "}{Localization.group}:&nbsp;
              </span>
              {/* {this.selectedGroupForPermission.name} {this.selectedGroupForPermission.username} */}
            </p>
            <div className="row">
              <div className="col-6">
                <label >{Localization.permission}</label>
                <AsyncSelect
                  isMulti
                  placeholder={Localization.permission}
                  cacheOptions
                  defaultOptions
                  value={this.state.permissions.value}
                  loadOptions={(inputValue:any, callback:any) => this.debounce_300(inputValue, callback)}
                  noOptionsMessage={(obj:any) => this.select_noOptionsMessage(obj)}
                  onChange={(selectedPerson: any) => this.handleMultiSelectInputChange(selectedPerson)}  
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideAddPermissionModal()}>{Localization.close}</button>
            {/* <BtnLoader
              btnClassName="btn btn-success shadow-default shadow-hover"
              onClick={() => this.onAddpermissionToGroup(selectedGroupForPermission.id)}
              loading={this.state.setAddPermissionLoader}
              disabled={!this.state.permissions.isValid}
            >
              {Localization.create}
            </BtnLoader> */}
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  // end add permission modal function define ////////


  /// start search functions and onchange handler ///

  handleFilterInputChange(value: string, isValid: boolean) {
    this.setState({
      ...this.state,
      filter: {
        ...this.state.filter,
        group: {
          value, isValid
        }
      },
    });
  }

  filterReset() {
    this.setState({
      ...this.state, filter: {
        ...this.state.filter,
        group: {
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
      this.fetchGroup()
    });
  }

  private _filter: IFilterUser = {
    group: { value: undefined, isValid: true },
  };
  isFilterEmpty(): boolean {
    if (this._filter.group.value) {
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
      if (this._filter.group.isValid) {
        obj['title'] = this._filter.group.value;
      }
      // if  ....
      return obj;
    }
    return;
  }

  /// end search functions and onchange handler ///


  /// start timestampe to date functions ///

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
          <div className="row">
            <div className="col-12">
              <div className="template-box mb-4">
                <div className="row">
                  <div className="col-sm-6 col-xl-4">
                    <Input
                      onChange={(value: string, isValid) => this.handleFilterInputChange(value, isValid)}
                      label={Localization.title}
                      placeholder={Localization.title}
                      defaultValue={this.state.filter.group.value}
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
        {this.render_delete_modal(this.selectedGroup)}
        {this.render_AddPermissionToGroup_modal(this.selectedGroupForPermission)}
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

export const GroupManage = connect(
  state2props,
  dispatch2props
)(GroupManageComponent);