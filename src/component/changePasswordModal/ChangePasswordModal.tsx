import React from "react";
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { redux_state } from "../../redux/app_state";
import { TInternationalization } from "../../config/setup";
import { BaseComponent } from "../_base/BaseComponent";
import { Localization } from "../../config/localization/localization";
import { Modal } from "react-bootstrap";
import { BtnLoader } from "../form/btn-loader/BtnLoader";
import { NETWORK_STATUS } from "../../enum/NetworkStatus";
import { Input } from "../form/input/Input";
import { UserService } from "../../service/service.user";
import { Store2 } from "../../redux/store";
import { action_set_authentication } from "../../redux/action/authentication";
import { Utility } from "../../asset/script/utility";

type TFormInput = 'old_password' | 'new_password' | 'r_new_password';

interface IProps {
    internationalization: TInternationalization;
    show: boolean;
    onHide: () => any;
    network_status: NETWORK_STATUS;
    onSetAuthentication?: (auth: string) => void;
}

interface IState {
    loader: boolean;
    formData: {
        [key in TFormInput]: {
            value: string | undefined;
            isValid: boolean;
        };
    },
    isFormValid: boolean;
}

class ChangePasswordComponent extends BaseComponent<IProps, IState> {
    state = {
        loader: false,
        formData: {
            old_password: {
                value: undefined,
                isValid: false,
            },
            new_password: {
                value: undefined,
                isValid: false,
            },
            r_new_password: {
                value: undefined,
                isValid: false,
            },
        },
        isFormValid: false,
    };

    _userService = new UserService();

    async changePassword() {
        if (!this.state.isFormValid) return;
        const user = Store2.getState().logged_in_user;
        if (!user) return;
        this.setState({ ...this.state, loader: true });

        const authObj = {
            username: user.username,
            password: this.state.formData.new_password.value!
        };

        const res = await this._userService.changePassword(
            this.state.formData.old_password.value!,
            this.state.formData.new_password.value!,
            user.id
        ).catch(e => {
            this.setState({ ...this.state, loader: false });
            this.handleError({ error: e.response, toastOptions: { toastId: 'changePassword_error' } });
        });

        if (res) {
            this.props.onSetAuthentication && this.props.onSetAuthentication(Utility.get_encode_auth(authObj));
            this.setState({
                ...this.state,
                loader: false,
                formData: {
                    old_password: { value: undefined, isValid: false },
                    new_password: { value: undefined, isValid: false },
                    r_new_password: { value: undefined, isValid: false },
                }
            });
            this.apiSuccessNotify(Localization.msg.ui.change_password_successful);
            this.closeModal();
        }
    }

    handleInputChange(value: any, isValid: boolean, inputType: TFormInput) {
        this.setState({
            ...this.state,
            formData: {
                ...this.state.formData, [inputType]: { value, isValid }
            },
            isFormValid: this.checkFormValidate(isValid, inputType)
        })
    }

    confirmPassword_validation(val: any): boolean {
        if (val === this.state.formData.new_password.value) {
            return true
        }
        return false;
    }

    checkFormValidate(isValid: boolean, inputType: any): boolean {
        let valid = true;
        const formDataObj: any = { ...this.state.formData };
        const formInputList: TFormInput[] = ['old_password', 'new_password', 'r_new_password'];

        for (let i = 0; i < formInputList.length; i++) {
            let IT = formInputList[i];
            if (IT !== inputType) {
                valid = valid && formDataObj[IT].isValid;
                if (!formDataObj[IT].isValid) break;
            }
        }
        valid = valid && isValid;

        return valid;
    }

    handle_keyUp(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            if (!this.state.isFormValid || this.state.loader) return;
            this.changePassword();
        }
    }

    closeModal() {
        this.setState({
            ...this.state,
            loader: false,
            formData: {
                old_password: {
                    value: undefined,
                    isValid: false,
                },
                new_password: {
                    value: undefined,
                    isValid: false,
                },
                r_new_password: {
                    value: undefined,
                    isValid: false,
                },
            },
            isFormValid: false,
        }, () => this.props.onHide());
    }

    modal_render() {
        return (
            <>
                <Modal show={this.props.show} onHide={() => this.closeModal()}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-12">
                                <div className="text-center text-primary">
                                    <i className="fa fa-key mr-2"></i>
                                    {Localization.password_change.change_password}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <Input
                                    onChange={(value, isValid) => this.handleInputChange(value, isValid, "old_password")}
                                    label={Localization.password_change.old_password}
                                    // placeholder={Localization.old_password}
                                    defaultValue={this.state.formData.old_password.value}
                                    required
                                    type="password"
                                    onKeyUp={(e) => this.handle_keyUp(e)}
                                    // className="input-bordered-bottom input-border-primary"
                                />
                            </div>
                            <div className="col-12">
                                <Input
                                    onChange={(value, isValid) => this.handleInputChange(value, isValid, "new_password")}
                                    label={Localization.password_change.new_password}
                                    // placeholder={Localization.new_password}
                                    defaultValue={this.state.formData.new_password.value}
                                    required
                                    type="password"
                                    onKeyUp={(e) => this.handle_keyUp(e)}
                                    // className="input-bordered-bottom input-border-primary"
                                />
                            </div>
                            <div className="col-12">
                                <Input
                                    onChange={(value, isValid) => this.handleInputChange(value, isValid, "r_new_password")}
                                    label={Localization.password_change.confirm_new_password}
                                    // placeholder={Localization.confirm_new_password}
                                    defaultValue={this.state.formData.r_new_password.value}
                                    required
                                    validationFunc={(val) => this.confirmPassword_validation(val)}
                                    patternError={Localization.validation.confirmPassword}
                                    type="password"
                                    onKeyUp={(e) => this.handle_keyUp(e)}
                                    // className="input-bordered-bottom input-border-primary"
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="pt-0 border-top-0">
                        <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.closeModal()}>
                            {Localization.close}
                        </button>
                        <BtnLoader
                            btnClassName="btn btn-system shadow-default shadow-hover"
                            loading={this.state.loader}
                            onClick={() => this.changePassword()}
                            disabled={
                                this.props.network_status === NETWORK_STATUS.OFFLINE
                                || !this.state.isFormValid
                            }
                        >
                            {Localization.password_change.change_password}
                            {
                                this.props.network_status === NETWORK_STATUS.OFFLINE
                                    ? <i className="fa fa-wifi text-danger"></i> : ''
                            }
                        </BtnLoader>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }

    render() {
        return (
            <>
                {this.modal_render()}
            </>
        );
    }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
    return {
        onSetAuthentication: (auth: string) => dispatch(action_set_authentication(auth))
    };
};

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        network_status: state.network_status,
    };
};

export const ChangePassword = connect(state2props, dispatch2props)(ChangePasswordComponent);