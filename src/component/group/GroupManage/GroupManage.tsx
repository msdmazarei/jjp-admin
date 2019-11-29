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
import { PermissionService } from "../../../service/service.permission";
import { PersonService } from "../../../service/service.person";
import { IPerson } from "../../../model/model.person";
import { AppRangePicker } from "../../form/app-rangepicker/AppRangePicker";
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
  filterSearchBtnLoader: boolean;
  tableProcessLoader: boolean;
  permissions: {
    value: { label: string | number, value: object }[] | null,
    isValid: boolean
  };
  beforePermission_id_array: string[] | [];
  filter_state: IFilterGroup;
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
    permissions: {
      value: null,
      isValid: true,
    },
    beforePermission_id_array: [],
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
  }

  selectedGroup: any | undefined;
  selectedGroupForPermission: any | undefined;
  private permissionRequstError_txt: string = Localization.no_item_found;
  private setTimeout_permission_val: any;

  private _groupService = new GroupService();
  private _permissionService = new PermissionService();
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
    this.fetchGroup();
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
      this.get_searchFilter()
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
    // this.setState({ ...this.state, addPermissionModalShow: true, })
    if (this.selectedGroupForPermission.id) {
      this.fetchGroupPermissions(this.selectedGroupForPermission.id);
    };
  }

  async fetchGroupPermissions(group_id: string) {
    const groupData: object = {
      groups: [group_id],
    };
    let res = await this._groupService.fetchGroupPermissions(groupData).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'fetchGroupPermissions_error' } });
    });

    if (res) {

      let newRes = res.data.result.map(item => { return { label: item.permission.permission, value: { id: item.permission_id } } });
      let beforePermission_id_array = res.data.result.length > 0 ? res.data.result.map(item => { return item.permission_id }) : [];

      this.setState({
        ...this.state,
        permissions: {
          ...this.state.permissions,
          // value: res.data.result,
          value: newRes,
        },
        addPermissionModalShow: true,
        beforePermission_id_array: beforePermission_id_array,
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
      let err_msg = this.handleError({ error: err.response, notify: false, toastOptions: { toastId: 'promiseOptions2fetchGroupPermissions_error' } });
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
    this.setState({
      ...this.state,
      permissions: {
        ...this.state.permissions,
        value: newValue,
      }
    })
  }

  handle_on_update_permissions_btn(group_id: string) {
    if (this.state.beforePermission_id_array.length > 0 && this.state.permissions.value !== null) {
      const updated: any[] = this.state.permissions.value!;
      const before_id_array: any[] = this.state.beforePermission_id_array;
      let updated_id_array = updated.map(item => { return item.value.id });
      let toRemovedItems = before_id_array.filter(x => !updated_id_array.includes(x));
      let toAddedItems = updated_id_array.filter(x => !before_id_array.includes(x));
      this.onRemovePermissionFromGroup(toRemovedItems, group_id);
      this.onAddPermissionToGroup(toAddedItems, group_id);
    };
    if (this.state.beforePermission_id_array.length > 0 && this.state.permissions.value === null) {
      let toRemovedItems = this.state.beforePermission_id_array;
      this.onRemovePermissionFromGroup(toRemovedItems, group_id);
    };
    if (this.state.beforePermission_id_array.length === 0 && this.state.permissions.value !== null) {
      const updated: any[] = this.state.permissions.value!;
      let updated_id_array = updated.map(item => { return item.value.id });
      let toAddedItems = updated_id_array;
      this.onAddPermissionToGroup(toAddedItems, group_id);
    };
    if (this.state.beforePermission_id_array.length === 0 && this.state.permissions.value === null) {
      return;
    }
  }

  async onRemovePermissionFromGroup(newValue: any[], group_id: string) {

    if (newValue.length === 0) {
      return;
    }

    const removedPermission: object = {
      groups: [group_id],
      permissions: newValue,
    };

    let res = await this._groupService.removePermissionFromGroup(removedPermission).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'onRemovePermissionFromGroup_error' } });
      this.fetchGroupPermissions(group_id);
    });

    if (res) {
      this.fetchGroupPermissions(group_id);
      this.apiSuccessNotify();
      console.log(newValue);
      return;
    }
  }

  async onAddPermissionToGroup(newValue: any[], group_id: string) {

    if (newValue.length === 0) {
      return;
    }

    const addedPermission: object = {
      groups: [group_id],
      permissions: newValue,
    };

    let res = await this._groupService.addPermissionToGroup(addedPermission).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'onAddPermissionToGroup_error' } });
      this.fetchGroupPermissions(group_id);
    });

    if (res) {
      this.fetchGroupPermissions(group_id);
      this.apiSuccessNotify();
      console.log(newValue);
      return;
    }
  }


  // handleMultiSelectInputChange(newValue: any[]) {
  //   const user_id: string = this.selectedGroupForPermission!.id;
  //   if (this.state.permissions.value === null) {
  //     this.onAddPermissionToGroup(newValue, user_id);
  //     return;
  //   }

  //   if (newValue === null) {
  //     this.onRemovePermissionFromGroup(newValue, user_id);
  //     return;
  //   }

  //   const before: any[] = this.state.permissions.value!

  //   if (newValue.length > before.length) {
  //     this.onAddPermissionToGroup(newValue, user_id);
  //     return;
  //   }

  //   if (newValue.length < before.length) {
  //     this.onRemovePermissionFromGroup(newValue, user_id);
  //     return;
  //   }

  //   // if (newValue.length = before.length) {
  //   //   return;
  //   // }
  // }

  // async onAddPermissionToGroup(newValue: any[], group_id: string) {

  //   if (this.state.permissions.value === null) {
  //     const newPermission: object = {
  //       groups: [group_id],
  //       permissions: [newValue[0].value.id],
  //     };

  //     let res = await this._groupService.addPermissionToGroup(newPermission).catch(error => {
  //       this.handleError({ error: error.response });
  //     });

  //     if (res) {
  //       this.setState({
  //         ...this.state,
  //         permissions: {
  //           ...this.state.permissions,
  //           value: newValue,
  //         }
  //       })
  //       this.apiSuccessNotify();
  //       // this.fetchGroup();
  //       console.log(newValue);
  //       return;
  //     }
  //   } else {
  //     const before: any[] = this.state.permissions.value!
  //     let addDiff = newValue.filter(x => !before.includes(x));
  //     const newPermission: object = {
  //       groups: [group_id],
  //       permissions: [addDiff[0].value.id],
  //     };

  //     let res = await this._groupService.addPermissionToGroup(newPermission).catch(error => {
  //       this.handleError({ error: error.response });
  //     });

  //     if (res) {
  //       this.setState({
  //         ...this.state,
  //         permissions: {
  //           ...this.state.permissions,
  //           value: newValue,
  //         }
  //       })
  //       this.apiSuccessNotify();
  //       // this.fetchGroup();
  //       console.log(newValue);
  //     }
  //   }
  // }

  // async onRemovePermissionFromGroup(newValue: any[], group_id: string) {

  //   if (newValue === null) {

  //     const oneItemHaveState: any[] = this.state.permissions.value!;

  //     const removedPermission: object = {
  //       groups: [group_id],
  //       permissions: [oneItemHaveState[0].value.id],
  //     };

  //     let res = await this._groupService.removePermissionFromGroup(removedPermission).catch(error => {
  //       this.handleError({ error: error.response });
  //     });

  //     if (res) {
  //       this.setState({
  //         ...this.state,
  //         permissions: {
  //           ...this.state.permissions,
  //           value: null,
  //         }
  //       })
  //       this.apiSuccessNotify();
  //       this.fetchGroup();
  //       return;
  //     }

  //   } else {
  //     const before: any[] = this.state.permissions.value!
  //     let removeDiff = before.filter(x => !newValue.includes(x));

  //     const removedPermission: object = {
  //       groups: [group_id],
  //       permissions: [removeDiff[0].value.id],
  //     };

  //     let res = await this._groupService.removePermissionFromGroup(removedPermission).catch(error => {
  //       this.handleError({ error: error.response });
  //     });

  //     if (res) {
  //       this.setState({
  //         ...this.state,
  //         permissions: {
  //           ...this.state.permissions,
  //           value: newValue,
  //         }
  //       })
  //       this.apiSuccessNotify();
  //       this.fetchGroup();
  //     }
  //   }
  // }

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
              {this.selectedGroupForPermission.title}
            </p>
            <div className="row">
              <div className="col-12">
                <label >{Localization.permission}</label>
                <AsyncSelect
                  isClearable={false}
                  isMulti
                  placeholder={Localization.permission}
                  cacheOptions
                  defaultOptions
                  value={this.state.permissions.value}
                  loadOptions={(inputValue: any, callback: any) => this.debounce_300(inputValue, callback)}
                  noOptionsMessage={(obj: any) => this.select_noOptionsMessage(obj)}
                  onChange={(selectedPerson: any) => this.handleMultiSelectInputChange(selectedPerson)}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideAddPermissionModal()}>{Localization.close}</button>
            <BtnLoader
              btnClassName="btn btn-success shadow-default shadow-hover"
              onClick={() => this.handle_on_update_permissions_btn(selectedGroupForPermission.id)}
              loading={this.state.setAddPermissionLoader}
            >
              {Localization.update}
            </BtnLoader>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  // end add permission modal function define ////////


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
                {/* start search box inputs */}
                <div className="row">
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
    // token: state.token,
  };
};

export const GroupManage = connect(
  state2props,
  dispatch2props
)(GroupManageComponent);