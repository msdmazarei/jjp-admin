import React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { Localization } from '../../../config/localization/localization';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { Modal } from "react-bootstrap";
import { IBook } from '../../../model/model.book';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';

interface IState {
}

interface IProps {
    internationalization: TInternationalization;
    data?: any;
    modalShow: boolean;
    book: IBook;
    onHide: () => void;
    onPass: () => void;
}

class BookSavePassToContentModalComponent extends BaseComponent<IProps, IState> {
    state = {
    }

    ////////   start crate quick person  //////////

    render_book_passer_to_content_page() {
        return (
            <>
                <Modal show={this.props.modalShow} onHide={() => this.props.onHide()}>
                    <Modal.Body>
                        <p className="delete-modal-content">
                            <span className="text-muted">{Localization.title}:&nbsp;</span>
                            {this.props.book.title}
                        </p>
                        <div className="text-center">
                            {
                                Localization.msg.ui.book_creation_successful_do_you_want_to_create_content_for_this_book
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.props.onHide()}>{Localization.close}</button>
                        {
                            <BtnLoader
                                loading={false}
                                btnClassName="btn btn-system shadow-default shadow-hover"
                                onClick={() => this.props.onPass()}
                            >
                                {Localization.create}
                            </BtnLoader>
                        }
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    ////////   end crate quick person  //////////

    render() {
        return (
            <>
                {this.render_book_passer_to_content_page()}
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

export const BookSavePassToContentModal = connect(
    state2props,
    dispatch2props
)(BookSavePassToContentModalComponent);