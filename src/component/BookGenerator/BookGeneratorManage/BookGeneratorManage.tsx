import React from "react";
import { Table, IProps_table } from "../../table/table";
import { Input } from '../../form/input/Input';
import { History } from 'history';
import { Modal } from "react-bootstrap";
import { IBook } from "../../../model/model.book";
import { ToastContainer } from "react-toastify";
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { redux_state } from "../../../redux/app_state";
import { BaseComponent } from "../../_base/BaseComponent";
import { TInternationalization } from "../../../config/setup";
// import { IToken } from "../../../model/model.token";
import { Localization } from "../../../config/localization/localization";
import { BtnLoader } from "../../form/btn-loader/BtnLoader";
import { BOOK_TYPES } from "../../../enum/Book";
import Select from 'react-select';
import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import { AccessService } from "../../../service/service.access"
import { BookGeneratorService } from "../../../service/service.bookGenerator";

/// define props & state ///////
export interface IProps {
  history: History;
  internationalization: TInternationalization;
  // token: IToken;
}
interface IFilterCntent {
  title: {
    value: string | undefined;
    isValid: boolean;
  };
  tags: {
    value: { label: string, value: string }[];
    isValid: boolean;
  };
}
interface IState {
  content_table: IProps_table;
  contentError: string | undefined;
  pager_offset: number;
  pager_limit: number;
  removeModalShow: boolean;
  generateModalShow: boolean;
  prevBtnLoader: boolean;
  nextBtnLoader: boolean;
  filterSearchBtnLoader: boolean;
  tableProcessLoader: boolean;
  filter: IFilterCntent,
  setRemoveLoader: boolean;
  setGenerateLoader: boolean;
  tags_inputValue: string;
}

// define class of content 

