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
import { UserService } from "../../../service/service.user";import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';

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
  prevBtnLoader: boolean;
  nextBtnLoader: boolean;
  priceModalShow: boolean;
  price: {
    value: number | undefined;
    isValid: boolean;
  },
  setRemoveLoader: boolean;
  setPriceLoader: boolean;
  isSearch: boolean;
  searchVal: string | undefined;
  filter: IFilterUser,
  filterSearchBtnLoader: boolean;
  tableProcessLoader: boolean;
}
///// define class of User //////
class GroupManageComponent extends BaseComponent<IProps, IState>{

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
                <div className="d-inline-block w-100px h-100px">
                  <img className="max-w-100px max-h-100px profile-img-rounded" src={"/api/serve-files/" + row.person.image} alt="" onError={e => this.userImageOnError(e)} />
                </div>
              </div>
            }
            else {
              return <div className="text-center">
                <div className="d-inline-block w-100px h-100px">
                  <img className="max-w-100px max-h-100px  profile-img-rounded" src={this.defaultPersonImagePath} alt="" />
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
        { text: <i title={Localization.remove} className="fa fa-trash text-danger"></i>,
         ac_func: (row: any) => { this.onShowRemoveModal(row) },
         name:Localization.remove },
        { text: <i title={Localization.update} className="fa fa-pencil-square-o text-primary"></i>,
         ac_func: (row: any) => { this.updateRow(row) },
         name:Localization.update },
      ]
    },
    filter: {
      user: {
        value: undefined,
        isValid: true,
      }
    },
    price: {
      value: undefined,
      isValid: false,
    },
    UserError: undefined,
    pager_offset: 0,
    pager_limit: 5,
    prevBtnLoader: false,
    nextBtnLoader: false,
    removeModalShow: false,
    priceModalShow: false,
    setRemoveLoader: false,
    setPriceLoader: false,
    isSearch: false,
    searchVal: undefined,
    filterSearchBtnLoader: false,
    tableProcessLoader: false,
  }

  selectedUser: IUser | undefined;
  private _userService = new UserService();
  // private _priceService = new PriceService();

  constructor(props: IProps) {
    super(props);
    this._userService.setToken(this.props.token)
  }
  updateRow(user_id: any) {
    this.props.history.push(`/user/${user_id.id}/edit`);
  }


  // timestamp to date 

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

  /////// delete modal function define ////////

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


  // define axios for give data

  componentDidMount() {
    this.setState({
      ...this.state,
      tableProcessLoader:true
    })
    this.fetchUsers();
  }

  async fetchUsers() {
    this.setState({...this.state,tableProcessLoader: true});
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

  // previous button create

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

  // // next button create

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

  // on previous click

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

  // on next click

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

  //// navigation function //////

  gotoUserCreate() {
    this.props.history.push('/user/create');
  }

  /////  onChange & search & reset function for search box ///////////

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

  private _filter: IFilterUser = {
    user: { value: undefined, isValid: true },
  };
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