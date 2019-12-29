import React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { Localization } from '../../../config/localization/localization';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { Modal } from "react-bootstrap";
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { IPerson } from '../../../model/model.person';

interface IState {
}

interface IProps {
    internationalization: TInternationalization;
    modalShow: boolean;
    person: IPerson;
    onHide: () => void;
    onPass: (id: string) => void;
}

class PersonSavePassToUserModalComponent extends BaseComponent<IProps, IState> {
    state = {
    }

    passer_func_to_props(){
        this.props.onPass(this.props.person.id);
    }

    ////////   start crate quick person  //////////

    render_person_passer_to_user_page() {
        return (
            <>
                <Modal show={this.props.modalShow} onHide={() => this.props.onHide()}>
                    <Modal.Body>
                        <p className="delete-modal-content">
                            <span className="text-muted">{Localization.full_name}:&nbsp;</span>
                            {this.getPersonFullName(this.props.person)}
                        </p>
                        <div className="text-center py-2">
                            {
                                Localization.msg.ui.person_creation_successful_do_you_want_to_create_user_for_this_person
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.props.onHide()}>{Localization.close}</button>
                        <BtnLoader
                            loading={false}
                            btnClassName="btn btn-system shadow-default shadow-hover"
                            onClick={() => this.passer_func_to_props()}
                        >
                            {Localization.continue}
                        </BtnLoader>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    ////////   end crate quick person  //////////

    render() {
        return (
            <>
                {this.render_person_passer_to_user_page()}
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

export const PersonSavePassToUserModal = connect(
    state2props,
    dispatch2props
)(PersonSavePassToUserModalComponent);