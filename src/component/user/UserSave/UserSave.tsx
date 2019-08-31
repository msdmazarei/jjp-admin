import React from 'react';
import { Input } from '../../form/input/Input';
import { PersonService } from "../../../service/service.person";
import { UploadService } from "../../../service/service.upload";
import { History } from 'history';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { Localization } from '../../../config/localization/localization';
import { IToken } from '../../../model/model.token';
import { ToastContainer } from 'react-toastify';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { UserService } from '../../../service/service.user';
import { IPerson } from '../../../model/model.person';
import AsyncSelect from 'react-select/async';

enum SAVE_MODE {
    CREATE = 'CREATE',
    EDIT = 'EDIT',
    DELETE = "DELETE"
}

interface IState {
    // user: any;//IUser | undefined;
    user: {
        username: {
            value: string | undefined;
            isValid: boolean;
        };
        password: {
            value: string | undefined;
            isValid: boolean;
        };
        confirm_pass: {
            value: string | undefined;
            isValid: boolean;
        };
        person_id: {
            value: string | undefined;
            isValid: boolean;
        };
        person: {
            value: { label: string, value: IPerson } | undefined; // IPerson | any,
            isValid: boolean
        };
    };
    
    isFormValid: boolean;
    saveMode: SAVE_MODE;
    createLoader: boolean;
    updateLoader: boolean;
    saveBtnVisibility: boolean;
}
interface IProps {
    match: any;
    history: History;
    internationalization: TInternationalization;
    token: IToken;
}

class UserSaveComponent extends BaseComponent<IProps, IState> {

    state = {
        user: {
            username: {
                value: undefined,
                isValid: false,
            },
            password: {
                value: undefined,
                isValid: false,
            },
            confirm_pass: {
                value: undefined,
                isValid: false,
            },
            person_id: {
                value: undefined,
                isValid: true,
            },
            person: {
                value: undefined,
                isValid: false,
            },
        },
        isFormValid: false,
        saveMode: SAVE_MODE.CREATE,
        createLoader: false,
        updateLoader: false,
        saveBtnVisibility: false,
    }

    private _userService = new UserService();
    private _uploadService = new UploadService();
    private user_id: string | undefined;
    private _personService = new PersonService();

    componentDidMount() {
        this._userService.setToken(this.props.token);
        this._uploadService.setToken(this.props.token);
        this._personService.setToken(this.props.token);

        if (this.props.match.path.includes('/user/:user_id/edit')) {
            this.setState({ ...this.state, saveMode: SAVE_MODE.EDIT });
            this.user_id = this.props.match.params.user_id;
            this.fetchUserById(this.props.match.params.user_id);
        }
    }

