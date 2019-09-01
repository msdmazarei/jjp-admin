import React from "react";
import { Table, IProps_table } from "../../table/table";
import { Input } from '../../form/input/Input';
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
import { BOOK_TYPES } from "../../../enum/Book";
import { CommentService } from "../../../service/service.comment";
import { IComment } from "../../../model/model.comment";

/// define props & state ///////
export interface IProps {
  history: History;
  internationalization: TInternationalization;
  token: IToken;
}

interface IFilterComment {
  book: {
    value: string;
    isValid: boolean;
  };
  body: {
    value: string | undefined;
    isValid: boolean;
  };
}
interface IState {
  comment_table: IProps_table;
  CommentError: string | undefined;
  pager_offset: number;
  pager_limit: number;
  removeModalShow: boolean;
  commentModalShow: boolean;
  prevBtnLoader: boolean;
  nextBtnLoader: boolean;
  filterSearchBtnLoader: boolean;
  tableProcessLoader: boolean;
  filter: IFilterComment,
  setRemoveLoader: boolean;
  tags_inputValue: string;
}

// define class of Comment 

class CommentManageComponent extends BaseComponent<IProps, IState>{
  state = {
    comment_table: {
      list: [],
      colHeaders: [
        {
          field: "creator", title: Localization.user , cellTemplateFunc: (row: IComment) => {
            if (row.creator) {
              return <div title={row.creator} className="text-nowrap-ellipsis max-w-100px d-inline-block">
                {row.creator}
              </div>
            }
            return '';
          }
        },
        {
          field: "name last_name", title: Localization.full_name , cellTemplateFunc: (row: IComment) => {
            if (row.person) {
              return <div title={this.getPersonFullName(row.person)} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {this.getPersonFullName(row.person)}
              </div>
            }
            return '';
          }
        },
        {
          field: "body", title: Localization.comment , cellTemplateFunc: (row: IComment) => {
            if (row.person) {
              return <div title={row.body} className="text-nowrap-ellipsis max-w-200px d-inline-block">
                {row.body}
              </div>
            }
            return '';
          }
        },
        {
          field: "book title", title: Localization.book_title , cellTemplateFunc: (row: IComment) => {
            if (row.book && row.book.title) {
              return <div title={row.book.title} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                {row.book.title}
              </div>
            }
            return '';
          }
        },
        {
          field: "likes", title: Localization.number_of_likes , cellTemplateFunc: (row: IComment) => {
            if (row.likes) {
              return <div title={row.likes.toLocaleString()} className="text-center">
                {row.likes}{
                  row.liked_by_user
                  ?   
                  <span> - <i title={Localization.liked_by_user} className="fa fa-check text-success"></i></span>
                  : 
                  ""
                }
              </div>
            }
            else {
              return <div className="text-muted text-center">-</div>;
            }
          }
        },
        {
          field: "reports", title: Localization.number_of_reports , cellTemplateFunc: (row: IComment) => {
            if (row.reports) {
              return <div title={row.reports.toLocaleString()} className="text-center">
                {row.reports}{
                  row.reported_by_user 
                  ? 
                  <span> - <i title={Localization.reported_by_user} className="fa fa-times text-danger"></i></span> 
                  : 
                  ""
                }
              </div>
            }
            else {
              return <div className="text-muted text-center">-</div>;
            }
          }
        },
        {
          field: "book images", title: Localization.book_image , templateFunc: () => {
            return <b>{Localization.images}</b>
          },
          cellTemplateFunc: (row: IComment) => {
            if (row.book && row.book.images) {
              return <div className="text-center" >
                <div className="d-inline-block w-100px h-100px">
                  <img className="max-w-100px max-h-100px" src={"/api/serve-files/" + row.book.images[0]} alt="" onError={e => this.bookImageOnError(e)} />
                </div>
              </div>
            }
            else {
              return <div className="text-center">
                <div className="d-inline-block w-100px h-100px">
                  <img className="max-w-100px max-h-100px" src={this.defaultBookImagePath} alt="" />
                </div>
              </div>
            }
          }
        },
        {
          field: "book type", title: Localization.book_type , cellTemplateFunc: (row: IComment) => {
            if (row.book && row.book.type) {
              const b_type: any = row.book.type;
              const b_t: BOOK_TYPES = b_type;
              return Localization.book_type_list[b_t];
            }
            else {
              return <div className="text-muted text-center">-</div>;
            }
          }
        },
      ],
      actions: [
        { text: <i title={Localization.remove} className="table-action-shadow-hover fa fa-trash text-danger pt-2 mt-1"></i>, ac_func: (row: any) => { this.onShowRemoveModal(row) } },
        { text: <i title={Localization.show_comment} className="table-action-shadow-hover fa fa-eye text-info pt-2"></i>, ac_func: (row: any) => { this.onShowCommentModal(row) } },
      ]
    },
    CommentError: undefined,
    pager_offset: 0,
    pager_limit: 5,
    prevBtnLoader: false,
    nextBtnLoader: false,
    filterSearchBtnLoader: false,
    tableProcessLoader: false,
    removeModalShow: false,
    commentModalShow: false,
    filter: {
      book:{
        value: "true",
        isValid: true,
      },
      body: {
        value: undefined,
        isValid: true,
      },
    },
    setRemoveLoader: false,
    tags_inputValue: '',
  }

