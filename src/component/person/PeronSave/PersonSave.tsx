import React, { Fragment } from 'react';
import { Input } from '../../form/input/Input';
import { PersonService } from "../../../service/service.person";
import { UploadService } from "../../../service/service.upload";
import { History } from 'history';
import { BOOK_GENRE, BOOK_TYPES } from '../../../enum/Book';
// import { IPerson } from '../../../model/model.person';
// import Select from 'react-select'
import Dropzone from "react-dropzone";
import { AppRegex } from '../../../config/regex';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { Localization } from '../../../config/localization/localization';
import { IToken } from '../../../model/model.token';
import { ToastContainer } from 'react-toastify';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';

enum SAVE_MODE {
    CREATE = 'CREATE',
    EDIT = 'EDIT',
    DELETE = "DELETE"
}

interface IState {
    // book: any;//IBook | undefined;
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
            value: string | undefined,
            isValid: boolean
        };
    };
    isFormValid: boolean;
    saveMode: SAVE_MODE;
    createLoader: boolean;
    updateLoader: boolean;
    tags_inputValue: string;
}
interface IProps {
    match: any;
    history: History;
    internationalization: TInternationalization;
    token: IToken;
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
                isValid: false,
            },
            phone: {
                value: undefined,
                isValid: false,
            },
            email: {
                value: undefined,
                isValid: false,
            },
            cell_no: {
                value: undefined,
                isValid: false,
            },
            image: {
                value: undefined,
                isValid: false,
            },
        },
        isFormValid: false,
        saveMode: SAVE_MODE.CREATE,
        createLoader: false,
        updateLoader: false,
        tags_inputValue: ''
    }
    // saveMode: 'edit' | 'create' = 'create';


    private _personService = new PersonService();
    private _uploadService = new UploadService();
    private person_id: string | undefined;

    componentDidMount() {
        this._personService.setToken(this.props.token);
        this._uploadService.setToken(this.props.token);

        if (this.props.match.path.includes('/person/:person_id/edit')) {
            // this.saveMode = "edit";
            this.setState({ ...this.state, saveMode: SAVE_MODE.EDIT });
            this.person_id = this.props.match.params.book_id;
            this.fetchBookById(this.props.match.params.book_id);
        }
    }

    async fetchBookById(book_id: string) {

        // let res = await this._bookService.bookById(book_id).catch(error => {
        //     debugger;
        //     //notify
        //   });

        let res = await this._personService.byId(book_id).catch(error => {
            debugger;
            //notify
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
                    image: { ...this.state.person.image, value: res.data.image, isValid: true },
                    email: { ...this.state.person.email, value: res.data.email, isValid: true },
                    cell_no: { ...this.state.person.cell_no, value: res.data.cell_no, isValid: true },
                }
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
        // debugger;

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
        let bookObj: any = { ...this.state.person };

        for (let i = 0; i < Object.keys(this.state.person).length; i++) {
            let IT = Object.keys(this.state.person)[i];
            if (IT !== inputType) {
                valid = valid && bookObj[IT].isValid;
                if (!bookObj[IT].isValid) {
                    break;
                }
            }
        }
        valid = valid && isValid;
        return valid;
    }
    async uploadFileReq(): Promise<string[]> {
        debugger;
        let fileImg = (this.state.person.image.value || []).filter(img => typeof img !== "string");
        let strImg = (this.state.person.image.value || []).filter(img => typeof img === "string");

        // if (this.state.book.images.value && (this.state.book.images.value || []).length) {
        if (fileImg && (fileImg || []).length) {
            return new Promise(async (res, rej) => {
                // let urls = await this._uploadService.upload(this.state.book.images.value || []).catch(e => {
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
                // res(this.state.book.images.value || []);
                // res([])
            });
        }
    }
    // add book function 

    async create() {

        debugger;
        if (!this.state.isFormValid) return;
        // let imgFile = (this.state.book.images.value || []);
        // let res = this._imgService.imgUpload([imgFile]).then(res => this.state.book.images.value=res.data)
        this.setState({ ...this.state, createLoader: true });

        let img = await this.uploadFileReq().catch(error => {
            this.handleError({ error: error });
        });
        if (!img/*  || !imgUrls.length */) {
            this.setState({ ...this.state, createLoader: false });
            return
        }
        const newBook = {
            name: this.state.person.name.value,
            last_name: this.state.person.last_name.value,
            address: this.state.person.address.value,
            phone: this.state.person.phone.value,
            image: img,
            email: this.state.person.email.value,
            cell_no: this.state.person.cell_no.value,
        }
        let res = await this._personService.create(newBook).catch(error => {
            this.handleError({ error: error });
        });
        this.setState({ ...this.state, createLoader: false });

        if (res) {
            this.apiSuccessNotify();
            this.resetForm();
        }
    }

    async update() {
        debugger;
        if (!this.state.isFormValid) return;
        this.setState({ ...this.state, updateLoader: true });

        let imgUrls = await this.uploadFileReq().catch(error => {
            debugger;
        });
        if (!imgUrls/*  || !imgUrls.length */) {
            return
        }
        const newBook = {
            name: this.state.person.name.value,
            last_name: this.state.person.last_name.value,
            address: this.state.person.address.value,
            phone: this.state.person.phone.value,
            image: imgUrls,
            email: this.state.person.email.value,
            cell_no: this.state.person.cell_no.value,
        }
        let res = await this._personService.update(newBook, this.person_id!).catch(e => {
            this.handleError({ error: e });
        });
        this.setState({ ...this.state, updateLoader: false });
        if (res) {
            // this.apiSuccessNotify();
            this.props.history.push('/book/manage');
            this.apiSuccessNotify();
        }

    }

    ///////////////////////////////////////////

    backTO() {
        this.gotoBookManage();
    }

    /* refreshBookCreate() {
        this.props.history.push('/book/create'); // /admin
    } */

    gotoBookManage() {
        this.props.history.push('/book/manage'); // /admin
    }

    // image add /////


    onDropRejected(file: any[], event: any) {
        debugger;
        console.log(file, event);
    }

    onDrop(file: any[]) {
        if(this.state.person.image.value===undefined){
            this.setState({
                ...this.state, person: {
                    ...this.state.person,
                    image: {
                        isValid: true,
                        value: [...(this.state.person.image.value || []), ...file]
                    }
                }
            })
        }else{

        }
        
    }

    tmpUrl_list: string[] = [];

    getTmpUrl(file: any): string {
        const tmUrl = URL.createObjectURL(file);
        this.tmpUrl_list.push(tmUrl);
        return tmUrl;
    }

    removeItemFromDZ(index: number/* , url: string */) {
        let newFiles = (this.state.person.image.value || "");
        // URL.revokeObjectURL(URL.createObjectURL(this.state.files[index]));
        // URL.revokeObjectURL(url);
        if (newFiles) {
            newFiles.splice(index, 1);
        }
        this.setState({
            ...this.state, person: {
                ...this.state.person,
                image: {
                    isValid: true,
                    value: ""
                }
            }
        })
    }


    /////////////////

    // reset form /////////////

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
                image: { value: undefined, isValid: true },
            },
            isFormValid: false,
        })
    }


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
                                            <h2 className="text-bold text-dark">{Localization.create_book}</h2>
                                            :
                                            <h2 className="text-bold text-dark">{Localization.edit_book}</h2>
                                    }
                                </div>
                                {/* <div className="row">
                                    <h3 className="text-bold text-dark">Book details :</h3>
                                </div> */}
                                {/* start give data by inputs */}
                                <div className="row">
                                    <div className="col-md-3 col-sm-6">
                                        <Input   //name
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "title")}
                                            label={Localization.title}
                                            placeholder={Localization.title}
                                            required
                                            defaultValue={this.state.person.name.value}
                                            readOnly={this.state.saveMode === SAVE_MODE.EDIT}
                                        />
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <Input   //last-name
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, 'edition')}
                                            label={Localization.edition}
                                            placeholder={Localization.edition}
                                            defaultValue={this.state.person.last_name.value}
                                        />
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <Input    //email
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, 'language')}
                                            label={Localization.language}
                                            placeholder={Localization.language}
                                            defaultValue={this.state.person.email.value}
                                        />
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <Input   //phone
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "pages")}
                                            label={Localization.pages}
                                            placeholder={Localization.pages}
                                            defaultValue={this.state.person.phone.value}
                                            pattern={AppRegex.integer}
                                            patternError={'int number only'}
                                        />
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <Input   //cell num
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "duration")}
                                            label={Localization.duration}
                                            placeholder={Localization.duration}
                                            defaultValue={this.state.person.cell_no.value}
                                            pattern={AppRegex.number}
                                            patternError={'number only'}
                                        />
                                    </div>
                                    <div className="col-md-6 col-sm-12">
                                        <Input  //address
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "description")}
                                            label={Localization.description}
                                            placeholder={Localization.description}
                                            is_textarea
                                            defaultValue={this.state.person.address.value}
                                        />
                                    </div>
                                    <div className="col-md-6 col-sm-12">
                                        <label htmlFor="">{Localization.images}</label>
                                        <div className="role-img-container">
                                            <Dropzone   //image
                                                onDrop={(files) => this.onDrop(files)}
                                                maxSize={5000000}
                                                accept="image/*"
                                                onDropRejected={(file, event) => this.onDropRejected(file, event)}
                                            >
                                                {
                                                    (({ getRootProps, getInputProps }) => (
                                                        <section className="container">
                                                            <div {...getRootProps({ className: 'dropzone' })}>
                                                                <input {...getInputProps()} />
                                                                <p className="img-container text-center text-muted p-3">{Localization.DRAG_AND_DROP}</p>
                                                            </div>
                                                            <aside>
                                                                <h4 className="m-2 font-weight-bold">{Localization.images_list}:</h4>
                                                                <ul className="image-wrapper">{
                                                                    (this.state.person.image.value || []).map((file: any, index) => {
                                                                        let fileName = '';
                                                                        let fileSize = '';
                                                                        let tmUrl = '';
                                                                        if (typeof file === "string") {
                                                                            fileName = file;
                                                                            tmUrl = '/api/serve-files/' + file;
                                                                        } else {
                                                                            fileName = file.name;
                                                                            fileSize = '- ' + file.size + ' bytes';
                                                                            tmUrl = this.getTmpUrl(file);
                                                                        }
                                                                        // const tmUrl = this.getTmpUrl(file); // URL.createObjectURL(file);

                                                                        return <Fragment key={index}>
                                                                            <li className="img-item m-2">
                                                                                <img src={tmUrl} alt="" style={{
                                                                                    width: '50px',
                                                                                    height: '50px'
                                                                                }} />
                                                                                <span className="mx-2 text-dark">{fileName} {fileSize}</span>
                                                                                <button className="img-remover btn btn-danger btn-sm ml-4" onClick={() => this.removeItemFromDZ(index/* , tmUrl */)}>&times;</button>
                                                                            </li>
                                                                        </Fragment>
                                                                    })
                                                                }</ul>
                                                            </aside>
                                                        </section>
                                                    ))
                                                }
                                            </Dropzone>
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
                                                <BtnLoader
                                                    btnClassName="btn btn-info shadow-default shadow-hover ml-4"
                                                    loading={this.state.updateLoader}
                                                    onClick={() => this.update()}
                                                    disabled={!this.state.isFormValid}
                                                >
                                                    {Localization.update}
                                                </BtnLoader>
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
                                {/* start show data */}
                                {/* <div className="row">
                                    <div className="col-12">
                                        <pre>{JSON.stringify(this.state.book, null, 2)}</pre>
                                    </div>
                                </div> */}
                                {/* end of show data */}
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

export const BookSave = connect(
    state2props,
    dispatch2props
)(PersonSaveComponent);