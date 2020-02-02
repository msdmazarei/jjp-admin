import React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { redux_state } from '../../../redux/app_state';
import { BaseComponent } from '../../_base/BaseComponent';
import { Dispatch } from 'redux';
import { TInternationalization } from '../../../config/setup';
import { Localization } from '../../../config/localization/localization';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { Modal } from 'react-bootstrap';
import { AppRegex } from '../../../config/regex';
import { FixNumber } from '../../form/fix-number/FixNumber';
import moment from "moment";
import moment_jalaali from 'moment-jalaali';


interface IProps {
    internationalization: TInternationalization;
    modalShow: boolean;
    rowData: any;
    btnLoader: boolean;
    onHide: () => void;
    onUpdate: (field: { payer_id: string, receiver_id: string, amount: number }, field_id: string) => void;
}

interface IState {
    rowId: string | undefined;
    payer_id: string | undefined;
    receiver_id: string | undefined;
    amount: number | null | undefined;
    isValid: boolean;
}

class UpdatePaymentModalComponent extends BaseComponent<IProps, IState> {
    state = {
        rowId: undefined,
        payer_id: undefined,
        receiver_id: undefined,
        amount: undefined,
        isValid: false,
    }

    componentDidMount() {
        this.rowData_received_from_props_set_in_state();
    }

    getTimestampToDate(timestamp: number) {
        if (this.props.internationalization.flag === "fa") {
            return moment_jalaali(timestamp * 1000).format('jYYYY/jM/jD');
        }
        else {
            return moment(timestamp * 1000).locale("en").format('YYYY/MM/DD');
        }
    }

    rowData_received_from_props_set_in_state() {
        this.setState({
            ...this.state,
            rowId: this.props.rowData.id,
            payer_id: this.props.rowData.payer_id,
            receiver_id: this.props.rowData.receiver_id,
            amount: this.props.rowData.amount,
            isValid: typeof this.props.rowData.amount === 'number' ? true : false,
        })
    }

    handlePriceInputChange(newAmount: number, validation: boolean) {
        this.setState({
            ...this.state,
            amount: newAmount,
            isValid: validation
        })
    }

    returner_delete_modal_content() {
        return (
            <>
                <Modal show={this.props.modalShow} onHide={() => this.props.onHide()}>
                    <Modal.Body>
                        <p className="delete-modal-content text-center text-success">
                            {Localization.payment_update}
                        </p>
                        <p className="delete-modal-content">
                            <span className="text-muted">{Localization.role_type_list.Press}:</span>{this.getUserFullName(this.props.rowData.receiver)}
                        </p>
                        <p className="delete-modal-content">
                            <span className="text-muted">{Localization.pay_time}:</span>{this.getTimestampToDate(this.props.rowData.creation_date)}
                        </p>
                        <FixNumber
                            onChange={(value, isValid) => this.handlePriceInputChange(value, isValid)}
                            label={Localization.Amount_of_payment}
                            placeholder={Localization.Amount_of_payment}
                            defaultValue={this.state.amount}
                            pattern={AppRegex.number}
                            patternError={Localization.Justـenterـtheـnumericـvalue}
                            required
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-light shadow-default shadow-hover"
                            onClick={() => this.props.onHide()}>
                            {Localization.close}
                        </button>
                        <BtnLoader
                            loading={this.props.btnLoader}
                            btnClassName="btn btn-success shadow-default shadow-hover"
                            onClick={() => this.props.onUpdate(
                                { payer_id: this.state.payer_id!, receiver_id: this.state.receiver_id!, amount: Number(this.state.amount!) },
                                this.state.rowId!
                            )}
                            disabled={!this.state.isValid}
                        >
                            {Localization.update}
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
                {this.returner_delete_modal_content()}
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

export const UpdatePaymentModal = connect(
    state2props,
    dispatch2props
)(UpdatePaymentModalComponent);