class BookGeneratorManageComponent extends BaseComponent<IProps, IState>{
  state = {
    content_table: {
      list: [],
      colHeaders: [
        {
          field: "bookTitle", title: Localization.title, cellTemplateFunc: (row: any) => {
            if (row.book) {
              return <div title={row.title} className="text-nowrap-ellipsis max-w-200px d-inline-block">
                {(row.book as IBook).title}
              </div>
            }
            return '';
          }
        },
        {
          field: "images", title: Localization.images, templateFunc: () => {
            return <b>{Localization.images}</b>
          },
          cellTemplateFunc: (row: any) => {
            if (row.book && row.book.images && row.book.images.length) {
              return <div className="text-center" >
                <div className="d-inline-block w-50px h-50px">
                  <img className="max-w-50px max-h-50px" src={"/api/serve-files/" + row.book.images[0]} alt="" onError={e => this.bookImageOnError(e)} />
                </div>
              </div>
            }
            else {
              return <div className="text-center">
                <div className="d-inline-block w-50px h-50px">
                  <img className="max-w-50px max-h-50px" src={this.defaultBookImagePath} alt="" />
                </div>
              </div>
            }
          }
        },
        {
          field: "type", title: Localization.type + " " + Localization.book,
          cellTemplateFunc: (row: any) => {
            if (row.book.type) {
              const b_type: any = row.book.type;
              const b_t: BOOK_TYPES = b_type;
              return Localization.book_type_list[b_t];
            }
            return '';
          }
        },
        {
          field: "contentType", title: Localization.type + " " + Localization.content,
          cellTemplateFunc: (row: any) => {
            if (row.type) {
              return Localization[row.type];
            }
            return '';
          }
        },
        {
          field: "creation_date", title: Localization.creation_date + " " + Localization.content,
          cellTemplateFunc: (row: IBook) => {
            if (row.creation_date) {
              return <div title={this._getTimestampToDate(row.creation_date)}>{this.getTimestampToDate(row.creation_date)}</div>
            }
            return '';
          }
        },
        {
          field: "duration", title: Localization.duration,
          cellTemplateFunc: (row: any) => {
            let hour;
            let minute;
            let second;
            if (row.book.duration) {
              if (row.book.duration === 'NaN') {
                return ''
              }
              if (row.book.type !== 'Audio') {
                return ''
              }
              let totalTime = Number(row.book.duration);
              if (totalTime === 0) {
                return ''
              }
              if (totalTime < 60) {
                hour = 0;
                minute = 0;
                second = totalTime;
                return <div title={row.book.duration} className="text-right d-inline-block text-nowrap-ellipsis max-w-100px"> {second} : {minute} : {hour}</div>
              }
              if (totalTime >= 60 && totalTime < 3600) {
                let min = Math.floor(totalTime / 60);
                let sec = totalTime - (min * 60);
                hour = 0;
                minute = min;
                second = sec;
                return <div title={row.book.duration} className="text-right d-inline-block text-nowrap-ellipsis max-w-100px"> {second} : {minute} : {hour}</div>
              } else {
                let hours = Math.floor(totalTime / 3600);
                if ((totalTime - (hours * 3600)) < 60) {
                  let sec = totalTime % 3600;
                  hour = hours;
                  minute = 0;
                  second = sec;
                  return <div title={row.book.duration} className="text-right d-inline-block text-nowrap-ellipsis max-w-100px"> {second} : {minute} : {hour}</div>
                } else {
                  let min = Math.floor(((totalTime - (hours * 3600)) / 60));
                  let sec = (totalTime - ((hours * 3600) + (min * 60)));
                  hour = hours;
                  minute = min;
                  second = sec;
                  return <div title={row.book.duration} className="text-right d-inline-block text-nowrap-ellipsis max-w-100px"> {second} : {minute} : {hour}</div>
                }
              }
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
          text: <i title={Localization.create} className="fa fa-wrench text-dark"></i>,
          ac_func: (row: any) => { this.getGenerateRow(row) },
          name: Localization.create
        },
      ]
    },
    contentError: undefined,
    pager_offset: 0,
    pager_limit: 10,
    prevBtnLoader: false,
    nextBtnLoader: false,
    filterSearchBtnLoader: false,
    tableProcessLoader: false,
    removeModalShow: false,
    generateModalShow: false,
    filter: {
      title: {
        value: undefined,
        isValid: true,
      },
      tags: {
        value: [],
        isValid: true
      }
    },
    setRemoveLoader: false,
    setGenerateLoader: false,
    tags_inputValue: '',
  }

  selectedContent: any | undefined;
  selectedContentGenerate: any | undefined;
  private _bookContentService = new BookGeneratorService();

  checkAllAccess(): boolean {
    if (AccessService.checkOneOFAllAccess([])
      || AccessService.checkOneOFAllAccess([])
    ) {
      return true;
    }
    return false;
  }

  checkDeleteToolAccess(): boolean {
    if (AccessService.checkAccess('') || AccessService.checkAccess('')) {
      return true;
    }
    return false
  }

  checkUpdateToolAccess(): boolean {
    if (AccessService.checkAccess('') || AccessService.checkAccess('')) {
      return true;
    }
    return false
  }

  checkPriceAddToolAccess(): boolean {
    if (AccessService.checkAccess('') || AccessService.checkAccess('')) {
      return true;
    }
    return false
  }

  // constructor(props: IProps) {
  //   super(props);
  //   // this._bookService.setToken(this.props.token)
  //   // this._priceService.setToken(this.props.token)
  // }

  componentDidMount() {
    moment.locale("en");
    this.setState({
      ...this.state,
      tableProcessLoader: true
    })
    this.fetchBooksContent();
  }

  updateRow(book_generator_id: any) {
    if (this.checkUpdateToolAccess() === false) {
      return;
    }
    this.props.history.push(`/book_generator/${book_generator_id.id}/edit`);
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

  // delete modal function define

  onShowRemoveModal(content: any) {
    if (this.checkDeleteToolAccess() === false) {
      return;
    }
    this.selectedContent = content;
    this.setState({ ...this.state, removeModalShow: true });
  }

  onHideRemoveModal() {
    this.selectedContent = undefined;
    this.setState({ ...this.state, removeModalShow: false });
  }

  async onRemoveContent(content_id: string) {
    if (this.checkDeleteToolAccess() === false) {
      return;
    };
    this.setState({ ...this.state, setRemoveLoader: true });
    let res = await this._bookContentService.remove(content_id).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'onRemoveContent_error' } });
      this.setState({ ...this.state, setRemoveLoader: false });
    });
    if (res) {
      this.setState({ ...this.state, setRemoveLoader: false });
      this.apiSuccessNotify();
      this.fetchBooksContent();
      this.onHideRemoveModal();
    }
  }

  render_delete_modal(selectedContent: any) {
    if (!this.selectedContent || !this.selectedContent.id) return;
    return (
      <>
        <Modal show={this.state.removeModalShow} onHide={() => this.onHideRemoveModal()}>
          <Modal.Body>
            <p className="delete-modal-content text-center text-danger">
              {Localization.remove + " " + Localization.content}
            </p>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.title}:&nbsp;
            </span>
              {(this.selectedContent.book as IBook).title}
            </p>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.type + " " + Localization.book}:&nbsp;
            </span>
              {Localization.book_type_list[((this.selectedContent.book as IBook).type as BOOK_TYPES)]}
            </p>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.type + " " + Localization.content}:&nbsp;
            </span>
              {Localization[this.selectedContent.type]}
            </p>
            <p className="text-danger">{Localization.msg.ui.item_will_be_removed_continue}</p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideRemoveModal()}>{Localization.close}</button>
            <BtnLoader
              btnClassName="btn btn-danger shadow-default shadow-hover"
              onClick={() => this.onRemoveContent(selectedContent.id)}
              loading={this.state.setRemoveLoader}
            >
              {Localization.remove}
            </BtnLoader>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  // generate modal function define

  getGenerateRow(content: any) {
    if (this.checkDeleteToolAccess() === false) {
      return;
    }
    this.selectedContentGenerate = content;
    this.setState({ ...this.state, generateModalShow: true });
  }

  onHideGenerateModal() {
    this.selectedContentGenerate = undefined;
    this.setState({ ...this.state, generateModalShow: false });
  }

  async onGenerateContent(content_id: string) {
    this.setState({ ...this.state, setGenerateLoader: true });
    let res = await this._bookContentService.bookBuild(content_id).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'onGenerateContent_error' } });
      this.setState({ ...this.state, setGenerateLoader: false });
    });
    if (res) {
      this.setState({ ...this.state, setGenerateLoader: false });
      this.apiSuccessNotify();
      this.fetchBooksContent();
      this.onHideGenerateModal();
    }
  }

  render_generate_modal(selectedContentGenerate: any) {
    if (!this.selectedContentGenerate || !this.selectedContentGenerate.id) return;
    return (
      <>
        <Modal show={this.state.generateModalShow} onHide={() => this.onHideGenerateModal()}>
          <Modal.Body>
            <p className="delete-modal-content text-center text-success">
              {Localization.create + " " + Localization.content}
            </p>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.title}:&nbsp;
              </span>
              {(this.selectedContentGenerate.book as IBook).title}
            </p>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.type + " " + Localization.book}:&nbsp;
              </span>
              {Localization.book_type_list[((this.selectedContentGenerate.book as IBook).type as BOOK_TYPES)]}
            </p>
            <p className="delete-modal-content">
              <span className="text-muted">
                {Localization.type + " " + Localization.content}:&nbsp;
              </span>
              {Localization[this.selectedContentGenerate.type]}
            </p>
            <p className="text-success">{Localization.msg.ui.do_you_want_create_this_book_content}</p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideGenerateModal()}>{Localization.close}</button>
            <BtnLoader
              btnClassName="btn btn-success shadow-default shadow-hover"
              onClick={() => this.onGenerateContent(selectedContentGenerate.id)}
              loading={this.state.setGenerateLoader}
            >
              {Localization.build}
            </BtnLoader>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  // define axios for give data

  async fetchBooksContent() {
    this.setState({ ...this.state, tableProcessLoader: true })
    let res = await this._bookContentService.search(
      this.state.pager_limit,
      this.state.pager_offset,
      this.getFilter()
    ).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'fetchBooksContent_error' } });
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
        ...this.state, content_table: {
          ...this.state.content_table,
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
    if (this.state.content_table.list && (this.state.content_table.list! || []).length) {
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
    } else if (this.state.content_table.list && !(this.state.content_table.list! || []).length) {
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

    } else if (this.state.contentError) {
      return;
    } else {
      return;
    }
  }

  // next button create

  pager_next_btn_render() {
    if (this.state.content_table.list && (this.state.content_table.list! || []).length) {
      return (
        <>
          {
            !(this.state.pager_limit > (this.state.content_table.list! || []).length) &&
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
    } else if (this.state.content_table.list && !(this.state.content_table.list! || []).length) {
      return;
    } else if (this.state.content_table.list) {
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
      this.fetchBooksContent()
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
      this.fetchBooksContent()
    });
  }


  ///// navigation function //////

  gotoBookContentCreate() {
    // if (AccessService.checkAccess('') === false && AccessService.checkAccess('') === false) {
    //   return;
    // };
    this.props.history.push('/book_generator/create'); // /admin
  }



  //////   tag filter //////////////

  handle_tagsKeyDown(event: any/* SyntheticKeyboardEvent<HTMLElement> */) {
    if (!this.state.tags_inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        const newVal = this.state.tags_inputValue;
        this.setState({
          ...this.state,
          filter: {
            ...this.state.filter,
            tags: {
              ...this.state.filter.tags,
              value: [
                ...this.state.filter.tags.value,
                { label: newVal, value: newVal }
              ]
            }
          },
          tags_inputValue: ''
        });
        event.preventDefault();
    }
  };


  handleSelectInputChange(value: any[], inputType: any) {
    // let isValid;
    // if (!value || !value.length) {
    //   isValid = false;
    // } else {
    //   isValid = true;
    // }
    this.setState({
      ...this.state,
      filter: {
        ...this.state.filter,
        [inputType]: { value: value || [], isValid: true }
      }
    })

  }

  /////  onChange & search & reset function for search box ///////////

  handleFilterInputChange(value: string, isValid: boolean) {
    this.setState({
      ...this.state,
      filter: {
        ...this.state.filter,
        title: {
          value, isValid
        }
      },
    });
  }

  filterReset() {
    this.setState({
      ...this.state, filter: {
        ...this.state.filter,
        title: {
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
      this.fetchBooksContent()
    });
  }

  private _filter: IFilterCntent = {
    title: { value: undefined, isValid: true },
    tags: { value: [], isValid: true },
  };
  isFilterEmpty(): boolean {
    if (this._filter.title.value) {
      return false;
    }
    if (this._filter.tags.value.length) {
      return false;
    }
    return true;
  }
  setFilter() {
    this._filter = { ...this.state.filter };
  }
  getFilter() {
    if (!this.isFilterEmpty()) {
      let obj: any = {};
      if (this._filter.title.isValid) {
        obj['title'] = this._filter.title.value;
      }
      if (this._filter.tags.isValid) {
        if (this._filter.tags.value.length) {
          obj['tags'] = this._filter.tags.value.map(t => t.value);
        }
        // obj['tags'] = this._filter.tags.value.length?;
      }
      return obj;
    }
    return;
  }

  //////render call Table component //////

  render() {
    return (
      <>
        <div className="content">
              <div className="row">
                <div className="col-12">
                  <h2 className="text-bold text-dark pl-3">{Localization.content}</h2>
          {/* {
            AccessService.checkAccess('BOOK_ADD_PREMIUM') || AccessService.checkAccess('BOOK_ADD_PRESS')
              ? */}
                  <BtnLoader
                    loading={false}
                    disabled={false}
                    btnClassName="btn btn-success shadow-default shadow-hover mb-4"
                    onClick={() => this.gotoBookContentCreate()}
                  >
                    {Localization.new}
                  </BtnLoader>
              {/* :
              undefined
            } */}
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
                      defaultValue={this.state.filter.title.value}
                    />
                  </div>
                  <div className="col-8 d-none">
                    <div className="form-group">
                      <label htmlFor="">{Localization.tags}</label>
                      <Select
                        isMulti
                        onChange={(value: any) => this.handleSelectInputChange(value, "tags")}
                        value={this.state.filter.tags.value}
                        placeholder={Localization.tags}
                        onKeyDown={(e) => this.handle_tagsKeyDown(e)}
                        inputValue={this.state.tags_inputValue}
                        menuIsOpen={false}
                        components={{
                          DropdownIndicator: null,
                        }}
                        isClearable
                        onInputChange={(inputVal) => this.setState({ ...this.state, tags_inputValue: inputVal })}
                      />
                    </div>
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

            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Table loading={this.state.tableProcessLoader} list={this.state.content_table.list} colHeaders={this.state.content_table.colHeaders} actions={this.state.content_table.actions}></Table>
              <div>
                {this.pager_previous_btn_render()}
                {this.pager_next_btn_render()}
              </div>
            </div>
          </div>
        </div>
        {this.render_delete_modal(this.selectedContent)}
        {this.render_generate_modal(this.selectedContentGenerate)}
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

export const BookGeneratorManage = connect(
  state2props,
  dispatch2props
)(BookGeneratorManageComponent);