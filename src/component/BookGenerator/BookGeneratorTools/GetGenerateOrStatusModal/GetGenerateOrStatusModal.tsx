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
    modalShow: boolean;
    onHide: () => void;
}

interface IState {
    old_inquiry_id_fetch_status: boolean;
    old_inquiry_id: string | undefined;
    new_inquiry_id: string | undefined;
    content_status_old_inquiry_id: string | undefined;
    content_status_new_inquiry_id: string | undefined;
    create_btn_loading_status: boolean;
    create_btn_disable_status: boolean;
    retry_btn_loading_status: boolean,
    retry_btn_disable_status: boolean,
    retry_first_dont_show: boolean;
}

class GetBookContentGenerateOrStatusModalComponent extends BaseComponent<IProps, IState>{
    state = {
        old_inquiry_id_fetch_status: false,
        old_inquiry_id: undefined,
        new_inquiry_id: undefined,
        content_status_old_inquiry_id: undefined,
        content_status_new_inquiry_id: undefined,
        create_btn_loading_status: false,
        create_btn_disable_status: true,
        retry_btn_loading_status: false,
        retry_btn_disable_status: true,
        retry_first_dont_show: false,
    }

    private _getContentService = new BookGeneratorService();

    componentDidMount() {
        this.fetchContentById(this.props.book_content_id);
    }

    async fetchContentById(book_content_id: string) {
        this.setState({ ...this.state, retry_btn_loading_status: true, retry_btn_disable_status: true })
        let res = await this._getContentService.byId(book_content_id).catch(error => {
            this.setState({ ...this.state, retry_btn_loading_status: false, retry_btn_disable_status: false, retry_first_dont_show: true });
            this.handleError({ error: error.response, toastOptions: { toastId: 'fetchContentById_error_modal' } });
        });
        if (res) {
            this.setState({
                ...this.state,
                old_inquiry_id_fetch_status: true,
                old_inquiry_id: res.data.celery_task_id === null ? undefined : res.data.celery_task_id,
            }, () => this.afterFetchDidMount_Func())
        }
    }

    afterFetchDidMount_Func() {
        if (this.state.old_inquiry_id_fetch_status === true && this.state.old_inquiry_id !== undefined) {
            this.getFileStateBeforNewId();
        } else if (this.state.old_inquiry_id_fetch_status === true && this.state.old_inquiry_id === undefined) {
            this.setState({
                ...this.state,
                create_btn_disable_status: false,
            })
        } else {
            /// retry btn define
        }
    }

    componentWillUnmount() {
        clearTimeout(this._getFileStateBeforNewId_timer);
        clearTimeout(this._getFileStateAfterNewId_timer);
        this.setState({
            old_inquiry_id: undefined,
            new_inquiry_id: undefined,
            content_status_old_inquiry_id: undefined,
            content_status_new_inquiry_id: undefined,
            create_btn_loading_status: false,
            create_btn_disable_status: true,
        })
    }

    async fetchContentStatus(inquiry_id: string) {
        let res = await this._getContentService.getbookBuildStatus(inquiry_id).catch(e => {
            this.handleError(e.error)
        })
        if (res) {
            if (this.state.new_inquiry_id === undefined) {
                if (res.data.inquiry_result === 'SUCCESS' || res.data.inquiry_result === 'FAILURE') {
                    this.clear_getFileStateBeforNewId();
                    if (res.data.inquiry_result === 'FAILURE') {
                        this.setState({
                            ...this.state,
                            create_btn_loading_status: false,
                            create_btn_disable_status: false,
                        })
                    }
                }
                this.setState({
                    ...this.state,
                    content_status_old_inquiry_id: res.data.inquiry_result,
                })
            } else {
                if (res.data.inquiry_result === 'SUCCESS' || res.data.inquiry_result === 'FAILURE') {
                    this.clear_getFileStateAfterNewId();
                    if (res.data.inquiry_result === 'FAILURE') {
                        this.setState({
                            ...this.state,
                            create_btn_loading_status: false,
                            create_btn_disable_status: false,
                        })
                    }
                }
                this.setState({
                    ...this.state,
                    content_status_new_inquiry_id: res.data.inquiry_result,
                })
            }
        }
    }