  selectedComment: IComment | undefined;
  private _commentService = new CommentService();

  constructor(props: IProps) {
    super(props);
    this._commentService.setToken(this.props.token)
  }

  // comment show modal function define

  onShowCommentModal(comment: IComment) {
    this.selectedComment = comment;
    this.setState({ ...this.state, commentModalShow: true});
  }

  onHideCommentModal() {
    this.selectedComment = undefined;
    this.setState({ ...this.state, commentModalShow: false });
  }

  render_comment_show_modal(selectedComment: any) {
    if (!this.selectedComment || !this.selectedComment.id) return;
    return (
      <>
        <Modal show={this.state.commentModalShow} onHide={() => this.onHideCommentModal()}>
          <Modal.Body>
            <p className="show-modal-content-wrapper" >
              <div>
                <span>
                  {Localization.user}:&nbsp;{this.selectedComment.creator}
                </span>
              </div>
              <div>
                <span>
                  {Localization.full_name}:&nbsp;{this.getUserFullName(this.selectedComment.person)}
                </span>
              </div>
              <span className="text-muted">
                  {Localization.comment}:&nbsp;
              </span>
              <p className="border border-dark rounded show-modal-content p-2">
                  {this.selectedComment.body}
              </p>
              <div>
                <span>
                  {Localization.number_of_likes}:&nbsp;<span className="text-success">{this.selectedComment.likes}</span>
                </span>
              </div>
              <div>
                <span>
                  {Localization.number_of_reports}:&nbsp;<span className="text-danger">{this.selectedComment.reports}</span>
                </span>
              </div>
              <div>
                <span>
                  {Localization.liked_by_user}:&nbsp;
                  {
                    this.selectedComment.liked_by_user
                    ?
                    <i title={Localization.liked_by_user} className="fa fa-check text-success"></i>
                    :
                    <i title={Localization.reported_by_user} className="fa fa-times text-danger"></i>
                  }
                </span>
              </div>
              <div>
                <span>
                  {Localization.reported_by_user}:&nbsp;
                  {
                    this.selectedComment.reported_by_user
                    ?
                    <i title={Localization.liked_by_user} className="fa fa-check text-success"></i>
                    :
                    <i title={Localization.reported_by_user} className="fa fa-times text-danger"></i>
                  }
                </span>
              </div>
              <div>
                <span>
                  {Localization.book_title}:&nbsp;<span>{(this.selectedComment.book!||{}).title}</span>
                </span>
              </div>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideCommentModal()}>{Localization.close}</button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  
  // delete modal function define

  onShowRemoveModal(comment: IComment) {
    this.selectedComment = comment;
    this.setState({ ...this.state, removeModalShow: true });
  }

  onHideRemoveModal() {
    this.selectedComment = undefined;
    this.setState({ ...this.state, removeModalShow: false });
  }

  async onRemoveComment(comment_id: string) {
    this.setState({ ...this.state, setRemoveLoader: true });
    let res = await this._commentService.remove(comment_id).catch(error => {
      this.handleError({ error: error.response });
      this.setState({ ...this.state, setRemoveLoader: false });
    });
    if (res) {
      this.setState({ ...this.state, setRemoveLoader: false });
      this.apiSuccessNotify();
      this.fetchComments();
      this.onHideRemoveModal();
    }
  }

  render_delete_modal(selectedComment: any) {
    if (!this.selectedComment || !this.selectedComment.id) return;
    return (
      <>
        <Modal show={this.state.removeModalShow} onHide={() => this.onHideRemoveModal()}>
          <Modal.Body>
            <p className="delete-modal-content" >
              <span className="text-muted">
                {Localization.comment}:&nbsp;
            </span>
              {this.selectedComment.body}
            </p>
            <p className="text-danger">{Localization.msg.ui.item_will_be_removed_continue}</p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.onHideRemoveModal()}>{Localization.close}</button>
            <BtnLoader
              btnClassName="btn btn-danger shadow-default shadow-hover"
              onClick={() => this.onRemoveComment(selectedComment.id)}
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
    this.fetchComments();
  }

  async fetchComments() {
    let res = await this._commentService.search(
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
        ...this.state, comment_table: {
          ...this.state.comment_table,
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
    if (this.state.comment_table.list && (this.state.comment_table.list! || []).length) {
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
    } else if (this.state.comment_table.list && !(this.state.comment_table.list! || []).length) {
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

    } else if (this.state.CommentError) {
      return;
    } else {
      return;
    }
  }

  // next button create

  pager_next_btn_render() {
    if (this.state.comment_table.list && (this.state.comment_table.list! || []).length) {
      return (
        <>
          {
            !(this.state.pager_limit > (this.state.comment_table.list! || []).length) &&
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
    } else if (this.state.comment_table.list && !(this.state.comment_table.list! || []).length) {
      return;
    } else if (this.state.comment_table.list) {
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
      this.fetchComments()
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
      this.fetchComments()
    });
  }



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
        body: {
          value, isValid
        }
      },
    });
  }

