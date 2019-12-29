import React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { Localization } from '../../../config/localization/localization';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { Modal } from "react-bootstrap";
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { IUser } from '../../../model/model.user';

interface IState {
}

interface IProps {
    internationalization: TInternationalization;
    modalShow: boolean;
    user: IUser;
    onHide: () => void;
    onPass: () => void;
}

class UserSavePassToAddGroupModalComponent extends BaseComponent<IProps, IState> {
    state = {
    }

    ////////   start crate quick person  //////////

    render_user_passer_to_add_group() {
        return (
            <>
                <Modal show={this.props.modalShow} onHide={() => this.props.onHide()}>
                    <Modal.Body>
                        <p className="delete-modal-content">
                            <span className="text-muted">{Localization.username}:&nbsp;</span>
                            <span>{this.props.user.username}</span>
                        </p>
                        <div className="text-center py-2">
                            {
                                Localization.msg.ui.user_creation_successful_do_you_want_to_add_group_for_this_user
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.props.onHide()}>{Localization.close}</button>
                        <BtnLoader
                            loading={false}
                            btnClassName="btn btn-system shadow-default shadow-hover"
                            onClick={() => this.props.onPass()}
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
                {this.render_user_passer_to_add_group()}
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

export const UserSavePassToAddGroupModal = connect(
    state2props,
    dispatch2props
)(UserSavePassToAddGroupModalComponent);