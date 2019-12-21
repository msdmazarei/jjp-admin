import React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { Localization } from '../../../config/localization/localization';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { Modal } from "react-bootstrap";
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { BOOK_TYPES } from '../../../enum/Book';
import Select from 'react-select';
interface IState {
    type: { label: string, value: BOOK_TYPES } | null;
}

interface IProps {
    internationalization: TInternationalization;
    data?: any;
    typeOption: { label: string, value: BOOK_TYPES }[];
    modalShow: boolean;
    bookTitle: string;
    onHide: () => void;
    onPass: (type: BOOK_TYPES) => void;
}

class BookSavePassToContentModalComponent extends BaseComponent<IProps, IState> {
    type_option = this.props.typeOption;
    state = {
        type: this.props.typeOption.length === 1 ? this.props.typeOption[0] : null,
    }

    handleSelectInputChange(value: { label: string, value: BOOK_TYPES }) {
        this.setState({
            ...this.state,
            type: value,
        })
    }

    passer_func_to_props() {
        this.props.onPass(this.state.type!.value);
    }

    ////////   start crate quick person  //////////

    render_book_passer_to_content_page() {
        return (
            <>
                <Modal show={this.props.modalShow} onHide={() => this.props.onHide()}>
                    <Modal.Body>
                        <p className="delete-modal-content">
                            <span className="text-muted">{Localization.title}:&nbsp;</span>
                            {this.props.bookTitle}
                        </p>
                        <div className="text-center">
                            {
                                Localization.msg.ui.book_creation_successful_do_you_want_to_create_content_for_this_book
                            }
                        </div>
                        <div>
                            {
                                this.props.typeOption.length > 1
                                    ?
                                    Localization.msg.ui.choose_the_type_of_book
                                    :
                                    undefined
                            }
                        </div>
                        <div>
                            {
                                this.props.typeOption.length === 1
                                    ?
                                    undefined
                                    :
                                    <div className="form-group">
                                        <label htmlFor="">{Localization.type} <span className="text-danger">*</span></label>
                                        <Select
                                            onChange={(value: any) => this.handleSelectInputChange(value)}
                                            options={this.type_option}
                                            value={this.state.type}
                                            placeholder={Localization.type}
                                        />
                                    </div>
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.props.onHide()}>{Localization.close}</button>
                        {
                            this.props.typeOption.length === 1
                                ?
                                <BtnLoader
                                    loading={false}
                                    btnClassName="btn btn-system shadow-default shadow-hover"
                                    onClick={() => this.passer_func_to_props()}
                                >
                                    {Localization.create}
                                </BtnLoader>
                                :
                                <BtnLoader
                                    loading={false}
                                    btnClassName="btn btn-system shadow-default shadow-hover"
                                    onClick={() => this.passer_func_to_props()}
                                    disabled={this.state.type === null ? true : false}
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