    async fetchUserById(user_id: string) {
        let res = await this._userService.byId(user_id).catch(error => {
            this.handleError({ error: error.response });
        });
        // await this.__waitOnMe();
        if (res) {
            this.setState({
                ...this.state,
                user: {
                    ...this.state.user,
                    username: { ...this.state.user.username, value: res.data.username, isValid: true },
                    person: {
                        ...this.state.user.person, value: {
                            label: this.getPersonFullName(res.data.person),
                            value: res.data.person
                        }, 
                        isValid: true
                    },
                    person_id: { ...this.state.user.person_id, value: res.data.person.id, isValid: true },
                    password: { ...this.state.user.password,  isValid: true },
                    confirm_pass: { ...this.state.user.confirm_pass,  isValid: true },

                },
                saveBtnVisibility: true
            })
        }

    }
    __waitOnMe() {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res(true)
            }, 0)
        });
    }

    // on change functions 

    handleInputChange(value: any, isValid: boolean, inputType: any) {
        this.setState({
            ...this.state,
            user: {
                ...this.state.user, [inputType]: { value, isValid }
            }
            , isFormValid: this.checkFormValidate(isValid, inputType)
        })
    }

    handlePersonChange = (selectedPerson: { label: string, value: IPerson }) => {
        let newperson = { ...selectedPerson };
        let isValid=true      // newperson = selectedPerson;
        this.setState({
            ...this.state, user: {
                ...this.state.user, person: {
                    ...this.state.user.person,
                    value: newperson,
                    isValid:true
                },
                person_id:{
                    value : newperson.value.id,
                    isValid:true,
                }
            },
             isFormValid: this.checkFormValidate(isValid, 'person')
        })
    }


    //  check form validation for avtive button

    checkFormValidate(isValid: boolean, inputType: any): boolean {
        let valid = true;
        let userObj: any = { ...this.state.user };

        for (let i = 0; i < Object.keys(this.state.user).length; i++) {
            let IT = Object.keys(this.state.user)[i];
            if (IT !== inputType) {
                valid = valid && userObj[IT].isValid;
                if (!userObj[IT].isValid) {
                    break;
                }
            }
        }
        valid = valid && isValid;
        return valid;
    }


    //////  password confirm ////////////

    confirmPassword_validation(val: any): boolean {
        if (val === this.state.user.password.value) {
            return true
        }
        return false;
    }
    
    /////////////////////////////////////


    // add user function 

    async create() {
        if (!this.state.isFormValid || this.state.user.password.value !== this.state.user.confirm_pass.value) return;
        this.setState({ ...this.state, createLoader: true });

        const newUser = {
            username:this.state.user.username.value,
            password:this.state.user.password.value,
            person_id:this.state.user.person_id.value,
        }

        let res = await this._userService.create(newUser).catch(error => {
            this.handleError({ error: error.response });
        });
        this.setState({ ...this.state, createLoader: false });

        if (res) {
            this.apiSuccessNotify();
            this.resetForm();
        }
    }

    async update() {
        if (!this.state.isFormValid) return;
        this.setState({ ...this.state, updateLoader: true });
        
        const newUser = {
            person_id:this.state.user.person_id.value,
        }

        let res = await this._userService.update(newUser, this.user_id!).catch(e => {
            this.handleError({ error: e.response });
        });
        this.setState({ ...this.state, updateLoader: false });
        if (res) {
            this.props.history.push('/user/manage');
            this.apiSuccessNotify();
        }

    }

    ////////// navigation function //////////////////

    backTO() {
        this.gotoUserManage();
    }

    gotoUserManage() {
        this.props.history.push('/user/manage');
    }

    ////// request for person ////////

    private personRequstError_txt: string = Localization.no_item_found;

    async promiseOptions2(inputValue: any, callBack: any) {
        let filter = undefined;
        if (inputValue) {
            filter = { person: inputValue };
        }
        let res: any = await this._personService.search(10, 0, filter).catch(err => {
            let err_msg = this.handleError({ error: err.response, notify: false });
            this.personRequstError_txt = err_msg.body;
        });

        if (res) {
            let persons = res.data.result.map((ps: any) => {
                return { label: this.getPersonFullName(ps), value: ps }
            });
            this.personRequstError_txt = Localization.no_item_found;
            callBack(persons);
        } else {
            callBack();
        }
    }

    private setTimeout_person_val: any;
    debounce_300(inputValue: any, callBack: any) {
        if (this.setTimeout_person_val) {
            clearTimeout(this.setTimeout_person_val);
        }
        this.setTimeout_person_val = setTimeout(() => {
            this.promiseOptions2(inputValue, callBack);
        }, 1000);
    }

    select_noOptionsMessage(obj: { inputValue: string }) {
        return this.personRequstError_txt;
    }


    /////////////////////////////////////

    // reset form /////////////

    resetForm() {
        this.setState({
            ...this.state,
            user: {
                username: { value: undefined, isValid: false },
                password: { value: undefined, isValid: false },
                confirm_pass: { value: undefined, isValid: false },
                person_id: { value: undefined, isValid: false },
                person: { value: undefined, isValid: false },
            },
            isFormValid: false,
        })
    }

    ////// render ////////
    render() {
        return (
            <>
                <div className="content">
                    <div className="row">
                        <div className="col-12">
                            <div className="template-box">
                                <div className="">
                                    {
                                        this.state.saveMode === SAVE_MODE.CREATE
                                            ?
                                            <h2 className="text-bold text-dark">{Localization.create_user}</h2>
                                            :
                                            <h2 className="text-bold text-dark">{Localization.user_update}</h2>
                                    }
                                </div>
                                {/* start give data by inputs */}
                                <div className="row">
                                    {
                                        this.state.saveMode === SAVE_MODE.EDIT
                                            ?
                                            <>
                                                <div className="col-md-3 col-sm-6">
                                                    <Input
                                                        onChange={(value, isValid) => this.handleInputChange(value, isValid, "username")}
                                                        label={Localization.username}
                                                        placeholder={Localization.username}
                                                        defaultValue={this.state.user.username.value}
                                                        disabled={true}
                                                    />
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="col-md-3 col-sm-6">
                                                    <Input
                                                        onChange={(value, isValid) => this.handleInputChange(value, isValid, "username")}
                                                        label={Localization.username}
                                                        placeholder={Localization.username}
                                                        defaultValue={this.state.user.username.value}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <Input
                                                        onChange={(value, isValid) => this.handleInputChange(value, isValid, "password")}
                                                        label={Localization.password}
                                                        placeholder={Localization.password}
                                                        defaultValue={this.state.user.password.value}
                                                        required
                                                        type="password"
                                                    />
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <Input
                                                        onChange={(value, isValid) => this.handleInputChange(value, isValid, "confirm_pass")}
                                                        label={Localization.confirm_password}
                                                        placeholder={Localization.confirm_password}
                                                        defaultValue={this.state.user.confirm_pass.value}
                                                        required
                                                        type="password"
                                                        patternError={Localization.validation.confirmPassword}
                                                        validationFunc={(val) => this.confirmPassword_validation(val)}
                                                    />
                                                </div>
                                            </>
                                    }
                                    <div className="col-md-3 col-sm-6">
                                        <label >{Localization.person}</label>
                                        <AsyncSelect
                                            placeholder={Localization.person}
                                            cacheOptions
                                            defaultOptions
                                            value={this.state.user.person.value}
                                            loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback)}
                                            noOptionsMessage={(obj) => this.select_noOptionsMessage(obj)}
                                            onChange={(selectedPerson : any ) => this.handlePersonChange(selectedPerson)}
                                        />
                                    </div>
                                </div>
                                {/* end of give data by inputs */}
                                <div className="d-flex justify-content-between mt-4">
                                    <div className="mr-0 pr-0">
                                        {
                                            this.state.saveMode === SAVE_MODE.CREATE
                                                ?
                                                <>
                                                    <BtnLoader
                                                        btnClassName="btn btn-success shadow-default shadow-hover"
                                                        loading={this.state.createLoader}
                                                        onClick={() => this.create()}
                                                        disabled={!this.state.isFormValid}
                                                    >
                                                        {Localization.create}
                                                    </BtnLoader>
                                                    <BtnLoader
                                                        btnClassName="btn btn-warning shadow-default shadow-hover ml-3"
                                                        loading={false}
                                                        onClick={() => this.resetForm()}
                                                        disabled={false}
                                                    >
                                                        {Localization.reset}
                                                    </BtnLoader>
                                                </>
                                                :
                                                <>
                                                    {
                                                        this.state.saveBtnVisibility ?
                                                            <BtnLoader
                                                                btnClassName="btn btn-info shadow-default shadow-hover"
                                                                loading={this.state.updateLoader}
                                                                onClick={() => this.update()}
                                                                disabled={!this.state.isFormValid}
                                                            >
                                                                {Localization.update}
                                                            </BtnLoader>
                                                            : ''
                                                    }
                                                </>

                                        }
                                    </div>
                                    <BtnLoader
                                        btnClassName="btn btn-primary shadow-default shadow-hover"
                                        loading={false}
                                        onClick={() => this.backTO()}
                                        disabled={false}
                                    >
                                        {Localization.back}
                                    </BtnLoader>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer {...this.getNotifyContainerConfig()} />
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
        token: state.token,
    };
};

export const UserSave = connect(
    state2props,
    dispatch2props
)(UserSaveComponent);