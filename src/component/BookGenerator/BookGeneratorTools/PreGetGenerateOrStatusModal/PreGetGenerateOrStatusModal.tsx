import React from 'react'
import { BaseComponent } from '../../../_base/BaseComponent';
import { TInternationalization } from '../../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../../redux/app_state';
import { Modal } from "react-bootstrap";
import { Localization } from '../../../../config/localization/localization';


interface IProps {
    internationalization: TInternationalization;
    modalShow: boolean;
    onHide: () => void;
    getContinue: () => void;
}

class PreGetBookContentGenerateOrStatusModalComponent extends BaseComponent<IProps>{

    render_generate_modal() {
        return (
            <>
                <Modal show={this.props.modalShow} onHide={() => this.props.onHide()}>
                    <Modal.Header>

                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            {
                                Localization.msg.ui.content_saved_successfully_do_you_want_to_make_the_book
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-light shadow-default shadow-hover"
                            onClick={() => this.props.onHide()}>
                            {Localization.close}
                        </button>
                        <button
                            className="btn btn-success shadow-default shadow-hover"
                            onClick={() => this.props.getContinue()}>
                            {Localization.continue}
                        </button>
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

export const PreGetBookContentGenerateOrStatusModal = connect(
    state2props,
    dispatch2props
)(PreGetBookContentGenerateOrStatusModalComponent);