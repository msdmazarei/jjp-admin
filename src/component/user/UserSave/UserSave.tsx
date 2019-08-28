import React, { Fragment } from 'react';
import { Input } from '../../form/input/Input';
import { UserService } from "../../../service/service.user";
import { UploadService } from "../../../service/service.upload";
import { History } from 'history';
import Dropzone from "react-dropzone";
import { AppRegex } from '../../../config/regex';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { Localization } from '../../../config/localization/localization';
import { IToken } from '../../../model/model.token';
import { ToastContainer, toast } from 'react-toastify';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';

enum SAVE_MODE {
    CREATE = 'CREATE',
    EDIT = 'EDIT',
    DELETE = "DELETE"
}

interface IState {
    // user: any;//IUser | undefined;
    user: {
        person:{
            name: {
                value: string | undefined;
                isValid: boolean;
            };
            last_name: {
                value: string | undefined;
                isValid: boolean;
            };
            address: {
                value: string | undefined,
                isValid: boolean
            };
            phone: {
                value: string | undefined,
                isValid: boolean
            };
            email: {
                value: string | undefined,
                isValid: boolean
            };
            cell_no: {
                value: string | undefined,
                isValid: boolean
            };
            image: {
                value: string[],
                isValid: boolean
            };
        };
        username: {
            value: string | undefined;
            isValid: boolean;
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
            person:{
                name: {
                    value: undefined,
                    isValid: false,
                },
                last_name: {
                    value: undefined,
                    isValid: false,
                },
                address: {
                    value: undefined,
                    isValid: true,
                },
                phone: {
                    value: undefined,
                    isValid: true,
                },
                email: {
                    value: undefined,
                    isValid: true,
                },
                cell_no: {
                    value: undefined,
                    isValid: true,
                },
                image: {
                    value: [],
                    isValid: true,
                },
            },
            username: {
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

    componentDidMount() {
        this._userService.setToken(this.props.token);
        this._uploadService.setToken(this.props.token);

        if (this.props.match.path.includes('/user/:_id/edit')) {
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
                    ...this.state.user,person:{
                        ...this.state.user.person,
                        name: { ...this.state.user.person.name, value: res.data.person.name, isValid: true },
                        last_name: { ...this.state.user.person.last_name, value: res.data.person.last_name, isValid: true },
                        address: { ...this.state.user.person.address, value: res.data.person.address, isValid: true },
                        phone: { ...this.state.user.person.phone, value: res.data.person.phone, isValid: true },
                        image: {
                            ...this.state.user.person.image,
                            value: res.data.person.image ? [res.data.person.image] : [], isValid: true
                        },
                        email: { ...this.state.user.person.email, value: res.data.person.email, isValid: true },
                        cell_no: { ...this.state.user.person.cell_no, value: res.data.person.cell_no, isValid: true },
                    }
                    
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

    async uploadFileReq(): Promise<string[]> {
        let fileImg = (this.state.user.person.image.value || []).filter(img => typeof img !== "string");
        let strImg = (this.state.user.person.image.value || []).filter(img => typeof img === "string");
        if (fileImg && (fileImg || []).length) {
            return new Promise(async (res, rej) => {
                let urls = await this._uploadService.upload(fileImg).catch(e => {
                    rej(e);
                });
                if (urls) {
                    res([...strImg, ...urls.data.result]);
                }
            });
        } else {
            return new Promise((res, rej) => {
                res(strImg || []);
            });
        }
    }

    // add user function 

    async create() {
        if (!this.state.isFormValid) return;
        this.setState({ ...this.state, createLoader: true });
        let imgUrls = await this.uploadFileReq().catch(error => {
            this.handleError({ error: error.response });
        });
        if (!imgUrls/*  || !imgUrls.length */) {
            this.setState({ ...this.state, createLoader: false });
            return
        }
        const newUser = {
            name: this.state.user.person.name.value,
            last_name: this.state.user.person.last_name.value,
            address: this.state.user.person.address.value,
            phone: this.state.user.person.phone.value,
            image: imgUrls[0],
            email: this.state.user.person.email.value,
            cell_no: this.state.user.person.cell_no.value,
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

        let imgUrls = await this.uploadFileReq().catch(error => {
            this.handleError({ error: error.response });
        });
        if (!imgUrls) {
            return
        }
        const newUser = {
            name: this.state.user.person.name.value,
            last_name: this.state.user.person.last_name.value,
            address: this.state.user.person.address.value,
            phone: this.state.user.person.phone.value,
            image: imgUrls[0],
            email: this.state.user.person.email.value,
            cell_no: this.state.user.person.cell_no.value,
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

    // image add /////

    onDropRejected(files: any[], event: any) {
        this.onDropRejectedNotify(files);
    }

    onDropRejectedNotify(files: any[]) {
        toast.warn(Localization.validation_msg.file_can_not_added, this.getNotifyConfig());
    }

    removePreviousImgNotify() {
        toast.warn(Localization.validation_msg.just_one_image_person_can_have, this.getNotifyConfig());
    }

    onDrop(files: any[]) {
        if (!files || !files.length) return;
        if (this.state.user.person.image.value && this.state.user.person.image.value!.length) {
            this.removePreviousImgNotify();
            return;
        }
        this.setState({
            ...this.state, user: {
                ...this.state.user, person:{
                    ...this.state.user.person,
                    image: {
                        isValid: true,
                        value: files
                    }
                }
                
            }
        })
    }

    tmpUrl_list: string[] = [];

    getTmpUrl(file: any): string {
        const tmUrl = URL.createObjectURL(file);
        this.tmpUrl_list.push(tmUrl);
        return tmUrl;
    }

    removeItemFromDZ(index: number/* , url: string */) {
        let newFiles = (this.state.user.person.image.value || []);
        if (newFiles) {
            newFiles.splice(index, 1);
        }
        this.setState({
            ...this.state, user: {
                ...this.state.user, person:{
                    ...this.state.user.person,
                    image: {
                        isValid: true,
                        value: [...newFiles]
                    }
                }
                
            }
        })
    }
    

    /////////////////

    // reset form /////////////

    resetForm() {
        this.setState({
            ...this.state,
            user: {
                ...this.state.user,
                person:{
                    name: { value: undefined, isValid: true },
                    last_name: { value: undefined, isValid: true },
                    address: { value: undefined, isValid: true },
                    phone: { value: undefined, isValid: false },
                    email: { value: undefined, isValid: true },
                    cell_no: { value: undefined, isValid: true },
                    image: { value: [], isValid: true },
                }

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
                                    <div className="col-md-3 col-sm-6">
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "name")}
                                            label={Localization.name}
                                            placeholder={Localization.name}
                                            defaultValue={this.state.user.person.name.value}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, 'last_name')}
                                            label={Localization.lastname}
                                            placeholder={Localization.lastname}
                                            defaultValue={this.state.user.person.last_name.value}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, 'email')}
                                            label={Localization.email}
                                            placeholder={Localization.email}
                                            defaultValue={this.state.user.person.email.value}
                                            pattern={AppRegex.email}
                                            patternError={Localization.validation_msg.Just_enter_the_email}
                                        />
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "phone")}
                                            label={Localization.phone}
                                            placeholder={Localization.phone}
                                            defaultValue={this.state.user.person.phone.value}
                                            pattern={AppRegex.phone}
                                            patternError={Localization.validation_msg.Just_enter_the_phone_number}
                                        />
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "cell_no")}
                                            label={Localization.cell_no}
                                            placeholder={Localization.cell_no}
                                            defaultValue={this.state.user.person.cell_no.value}
                                            pattern={AppRegex.mobile}
                                            patternError={Localization.validation_msg.Just_enter_the_cell_number}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-md-6 col-sm-12">
                                                <Input
                                                    onChange={(value, isValid) => this.handleInputChange(value, isValid, "address")}
                                                    label={Localization.address}
                                                    placeholder={Localization.address}
                                                    is_textarea
                                                    defaultValue={this.state.user.person.address.value}
                                                />
                                            </div>
                                            <div className="col-md-6 col-sm-12">
                                                <label htmlFor="">{Localization.profile_image}</label>
                                                <div className="role-img-container">
                                                    <Dropzone
                                                        multiple={false}
                                                        onDrop={(files) => this.onDrop(files)}
                                                        maxSize={5000000}
                                                        accept="image/*"
                                                        onDropRejected={(files, event) => this.onDropRejected(files, event)}
                                                    >
                                                        {
                                                            (({ getRootProps, getInputProps }) => (
                                                                <section className="container">
                                                                    <div {...getRootProps({ className: 'dropzone' })}>
                                                                        <input {...getInputProps()} />
                                                                        <p className="img-container text-center text-muted p-3">{Localization.DRAG_AND_DROP}</p>
                                                                    </div>
                                                                    <aside>
                                                                        <h5 className="m-2">{Localization.preview}:</h5>
                                                                        <div className="image-wrapper mb-2">{
                                                                            (this.state.user.person.image.value || []).map((file: any, index) => {
                                                                                let tmUrl = '';
                                                                                let fileName = '';
                                                                                let fileSize = '';
                                                                                if (typeof file === "string") {
                                                                                    // fileName = file;
                                                                                    tmUrl = '/api/serve-files/' + file;
                                                                                } else {
                                                                                    fileName = file.name;
                                                                                    fileSize = '- ' + parseFloat((file.size / 1024).toFixed(2)) + ' KB';
                                                                                    tmUrl = this.getTmpUrl(file);
                                                                                }
                                                                                return <Fragment key={index}>
                                                                                <div className="img-item m-2">
                                                                                    {
                                                                                        (this.state.user.person.image.value) ? <img className="w-50px h-50px profile-img-rounded" src={tmUrl} alt="" onError={e => this.userImageOnError(e)}/> : <img className="w-50px h-50px profile-img-rounded" src={this.defaultPersonImagePath} alt=""/>
                                                                                    }
                                                                                    {/* <img className="w-50px h-50px profile-img-rounded" src={tmUrl} alt=""/> */}
                                                                                    <span className="mx-2 text-dark">{fileName} {fileSize}</span>
                                                                                    <button title={Localization.remove} className="img-remover btn btn-danger btn-sm ml-4" onClick={() => this.removeItemFromDZ(index/* , tmUrl */)}>&times;</button>
                                                                                </div>
                                                                                </Fragment>
                                                                            })
                                                                        }</div>
                                                                    </aside>
                                                                </section>
                                                            ))
                                                        }
                                                    </Dropzone>
                                                </div>
                                            </div>
                                        </div>
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
                                                        btnClassName="btn btn-success shadow-default shadow-hover mx-4"
                                                        loading={this.state.createLoader}
                                                        onClick={() => this.create()}
                                                        disabled={!this.state.isFormValid}
                                                    >
                                                        {Localization.create}
                                                    </BtnLoader>
                                                    <BtnLoader
                                                        btnClassName="btn btn-warning shadow-default shadow-hover  ml-2"
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
                                                                btnClassName="btn btn-info shadow-default shadow-hover ml-4"
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
                                        btnClassName="btn btn-primary shadow-default shadow-hover mr-4"
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