import React, { Fragment } from 'react';
import { PersonService } from "../../../service/service.person";
import { IToken } from '../../../model/model.token';
import { connect, MapDispatchToProps } from 'react-redux';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { Localization } from '../../../config/localization/localization';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { UploadService } from '../../../service/service.upload';
import { Modal } from "react-bootstrap";
import { Input } from '../../form/input/Input';
import { toast } from 'react-toastify';
import Dropzone from 'react-dropzone';
import { AppRegex } from '../../../config/regex';
import { IPerson } from '../../../model/model.person';

interface IState {
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
    isFormValid: boolean;
    quickPersonAddBtnLoader: boolean;
    // index: number;
}

interface IProps {
    internationalization: TInternationalization;
    token: IToken;
    modalShow: boolean;
    onHide: () => void;
    data?: any;
    onCreate?: (person: IPerson, data: IProps['data']) => void;
    // index?:number;
}

class QuickPersonComponent extends BaseComponent<IProps, IState> {
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
        isFormValid: false,
        quickPersonAddBtnLoader: false,
        // index: 0,
    }
    componentDidMount() {
        this._quickPersonService.setToken(this.props.token);
        this._quickUploadService.setToken(this.props.token);
        // if (this.props.index) {
        //     this.setState({
        //         ...this.state,
        //         index: this.props.index
        //     })
        // }

    }

    ////////   start crate quick person  //////////

    private _quickPersonService = new PersonService();
    private _quickUploadService = new UploadService();


    async quickAddPerson() {
        if (!this.state.isFormValid) return;
        this.setState({ ...this.state, quickPersonAddBtnLoader: true, });
        let imgUrls = await this.uploadFileReq().catch(error => {
            this.handleError({ error: error.response });
        });
        if (!imgUrls/*  || !imgUrls.length */) {
            this.setState({ ...this.state, quickPersonAddBtnLoader: false, });
            return
        }
        const newPerson = {
            name: this.state.person.name.value,
            last_name: this.state.person.last_name.value,
            address: this.state.person.address.value,
            phone: this.state.person.phone.value,
            image: imgUrls[0],
            email: this.state.person.email.value,
            cell_no: this.state.person.cell_no.value,
        }
        let res = await this._quickPersonService.create(newPerson).catch(error => {
            this.handleError({ error: error.response });
        });
        this.setState({ ...this.state, quickPersonAddBtnLoader: false, });

        if (res) {
            this.apiSuccessNotify();
            this.resetForm();
            this.props.onHide();
            if (this.props.onCreate) {
                this.props.onCreate(res.data, this.props.data); // this.state.index
            }
        }
    }

    async uploadFileReq(): Promise<string[]> {
        let fileImg = (this.state.person.image.value || []).filter(img => typeof img !== "string");
        let strImg = (this.state.person.image.value || []).filter(img => typeof img === "string");
        if (fileImg && (fileImg || []).length) {
            return new Promise(async (res, rej) => {
                let urls = await this._quickUploadService.upload(fileImg).catch(e => {
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

    resetForm() {
        this.setState({
            ...this.state,
            person: {
                name: { value: undefined, isValid: true },
                last_name: { value: undefined, isValid: true },
                address: { value: undefined, isValid: true },
                phone: { value: undefined, isValid: false },
                email: { value: undefined, isValid: true },
                cell_no: { value: undefined, isValid: true },
                image: { value: [], isValid: true },
            },
            isFormValid: false,
        })
    }



    handleInputChange(value: any, isValid: boolean, inputType: any) {
        this.setState({
            ...this.state,
            person: {
                ...this.state.person, [inputType]: { value, isValid }
            },
            isFormValid: this.checkFormValidate(isValid, inputType)
        })
    }

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

    onDropRejected(files: any[], event: any) {
        this.onDropRejectedNotify(files);
    }

    onDropRejectedNotify(files: any[]) {
        toast.warn(Localization.validation_msg.file_can_not_added, this.getNotifyConfig());
    }

    removePreviousImgNotify() {
        toast.warn(Localization.validation_msg.just_one_image_person_can_have, this.getNotifyConfig());
    }

    tmpUrl_list: string[] = [];

    getTmpUrl(file: any): string {
        const tmUrl = URL.createObjectURL(file);
        this.tmpUrl_list.push(tmUrl);
        return tmUrl;
    }

    onDrop(files: any[]) {
        if (!files || !files.length) return;
        if (this.state.person.image.value && this.state.person.image.value!.length) {
            this.removePreviousImgNotify();
            return;
        }
        this.setState({
            ...this.state,
            person: {
                ...this.state.person,
                image: {
                    isValid: true,
                    value: files
                }
            }

        })
    }

    removeItemFromDZ(index: number/* , url: string */) {
        let newFiles = (this.state.person.image.value || []);
        if (newFiles) {
            newFiles.splice(index, 1);
        }
        this.setState({
            ...this.state,
            person: {
                ...this.state.person,
                image: {
                    isValid: true,
                    value: [...newFiles]
                }
            }
        })
    }

    render_quick_person() {
        return (
            <>
                <Modal show={this.props.modalShow} onHide={() => this.props.onHide()}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-12">
                                <p className="text-center text-dark my-1">{Localization.Quick_person_creation}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <Input
                                    onChange={(value, isValid) => this.handleInputChange(value, isValid, "name")}
                                    label={Localization.name}
                                    placeholder={Localization.name}
                                    defaultValue={this.state.person.name.value}
                                    required
                                />
                            </div>
                            <div className="col-6">
                                <Input
                                    onChange={(value, isValid) => this.handleInputChange(value, isValid, 'last_name')}
                                    label={Localization.lastname}
                                    placeholder={Localization.lastname}
                                    defaultValue={this.state.person.last_name.value}
                                    required
                                />
                            </div>
                            <div className="col-12">
                                <Input
                                    onChange={(value, isValid) => this.handleInputChange(value, isValid, "cell_no")}
                                    label={Localization.cell_no}
                                    placeholder={Localization.cell_no}
                                    defaultValue={this.state.person.cell_no.value}
                                    pattern={AppRegex.mobile}
                                    patternError={Localization.validation_msg.Just_enter_the_cell_number}
                                />
                            </div>
                            <div className="col-12">
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
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.props.onHide()}>{Localization.close}</button>
                        <BtnLoader
                            loading={this.state.quickPersonAddBtnLoader}
                            btnClassName="btn btn-system shadow-default shadow-hover"
                            onClick={() => this.quickAddPerson()}
                            disabled={!this.state.isFormValid}
                        >
                            {Localization.create}
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
                {this.render_quick_person()}
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

export const QuickPerson = connect(
    state2props,
    dispatch2props
)(QuickPersonComponent);