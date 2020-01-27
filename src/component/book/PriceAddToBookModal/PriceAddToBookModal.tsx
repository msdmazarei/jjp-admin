import React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { redux_state } from '../../../redux/app_state';
import { BaseComponent } from '../../_base/BaseComponent';
import { Dispatch } from 'redux';
import { TInternationalization } from '../../../config/setup';
import { Localization } from '../../../config/localization/localization';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { Modal } from 'react-bootstrap';
import { FixNumber } from '../../form/fix-number/FixNumber';
import { AppRegex } from '../../../config/regex';
import { IBook } from '../../../model/model.book';

interface IProps {
    internationalization: TInternationalization;
    modal_show: boolean;
    book: IBook;
    btnLoader: boolean;
    onchange: (book_id: string, price: number) => void;
    onHide: () => void;
}

interface IState {
    book_title: string | undefined;
    book_id: string | undefined
    price: {
        value: number | undefined;
        isValid: boolean
    }
}

class PriceAddToBookModalComponent extends BaseComponent<IProps, IState> {

    state = {
        book_title: undefined,
        book_id: undefined,
        price: {
            value: undefined,
            isValid: false,
        }
    }

    componentDidMount() {
        this.received_data_from_props_set_on_state();
    }

    received_data_from_props_set_on_state() {
        if (typeof this.props.book.id === undefined || typeof this.props.book.title === undefined) {
            this.props.onHide();
            return;
        }
        this.setState({
            ...this.state,
            book_title: this.props.book.title,
            book_id: this.props.book.id,
            price: {
                value: this.props.book.price,
                isValid: (this.props.book.price || this.props.book.price === 0) ? true : false,
            }
        })
    }

    handlePriceInputChange(price: number, validation: boolean) {
        this.setState({
            ...this.state,
            price: {
                value : price,
                isValid : validation,
            }
        })
    }

    returner_price_add_to_book_modal_content() {
        return (
            <>
                <Modal show={this.props.modal_show} onHide={() => this.props.onHide()}>
                    <Modal.Body>
                        <p className="delete-modal-content">
                            <span className="text-muted">{Localization.title}:</span>{this.state.book_title}
                        </p>
                        <FixNumber
                            onChange={(value, isValid) => this.handlePriceInputChange(value, isValid)}
                            label={Localization.Pricing}
                            placeholder={Localization.price}
                            defaultValue={this.state.price.value}
                            pattern={AppRegex.number}
                            patternError={Localization.Justـenterـtheـnumericـvalue}
                            required
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.props.onHide()}>{Localization.close}</button>
                        <BtnLoader
                            loading={this.props.btnLoader}
                            btnClassName="btn btn-system shadow-default shadow-hover"
                            onClick={() => this.props.onchange(this.state.book_id!, this.state.price.value!)}
                            disabled={!this.state.price.isValid}
                        >
                            {Localization.Add_price}
                        </BtnLoader>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }

    ////////   end crate quick person  //////////

    render() {
        return (
            <>
                {this.returner_price_add_to_book_modal_content()}
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

export const PriceAddToBookModal = connect(
    state2props,
    dispatch2props
)(PriceAddToBookModalComponent);