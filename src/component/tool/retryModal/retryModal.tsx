import React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { redux_state } from '../../../redux/app_state';
import { BaseComponent } from '../../_base/BaseComponent';
import { Dispatch } from 'redux';
import { TInternationalization } from '../../../config/setup';
import { Localization } from '../../../config/localization/localization';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { Modal } from 'react-bootstrap';


interface IState {
}

interface IProps {
    internationalization: TInternationalization;
    modalShow: boolean;
    onHide: () => void;
    onRetry: () => void;
}

class RetryModalComponent extends BaseComponent<IProps, IState> {
    state = {
    }

    returner_retry_modal_content() {
        return (
            <>
                <Modal show={this.props.modalShow} onHide={() => this.props.onHide()}>
                    <Modal.Header>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-12">
                                <p className="text-center text-dark mt-1">
                                    <i className="fa fa-exclamation-triangle fa-3x text-danger"></i>
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <p className="text-center text-dark my-1">
                                    {Localization.msg.ui.msg5}
                                </p>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-light shadow-default shadow-hover"
                            onClick={() => this.props.onHide()}>
                            {Localization.close}
                        </button>
                        <BtnLoader
                            loading={false}
                            btnClassName="btn btn-system shadow-default shadow-hover"
                            onClick={() => this.props.onRetry()}
                        >
                            {Localization.retry}
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
                {this.returner_retry_modal_content()}
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

export const RetryModal = connect(
    state2props,
    dispatch2props
)(RetryModalComponent);