    async onGenerateContent(content_id: string) {
        this.setState({ ...this.state, create_btn_disable_status: true, create_btn_loading_status: true });
        let res = await this._getContentService.bookBuild(content_id).catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'onGenerateContent_error' } });
            this.setState({ ...this.state, create_btn_disable_status: false, create_btn_loading_status: false });
        });
        if (res) {
            if (res) {
                this.setState({
                    ...this.state,
                    new_inquiry_id: res.data.inquiry_id,
                    create_btn_loading_status: false,
                    create_btn_disable_status: true
                }, () => this.getFileStateAfterNewId());
            }
        }
    }

    private _getFileStateBeforNewId_timer: any;
    getFileStateBeforNewId() {
        this._getFileStateBeforNewId_timer = setTimeout(() => {

            this.fetchContentStatus(this.state.old_inquiry_id!);

            if (this.state.new_inquiry_id === undefined) {
                if (this.state.content_status_old_inquiry_id === 'SUCCESS' || this.state.content_status_old_inquiry_id === 'FAILURE') {
                    this.clear_getFileStateBeforNewId();
                    if (this.state.content_status_old_inquiry_id === 'FAILURE') {
                        this.setState({
                            ...this.state,
                            create_btn_loading_status: false,
                            create_btn_disable_status: false,
                        })
                    }
                } else if (this.state.content_status_old_inquiry_id === 'PENDING') {
                    this.setState({
                        ...this.state,
                        create_btn_loading_status: true,
                        create_btn_disable_status: true,
                    })
                    this.getFileStateBeforNewId();
                } else {
                    this.getFileStateBeforNewId();
                }
            }
        }, 2000);
    }

    clear_getFileStateBeforNewId() {
        clearTimeout(this._getFileStateBeforNewId_timer);
    }

    private _getFileStateAfterNewId_timer: any;
    getFileStateAfterNewId() {
        this._getFileStateAfterNewId_timer = setTimeout(() => {

            this.fetchContentStatus(this.state.new_inquiry_id!);

            if (this.state.content_status_new_inquiry_id === 'SUCCESS' || this.state.content_status_new_inquiry_id === 'FAILURE') {
                this.clear_getFileStateAfterNewId();
                if (this.state.content_status_new_inquiry_id === 'SUCCESS') {
                    this.setState({
                        ...this.state,
                        create_btn_loading_status: false,
                        create_btn_disable_status: true,
                    })
                }
                if (this.state.content_status_new_inquiry_id === 'FAILURE') {
                    this.setState({
                        ...this.state,
                        create_btn_loading_status: false,
                        create_btn_disable_status: false,
                    })
                }
            } else if (this.state.content_status_old_inquiry_id === 'PENDING') {
                this.setState({
                    ...this.state,
                    create_btn_loading_status: true,
                    create_btn_disable_status: true,
                })
                this.getFileStateAfterNewId();
            } else {
                this.setState({
                    ...this.state,
                    create_btn_loading_status: true,
                    create_btn_disable_status: true,
                })
                this.getFileStateAfterNewId();
            }
        }, 2000);
    }

    clear_getFileStateAfterNewId() {
        clearTimeout(this._getFileStateAfterNewId_timer);
    }

    toster_msg_func(msg: string, status: number) {
        if (status === 1) {
            this.toastNotify(msg, { toastId: 'toster_msg_func_info' }, 'info');
        }
        if (status === 2) {
            this.toastNotify(msg, { toastId: 'toster_msg_func_warn_1' }, 'warn');
        }
        if (status === 3) {
            this.toastNotify(msg, { toastId: 'toster_msg_func_error_1' }, 'error');
        }
        if (status === 4) {
            this.toastNotify(msg, { toastId: 'toster_msg_func_success_1' }, 'success');
        }
        if (status === 22) {
            this.toastNotify(msg, { toastId: 'toster_msg_func_warn_2' }, 'warn');
        }
        if (status === 33) {
            this.toastNotify(msg, { toastId: 'toster_msg_func_error_2' }, 'error');
        }
        if (status === 44) {
            this.toastNotify(msg, { toastId: 'toster_msg_func_success_2' }, 'success');
        }
    }

    status_returner(): string {
        if (this.state.new_inquiry_id === undefined) {
            if (this.state.old_inquiry_id_fetch_status === true && this.state.old_inquiry_id === undefined && this.state.content_status_old_inquiry_id === undefined) {
                this.toster_msg_func(Localization.msg.ui.admin_book_content_generate.book_not_created, 1);
                return Localization.msg.ui.admin_book_content_generate.book_not_created;
            };
            if (this.state.content_status_old_inquiry_id === 'PENDING') {
                this.toster_msg_func(Localization.msg.ui.admin_book_content_generate.before_generate_request_result_pendding, 2);
                return Localization.msg.ui.admin_book_content_generate.before_generate_request_result_pendding;
            };
            if (this.state.content_status_old_inquiry_id === 'FAILURE') {
                this.toster_msg_func(Localization.msg.ui.admin_book_content_generate.before_generate_request_result_fail, 3);
                return Localization.msg.ui.admin_book_content_generate.before_generate_request_result_fail;
            };
            if (this.state.content_status_old_inquiry_id === 'SUCCESS') {
                this.toster_msg_func(Localization.msg.ui.admin_book_content_generate.before_generate_request_result_success, 4);
                return Localization.msg.ui.admin_book_content_generate.before_generate_request_result_success;
            };
        } else {
            if (this.state.content_status_new_inquiry_id === 'PENDING') {
                this.toster_msg_func(Localization.msg.ui.admin_book_content_generate.after_generate_request_result_pendding, 22);
                return Localization.msg.ui.admin_book_content_generate.after_generate_request_result_pendding;
            };
            if (this.state.content_status_new_inquiry_id === 'FAILURE') {
                this.toster_msg_func(Localization.msg.ui.admin_book_content_generate.after_generate_request_result_fail, 33);
                return Localization.msg.ui.admin_book_content_generate.after_generate_request_result_fail;
            };
            if (this.state.content_status_new_inquiry_id === 'SUCCESS') {
                this.toster_msg_func(Localization.msg.ui.admin_book_content_generate.after_generate_request_result_success, 44);
                return Localization.msg.ui.admin_book_content_generate.after_generate_request_result_success;
            };
        }
        return ''
    }

    create_status(): boolean {
        if (this.state.old_inquiry_id_fetch_status === false && this.state.new_inquiry_id === undefined) {
            return false;
        };
        if (this.state.new_inquiry_id === undefined) {
            if (this.state.old_inquiry_id_fetch_status === true && this.state.content_status_old_inquiry_id === undefined) {
                return false;
            };
            if (this.state.old_inquiry_id_fetch_status === true && this.state.content_status_old_inquiry_id === 'SUCCESS') {
                return false;
            };
            if (this.state.old_inquiry_id_fetch_status === true && this.state.content_status_old_inquiry_id === 'PENDING') {
                return true;
            };
            if (this.state.old_inquiry_id_fetch_status === true && this.state.content_status_old_inquiry_id === 'FAILURE') {
                return true;
            };
        }
        if (this.state.new_inquiry_id !== undefined) {
            if (this.state.content_status_new_inquiry_id === undefined) {
                return false;
            };
            if (this.state.content_status_new_inquiry_id === 'SUCCESS') {
                return false;
            };
            if (this.state.content_status_new_inquiry_id === 'PENDING') {
                return true;
            };
            if (this.state.content_status_new_inquiry_id === 'FAILURE') {
                return true;
            };
        }

        return false;
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
                        {
                            this.create_status() === true
                                ?
                                <p className="text-success">{Localization.msg.ui.do_you_want_create_this_book_content}</p>
                                :
                                undefined
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-light shadow-default shadow-hover"
                            onClick={() => this.props.onHide()}>
                            {Localization.close}
                        </button>
                        {
                            this.create_status() === true
                                ?
                                <BtnLoader
                                    btnClassName="btn btn-success shadow-default shadow-hover"
                                    onClick={() => this.onGenerateContent(this.props.book_content_id)}
                                    loading={this.state.create_btn_loading_status}
                                    disabled={this.state.create_btn_disable_status}
                                >
                                    {Localization.build}
                                </BtnLoader>
                                :
                                undefined
                        }
                        {
                            (this.state.old_inquiry_id_fetch_status === false && this.state.retry_first_dont_show === true)
                                ?
                                <BtnLoader
                                    btnClassName="btn btn-success shadow-default shadow-hover"
                                    onClick={() => this.fetchContentById(this.props.book_content_id)}
                                    loading={this.state.retry_btn_loading_status}
                                    disabled={this.state.retry_btn_disable_status}
                                >
                                    {Localization.retry}
                                </BtnLoader>
                                :
                                undefined
                        }
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