  filterReset() {
    this.setState({
      ...this.state, filter: {
        ...this.state.filter,
        body: {
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
      this.fetchComments()
    });
  }

  private _filter: IFilterComment = {
    book: { value: "true", isValid: true },
    body: { value: undefined, isValid: true },
  };
  isFilterEmpty(): boolean {
    if (this._filter.book.value) {
      return false;
    }
    if (this._filter.body.value) {
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
      if (this._filter.body.isValid) {
        obj['body'] = this._filter.body.value;
      }
      if (this._filter.book.isValid) {
        obj['book'] = true;
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
              <h2 className="text-bold text-dark pl-3">{Localization.comment}</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="template-box mb-4">
                <div className="row">
                  <div className="col-4">
                    <Input
                      onChange={(value: string, isValid) => this.handleFilterInputChange(value, isValid)}
                      label={Localization.comment}
                      placeholder={Localization.comment}
                      defaultValue={this.state.filter.body.value}
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

            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Table list={this.state.comment_table.list} colHeaders={this.state.comment_table.colHeaders} actions={this.state.comment_table.actions}></Table>
              <div>
                {this.pager_previous_btn_render()}
                {this.pager_next_btn_render()}
              </div>
            </div>
          </div>
        </div>
        {this.render_delete_modal(this.selectedComment)}
        {this.render_comment_show_modal(this.selectedComment)}
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

export const CommentManage = connect(
  state2props,
  dispatch2props
)(CommentManageComponent);