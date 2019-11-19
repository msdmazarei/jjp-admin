import React from 'react'
import { BaseComponent } from '../../../_base/BaseComponent';
import { TInternationalization } from '../../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../../redux/app_state';
import { Modal } from "react-bootstrap";
import { BookGeneratorService } from '../../../../service/service.bookGenerator';
import { Localization } from '../../../../config/localization/localization';
import { BtnLoader } from '../../../form/btn-loader/BtnLoader';
import { IBook } from '../../../../model/model.book';
import { BOOK_TYPES } from '../../../../enum/Book';

interface IProps {
    internationalization: TInternationalization;
    book: IBook;
    content_type: string;
    book_content_id: string;
    content_inquiry_id: string;
    modalShow: boolean;
    onHide: () => void;
}

interface IState {
    new_inquiry_id: string | undefined;
    content_status_old_inquiry_id: string | undefined;
    content_status_new_inquiry_id: string | undefined;
}

class GetBookContentGenerateOrStatusModalComponent extends BaseComponent<IProps, IState>{
    state = {
        new_inquiry_id: undefined,
        content_status_old_inquiry_id: undefined,
        content_status_new_inquiry_id: undefined,
    }

    private _getContentService = new BookGeneratorService();

    componentDidMount() {
        if (typeof this.props.content_inquiry_id === 'string') {
            this.getFileStateBeforNewId();
        }
    }

    async fetchContentStatus(inquiry_id: string) {
        let res = await this._getContentService.getbookBuildStatus(inquiry_id).catch(e => {
            this.setState({ ...this.state, content_status_old_inquiry_id: 'استعلام وضعیت محتوای کتاب با خطا مواجه شده است' })
        })
        if (res) {
            if (this.state.new_inquiry_id === undefined) {
                this.setState({
                    ...this.state,
                    content_status_old_inquiry_id: res.data.inquiry_result,
                })
            } else {
                this.setState({
                    ...this.state,
                    content_status_new_inquiry_id: res.data.inquiry_result,
                })
            }
        }
    }

    async onGenerateContent(content_id: string) {
        let res = await this._getContentService.bookBuild(content_id).catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'onGenerateContent_error' } });
        });
        if (res) {
            if (res) {
                this.setState({
                    ...this.state,
                    new_inquiry_id: res.data.inquiry_id,
                }, () => this.getFileStateAfterNewId());
            }
        }
    }

    private _getFileStateBeforNewId_timer: any;
    getFileStateBeforNewId() {
        this._getFileStateBeforNewId_timer = setTimeout(() => {

            this.fetchContentStatus(this.props.content_inquiry_id);

            if (this.state.new_inquiry_id === undefined) {
                if (this.state.content_status_old_inquiry_id !== 'SUCCESS') {
                    this.getFileStateBeforNewId();
                }
            }
        }, 500);
    }

    private _getFileStateAfterNewId_timer: any;
    getFileStateAfterNewId() {
        this._getFileStateAfterNewId_timer = setTimeout(() => {

            this.fetchContentStatus(this.state.new_inquiry_id!);

            if (this.state.content_status_new_inquiry_id !== 'SUCCESS') {
                this.getFileStateAfterNewId();
            }
        }, 500);
    }

    status_returner():string{
        if(this.state.new_inquiry_id === undefined){
            if(this.state.content_status_old_inquiry_id === 'PENDING'){
                return 'this is creating ...'
            }else if(this.state.content_status_old_inquiry_id === 'SUCCESS'){
                return 'this is created'
            }else{
                return 'this is not created'
            }
        }else{
            if(this.state.content_status_new_inquiry_id === 'PENDING'){
                return 'this is creating ...'
            }else if(this.state.content_status_old_inquiry_id === 'SUCCESS'){
                return 'this is created'
            }else{
                return 'this is not created'
            }
        }
        return ''
    }

    render_generate_modal() {
        return (
            <>
                <Modal show={this.props.modalShow} onHide={() => this.props.onHide()}>
                    <Modal.Header>

                    </Modal.Header>
                    <Modal.Body>
                        <p className="delete-modal-content text-center text-success">
                            {Localization.create + " " + Localization.content}
                        </p>
                        <p className="delete-modal-content">
                            <span className="text-muted">{Localization.title}:&nbsp;</span>{(this.props.book as IBook).title}
                        </p>
                        <p className="delete-modal-content">
                            <span className="text-muted">{Localization.type + " " + Localization.book}:&nbsp;</span>
                            {Localization.book_type_list[this.props.book.type as BOOK_TYPES]}
                        </p>
                        <p className="delete-modal-content">
                            <span className="text-muted">{Localization.type + " " + Localization.content}:&nbsp;</span>
                            {Localization[this.props.content_type]}
                        </p>
                        <p>
                            <span className="text-muted">{Localization.status + " " + Localization.content}:&nbsp;</span>
                            {this.status_returner()}
                        </p>
                        <p className="text-success">{Localization.msg.ui.do_you_want_create_this_book_content}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-light shadow-default shadow-hover"
                            onClick={() => this.props.onHide()}>
                            {Localization.close}
                        </button>
                        <BtnLoader
                            btnClassName="btn btn-success shadow-default shadow-hover"
                            onClick={() => this.onGenerateContent(this.props.book_content_id)}
                            loading={this.state.content_status_new_inquiry_id === 'PENDING' ? true : false}
                            disabled={this.state.content_status_new_inquiry_id === 'SUCCESS' ? true : false}
                        >
                            {Localization.build}
                        </BtnLoader>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    render() {
        return (
            <>
                {this.render_generate_modal()}
            </>
        )
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

export const GetBookContentGenerateOrStatusModal = connect(
    state2props,
    dispatch2props
)(GetBookContentGenerateOrStatusModalComponent);