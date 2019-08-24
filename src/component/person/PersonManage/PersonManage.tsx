import React from "react";
// import { IPerson } from "../model/model.person";
import { Table, IProps_table } from "../../table/table";
import { Input } from '../../form/input/Input';
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





//  define props & state and type 

// export interface IPerson {
//   last_name: number;
//   username: string;
//   id: string;
//   person?: IPerson;
// }

export interface IProps {
  history: History;
  internationalization: TInternationalization;
  token: IToken;
}


interface IState {
  // userlist: any[];//IPerson
  // colHeaders: any[]//Table header
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




// define class of Person 

class PersonManageComponent extends BaseComponent<IProps, IState>{

  state = {
    person_table: {
      list: [],
      colHeaders: [
        {
          field: "name", title: Localization.name, cellTemplateFunc: (row: IPerson) => {
            if (row.name) {
              return <div title={row.name} className=" d-inline-block" style={{
                maxWidth: '200px',
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }} >
                {row.name}
              </div>
            }
            return '';
          }
        },
        {
          field: "last_name", title: Localization.lastname,cellTemplateFunc: (row: IPerson) => {
            if (row.last_name) {
              return <div title={row.last_name} className=" d-inline-block" style={{
                maxWidth: '200px',
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }} >
                {row.last_name}
              </div>
            }
            return '';
          }
        },
        {
          field: "address", title: Localization.address,cellTemplateFunc: (row: IPerson) => {
            if (row.address) {
              return <div title={row.last_name} className=" d-inline-block" style={{
                maxWidth: '200px',
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }} >
                {row.address}
              </div>
            }
            return '';
          }
        },
        {
          field: "phone", title: Localization.phone,cellTemplateFunc: (row: IPerson) => {
            if (row.phone) {
              return <div title={row.last_name} className=" d-inline-block" style={{
                maxWidth: '200px',
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }} >
                {row.phone}
              </div>
            }
            return '';
          }
        },
        {
          field: "email",title: Localization.email,cellTemplateFunc: (row: IPerson) => {
            if (row.email) {
              return <div title={row.last_name} className=" d-inline-block" style={{
                maxWidth: '200px',
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }} >
                {row.email}
              </div>
            }
            return '';
          }
        },
        {
          field: "cell_no",title: Localization.cell_no,cellTemplateFunc: (row: IPerson) => {
            if (row.cell_no) {
              return <div title={row.last_name} className=" d-inline-block" style={{
                maxWidth: '200px',
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }} >
                {row.cell_no}
              </div>
            }
            return '';
          }
        },
        {
          field: "image", title: Localization.image, templateFunc: () => {return <b>{Localization.image}</b> },cellTemplateFunc: (row: IPerson) => {
            if (row.image) {
              return <div className="text-center" >
                <div className="d-inline-block" style={{ width: '100px', height: '100px' }}>
                  <img src={"/api/serve-files/" + row.image} alt=""
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                    onError={e => this.personImageOnError(e)} />
                </div>
              </div>
            }
            else {
              return <div className="text-center">
                <div className="d-inline-block" style={{ width: '100px', height: '100px' }}>
                  {/* <img src="/static/media/img/icon/no-image.png" alt="" style={{ maxWidth: '100px', maxHeight: '100px' }} /> */}
                  <img src={this.defaultPersonImagePath} alt="" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                </div>
              </div>
            }
          }
        },
      ],
      actions: [
        // { text: <div title={Localization.remove} className="table-action-shadow-hover text-center p-0 mb-0 ml-0 mr-0 mt-1"><i className="fa fa-trash text-danger pt-1"></i></div>, ac_func: (row: any) => { this.onShowRemoveModal(row) } },
        // { text: <div title={Localization.update} className="table-action-shadow-hover text-center p-0 m-0"><i className="fa fa-pencil-square-o text-info"></i></div>, ac_func: (row: any) => { this.updateRow(row) } },
        // { text: <div title={Localization.Pricing} className="table-action-shadow-hover text-center p-0 m-0"><i className="fa fa-money text-success"></i></div>, ac_func: (row: any) => { this.onShowPriceModal(row) } },
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
    // this.props.history.push(`/admin/person/${person_id.id}/edit`);
    this.props.history.push(`/person/${person_id.id}/edit`);
  }


  // delete modal function define

  onShowRemoveModal(person: IPerson) {
    this.selectedPerson = person;
    // debugger;
    this.setState({ ...this.state, removeModalShow: true });
  }

  onHideRemoveModal() {
    this.selectedPerson = undefined;
    this.setState({ ...this.state, removeModalShow: false });

  }

  async onRemovePerson(person_id: string) {
    this.setState({ ...this.state, setRemoveLoader: true });
    let res = await this._personService.remove(person_id).catch(error => {
      // debugger;
      //notify
      this.handleError({ error: error });
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
    // this.fetchOnePerson('4c64a437-0740-4be9-b836-5453ac93f05d');
  }


  async fetchPersons() {
    // debugger;

    let res = await this._personService.search(this.state.pager_limit, this.state.pager_offset).catch(error => {
      // debugger;
      //notify
      this.handleError({ error: error });
      this.setState({
        ...this.state,
        prevBtnLoader: false,
        nextBtnLoader: false,
      });
    });

    if (res) {
      // debugger;
      // const personlist = res.data;
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



  /* async fetchOnePerson(personId: string) {
    // let onePerson = await this._personService.personById(personId).catch(onePerson => { debugger })  
    await this._personService.personById(personId).catch(() => { debugger })
  } */




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
      // this.gotoTop();
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
      // this.gotoTop();
      this.fetchPersons()
    });
  }



  // async fetchtablePersons() {
  //   this.setState({ ...this.state, personError: undefined });
  //   let searchRequest;
  //   searchRequest = this._personService.search(this.state.pager_limit,this.state.pager_offset).catch(error => {
  //     debugger;
  //     //notify
  //   })
  // }





  // link on button  for create person

  gotoPersonCreate() {
    this.props.history.push('/person/create'); // /admin
  }


  //   call Table component 

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
// export default Person


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