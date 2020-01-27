import React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { redux_state } from '../../../redux/app_state';
import { BaseComponent } from '../../_base/BaseComponent';
import { Dispatch } from 'redux';
import { TInternationalization } from '../../../config/setup';
import { Localization } from '../../../config/localization/localization';
import { Modal } from 'react-bootstrap';
import { IPerson } from '../../../model/model.person';
import { IBook } from '../../../model/model.book';
import { IComment } from '../../../model/model.comment';

interface IProps {
    internationalization: TInternationalization;
    modalShow: boolean;
    rowData: IComment;
    onHide: () => void;
}

interface IState {
    user: string | undefined;
    person: IPerson | undefined;
    book: IBook | undefined;
    comment: string | undefined;
    likes: number | undefined;
    reports: number | undefined;
    liked_by_user: boolean | undefined;
    reported_by_user: boolean | undefined;
}

class CommentShowModalComponent extends BaseComponent<IProps, IState> {
    state = {
        user: undefined,
        person: undefined,
        book: undefined,
        comment: undefined,
        likes: undefined,
        reports: undefined,
        liked_by_user: undefined,
        reported_by_user: undefined,
    }

    componentDidMount() {
        this.received_data_from_props_seter();
    }

    received_data_from_props_seter() {
        this.setState({
            ...this.state,
            user: this.props.rowData.creator,
            person: this.props.rowData.person,
            book: this.props.rowData.book === undefined ? undefined : this.props.rowData.book,
            comment: this.props.rowData.body,
            likes: this.props.rowData.likes,
            reports: this.props.rowData.reports,
            liked_by_user: this.props.rowData.liked_by_user,
            reported_by_user: this.props.rowData.reported_by_user
        })
    }

    returner_comment_content() {
        return (
            <>
                <Modal className="fade" show={this.props.modalShow} onHide={() => this.props.onHide()} >
                    <Modal.Body>
                        <p className="delete-modal-content text-center text-info">
                            {Localization.comment}
                        </p>
                        <p className="show-modal-content-wrapper" >
                            <div>
                                <span>
                                    <span className="text-muted">{Localization.user}:&nbsp;</span>{this.state.user === undefined ? "" : this.state.user}
                                </span>
                            </div>
                            <div>
                                <span>
                                    <span className="text-muted">{Localization.full_name}:&nbsp;</span>{this.state.person === undefined ? "" : this.getPersonFullName(this.state.person!)}
                                </span>
                            </div>
                            <div>
                                <span>
                                    <span className="text-muted">{Localization.book_title}:&nbsp;</span><span>{this.state.book === undefined ? "" : (this.state.book as any).title}</span>
                                </span>
                            </div>
                            <span className="text-muted">{Localization.comment}:&nbsp;</span>
                            <p className="border border-dark rounded show-modal-content p-2">
                                {this.state.comment}
                            </p>
                            <div>
                                <span>
                                    <span className="text-muted">{Localization.number_of_likes}:&nbsp;</span><span className="text-success">{this.state.likes}</span>
                                </span>
                            </div>
                            <div>
                                <span>
                                    <span className="text-muted">{Localization.number_of_reports}:&nbsp;</span><span className="text-danger">{this.state.reports}</span>
                                </span>
                            </div>
                            <div>
                                <span>
                                    <span className="text-muted">{Localization.liked_by_user}:&nbsp;</span>
                                    {
                                        this.state.liked_by_user
                                            ?
                                            <i title={Localization.liked_by_user} className="fa fa-check text-success"></i>
                                            :
                                            ""
                                    }
                                </span>
                            </div>
                            <div>
                                <span>
                                    <span className="text-muted">{Localization.reported_by_user}:&nbsp;</span>
                                    {
                                        this.state.reported_by_user
                                            ?
                                            <i title={Localization.liked_by_user} className="fa fa-check text-danger"></i>
                                            :
                                            ""
                                    }
                                </span>
                            </div>
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-light shadow-default shadow-hover"
                            onClick={() => this.props.onHide()}>
                            {Localization.close}
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }

    ////////   end crate quick person  //////////

    render() {
        return (
            <>
                {this.returner_comment_content()}
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

export const CommentShowModal = connect(
    state2props,
    dispatch2props
)(CommentShowModalComponent);