import React from "react";
import { Table, IProps_table } from "../../table/table";
import { PersonService } from "../../../service/service.person";
import { History } from 'history';
import { Modal } from "react-bootstrap";
import { IPerson } from "../../../model/model.person";
import { ToastContainer } from "react-toastify";
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { redux_state } from "../../../redux/app_state";
import { BaseComponent } from "../../_base/BaseComponent";
import { TInternationalization } from "../../../config/setup";
import { IToken } from "../../../model/model.token";
import { Localization } from "../../../config/localization/localization";
import { BtnLoader } from "../../form/btn-loader/BtnLoader";
import { PriceService } from "../../../service/service.price";

//// props & state define ////////
export interface IProps {
  history: History;
  internationalization: TInternationalization;
  token: IToken;
}

interface IState {
  person_table: IProps_table;
  PersonError: string | undefined;
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
}
///// define class of Person //////
class PersonManageComponent extends BaseComponent<IProps, IState>{

  state = {
    person_table: {
      list: [],
      colHeaders: [
        {
          field: "name", title: Localization.full_name , cellTemplateFunc: (row: IPerson) => {
            if (row.name) {
              return <div title={this.getPersonFullName(row)} className="text-nowrap-ellipsis max-w-200px d-inline-block">
                {this.getPersonFullName(row)}
              </div>
            }
            return '';
          }
        },
        {
          field: "image", title: Localization.image, templateFunc: () => {return <b>{Localization.image}</b> },cellTemplateFunc: (row: IPerson) => {
            if (row.image) {
              return <div title={Localization.image} className="text-center" >
                <div className="d-inline-block w-100px h-100px">
                  <img className="max-w-100px max-h-100px" src={"/api/serve-files/" + row.image} alt="" onError={e => this.personImageOnError(e)} />
                </div>
              </div>
            }
            else {
              return <div className="text-center">
                <div className="d-inline-block w-100px h-100px">
                  <img className="max-w-100px max-h-100px" src={this.defaultPersonImagePath} alt=""/>
                </div>
              </div>
            }
          }
        },
        {
          field: "cell_no",title: Localization.cell_no,cellTemplateFunc: (row: IPerson) => {
            if (row.cell_no) {
              return <div title={row.cell_no} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.cell_no}
              </div>
            }
            return '';
          }
        },
        {
          field: "email",title: Localization.email,cellTemplateFunc: (row: IPerson) => {
            if (row.email) {
              return <div title={row.email} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.email}
              </div>
            }
            return '';
          }
        },
        {
          field: "phone", title: Localization.phone,cellTemplateFunc: (row: IPerson) => {
            if (row.phone) {
              return <div title={row.phone} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.phone}
              </div>
            }
            return '';
          }
        },
        {
          field: "address", title: Localization.address,cellTemplateFunc: (row: IPerson) => {
            if (row.address) {
              return <div title={row.address} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.address}
              </div>
            }
            return '';
          }
        },
      ],
      actions: [
        { text: <i title={Localization.remove} className="table-action-shadow-hover fa fa-trash text-danger pt-2 mt-1"></i>, ac_func: (row: any) => { this.onShowRemoveModal(row) } },
        { text: <i title={Localization.update} className="table-action-shadow-hover fa fa-pencil-square-o text-info pt-2"></i>, ac_func: (row: any) => { this.updateRow(row) } },
      ]
    },
    PersonError: undefined,
    pager_offset: 0,
    pager_limit: 5,
    prevBtnLoader: false,
    nextBtnLoader: false,
    removeModalShow: false,
    priceModalShow: false,
    price: {
      value: undefined,
      isValid: false,
    },
    setRemoveLoader: false,
    setPriceLoader: false
  }

  selectedPerson: IPerson | undefined;
  private _personService = new PersonService();
  private _priceService = new PriceService();

  updateRow(person_id: any) {
    this.props.history.push(`/person/${person_id.id}/edit`);
  }

  /////// delete modal function define ////////

  onShowRemoveModal(person: IPerson) {
    this.selectedPerson = person;
    this.setState({ ...this.state, removeModalShow: true });
  }

  onHideRemoveModal() {
    this.selectedPerson = undefined;
    this.setState({ ...this.state, removeModalShow: false });

  }

  async onRemovePerson(person_id: string) {
    this.setState({ ...this.state, setRemoveLoader: true });
    let res = await this._personService.remove(person_id).catch(error => {
      this.handleError({ error: error.response });
      this.setState({ ...this.state, setRemoveLoader: false });
    });
    if (res) {
      this.setState({ ...this.state, setRemoveLoader: false });
      this.apiSuccessNotify();
      this.fetchPersons();
      this.onHideRemoveModal();
    }
  }

  render_delete_modal(selectedPerson: any) {
    if (!this.selectedPerson || !this.selectedPerson.id) return;
    return (
      <>
        <Modal show={this.state.removeModalShow} onHide={() => this.onHideRemoveModal()}>
          <Modal.Body>
            <p style={{ maxWidth: '200px', whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} >
              <span className="text-muted">
                {Localization.title}:&nbsp;
            </span>
              {this.selectedPerson.name} {this.selectedPerson.last_name}
            </p>
            <p className="text-danger">{Localization.msg.ui.item_will_be_removed_continue}</p>
            
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideRemoveModal()}>{Localization.close}</button>
            <BtnLoader
              btnClassName="btn btn-danger shadow-default shadow-hover"
              onClick={() => this.onRemovePerson(selectedPerson.id)}
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
    this.fetchPersons();
  }

  async fetchPersons() {
    let res = await this._personService.search(this.state.pager_limit, this.state.pager_offset).catch(error => {
      this.handleError({ error: error });
      this.setState({
        ...this.state,
        prevBtnLoader: false,
        nextBtnLoader: false,
      });
    });

    if (res) {
      this.setState({
        ...this.state, person_table: {
          ...this.state.person_table,
          list: res.data.result
        },
        prevBtnLoader: false,
        nextBtnLoader: false,
      });
    }
  }

  // previous button create

  pager_previous_btn_render() {
    if (this.state.person_table.list && (this.state.person_table.list! || []).length) {
      return (
        <>
          {
            this.state.pager_offset > 0 &&
            <BtnLoader
              loading={this.state.prevBtnLoader}
              btnClassName="btn btn-outline-info pull-left shadow-default shadow-hover"
              onClick={() => this.onPreviousClick()}
            >
              {Localization.previous}
            </BtnLoader>
          }
        </>
      );
    } else if (this.state.person_table.list && !(this.state.person_table.list! || []).length) {
      return (
        <>
          {
            this.state.pager_offset > 0 &&
            <BtnLoader
              loading={this.state.prevBtnLoader}
              btnClassName="btn btn-outline-info pull-left shadow-default shadow-hover"
              onClick={() => this.onPreviousClick()}
            >
              {Localization.previous}
            </BtnLoader>
          }
        </>
      );

    } else if (this.state.PersonError) {
      return;
    } else {
      return;
    }
  }

  // next button create

  pager_next_btn_render() {
    if (this.state.person_table.list && (this.state.person_table.list! || []).length) {
      return (
        <>
          {
            !(this.state.pager_limit > (this.state.person_table.list! || []).length) &&
            <BtnLoader
              loading={this.state.nextBtnLoader}
              btnClassName="btn btn-outline-info pull-right shadow-default shadow-hover"
              onClick={() => this.onNextClick()}
            >
              {Localization.next}
            </BtnLoader>
          }
        </>
      );
    } else if (this.state.person_table.list && !(this.state.person_table.list! || []).length) {
      return;
    } else if (this.state.person_table.list) {
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
      prevBtnLoader: true
    }, () => {
      this.gotoTop();
      this.fetchPersons()
    });
  }

  // on next click

  onNextClick() {
    this.setState({
      ...this.state,
      pager_offset: this.state.pager_offset + this.state.pager_limit,
      nextBtnLoader: true
    }, () => {
      this.gotoTop();
      this.fetchPersons()
    });
  }

  //// navigation function //////

  gotoPersonCreate() {
    this.props.history.push('/person/create');
  }

  //// render call Table component ///////

  render() {
    return (
      <>
        <div className="content">
          <div className="row">
            <h2 className="text-bold text-dark pl-3">{Localization.person_manage}</h2>
            <div className="col-12">
              <BtnLoader
                loading={false}
                disabled={false}
                btnClassName="btn btn-success shadow-default shadow-hover mb-4"
                onClick={() => this.gotoPersonCreate()}
              >
                {Localization.new}
              </BtnLoader>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Table list={this.state.person_table.list} colHeaders={this.state.person_table.colHeaders} actions={this.state.person_table.actions}></Table>
              <div>
                {this.pager_previous_btn_render()}
                {this.pager_next_btn_render()}
              </div>
            </div>
          </div>
        </div>
        {this.render_delete_modal(this.selectedPerson)}
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

export const PersonManage = connect(
  state2props,
  dispatch2props
)(PersonManageComponent);