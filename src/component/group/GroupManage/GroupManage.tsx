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
import { GroupService } from "../../../service/service.group";

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
  prevBtnLoader: boolean;
  nextBtnLoader: boolean;
  setRemoveLoader: boolean;
  isSearch: boolean;
  searchVal: string | undefined;
  filter: IFilterUser,
  filterSearchBtnLoader: boolean;
  tableProcessLoader: boolean;
}

//// end define IState ///


/// start class define ///

class GroupManageComponent extends BaseComponent<IProps, IState>{

  state = {
    user_table: {
      list: [],
      colHeaders: [
        {
          field: "group", title: Localization.group, cellTemplateFunc: (row: any) => {
            if (row.group) {
              return <div title={row.group} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.group}
              </div>
            }
            return '';
          }
        },
        {
          field: "description", title: Localization.description, cellTemplateFunc: (row: any) => {
            if (row.description) {
              return <div title={row.description} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.description}
              </div>
            }
            return '';
          }
        },
      ],
      actions: [
        { text: <i title={Localization.remove} className="fa fa-trash text-danger"></i>,
         ac_func: (row: any) => { this.onShowRemoveModal(row) },
         name:Localization.remove },
        { text: <i title={Localization.update} className="fa fa-pencil-square-o text-primary"></i>,
         ac_func: (row: any) => { this.updateRow(row) },
         name:Localization.update },
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
    pager_limit: 5,
    prevBtnLoader: false,
    nextBtnLoader: false,
    removeModalShow: false,
    setRemoveLoader: false,
    isSearch: false,
    searchVal: undefined,
    filterSearchBtnLoader: false,
    tableProcessLoader: false,
  }

  selectedGroup: any | undefined;

  private _groupService = new GroupService();

  constructor(props: IProps) {
    super(props);
    this._groupService.setToken(this.props.token)
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      tableProcessLoader:true
    })
    this.fetchGroup();
  }

  /// start navigation function for create ant update ///
  gotoGroupCreate() {
    this.props.history.push('/group/create');
  }

  updateRow(group_id: any) {
    this.props.history.push(`/groups/${group_id.id}/edit`);
  }

  /// end navigation function for create ant update ///

  /// start for all function for request ///

  async fetchGroup() {
    this.setState({...this.state,tableProcessLoader: true});
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

  async onRemoveUser(group_id: string) {
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
                {Localization.selectedGroup}:&nbsp;
            </span>
              {this.selectedGroup.description}
            </p>
            <p className="text-danger">{Localization.msg.ui.item_will_be_removed_continue}</p>

          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideRemoveModal()}>{Localization.close}</button>
            <BtnLoader
              btnClassName="btn btn-danger shadow-default shadow-hover"
              onClick={() => this.onRemoveUser(selectedGroup.id)}
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
    group : { value: undefined, isValid: true },
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
                      label={Localization.group}
                      placeholder={Localization.group}
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