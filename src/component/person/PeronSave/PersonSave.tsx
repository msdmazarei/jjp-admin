import React, { Fragment } from 'react';
import { Input } from '../../form/input/Input';
import { PersonService } from "../../../service/service.person";
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
// import { IToken } from '../../../model/model.token';
import { ToastContainer, toast } from 'react-toastify';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { FixNumber } from '../../form/fix-number/FixNumber';
import { AccessService } from '../../../service/service.access';
import { TPERMISSIONS } from '../../../enum/Permission';
import { PersonSavePassToUserModal } from './PersonPassToUserCreateModal'
import { IPerson } from '../../../model/model.person';

enum SAVE_MODE {
    CREATE = 'CREATE',
    EDIT = 'EDIT',
    DELETE = "DELETE"
}

interface IState {
    // person: any;//IPerson | undefined;
    person: {
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
    is_legal: boolean | null;
    isFormValid: boolean;
    saveMode: SAVE_MODE;
    createLoader: boolean;
    updateLoader: boolean;
    saveBtnVisibility: boolean;
    passerCreateToUserModal: boolean;
}
interface IProps {
    match: any;
    history: History;
    internationalization: TInternationalization;
    // token: IToken;
}

class PersonSaveComponent extends BaseComponent<IProps, IState> {

