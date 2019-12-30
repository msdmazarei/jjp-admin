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
// import { IToken } from "../../../model/model.token";
import { Localization } from "../../../config/localization/localization";
import { BtnLoader } from "../../form/btn-loader/BtnLoader";
import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import { AccessService } from "../../../service/service.access";
import { Input } from "../../form/input/Input";
import Select from 'react-select';
import { AppRangePicker } from "../../form/app-rangepicker/AppRangePicker";
import { TABLE_SORT } from "../../table/tableSortHandler";
import { TPERMISSIONS } from "../../../enum/Permission";
import { SORT } from "../../../enum/Sort";
import { RetryModal } from "../../tool/retryModal/retryModal";

//// props & state define ////////
export interface IProps {
  history: History;
  internationalization: TInternationalization;
  // token: IToken;
}

interface IFilterPerson {
  name: {
    value: string | undefined,
    isValid: boolean
  };
  last_name: {
    value: string | undefined,
    isValid: boolean
  };
  is_legal: {
    value: { value: string, label: string } | null,
    is_legal: boolean | null,
    isValid: boolean
  };
  cr_date: {
    from: number | undefined,
    from_isValid: boolean,
    to: number | undefined,
    to_isValid: boolean,
    is_valid: boolean,
  };
  cell_no: {
    value: string | undefined,
    isValid: boolean
  };
  email: {
    value: string | undefined,
    isValid: boolean
  };
  phone: {
    value: string | undefined,
    isValid: boolean
  };
  creator: {
    value: string | undefined,
    isValid: boolean
  }
}

interface ISortPerson {
  full_name: boolean;
  is_legal: boolean;
  creation_date: boolean;
  cell_no: boolean;
  phone: boolean;
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
  isSearch: boolean;
  searchVal: string | undefined;
  filterSearchBtnLoader: boolean;
  tableProcessLoader: boolean;
  filter_state: IFilterPerson;
  advance_search_box_show: boolean;
  sort: string[];
  sortShowStyle: ISortPerson;
  retryModal: boolean;
}
///// define class of Person //////
class PersonManageComponent extends BaseComponent<IProps, IState>{

