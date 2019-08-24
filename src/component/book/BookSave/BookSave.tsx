import React, { Fragment } from 'react';
import { Input } from '../../form/input/Input';
import { BookService } from "../../../service/service.book";
import { UploadService } from "../../../service/service.upload";
import { History } from 'history';
import { BOOK_GENRE, BOOK_TYPES } from '../../../enum/Book';
import { IPerson } from '../../../model/model.person';
import { BookRole } from "../BookRole/BookRole";
import Select from 'react-select'
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
    book: {
        edition: {
            value: string | undefined;
            isValid: boolean;
        };
        language: {
            value: string | undefined;
            isValid: boolean;
        };
        pub_year: {
            value: string | undefined,
            isValid: boolean
        };
        title: {
            value: string | undefined,
            isValid: boolean
        };
        isben: {
            value: string | undefined,
            isValid: boolean
        };
        pages: {
            value: string | undefined,
            isValid: boolean
        };
        duration: {
            value: string | undefined,
            isValid: boolean
        };
        from_editor: {
            value: string | undefined,
            isValid: boolean
        };
        description: {
            value: string | undefined,
            isValid: boolean
        };
        genre: {
            value: BOOK_GENRE[] | null,
            isValid: boolean
        };
        type: {
            value: BOOK_TYPES | BOOK_TYPES[] | null,
            isValid: boolean
        };
        roles: {
            value: { role: string, person: IPerson }[] | any,
            isValid: boolean
        };
        images: {
            value: [] | any,
            isValid: boolean
        };
        tags: {
            value: { label: string, value: string }[];
            isValid: boolean;
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

class BookSaveComponent extends BaseComponent<IProps, IState> {

    state = {
        book: {
            edition: {
                value: undefined,
                isValid: true
            },
            language: {
                value: undefined,
                isValid: true
            },
            pub_year: {
                value: undefined,
                isValid: true
            },
            title: {
                value: undefined,
                isValid: false
            },
            isben: {
                value: undefined,
                isValid: true
            },
            pages: {
                value: undefined,
                isValid: true
            },
            duration: {
                value: undefined,
                isValid: true
            },
            from_editor: {
                value: undefined,
                isValid: true
            },
            description: {
                value: undefined,
                isValid: true
            },
            genre: {
                value: null,
                isValid: true
            },
            type: {
                value: null,
                isValid: false
            },
            roles: {
                value: undefined,
                isValid: false
            },
            images: {
                value: undefined,
                isValid: true
            },
            tags: {
                value: [],
                isValid: true
            }
        },
        isFormValid: false,
        saveMode: SAVE_MODE.CREATE,
        createLoader: false,
        updateLoader: false,
        tags_inputValue: ''
    }
    // saveMode: 'edit' | 'create' = 'create';

    /////////// start Select's options define

    genreOptions = [
        { value: 'Comedy', label: Localization.genre_type_list.Comedy },
        { value: 'Drama', label: Localization.genre_type_list.Drama },
        { value: 'Romance', label: Localization.genre_type_list.Romance },
        { value: 'Social', label: Localization.genre_type_list.Social },
        { value: 'Religious', label: Localization.genre_type_list.Religious },
        { value: 'Historical', label: Localization.genre_type_list.Historical },
        { value: 'Classic', label: Localization.genre_type_list.Classic },
        { value: 'Science', label: Localization.genre_type_list.Science }
    ];
    typeOptions = [
        { value: 'DVD', label: Localization.book_type_list.DVD },
        { value: 'Audio', label: Localization.book_type_list.Audio },
        { value: 'Hard_Copy', label: Localization.book_type_list.Hard_Copy },
        { value: 'Pdf', label: Localization.book_type_list.Pdf },
        { value: 'Epub', label: Localization.book_type_list.Epub }
    ];

    /////////// end of Select's options define
    private _bookService = new BookService();
    private _uploadService = new UploadService();
    private book_id: string | undefined;

    componentDidMount() {
        this._bookService.setToken(this.props.token);
        this._uploadService.setToken(this.props.token);

        if (this.props.match.path.includes('/book/:book_id/edit')) {
            // this.saveMode = "edit";
            this.setState({ ...this.state, saveMode: SAVE_MODE.EDIT });
            this.book_id = this.props.match.params.book_id;
            this.fetchBookById(this.props.match.params.book_id);
        }
    }

    async fetchBookById(book_id: string) {

        // let res = await this._bookService.bookById(book_id).catch(error => {
        //     debugger;
        //     //notify
        //   });

        let res = await this._bookService.byId(book_id).catch(error => {
            debugger;
            //notify
        });

        // await this.__waitOnMe();
        if (res) {
            let genreList: any[] = [];
            let typeList: any[] = [];
            let tagList: any[] = [];
            if (res.data.genre && res.data.genre.length) {
                genreList = res.data.genre.map(g => { return { label: g, value: g } });
            }
            if (res.data.type) {
                typeList = [{ label: res.data.type, value: res.data.type }];
            }
            if (res.data.tags) {
                tagList = res.data.tags.map(t => { return { label: t, value: t } });
            }
            this.setState({
                ...this.state,
                book: {
                    ...this.state.book,
                    edition: { ...this.state.book.edition, value: res.data.edition, isValid: true },
                    language: { ...this.state.book.language, value: res.data.language, isValid: true },
                    pub_year: { ...this.state.book.pub_year, value: res.data.pub_year, isValid: true },
                    title: { ...this.state.book.title, value: res.data.title, isValid: true },
                    isben: { ...this.state.book.isben, value: res.data.isben, isValid: true },
                    pages: { ...this.state.book.pages, value: res.data.pages, isValid: true },
                    duration: { ...this.state.book.duration, value: res.data.duration, isValid: true },
                    from_editor: { ...this.state.book.from_editor, value: res.data.from_editor, isValid: true },
                    description: { ...this.state.book.description, value: res.data.description, isValid: true },
                    genre: { ...this.state.book.genre, value: genreList, isValid: true },
                    roles: { ...this.state.book.roles, value: res.data.roles, isValid: true },
                    type: { ...this.state.book.type, value: typeList, isValid: true },
                    images: { ...this.state.book.images, value: res.data.images, isValid: true },
                    // id: { ...this.state.book.id, value: res.data.id, isValid: true },
                    tags: { ...this.state.book.tags, value: tagList, isValid: true },
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
            book: {
                ...this.state.book, [inputType]: { value, isValid }
            }
            , isFormValid: this.checkFormValidate(isValid, inputType)
        })
    }

    handleSelectInputChange(value: any[], inputType: any) {
        // debugger;
        // let List = (value || []).map(selestinput => selestinput.value);
        let isValid;
        if (!value || !value.length) {
            isValid = false;
        } else {
            isValid = true;
        }
        this.setState({
            ...this.state,
            book: {
                ...this.state.book, [inputType]: { value: value, isValid: isValid }
            }
            , isFormValid: this.checkFormValidate(isValid, inputType)
        })

    }

    bookRollChange(list: any[], isValid: boolean) {
        // debugger;
        // let List = (list || []).map(rolesinput => rolesinput.value);
        // let isValid;
        // for (let i = 0; i < list.length; i++) {
        //     if (!list[i].role || !list[i].person || !list.length) {
        //         isValid = false;
        //     } else {
        //         isValid = true;
        //     }
        // }
        this.setState({
            ...this.state,
            book: {
                ...this.state.book, roles: { value: list, isValid: isValid }
            }
            , isFormValid: this.checkFormValidate(isValid, 'roles')
        })
    }

    //  check form validation for avtive button

    checkFormValidate(isValid: boolean, inputType: any): boolean {
        let valid = true;
        let bookObj: any = { ...this.state.book };

        for (let i = 0; i < Object.keys(this.state.book).length; i++) {
            let IT = Object.keys(this.state.book)[i];
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
        let fileImg = (this.state.book.images.value || []).filter(img => typeof img !== "string");
        let strImg = (this.state.book.images.value || []).filter(img => typeof img === "string");

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

        let imgUrls = await this.uploadFileReq().catch(error => {
            this.handleError({ error: error });
        });
        if (!imgUrls/*  || !imgUrls.length */) {
            this.setState({ ...this.state, createLoader: false });
            return
        }

        let genreList = (this.state.book.genre.value || []).map((item: { label: string; value: string }) => item.value);
        let typeList = (this.state.book.type.value || []).map((item: { label: string; value: string }) => item.value);
        let roleList = (this.state.book.roles.value || []).map((item: any) => { return { role: item.role, person: { id: item.person.id } } });
        let tagList = (this.state.book.tags.value || []).map((item: { label: string; value: string }) => item.value);

        const newBook = {
            edition: this.state.book.edition.value,
            language: this.state.book.language.value,
            pub_year: this.state.book.pub_year.value,
            title: this.state.book.title.value,
            isben: this.state.book.isben.value,
            pages: this.state.book.pages.value,
            duration: this.state.book.duration.value,
            from_editor: this.state.book.from_editor.value,
            description: this.state.book.description.value,
            genre: genreList, // this.state.book.genre.value,
            types: typeList, // note: in book create use types,
            roles: roleList, // this.state.book.roles.value,
            images: imgUrls,
            tags: tagList
        }
        let res = await this._bookService.create(newBook).catch(error => {
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
        let genreList = (this.state.book.genre.value || []).map((list: { label: string; value: string }) => list.value);
        // let typeList = (this.state.book.type.value || []).map((list: { label: string; value: string }) => list.value);
        let roleList = (this.state.book.roles.value || []).map((item: any) => { return { role: item.role, person: { id: item.person.id } } });
        // let imagesList = (this.state.book.images.value || []).map((list: { label: string; value: string }) => list.value);
        // let id = this.state.book.id.value;
        let tagList = (this.state.book.tags.value || []).map((item: { label: string; value: string }) => item.value);

        const newBook = {
            edition: this.state.book.edition.value,
            language: this.state.book.language.value,
            pub_year: this.state.book.pub_year.value,
            // title: this.state.book.title.value,
            isben: this.state.book.isben.value,
            pages: this.state.book.pages.value,
            duration: this.state.book.duration.value,
            from_editor: this.state.book.from_editor.value,
            description: this.state.book.description.value,
            genre: genreList, // this.state.book.genre.value,
            // type: typeList[0], // this.state.book.type.value,
            roles: roleList,//this.state.book.roles.value,
            images: imgUrls,
            tags: tagList
        }
        let res = await this._bookService.update(newBook, this.book_id!).catch(e => {
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


    onDropRejected(files: any[], event: any) {
        debugger;
        console.log(files, event);
    }

    onDrop(files: any[]) {
        this.setState({
            ...this.state, book: {
                ...this.state.book,
                images: {
                    isValid: true,
                    value: [...(this.state.book.images.value || []), ...files]
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
        let newFiles = (this.state.book.images.value || []);
        // URL.revokeObjectURL(URL.createObjectURL(this.state.files[index]));
        // URL.revokeObjectURL(url);
        if (newFiles) {
            newFiles.splice(index, 1);
        }
        this.setState({
            ...this.state, book: {
                ...this.state.book,
                images: {
                    isValid: true,
                    value: [...newFiles]
                }
            }
        })
    }


    /////////////////

    // reset form /////////////

    resetForm() {
        this.setState({
            ...this.state,
            book: {
                edition: { value: undefined, isValid: true },
                language: { value: undefined, isValid: true },
                pub_year: { value: undefined, isValid: true },
                title: { value: undefined, isValid: false },
                isben: { value: undefined, isValid: true },
                pages: { value: undefined, isValid: true },
                duration: { value: undefined, isValid: true },
                from_editor: { value: undefined, isValid: true },
                description: { value: undefined, isValid: true },
                genre: { value: null, isValid: true },
                roles: { value: undefined, isValid: false },
                type: { value: null, isValid: false },
                images: { value: undefined, isValid: true },
                tags: { value: [], isValid: true },
            },
            isFormValid: false,
        })
    }

    // private tags_inputValue: any;
    handle_tagsKeyDown(event: any/* SyntheticKeyboardEvent<HTMLElement> */) {
        // const { inputValue, value } = this.state;
        if (!this.state.tags_inputValue) return;
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                const newVal = this.state.tags_inputValue;
                // this.tags_inputValue = '';
                this.setState({
                    ...this.state,
                    book: {
                        ...this.state.book,
                        tags: {
                            ...this.state.book.tags,
                            value: [...this.state.book.tags.value,
                            { label: newVal, value: newVal }
                            ]
                        }
                    },
                    tags_inputValue: ''
                });
                // this.tags_inputValue = '';
                event.preventDefault();
        }
    };

    ///////////////////////////////////////////

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
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "title")}
                                            label={Localization.title}
                                            placeholder={Localization.title}
                                            required
                                            defaultValue={this.state.book.title.value}
                                            readOnly={this.state.saveMode === SAVE_MODE.EDIT}
                                        />
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, 'edition')}
                                            label={Localization.edition}
                                            placeholder={Localization.edition}
                                            defaultValue={this.state.book.edition.value}
                                        />
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, 'language')}
                                            label={Localization.language}
                                            placeholder={Localization.language}
                                            defaultValue={this.state.book.language.value}
                                        />
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "pub_year")}
                                            label={Localization.publication_date}
                                            placeholder={Localization.publication_date}
                                            defaultValue={this.state.book.pub_year.value}
                                            pattern={AppRegex.integer}
                                            patternError={'int number only'}
                                        />
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "isben")}
                                            label={Localization.book_isben}
                                            placeholder={Localization.book_isben}
                                            defaultValue={this.state.book.isben.value}
                                        />
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "pages")}
                                            label={Localization.pages}
                                            placeholder={Localization.pages}
                                            defaultValue={this.state.book.pages.value}
                                            pattern={AppRegex.integer}
                                            patternError={'int number only'}
                                        />
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "duration")}
                                            label={Localization.duration}
                                            placeholder={Localization.duration}
                                            defaultValue={this.state.book.duration.value}
                                            pattern={AppRegex.number}
                                            patternError={'number only'}
                                        />
                                    </div>

                                    <div className="col-md-3 col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="">{Localization.type} <span className="text-danger">*</span></label>
                                            <Select
                                                isMulti
                                                onChange={(value: any) => this.handleSelectInputChange(value, "type")}
                                                options={this.typeOptions}
                                                // defaultValue={this.state.book.type.value}
                                                // label='type'
                                                value={this.state.book.type.value}
                                                placeholder={Localization.type}
                                                isDisabled={this.state.saveMode === SAVE_MODE.EDIT}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="">{Localization.genre}</label>
                                            <Select
                                                isMulti
                                                onChange={(value: any) => this.handleSelectInputChange(value, "genre")}
                                                options={this.genreOptions}
                                                // defaultValue={this.state.book.genre.value}
                                                // label='genre'
                                                value={this.state.book.genre.value}
                                                placeholder={Localization.genre}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="">{Localization.tags}</label>
                                            <Select
                                                isMulti
                                                onChange={(value: any) => this.handleSelectInputChange(value, "tags")}
                                                value={this.state.book.tags.value}
                                                placeholder={Localization.tags}
                                                onKeyDown={(e) => this.handle_tagsKeyDown(e)}
                                                inputValue={this.state.tags_inputValue}
                                                menuIsOpen={false}
                                                components={{
                                                    DropdownIndicator: null,
                                                }}
                                                isClearable
                                                onInputChange={(inputVal) => this.setState({ ...this.state, tags_inputValue: inputVal })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-sm-12">
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "from_editor")}
                                            label={Localization.from_the_editor}
                                            placeholder={Localization.from_the_editor}
                                            defaultValue={this.state.book.from_editor.value}
                                            is_textarea
                                        />
                                    </div>
                                    <div className="col-md-6 col-sm-12">
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "description")}
                                            label={Localization.description}
                                            placeholder={Localization.description}
                                            is_textarea
                                            defaultValue={this.state.book.description.value}
                                        />
                                    </div>
                                    <div className="col-md-6 col-sm-12">
                                        <BookRole
                                            defaultValue={this.state.book.roles.value}
                                            onChange={(list, isValid) => this.bookRollChange(list, isValid)}
                                            required
                                            label={Localization.roles}
                                        ></BookRole>
                                    </div>
                                    <div className="col-md-6 col-sm-12">
                                        <label htmlFor="">{Localization.images}</label>
                                        <div className="role-img-container">
                                            <Dropzone
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
                                                                <h4 className="m-2 font-weight-bold">{Localization.images_list}:</h4>
                                                                <ul className="image-wrapper">{
                                                                    (this.state.book.images.value || []).map((file: any, index) => {
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
)(BookSaveComponent);