    state = {
        person: {
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
        is_legal: false,
        isFormValid: false,
        saveMode: SAVE_MODE.CREATE,
        createLoader: false,
        updateLoader: false,
        saveBtnVisibility: false,
        passerCreateToUserModal: false,
    }

    private _personService = new PersonService();
    private _uploadService = new UploadService();
    private person_id: string | undefined;
    private resOfPersonCreate: IPerson | undefined;

    componentDidMount() {
        if (this.props.match.path.includes('/person/:person_id/edit')) {
            if (AccessService.checkAccess(TPERMISSIONS.PERSON_EDIT_PREMIUM) === true) {
                this.setState({ ...this.state, saveMode: SAVE_MODE.EDIT });
                this.person_id = this.props.match.params.person_id;
                this.fetchPersonById(this.props.match.params.person_id);
            } else {
                this.noAccessRedirect(this.props.history);
            }
        } else {
            if (AccessService.checkAccess(TPERMISSIONS.PERSON_ADD_PREMIUM) === false) {
                this.noAccessRedirect(this.props.history);
            }
        }
    }

    async fetchPersonById(person_id: string) {
        if (AccessService.checkAccess(TPERMISSIONS.PERSON_GET_PREMIUM) === false) {
            return;
        }
        let res = await this._personService.byId(person_id).catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'fetchPersonById_error' } });
        });
        // await this.__waitOnMe();
        if (res) {
            this.setState({
                ...this.state,
                person: {
                    ...this.state.person,
                    name: { ...this.state.person.name, value: res.data.name, isValid: true },
                    last_name: { ...this.state.person.last_name, value: res.data.last_name, isValid: true },
                    address: { ...this.state.person.address, value: res.data.address, isValid: true },
                    phone: { ...this.state.person.phone, value: res.data.phone, isValid: true },
                    image: {
                        ...this.state.person.image,
                        value: res.data.image ? [res.data.image] : [], isValid: true
                    },
                    email: { ...this.state.person.email, value: res.data.email, isValid: true },
                    cell_no: { ...this.state.person.cell_no, value: res.data.cell_no, isValid: true },
                },
                is_legal: res.data.is_legal,
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
            person: {
                ...this.state.person, [inputType]: { value, isValid }
            }
            , isFormValid: this.checkFormValidate(isValid, inputType)
        })
    }

    //  check form validation for avtive button

    checkFormValidate(isValid: boolean, inputType: any): boolean {
        let valid = true;
        let personObj: any = { ...this.state.person };

        for (let i = 0; i < Object.keys(this.state.person).length; i++) {
            let IT = Object.keys(this.state.person)[i];
            if (IT !== inputType) {
                valid = valid && personObj[IT].isValid;
                if (!personObj[IT].isValid) {
                    break;
                }
            }
        }
        valid = valid && isValid;
        return valid;
    }

    async uploadFileReq(): Promise<string[]> {
        let fileImg = (this.state.person.image.value || []).filter(img => typeof img !== "string");
        let strImg = (this.state.person.image.value || []).filter(img => typeof img === "string");
        if (fileImg && (fileImg || []).length) {
            return new Promise(async (res, rej) => {
                let urls = await this._uploadService.upload(fileImg).catch(e => {
                    this.handleError({ error: e.response, toastOptions: { toastId: 'personImgUpload_error' } });
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

    // add person function 

    async create() {
        if (AccessService.checkAccess(TPERMISSIONS.PERSON_ADD_PREMIUM) === false) {
            return;
        }
        if (!this.state.isFormValid) return;
        this.setState({ ...this.state, createLoader: true });
        let imgUrls = await this.uploadFileReq().catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'createPerson_error' } });
        });
        if (!imgUrls/*  || !imgUrls.length */) {
            this.setState({ ...this.state, createLoader: false });
            return
        }
        const newPerson = {
            name: this.state.person.name.value,
            last_name: this.state.is_legal === true ? '' : this.state.person.last_name.value,
            address: this.state.person.address.value,
            phone: this.state.person.phone.value,
            image: imgUrls[0],
            email: this.state.person.email.value,
            cell_no: this.state.person.cell_no.value,
            is_legal: this.state.is_legal,
        }
        let res = await this._personService.create(newPerson).catch(error => {
            this.handleError({ error: error.response });
        });
        this.setState({ ...this.state, createLoader: false });

        if (res) {
            this.apiSuccessNotify();
            this.resetForm();
            this.resOfPersonCreate = res.data;
            this.setState({...this.state, passerCreateToUserModal : true})
        }
    }

    async update() {
        if (AccessService.checkAccess(TPERMISSIONS.PERSON_EDIT_PREMIUM) === false) {
            return;
        }
        if (!this.state.isFormValid) return;
        this.setState({ ...this.state, updateLoader: true });

        let imgUrls = await this.uploadFileReq().catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'personUpdate_error' } });
        });
        if (!imgUrls) {
            return
        }
        const newPerson = {
            name: this.state.person.name.value,
            last_name: this.state.is_legal === true ? '' : this.state.person.last_name.value,
            address: this.state.person.address.value,
            phone: this.state.person.phone.value,
            image: imgUrls[0] || null, // '',
            email: this.state.person.email.value,
            cell_no: this.state.person.cell_no.value,
            is_legal: this.state.is_legal,
        }
        let res = await this._personService.update(newPerson, this.person_id!).catch(e => {
            this.handleError({ error: e.response });
        });
        this.setState({ ...this.state, updateLoader: false });
        if (res) {
            this.props.history.push('/person/manage');
            this.apiSuccessNotify();
        }

    }

    ////////// navigation function //////////////////

    backTO() {
        if (AccessService.checkOneOFAllAccess([TPERMISSIONS.PERSON_ADD_PREMIUM, TPERMISSIONS.PERSON_GET_PREMIUM]) === false) {
            return;
        }
        this.gotoPersonManage();
    }

    gotoPersonManage() {
        this.props.history.push('/person/manage');
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
        if (this.state.person.image.value && this.state.person.image.value!.length) {
            this.removePreviousImgNotify();
            return;
        }
        this.setState({
            ...this.state, person: {
                ...this.state.person,
                image: {
                    isValid: true,
                    value: files
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
        let newFiles = (this.state.person.image.value || []);
        if (newFiles) {
            newFiles.splice(index, 1);
        }
        this.setState({
            ...this.state, person: {
                ...this.state.person,
                image: {
                    isValid: true,
                    value: [...newFiles]
                }
            }
        })
    }


    /////////////////


    /// start is legal person handler function //////

    personIsLegalHandler() {
        if (this.state.is_legal === false) {
            this.setState({
                ...this.state,
                person: {
                    ...this.state.person,
                    last_name: {
                        value: undefined,
                        isValid: true,
                    }
                },
                isFormValid: this.state.person.name.isValid === true ? true : this.state.isFormValid,
                is_legal: true,
            });
        } else {
            this.setState({
                ...this.state,
                person: {
                    ...this.state.person,
                    last_name: {
                        value: undefined,
                        isValid: false,
                    }
                },
                is_legal: false,
                isFormValid: false,
            });
        }
    }

    /// end is legal person handler function //////


    // reset form /////////////

    resetForm() {
        this.setState({
            ...this.state,
            person: {
                name: { value: undefined, isValid: false },
                last_name: { value: undefined, isValid: this.state.is_legal === true ? true : false },
                address: { value: undefined, isValid: true },
                phone: { value: undefined, isValid: true },
                email: { value: undefined, isValid: true },
                cell_no: { value: undefined, isValid: true },
                image: { value: [], isValid: true },
            },
            isFormValid: false,
        })
    }


    ///// start function onHide & onPass of personCreateToUserModal 

    passerModal_onHide(){
        this.resOfPersonCreate = undefined;
        this.setState({... this.state, passerCreateToUserModal : false});
    }

    passerModal_onPass(id : string){
        this.resOfPersonCreate = undefined;
        this.setState({... this.state, passerCreateToUserModal : false});
        if(id === undefined || id === null){return};
        this.props.history.push(`/user/${id}/wizard`);
    }

    ///// end function onHide & onPass of personCreateToUserModal 

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
                                            <h2 className="text-bold text-dark">{Localization.create_person}</h2>
                                            :
                                            <h2 className="text-bold text-dark">{Localization.person_update}</h2>
                                    }
                                </div>
                                {/* start give data by inputs */}
                                {
                                    this.state.saveMode === SAVE_MODE.CREATE
                                        ?
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <input id={'person_is_legal_handler'} type="checkbox" className="app-checkbox-round"
                                                        onChange={() => this.personIsLegalHandler()}
                                                    />
                                                    <label htmlFor={'person_is_legal_handler'}></label>
                                                    <label htmlFor={'person_is_legal_handler'}>
                                                        <h6 className="ml-2">{Localization.legal_person}</h6>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        undefined
                                }
                                <div className="row">
                                    <div className="col-md-3 col-sm-6">
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "name")}
                                            label={this.state.is_legal === true ? Localization.name_of_organization : Localization.name}
                                            placeholder={this.state.is_legal === true ? Localization.name_of_organization : Localization.name}
                                            defaultValue={this.state.person.name.value}
                                            required
                                        />
                                    </div>
                                    {
                                        this.state.saveMode === SAVE_MODE.EDIT
                                            ?
                                            this.state.is_legal === true
                                                ?
                                                undefined
                                                :
                                                <div className="col-md-3 col-sm-6">
                                                    <Input
                                                        onChange={(value, isValid) => this.handleInputChange(value, isValid, 'last_name')}
                                                        label={Localization.lastname}
                                                        placeholder={Localization.lastname}
                                                        defaultValue={this.state.person.last_name.value}
                                                        required
                                                    />
                                                </div>
                                            :
                                            this.state.is_legal === true
                                                ?
                                                undefined
                                                :
                                                <div className="col-md-3 col-sm-6">
                                                    <Input
                                                        onChange={(value, isValid) => this.handleInputChange(value, isValid, 'last_name')}
                                                        label={Localization.lastname}
                                                        placeholder={Localization.lastname}
                                                        defaultValue={this.state.person.last_name.value}
                                                        required
                                                    />
                                                </div>
                                    }
                                    <div className="col-md-3 col-sm-6">
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, 'email')}
                                            label={Localization.email}
                                            placeholder={Localization.email}
                                            defaultValue={this.state.person.email.value}
                                            pattern={AppRegex.email}
                                            patternError={Localization.validation_msg.Just_enter_the_email}
                                        />
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <FixNumber
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "phone")}
                                            label={Localization.phone}
                                            placeholder={Localization.phone}
                                            defaultValue={this.state.person.phone.value}
                                            pattern={AppRegex.phone}
                                            patternError={Localization.validation_msg.Just_enter_the_phone_number}
                                        />
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <FixNumber
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "cell_no")}
                                            label={Localization.cell_no}
                                            placeholder={Localization.cell_no}
                                            defaultValue={this.state.person.cell_no.value}
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
                                                    defaultValue={this.state.person.address.value}
                                                />
                                            </div>
                                            <div className="col-md-6 col-sm-12">
                                                <label htmlFor="">{Localization.profile_image}</label>
                                                <div className="role-img-container">
                                                    <Dropzone
                                                        multiple={false}
                                                        onDrop={(files) => this.onDrop(files)}
                                                        maxSize={524288}
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
                                                                            (this.state.person.image.value || []).map((file: any, index) => {
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
                                                                                            (this.state.person.image.value) ? <img className="w-50px h-50px profile-img-rounded" src={tmUrl} alt="" onError={e => this.personImageOnError(e)} /> : <img className="w-50px h-50px profile-img-rounded" src={this.defaultPersonImagePath} alt="" />
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
                                                    {
                                                        AccessService.checkAccess(TPERMISSIONS.PERSON_ADD_PREMIUM)
                                                            ?
                                                            <BtnLoader
                                                                btnClassName="btn btn-success shadow-default shadow-hover"
                                                                loading={this.state.createLoader}
                                                                onClick={() => this.create()}
                                                                disabled={!this.state.isFormValid}
                                                            >
                                                                {Localization.create}
                                                            </BtnLoader>
                                                            :
                                                            undefined
                                                    }
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
                                                        (AccessService.checkAccess(TPERMISSIONS.PERSON_EDIT_PREMIUM) && this.state.saveBtnVisibility)
                                                            ?
                                                            <BtnLoader
                                                                btnClassName="btn btn-info shadow-default shadow-hover"
                                                                loading={this.state.updateLoader}
                                                                onClick={() => this.update()}
                                                                disabled={!this.state.isFormValid}
                                                            >
                                                                {Localization.update}
                                                            </BtnLoader>
                                                            :
                                                            undefined
                                                    }
                                                </>

                                        }
                                    </div>
                                    {
                                        AccessService.checkOneOFAllAccess([TPERMISSIONS.PERSON_ADD_PREMIUM, TPERMISSIONS.PERSON_GET_PREMIUM])
                                            ?
                                            <BtnLoader
                                                btnClassName="btn btn-primary shadow-default shadow-hover"
                                                loading={false}
                                                onClick={() => this.backTO()}
                                                disabled={false}
                                            >
                                                {Localization.back}
                                            </BtnLoader>
                                            :
                                            undefined
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.resOfPersonCreate === undefined
                        ?
                        undefined
                        :
                        <PersonSavePassToUserModal
                            modalShow={this.state.passerCreateToUserModal}
                            person={this.resOfPersonCreate}
                            onHide={() => this.passerModal_onHide()}
                            onPass={(id : string) => this.passerModal_onPass(id)}
                        />
                }
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
        // token: state.token,
    };
};

export const PersonSave = connect(
    state2props,
    dispatch2props
)(PersonSaveComponent);