  is_legalOptions = [
    { value: Localization.legal_person, label: Localization.legal_person },
    { value: Localization.real_person, label: Localization.real_person },
  ];
  state = {
    person_table: {
      list: [],
      colHeaders: [
        {
          field: "full_name", title: Localization.full_name,
          templateFunc: () => {
            return <>
              {Localization.full_name}
              {
                (this.is_this_sort_exsit_in_state(SORT.full_name) === false && this.is_this_sort_exsit_in_state(SORT.full_name_) === false)
                  ?
                  <span
                    className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                    onClick={() => this.sort_handler_func(SORT.full_name, SORT.full_name_, true, 1)}
                    onMouseOver={() => this.sort_icon_change_on_mouse_over_out('full_name', true)}
                    onMouseOut={() => this.sort_icon_change_on_mouse_over_out('full_name', false)}>
                    <i className={this.state.sortShowStyle.full_name === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                  </span>
                  :
                  this.is_this_sort_exsit_in_state(SORT.full_name) === true
                    ?
                    <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                      onClick={() => this.sort_handler_func(SORT.full_name_, SORT.full_name, false, 0)}
                      onMouseOver={() => this.sort_icon_change_on_mouse_over_out('full_name', true)}
                      onMouseOut={() => this.sort_icon_change_on_mouse_over_out('full_name', false)}>
                      <i className={this.state.sortShowStyle.full_name === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                    </span>
                    :
                    this.is_this_sort_exsit_in_state(SORT.full_name_) === true
                      ?
                      <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                        onClick={() => this.sort_handler_func(SORT.full_name_, SORT.full_name, true, 2)}
                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('full_name', true)}
                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('full_name', false)}>
                        <i className={this.state.sortShowStyle.full_name === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                      </span>
                      :
                      undefined
              }
            </>
          }, 
          cellTemplateFunc: (row: IPerson) => {
            if (row.name) {
              return <div title={this.getPersonFullName(row)} className="text-nowrap-ellipsis max-w-200px d-inline-block">
                {this.getPersonFullName(row)}
              </div>
            }
            return '';
          }
        },
        {
          field: "image", title: Localization.image, templateFunc: () => { return <b>{Localization.image}</b> }, cellTemplateFunc: (row: IPerson) => {
            if (row.image) {
              return <div title={Localization.image} className="text-center" >
                <div className="d-inline-block w-50px h-50px">
                  <img className="max-w-50px max-h-50px profile-img-rounded" src={"/api/serve-files/" + row.image} alt="" onError={e => this.personImageOnError(e)} />
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
          field: "type", title: Localization.type, 
          templateFunc: () => {
            return <>
              {Localization.type}
              {
                (this.is_this_sort_exsit_in_state(SORT.is_legal) === false && this.is_this_sort_exsit_in_state(SORT.is_legal_) === false)
                  ?
                  <span
                    className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                    onClick={() => this.sort_handler_func(SORT.is_legal, SORT.is_legal_, true, 1)}
                    onMouseOver={() => this.sort_icon_change_on_mouse_over_out('is_legal', true)}
                    onMouseOut={() => this.sort_icon_change_on_mouse_over_out('is_legal', false)}>
                    <i className={this.state.sortShowStyle.is_legal === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                  </span>
                  :
                  this.is_this_sort_exsit_in_state(SORT.is_legal) === true
                    ?
                    <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                      onClick={() => this.sort_handler_func(SORT.is_legal_, SORT.is_legal, false, 0)}
                      onMouseOver={() => this.sort_icon_change_on_mouse_over_out('is_legal', true)}
                      onMouseOut={() => this.sort_icon_change_on_mouse_over_out('is_legal', false)}>
                      <i className={this.state.sortShowStyle.is_legal === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                    </span>
                    :
                    this.is_this_sort_exsit_in_state(SORT.is_legal_) === true
                      ?
                      <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                        onClick={() => this.sort_handler_func(SORT.is_legal_, SORT.is_legal, true, 2)}
                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('is_legal', true)}
                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('is_legal', false)}>
                        <i className={this.state.sortShowStyle.is_legal === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                      </span>
                      :
                      undefined
              }
            </>
          }, 
          cellTemplateFunc: (row: IPerson) => {
            if (row.is_legal) {
              return <div className="text-nowrap-ellipsis max-w-100px d-inline-block">
                {row.is_legal === true ? Localization.legal_person : Localization.real_person}
              </div>
            }
            return <div className="text-nowrap-ellipsis max-w-100px d-inline-block">
              {Localization.real_person}
            </div>;
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
          cellTemplateFunc: (row: IPerson) => {
            if (row.creation_date) {
              return <div title={this._getTimestampToDate(row.creation_date)}>{this.getTimestampToDate(row.creation_date)}</div>
            }
            return '';
          }
        },
        {
          field: "cell_no", title: Localization.cell_no, 
          templateFunc: () => {
            return <>
              {Localization.cell_no}
              {
                (this.is_this_sort_exsit_in_state(SORT.cell_no) === false && this.is_this_sort_exsit_in_state(SORT.cell_no_) === false)
                  ?
                  <span
                    className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                    onClick={() => this.sort_handler_func(SORT.cell_no, SORT.cell_no_, true, 1)}
                    onMouseOver={() => this.sort_icon_change_on_mouse_over_out('cell_no', true)}
                    onMouseOut={() => this.sort_icon_change_on_mouse_over_out('cell_no', false)}>
                    <i className={this.state.sortShowStyle.cell_no === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                  </span>
                  :
                  this.is_this_sort_exsit_in_state(SORT.cell_no) === true
                    ?
                    <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                      onClick={() => this.sort_handler_func(SORT.cell_no_, SORT.cell_no, false, 0)}
                      onMouseOver={() => this.sort_icon_change_on_mouse_over_out('cell_no', true)}
                      onMouseOut={() => this.sort_icon_change_on_mouse_over_out('cell_no', false)}>
                      <i className={this.state.sortShowStyle.cell_no === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                    </span>
                    :
                    this.is_this_sort_exsit_in_state(SORT.cell_no_) === true
                      ?
                      <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                        onClick={() => this.sort_handler_func(SORT.cell_no_, SORT.cell_no, true, 2)}
                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('cell_no', true)}
                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('cell_no', false)}>
                        <i className={this.state.sortShowStyle.cell_no === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                      </span>
                      :
                      undefined
              }
            </>
          }, 
          cellTemplateFunc: (row: IPerson) => {
            if (row.cell_no) {
              return <div title={row.cell_no} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.cell_no}
              </div>
            }
            return '';
          }
        },
        {
          field: "email", title: Localization.email, cellTemplateFunc: (row: IPerson) => {
            if (row.email) {
              return <div title={row.email} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.email}
              </div>
            }
            return '';
          }
        },
        {
          field: "phone", title: Localization.phone, 
          templateFunc: () => {
            return <>
              {Localization.phone}
              {
                (this.is_this_sort_exsit_in_state(SORT.phone) === false && this.is_this_sort_exsit_in_state(SORT.phone_) === false)
                  ?
                  <span
                    className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                    onClick={() => this.sort_handler_func(SORT.phone, SORT.phone_, true, 1)}
                    onMouseOver={() => this.sort_icon_change_on_mouse_over_out('phone', true)}
                    onMouseOut={() => this.sort_icon_change_on_mouse_over_out('phone', false)}>
                    <i className={this.state.sortShowStyle.phone === false ? "fa fa-sort sort-btn-icon cursor-pointer text-muted" : "fa fa-sort-asc sort-btn-icon cursor-pointer text-muted"}></i>
                  </span>
                  :
                  this.is_this_sort_exsit_in_state(SORT.phone) === true
                    ?
                    <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                      onClick={() => this.sort_handler_func(SORT.phone_, SORT.phone, false, 0)}
                      onMouseOver={() => this.sort_icon_change_on_mouse_over_out('phone', true)}
                      onMouseOut={() => this.sort_icon_change_on_mouse_over_out('phone', false)}>
                      <i className={this.state.sortShowStyle.phone === false ? "fa fa-sort-asc sort-btn-icon cursor-pointer text-success" : "fa fa-sort-desc sort-btn-icon cursor-pointer text-success"}></i>
                    </span>
                    :
                    this.is_this_sort_exsit_in_state(SORT.phone_) === true
                      ?
                      <span className="btn btn-sm my-0 py-0 sort-btn-icon-wrapper"
                        onClick={() => this.sort_handler_func(SORT.phone_, SORT.phone, true, 2)}
                        onMouseOver={() => this.sort_icon_change_on_mouse_over_out('phone', true)}
                        onMouseOut={() => this.sort_icon_change_on_mouse_over_out('phone', false)}>
                        <i className={this.state.sortShowStyle.phone === false ? "fa fa-sort-desc sort-btn-icon cursor-pointer text-success" : "fa fa-sort cursor-pointer text-muted"}></i>
                      </span>
                      :
                      undefined
              }
            </>
          }, 
          cellTemplateFunc: (row: IPerson) => {
            if (row.phone) {
              return <div title={row.phone} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.phone}
              </div>
            }
            return '';
          }
        },
        {
          field: "address", title: Localization.address, cellTemplateFunc: (row: IPerson) => {
            if (row.address) {
              return <div title={row.address} className="text-nowrap-ellipsis max-w-100px d-inline-block">
                {row.address}
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
      ]
        :
        undefined
    },
    filter: {
      person: {
        value: undefined,
        isValid: true,
      }
    },
    price: {
      value: undefined,
      isValid: false,
    },
    PersonError: undefined,
    pager_offset: 0,
    pager_limit: 10,
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
    filter_state: {
      name: {
        value: undefined,
        isValid: false
      },
      last_name: {
        value: undefined,
        isValid: false
      },
      is_legal: {
        value: null,
        is_legal: null,
        isValid: false
      },
      cr_date: {
        from: undefined,
        from_isValid: false,
        to: undefined,
        to_isValid: false,
        is_valid: false,
      },
      cell_no: {
        value: undefined,
        isValid: false
      },
      email: {
        value: undefined,
        isValid: false
      },
      phone: {
        value: undefined,
        isValid: false
      },
      creator: {
        value: undefined,
        isValid: false
      },
    },
    advance_search_box_show: false,
    sort: [],
    sortShowStyle: {
      full_name: false,
      is_legal: false,
      creation_date: false,
      cell_no: false,
      phone: false,
    },
    retryModal : false,
  }

  componentDidMount() {
    if (this.checkPersonManagePageRender() === true) {
      if (AccessService.checkAccess(TPERMISSIONS.PERSON_GET_PREMIUM)) {
        this.setState({
          ...this.state,
          tableProcessLoader: true
        })
        TABLE_SORT.sortArrayReseter();
        this.fetchPersons();
      }
    } else {
      this.noAccessRedirect(this.props.history);
    }
  }

  checkPersonManagePageRender(): boolean {
    if (AccessService.checkOneOFAllAccess([TPERMISSIONS.PERSON_GET_PREMIUM, TPERMISSIONS.PERSON_ADD_PREMIUM])) {
      return true;
    }
    return false
  }


  checkAllAccess(): boolean {
    if (AccessService.checkOneOFAllAccess([TPERMISSIONS.PERSON_DELETE_PREMIUM, TPERMISSIONS.PERSON_EDIT_PREMIUM])) {
      return true;
    }
    return false;
  }

  checkDeleteToolAccess(): boolean {
    if (AccessService.checkAccess(TPERMISSIONS.PERSON_DELETE_PREMIUM)) {
      return true;
    }
    return false
  }

  checkUpdateToolAccess(): boolean {
    if (AccessService.checkAccess(TPERMISSIONS.PERSON_EDIT_PREMIUM)) {
      return true;
    }
    return false
  }

  selectedPerson: IPerson | undefined;
  private _personService = new PersonService();
  // private _priceService = new PriceService();

  // constructor(props: IProps) {
  //   super(props);
  //   // this._personService.setToken(this.props.token)
  // }

  sort_handler_func(comingType: string, reverseType: string, is_just_add_or_remove: boolean, typeOfSingleAction: number) {
    if (is_just_add_or_remove === false) {
      TABLE_SORT.coming_field_name_by_sortType_and_that_reverseType_exist_in_sortArray(comingType, reverseType);
    }
    if (is_just_add_or_remove === true) {
      TABLE_SORT.just_add_or_remove(comingType, typeOfSingleAction)
    }
    this.setState({ ...this.state, sort: TABLE_SORT.sortArrayReturner() }, () => this.fetchPersons());
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

  updateRow(person_id: any) {
    if (AccessService.checkAccess(TPERMISSIONS.PERSON_EDIT_PREMIUM) === false) {
      return;
    }
    this.props.history.push(`/person/${person_id.id}/edit`);
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



  /////// delete modal function define ////////

  onShowRemoveModal(person: IPerson) {
    if (AccessService.checkAccess(TPERMISSIONS.PERSON_DELETE_PREMIUM) === false) {
      return;
    };
    this.selectedPerson = person;
    this.setState({ ...this.state, removeModalShow: true });
  }

  onHideRemoveModal() {
    this.selectedPerson = undefined;
    this.setState({ ...this.state, removeModalShow: false });

  }

  async onRemovePerson(person_id: string) {
    if (AccessService.checkAccess(TPERMISSIONS.PERSON_DELETE_PREMIUM) === false) {
      return;
    };
    this.setState({ ...this.state, setRemoveLoader: true });
    let res = await this._personService.remove(person_id).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'onRemovePerson_error' } });
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
            <p className="delete-modal-content" >
              <span className="text-muted">
                {Localization.full_name}:&nbsp;
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

  async fetchPersons() {
    if (AccessService.checkAccess(TPERMISSIONS.PERSON_GET_PREMIUM) === false){
      return;
    }
    this.setState({ ...this.state, tableProcessLoader: true });
    let res = await this._personService.search(
      this.state.pager_limit,
      this.state.pager_offset,
      this.get_searchFilter(),
      this.returner_sort_array_to_fetch_func(),
    ).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'fetchPersons_error' } });
      this.setState({
        ...this.state,
        prevBtnLoader: false,
        nextBtnLoader: false,
        tableProcessLoader: false,
        filterSearchBtnLoader: false,
        retryModal : true,
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
        tableProcessLoader: false,
        filterSearchBtnLoader: false,
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
    } else if (this.state.person_table.list && !(this.state.person_table.list! || []).length) {
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
      prevBtnLoader: true,
      tableProcessLoader: true,
    }, () => {
      this.gotoTop();
      this.fetchPersons()
      // {
      //   this.state.isSearch ? this.fetchFilterPersons(this.state.searchVal) : this.fetchPersons()
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
      this.fetchPersons()
      // {
      //   this.state.isSearch ? this.fetchFilterPersons(this.state.searchVal) : this.fetchPersons()
      // }
    });
  }

  //// navigation function //////

  gotoPersonCreate() {
    if (AccessService.checkAccess(TPERMISSIONS.PERSON_ADD_PREMIUM) === false) {
      return;
    };
    this.props.history.push('/person/create');
  }


  private _searchFilter: any | undefined;
  private get_searchFilter() {
    this.set_searchFilter();
    return this._searchFilter;
  }
  private set_searchFilter() {
    const obj: any = {};

    if (this.state.filter_state.name.isValid) {
      obj['name'] = { $prefix: this.state.filter_state.name.value };
    }

    if (this.state.filter_state.last_name.isValid) {
      obj['last_name'] = { $prefix: this.state.filter_state.last_name.value };
    }

    if (this.state.filter_state.is_legal.isValid) {
      obj['is_legal'] = { $eq: this.state.filter_state.is_legal.is_legal };
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

    if (this.state.filter_state.cell_no.isValid) {
      obj['cell_no'] = { $prefix: this.state.filter_state.cell_no.value };
    }

    if (this.state.filter_state.email.isValid) {
      obj['email'] = { $prefix: this.state.filter_state.email.value };
    }

    if (this.state.filter_state.phone.isValid) {
      obj['phone'] = { $prefix: this.state.filter_state.phone.value };
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
    }, () => {this.fetchPersons()});
  }

  /////  start onChange & search & reset function for search box ///////////

  filter_state_reset() {
    this.setState({
      ...this.state,
      filter_state: {
        name: {
          value: undefined,
          isValid: false
        },
        last_name: {
          value: undefined,
          isValid: false
        },
        is_legal: {
          value: null,
          is_legal: null,
          isValid: false
        },
        cr_date: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
        cell_no: {
          value: undefined,
          isValid: false
        },
        email: {
          value: undefined,
          isValid: false
        },
        phone: {
          value: undefined,
          isValid: false
        },
        creator: {
          value: undefined,
          isValid: false
        },
      }
    }, () => this.repetReset())
  }
  repetReset() {
    this.setState({
      ...this.state,
      filter_state: {
        name: {
          value: undefined,
          isValid: false
        },
        last_name: {
          value: undefined,
          isValid: false
        },
        is_legal: {
          value: null,
          is_legal: null,
          isValid: false
        },
        cr_date: {
          from: undefined,
          from_isValid: false,
          to: undefined,
          to_isValid: false,
          is_valid: false,
        },
        cell_no: {
          value: undefined,
          isValid: false
        },
        email: {
          value: undefined,
          isValid: false
        },
        phone: {
          value: undefined,
          isValid: false
        },
        creator: {
          value: undefined,
          isValid: false
        },
      }
    })
  }

  is_legal_of_person_in_search_remover() {
    this.setState({
      ...this.state,
      filter_state: {
        ...this.state.filter_state,
        is_legal: {
          value: null,
          is_legal: null,
          isValid: false,
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

  handleSelectInputChange(type: { value: string, label: string } | null, inputType: any) {
    let isValid;
    let newVal: boolean | null = null;
    if (type === null) {
      newVal = null;
      isValid = false;
    } else {
      newVal = type.value === Localization.legal_person ? true : false;
      isValid = true;
    }
    this.setState({
      ...this.state,
      filter_state: {
        ...this.state.filter_state, [inputType]: { value: type, is_legal: newVal, isValid: isValid }
      }
    })
  }

  filter: any;

  /////  end onChange & search & reset function for search box ///////////

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
              <h2 className="text-bold text-dark pl-3">{Localization.person}</h2>
              {
                AccessService.checkAccess(TPERMISSIONS.PERSON_ADD_PREMIUM)
                  ?
                  <BtnLoader
                    loading={false}
                    disabled={false}
                    btnClassName="btn btn-success shadow-default shadow-hover mb-4"
                    onClick={() => this.gotoPersonCreate()}
                  >
                    {Localization.new}
                  </BtnLoader>
                  :
                  undefined
              }
            </div>
          </div>
          {
            AccessService.checkAccess(TPERMISSIONS.PERSON_GET_PREMIUM) === true
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
                            onChange={(value, isValid) => this.handleInputChange(value, 'name')}
                            label={Localization.name}
                            placeholder={Localization.name}
                            defaultValue={this.state.filter_state.name.value}
                          />
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <Input
                            onChange={(value, isValid) => this.handleInputChange(value, 'last_name')}
                            label={Localization.lastname}
                            placeholder={Localization.lastname}
                            defaultValue={this.state.filter_state.last_name.value}
                          />
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="form-group">
                            <label htmlFor="">{Localization.type}</label>
                            <i
                              title={Localization.reset}
                              className="fa fa-times cursor-pointer remover-in_box text-danger mx-1"
                              onClick={() => this.is_legal_of_person_in_search_remover()}
                            ></i>
                            <Select
                              onChange={(value: any) => this.handleSelectInputChange(value, 'is_legal')}
                              options={this.is_legalOptions}
                              value={this.state.filter_state.is_legal.value}
                              placeholder={Localization.type}
                            />
                          </div>
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
                          <Input
                            onChange={(value, isValid) => this.handleInputChange(value, 'cell_no')}
                            label={Localization.cell_no}
                            placeholder={Localization.cell_no}
                            defaultValue={this.state.filter_state.cell_no.value}
                          />
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <Input
                            onChange={(value, isValid) => this.handleInputChange(value, 'email')}
                            label={Localization.email}
                            placeholder={Localization.email}
                            defaultValue={this.state.filter_state.email.value}
                          />
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <Input
                            onChange={(value, isValid) => this.handleInputChange(value, 'phone')}
                            label={Localization.phone}
                            placeholder={Localization.phone}
                            defaultValue={this.state.filter_state.phone.value}
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
                    <Table row_offset_number={this.state.pager_offset} loading={this.state.tableProcessLoader} list={this.state.person_table.list} colHeaders={this.state.person_table.colHeaders} actions={this.state.person_table.actions}></Table>
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
        {this.render_delete_modal(this.selectedPerson)}
        {
          <RetryModal
            modalShow={this.state.retryModal}
            onHide={() => this.setState({ ...this.state, retryModal: false })}
            onRetry={() => { this.fetchPersons(); this.setState({ ...this.state, retryModal: false }) }}
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

export const PersonManage = connect(
  state2props,
  dispatch2props
)(PersonManageComponent);