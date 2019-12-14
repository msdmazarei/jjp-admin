import React from 'react';
import { History } from 'history';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
// import { IToken } from '../../../model/model.token';
// import { ToastContainer } from 'react-toastify';
import { Localization } from '../../../config/localization/localization';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { IBook } from '../../../model/model.book';
import { BookService } from '../../../service/service.book';
import { BOOK_TYPES } from '../../../enum/Book';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { ChapterGenerator } from '../BookGeneratorTools/ChapterGenerator/ChapterGenerator';
import { PdfGenerator } from '../BookGeneratorTools/PdfGenerator/PdfGenerator';
import { BookGeneratorService } from '../../../service/service.bookGenerator';
import { BGUtility } from '../BookGeneratorTools/fileUploader/fileUploader';
import { Modal } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { AppGuid } from '../../../asset/script/guid';
import { EpubGenerator } from '../BookGeneratorTools/EpubGenerator/EpubGenerator';
interface ICmp_select<T> {
    label: string;
    value: T
}

export interface Book_body_base {
    front_id: string;
    type: string;
}

export interface Book_body_text extends Book_body_base {
    text: string;
}

export interface book_body_control extends Book_body_base {
    control: string;
}

export interface book_body_voice extends Book_body_base {
    voice: any;
    name: string;
}

export interface book_body_pdf extends Book_body_base {
    name: string;
    pdf: any;
}

export interface book_body_epub extends Book_body_base {
    name: string;
    epub: any;
}

export type Book_body = book_body_control | Book_body_text | book_body_voice | book_body_pdf | book_body_epub;

export interface Book_children {
    front_id: string;
    title?: string;
    body: Book_body[];
    children: Book_children[];
}

enum SAVE_MODE {
    CREATE = 'CREATE',
    EDIT = 'EDIT',
    DELETE = "DELETE"
}

interface IState {
    saveMode: SAVE_MODE;
    selectedBook: ICmp_select<IBook> | null;
    isBookInputTouch: boolean;
    contentType: ICmp_select<string> | null;
    isContentTypeInputTouch: boolean;
    selectedBookType: any | undefined;
    Msd_book: {
        BookType: number;
        PackagingVersion: number;
        title: string | undefined;
        children?: Book_children[];
    };
    Audio_book: {
        BookType: number;
        PackagingVersion: number;
        title: string | undefined;
        children?: Book_children[];
    };
    Pdf_book: {
        BookType: number;
        PackagingVersion: number;
        title: string | undefined;
        children?: Book_children[];
    };
    Epub_book: {
        BookType: number;
        PackagingVersion: number;
        title: string | undefined;
        children?: Book_children[];
    };
    create_update_loading: boolean;
    number_of_file_should_upload: number;
    number_of_uploaded: number;
    uploadStop: boolean;
    uploadRej: boolean;
    upload_modal: boolean;
    error_upload_modal: boolean;
    error_upload_modal_state: number;
}

interface IProps {
    match: any;
    history: History;
    internationalization: TInternationalization;
}

class BookGeneratorComponent extends BaseComponent<IProps, IState> {

    state = {
        saveMode: SAVE_MODE.CREATE,
        selectedBook: null,
        isBookInputTouch: false,
        contentType: null,
        isContentTypeInputTouch: false,
        selectedBookType: undefined,
        Msd_book: {
            BookType: 0,
            PackagingVersion: 0,
            title: undefined,
            children: [],
        },
        Audio_book: {
            BookType: 2,
            PackagingVersion: 0,
            title: undefined,
            children: [],
        },
        Pdf_book: {
            BookType: 1,
            PackagingVersion: 0,
            title: undefined,
            children: [],
        },
        Epub_book: {
            BookType: 1,
            PackagingVersion: 0,
            title: undefined,
            children: [],
        },
        create_update_loading: false,
        number_of_file_should_upload: 0,
        number_of_uploaded: 0,
        uploadStop: false,
        uploadRej: false,
        upload_modal: false,
        error_upload_modal: false,
        error_upload_modal_state: 0,
    }

    //// start navigation for back to BookGeneratorManage /////

    backTO() {
        this.gotoBookGeneratorManage();
    }

    gotoBookGeneratorManage() {
        this.props.history.push('/book_generator/manage'); // /admin
    }

    //// end navigation for back to BookGeneratorManage /////

    private _bookContentService = new BookGeneratorService();
    private book_generator_id: string | undefined;

    componentDidMount() {
        if (this.props.match.path.includes('/book_generator/:book_generator_id/edit')) {
            this.setState({ ...this.state, saveMode: SAVE_MODE.EDIT });
            this.book_generator_id = this.props.match.params.book_generator_id;
            this.fetchContentById(this.props.match.params.book_generator_id);
        }
    }

    async fetchContentById(book_content_id: string) {
        let res = await this._bookContentService.byId(book_content_id).catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'fetchContentById_error' } });
        });
        // await this.__waitOnMe();
        if (res) {
            let come_selectedBook: { label: string, value: IBook } = { label: (res.data.book as IBook).title, value: (res.data.book as IBook) };
            let come_contentType: { label: string, value: string } = { label: Localization[res.data.type], value: res.data.type };
            let book_type: any = (res.data.book as IBook).type;
            if (book_type === 'Msd') {
                this.setState({
                    ...this.state,
                    selectedBook: come_selectedBook,
                    selectedBookType: book_type,
                    contentType: come_contentType,
                    Msd_book: {
                        ...this.state.Msd_book,
                        BookType: res.data.content.BookType ? res.data.content.BookType : 0,
                        PackagingVersion: res.data.content.PackagingVersion ? res.data.content.PackagingVersion : 0,
                        title: res.data.content.title ? res.data.content.title : "",
                        children: (res.data.content.children && res.data.content.children.length) ? res.data.content.children : [],
                    },
                });
            }
            if (book_type === 'Audio') {
                this.setState({
                    ...this.state,
                    selectedBook: come_selectedBook,
                    selectedBookType: book_type,
                    contentType: come_contentType,
                    Audio_book: {
                        ...this.state.Audio_book,
                        BookType: res.data.content.BookType ? res.data.content.BookType : 2,
                        PackagingVersion: res.data.content.PackagingVersion ? res.data.content.PackagingVersion : 0,
                        title: res.data.content.title ? res.data.content.title : "",
                        children: (res.data.content.children && res.data.content.children.length) ? res.data.content.children : [],
                    },
                });
            }
            if (book_type === 'Pdf') {
                this.setState({
                    ...this.state,
                    selectedBook: come_selectedBook,
                    selectedBookType: book_type,
                    contentType: come_contentType,
                    Pdf_book: {
                        ...this.state.Pdf_book,
                        BookType: res.data.content.BookType ? res.data.content.BookType : 1,
                        PackagingVersion: res.data.content.PackagingVersion ? res.data.content.PackagingVersion : 0,
                        title: res.data.content.title ? res.data.content.title : "",
                        children: (res.data.content.children && res.data.content.children.length) ? res.data.content.children : [],
                    },
                });
            }
            if (book_type === 'Epub') {
                this.setState({
                    ...this.state,
                    selectedBook: come_selectedBook,
                    selectedBookType: book_type,
                    contentType: come_contentType,
                    Epub_book: {
                        ...this.state.Epub_book,
                        BookType: res.data.content.BookType ? res.data.content.BookType : 1,
                        PackagingVersion: res.data.content.PackagingVersion ? res.data.content.PackagingVersion : 0,
                        title: res.data.content.title ? res.data.content.title : "",
                        children: (res.data.content.children && res.data.content.children.length) ? res.data.content.children : [],
                    },
                });
            }
        }
    }

    book_title_returner() {
        if (this.state.selectedBook !== null) {
            return (this.state.selectedBook! as ICmp_select<IBook>).value.title
        }
        return ''
    };

    book_type_returner() {
        if (this.state.selectedBook !== null) {
            let b_t: any = (this.state.selectedBook! as ICmp_select<IBook>).value.type;
            let B_type: BOOK_TYPES = b_t;
            return Localization.book_type_list[B_type];
        }
        return ''
    };

    type_uploadable(): boolean {
        if (this.state.selectedBook === null) {
            return false;
        } else {
            const b_t: any = (this.state.selectedBook! as ICmp_select<IBook>).value.type;
            if (b_t === 'Hard_Copy' || b_t === 'DVD') {
                return false;
            } else {
                return true;
            }
        }
    }


    ////////////   start book selection func ////////////////////

    _bookService = new BookService();

    handleBookChange(selectedBook: any) {
        this.setState({
            ...this.state,
            selectedBook: selectedBook,
            selectedBookType: selectedBook !== null ? (selectedBook as ICmp_select<IBook>).value.type : undefined,
        }, () => this.bookTitleSetter());
    }

    bookTitleSetter() {
        if (this.state.selectedBookType === 'Msd') {
            this.setState({
                ...this.state,
                Msd_book: {
                    ...this.state.Msd_book,
                    title: this.state.selectedBook !== null ? (this.state.selectedBook! as ICmp_select<IBook>).value.title : undefined,
                }
            })
        };
        if (this.state.selectedBookType === 'Audio') {
            this.setState({
                ...this.state,
                Audio_book: {
                    ...this.state.Audio_book,
                    title: this.state.selectedBook !== null ? (this.state.selectedBook! as ICmp_select<IBook>).value.title : undefined,
                }
            })
        };
        if (this.state.selectedBookType === 'Pdf') {
            this.setState({
                ...this.state,
                Pdf_book: {
                    ...this.state.Pdf_book,
                    title: this.state.selectedBook !== null ? (this.state.selectedBook! as ICmp_select<IBook>).value.title : undefined,
                }
            })
        };
        if (this.state.selectedBookType === 'Epub') {
            this.setState({
                ...this.state,
                Epub_book: {
                    ...this.state.Epub_book,
                    title: this.state.selectedBook !== null ? (this.state.selectedBook! as ICmp_select<IBook>).value.title : undefined,
                }
            })
        };
    }

    personRequstError_txt: string = Localization.no_item_found;

    async promiseOptions2(inputValue: any, callBack: any) {
        let filter = undefined;
        if (inputValue) {
            filter = {title : {$prefix : inputValue} };
        }
        let res: any = await this._bookService.search(10, 0, filter).catch(err => {
            let err_msg = this.handleError({ error: err.response, notify: false, toastOptions: { toastId: 'promiseOptions2content_error' } });
            this.personRequstError_txt = err_msg.body;
        });

        if (res) {
            let books = res.data.result.map((ps: any) => {
                const b_type: any = ps.type;
                const b_t: BOOK_TYPES = b_type;
                let type = Localization.book_type_list[b_t];
                return { label: ps.title + " - " + type, value: ps }
            });
            this.personRequstError_txt = Localization.no_item_found;
            callBack(books);
        } else {
            callBack();
        }
    }

    private setTimeout_val: any;
    debounce_300(inputValue: any, callBack: any) {
        if (this.setTimeout_val) {
            clearTimeout(this.setTimeout_val);
        }
        this.setTimeout_val = setTimeout(() => {
            this.promiseOptions2(inputValue, callBack);
        }, 1000);
    }

    select_noOptionsMessage(obj: { inputValue: string }) {
        return this.personRequstError_txt;
    }

    bookInputTouch_handler() {
        this.setState({
            ...this.state,
            isBookInputTouch: true,
        })
    }

    bookInvalidFeedback() {
        if (!this.state.isBookInputTouch) {
            return
        };
        if (this.state.isBookInputTouch && this.state.selectedBook !== null) {
            return
        }
        if (this.state.isBookInputTouch && this.state.selectedBook === null) {
            return <div className="select-feedback">{Localization.required_field}</div>
        }
    }

    ////////////   end book selection func ////////////////////


    ////////////   start book content type selection func //////////////////

    contentOptions = [
        { value: 'Original', label: Localization.Original },
        { value: 'Brief', label: Localization.Brief },
    ];

    handleBookContentTypeChange(contentType: any) {
        this.setState({
            ...this.state,
            contentType: contentType,
        })
    }

    typeInputTouch_handler() {
        this.setState({
            ...this.state,
            isContentTypeInputTouch: true,
        })
    }

    typeInvalidFeedback() {
        if (!this.state.isContentTypeInputTouch) {
            return
        };
        if (this.state.isContentTypeInputTouch && this.state.contentType !== null) {
            return
        }
        if (this.state.isContentTypeInputTouch && this.state.contentType === null) {
            return <div className="select-feedback">{Localization.required_field}</div>
        }
    }

    ////////////   end book content type selection func ////////////////////


    ////////////   start reset page func ////////////////////

    Reset() {
        this.setState({
            ...this.state,
            selectedBook: null,
            isBookInputTouch: false,
            contentType: null,
            isContentTypeInputTouch: false,
            selectedBookType: undefined,
            Msd_book: {
                ...this.state.Msd_book,
                title: undefined,
                children: [],
            },
            Audio_book: {
                ...this.state.Audio_book,
                title: undefined,
                children: [],
            },
            Pdf_book: {
                ...this.state.Audio_book,
                title: undefined,
                children: [],
            },
            create_update_loading: false,
            number_of_file_should_upload: 0,
            number_of_uploaded: 0,
            uploadStop: false,
            uploadRej: false,
            upload_modal: false,
            error_upload_modal: false,
            error_upload_modal_state: 0,
        });
    }

    ////////////   end reset page func ////////////////////


    ////////////   start create btn function ////////////////////

    async create() {
        if (this.state.selectedBook === null || this.state.contentType === null || this.state.selectedBookType === undefined) {
            return
        }
        this.setState({
            ...this.state,
            create_update_loading: true,
            number_of_file_should_upload: 0,
            number_of_uploaded: 0,
            uploadStop: false,
            uploadRej: false,
            upload_modal: false,
            error_upload_modal: false,
            error_upload_modal_state: 0,
        });
        if (this.state.selectedBookType === 'Msd') {
            let res = await this._bookContentService.create(
                (this.state.selectedBook! as { label: string, value: IBook }).value.id,
                (this.state.contentType! as { label: string, value: string }).value,
                this.state.Msd_book
            ).catch(error => {
                this.setState({ ...this.state, create_update_loading: false });
                this.handleError({ error: error.response, toastOptions: { toastId: 'createMsd_error' } });
            });
            if (res) {
                this.Reset();
                this.apiSuccessNotify();
            }
        }
        if (this.state.selectedBookType === 'Audio') {
            const allBody: Book_body[] = await BGUtility.book_children_array_filter_by_body_type(this.state.Audio_book.children, 'voice');
            const bodyShouldUpload: Book_body[] = await BGUtility.book_body_array_filter_by_file_type(allBody);
            if (bodyShouldUpload.length === 0) {
                let res = await this._bookContentService.create(
                    (this.state.selectedBook! as { label: string, value: IBook }).value.id,
                    (this.state.contentType! as { label: string, value: string }).value,
                    this.state.Audio_book
                ).catch(error => {
                    this.setState({ ...this.state, create_update_loading: false });
                    this.handleError({ error: error.response, toastOptions: { toastId: 'createAudio_error' } });
                });
                if (res) {
                    this.Reset();
                    this.apiSuccessNotify();
                }
            } else {
                this.getUploadFileState();
                this.setState({ ...this.state, number_of_file_should_upload: bodyShouldUpload.length, upload_modal: true });
                let uploadedAndThatsId: book_body_voice[] = await BGUtility.upload_file_and_save_id(bodyShouldUpload);
                if (uploadedAndThatsId.length === 1 && uploadedAndThatsId[0].front_id === 'rejected') {
                    this.setState({
                        ...this.state,
                        create_update_loading: false,
                        number_of_file_should_upload: 0,
                        number_of_uploaded: 0,
                        uploadStop: false,
                        uploadRej: true,
                        upload_modal: false,
                        error_upload_modal: true,
                        error_upload_modal_state: 2,
                    });
                    return;
                }
                if (uploadedAndThatsId.length === 1 && uploadedAndThatsId[0].front_id === 'stop') {
                    this.setState({
                        ...this.state,
                        create_update_loading: false,
                        number_of_file_should_upload: 0,
                        number_of_uploaded: 0,
                        uploadStop: true,
                        uploadRej: false,
                        upload_modal: false,
                        error_upload_modal: true,
                        error_upload_modal_state: 1,
                    });
                    return;
                }
                const convertedChildren: Book_children[] = await BGUtility.replace_id_instead_of_file(this.state.Audio_book.children, uploadedAndThatsId);
                let converted_content: Object = {
                    BookType: this.state.Audio_book.BookType,
                    PackagingVersion: this.state.Audio_book.PackagingVersion,
                    title: this.state.Audio_book.title,
                    children: convertedChildren,
                }
                let res = await this._bookContentService.create(
                    (this.state.selectedBook! as { label: string, value: IBook }).value.id,
                    (this.state.contentType! as { label: string, value: string }).value,
                    converted_content,
                ).catch(error => {
                    this.content_modification();
                    this.handleError({ error: error.response, toastOptions: { toastId: 'createAudio_error' } });
                });
                if (res) {
                    this.Reset();
                    this.apiSuccessNotify();
                }
            }
        }
        if (this.state.selectedBookType === 'Pdf') {
            this.getPdfUploadFileState();
            this.setState({ ...this.state, number_of_file_should_upload: 1, upload_modal: true });
            let uploadedAndThatsId: book_body_pdf[] = await BGUtility.upload_pdf_file_and_save_id((this.state.Pdf_book.children as Book_children[])[0].body);
            if (uploadedAndThatsId.length === 1 && uploadedAndThatsId[0].front_id === 'rejected') {
                this.setState({
                    ...this.state,
                    create_update_loading: false,
                    number_of_file_should_upload: 0,
                    number_of_uploaded: 0,
                    uploadStop: false,
                    uploadRej: true,
                    upload_modal: false,
                    error_upload_modal: true,
                    error_upload_modal_state: 2,
                });
                return;
            }
            if (uploadedAndThatsId.length === 1 && uploadedAndThatsId[0].front_id === 'stop') {
                this.setState({
                    ...this.state,
                    create_update_loading: false,
                    number_of_file_should_upload: 0,
                    number_of_uploaded: 0,
                    uploadStop: true,
                    uploadRej: false,
                    upload_modal: false,
                    error_upload_modal: true,
                    error_upload_modal_state: 1,
                });
                return;
            }
            const convertedChildren: Book_children[] = [
                {
                    front_id: AppGuid.generate(),
                    title: "",
                    body: uploadedAndThatsId,
                    children: [],
                }
            ];
            let converted_content: Object = {
                BookType: this.state.Pdf_book.BookType,
                PackagingVersion: this.state.Pdf_book.PackagingVersion,
                title: this.state.Pdf_book.title,
                children: convertedChildren,
            }
            let res = await this._bookContentService.create(
                (this.state.selectedBook! as { label: string, value: IBook }).value.id,
                (this.state.contentType! as { label: string, value: string }).value,
                converted_content,
            ).catch(error => {
                this.content_modification();
                this.handleError({ error: error.response, toastOptions: { toastId: 'createPdf_error' } });
            });
            if (res) {
                this.Reset();
                this.apiSuccessNotify();
            }
        };
        if (this.state.selectedBookType === 'Epub') {
            this.getEpubUploadFileState();
            this.setState({ ...this.state, number_of_file_should_upload: 1, upload_modal: true });
            let uploadedAndThatsId: book_body_epub[] = await BGUtility.upload_epub_file_and_save_id((this.state.Epub_book.children as Book_children[])[0].body);
            if (uploadedAndThatsId.length === 1 && uploadedAndThatsId[0].front_id === 'rejected') {
                this.setState({
                    ...this.state,
                    create_update_loading: false,
                    number_of_file_should_upload: 0,
                    number_of_uploaded: 0,
                    uploadStop: false,
                    uploadRej: true,
                    upload_modal: false,
                    error_upload_modal: true,
                    error_upload_modal_state: 2,
                });
                return;
            }
            if (uploadedAndThatsId.length === 1 && uploadedAndThatsId[0].front_id === 'stop') {
                this.setState({
                    ...this.state,
                    create_update_loading: false,
                    number_of_file_should_upload: 0,
                    number_of_uploaded: 0,
                    uploadStop: true,
                    uploadRej: false,
                    upload_modal: false,
                    error_upload_modal: true,
                    error_upload_modal_state: 1,
                });
                return;
            }
            const convertedChildren: Book_children[] = [
                {
                    front_id: AppGuid.generate(),
                    title: "",
                    body: uploadedAndThatsId,
                    children: [],
                }
            ];
            let converted_content: Object = {
                BookType: this.state.Epub_book.BookType,
                PackagingVersion: this.state.Epub_book.PackagingVersion,
                title: this.state.Epub_book.title,
                children: convertedChildren,
            }
            let res = await this._bookContentService.create(
                (this.state.selectedBook! as { label: string, value: IBook }).value.id,
                (this.state.contentType! as { label: string, value: string }).value,
                converted_content,
            ).catch(error => {
                this.content_modification();
                this.handleError({ error: error.response, toastOptions: { toastId: 'createEpub_error' } });
            });
            if (res) {
                this.Reset();
                this.apiSuccessNotify();
            }
        }
    }

    ////////////   end create btn function ////////////////////


    ////////////   start update btn function ////////////////////

    async update() {
        if (this.state.selectedBook === null || this.state.contentType === null) {
            return
        }
        this.setState({
            ...this.state,
            create_update_loading: true,
            number_of_file_should_upload: 0,
            number_of_uploaded: 0,
            uploadStop: false,
            uploadRej: false,
            upload_modal: false,
            error_upload_modal: false,
            error_upload_modal_state: 0,
        });
        if (this.state.selectedBookType === 'Msd') {
            let res = await this._bookContentService.update(
                this.book_generator_id!,
                (this.state.selectedBook! as { label: string, value: IBook }).value.id,
                (this.state.contentType! as { label: string, value: string }).value,
                this.state.Msd_book
            ).catch(error => {
                this.setState({ ...this.state, create_update_loading: false });
                this.handleError({ error: error.response, toastOptions: { toastId: 'updateMsd_error' } });
            });
            if (res) {
                this.book_generator_id = undefined;
                this.Reset();
                this.backTO();
                this.apiSuccessNotify();
            }
        }
        if (this.state.selectedBookType === 'Audio') {
            const allBody: Book_body[] = await BGUtility.book_children_array_filter_by_body_type(this.state.Audio_book.children, 'voice');
            const bodyShouldUpload: Book_body[] = await BGUtility.book_body_array_filter_by_file_type(allBody);
            if (bodyShouldUpload.length === 0) {
                let res = await this._bookContentService.update(
                    this.book_generator_id!,
                    (this.state.selectedBook! as { label: string, value: IBook }).value.id,
                    (this.state.contentType! as { label: string, value: string }).value,
                    this.state.Audio_book
                ).catch(error => {
                    this.setState({ ...this.state, create_update_loading: false });
                    this.handleError({ error: error.response, toastOptions: { toastId: 'updateAudio_error' } });
                });
                if (res) {
                    this.book_generator_id = undefined;
                    this.Reset();
                    this.backTO();
                    this.apiSuccessNotify();
                }
            } else {
                this.getUploadFileState();
                this.setState({ ...this.state, number_of_file_should_upload: bodyShouldUpload.length, upload_modal: true });
                let uploadedAndThatsId: book_body_voice[] = await BGUtility.upload_file_and_save_id(bodyShouldUpload);
                if (uploadedAndThatsId.length === 1 && uploadedAndThatsId[0].front_id === 'rejected') {
                    this.setState({
                        ...this.state,
                        create_update_loading: false,
                        number_of_file_should_upload: 0,
                        number_of_uploaded: 0,
                        uploadStop: false,
                        uploadRej: true,
                        upload_modal: false,
                        error_upload_modal: true,
                        error_upload_modal_state: 2,
                    });
                    return;
                }
                if (uploadedAndThatsId.length === 1 && uploadedAndThatsId[0].front_id === 'stop') {
                    this.setState({
                        ...this.state,
                        create_update_loading: false,
                        number_of_file_should_upload: 0,
                        number_of_uploaded: 0,
                        uploadStop: true,
                        uploadRej: false,
                        upload_modal: false,
                        error_upload_modal: true,
                        error_upload_modal_state: 1,
                    });
                    return;
                }
                const convertedChildren: Book_children[] = await BGUtility.replace_id_instead_of_file(this.state.Audio_book.children, uploadedAndThatsId);
                let converted_content: Object = {
                    BookType: this.state.Audio_book.BookType,
                    PackagingVersion: this.state.Audio_book.PackagingVersion,
                    title: this.state.Audio_book.title,
                    children: convertedChildren,
                }
                let res = await this._bookContentService.update(
                    this.book_generator_id!,
                    (this.state.selectedBook! as { label: string, value: IBook }).value.id,
                    (this.state.contentType! as { label: string, value: string }).value,
                    converted_content
                ).catch(error => {
                    this.content_modification();
                    this.handleError({ error: error.response, toastOptions: { toastId: 'updateAudio_error' } });
                });
                if (res) {
                    this.book_generator_id = undefined;
                    this.Reset();
                    this.backTO();
                    this.apiSuccessNotify();
                }
            }
        }
        if (this.state.selectedBookType === 'Pdf') {
            if (typeof ((this.state.Pdf_book.children as Book_children[])[0].body as book_body_pdf[])[0].pdf === "string") {
                let res = await this._bookContentService.update(
                    this.book_generator_id!,
                    (this.state.selectedBook! as { label: string, value: IBook }).value.id,
                    (this.state.contentType! as { label: string, value: string }).value,
                    this.state.Pdf_book
                ).catch(error => {
                    this.content_modification();
                    this.handleError({ error: error.response, toastOptions: { toastId: 'updatePdf_error' } });
                });
                if (res) {
                    this.book_generator_id = undefined;
                    this.Reset();
                    this.backTO();
                    this.apiSuccessNotify();
                }
            } else {
                this.getPdfUploadFileState();
                this.setState({ ...this.state, number_of_file_should_upload: 1, upload_modal: true });
                let uploadedAndThatsId: book_body_pdf[] = await BGUtility.upload_pdf_file_and_save_id((this.state.Pdf_book.children as Book_children[])[0].body);
                if (uploadedAndThatsId.length === 1 && uploadedAndThatsId[0].front_id === 'rejected') {
                    this.setState({
                        ...this.state,
                        create_update_loading: false,
                        number_of_file_should_upload: 0,
                        number_of_uploaded: 0,
                        uploadStop: false,
                        uploadRej: true,
                        upload_modal: false,
                        error_upload_modal: true,
                        error_upload_modal_state: 2,
                    });
                    return;
                }
                if (uploadedAndThatsId.length === 1 && uploadedAndThatsId[0].front_id === 'stop') {
                    this.setState({
                        ...this.state,
                        create_update_loading: false,
                        number_of_file_should_upload: 0,
                        number_of_uploaded: 0,
                        uploadStop: true,
                        uploadRej: false,
                        upload_modal: false,
                        error_upload_modal: true,
                        error_upload_modal_state: 1,
                    });
                    return;
                }
                const convertedChildren: Book_children[] = [
                    {
                        front_id: AppGuid.generate(),
                        title: "",
                        body: uploadedAndThatsId,
                        children: [],
                    }
                ];
                let converted_content: Object = {
                    BookType: this.state.Pdf_book.BookType,
                    PackagingVersion: this.state.Pdf_book.PackagingVersion,
                    title: this.state.Pdf_book.title,
                    children: convertedChildren,
                }
                let res = await this._bookContentService.update(
                    this.book_generator_id!,
                    (this.state.selectedBook! as { label: string, value: IBook }).value.id,
                    (this.state.contentType! as { label: string, value: string }).value,
                    converted_content,
                ).catch(error => {
                    this.content_modification();
                    this.handleError({ error: error.response, toastOptions: { toastId: 'createPdf_error' } });
                });
                if (res) {
                    this.book_generator_id = undefined;
                    this.Reset();
                    this.backTO();
                    this.apiSuccessNotify();
                }
            }
        };
        if (this.state.selectedBookType === 'Epub') {
            if (typeof ((this.state.Epub_book.children as Book_children[])[0].body as book_body_epub[])[0].epub === "string") {
                let res = await this._bookContentService.update(
                    this.book_generator_id!,
                    (this.state.selectedBook! as { label: string, value: IBook }).value.id,
                    (this.state.contentType! as { label: string, value: string }).value,
                    this.state.Epub_book
                ).catch(error => {
                    this.content_modification();
                    this.handleError({ error: error.response, toastOptions: { toastId: 'updateEpub_error' } });
                });
                if (res) {
                    this.book_generator_id = undefined;
                    this.Reset();
                    this.backTO();
                    this.apiSuccessNotify();
                }
            } else {
                this.getEpubUploadFileState();
                this.setState({ ...this.state, number_of_file_should_upload: 1, upload_modal: true });
                let uploadedAndThatsId: book_body_epub[] = await BGUtility.upload_epub_file_and_save_id((this.state.Epub_book.children as Book_children[])[0].body);
                if (uploadedAndThatsId.length === 1 && uploadedAndThatsId[0].front_id === 'rejected') {
                    this.setState({
                        ...this.state,
                        create_update_loading: false,
                        number_of_file_should_upload: 0,
                        number_of_uploaded: 0,
                        uploadStop: false,
                        uploadRej: true,
                        upload_modal: false,
                        error_upload_modal: true,
                        error_upload_modal_state: 2,
                    });
                    return;
                }
                if (uploadedAndThatsId.length === 1 && uploadedAndThatsId[0].front_id === 'stop') {
                    this.setState({
                        ...this.state,
                        create_update_loading: false,
                        number_of_file_should_upload: 0,
                        number_of_uploaded: 0,
                        uploadStop: true,
                        uploadRej: false,
                        upload_modal: false,
                        error_upload_modal: true,
                        error_upload_modal_state: 1,
                    });
                    return;
                }
                const convertedChildren: Book_children[] = [
                    {
                        front_id: AppGuid.generate(),
                        title: "",
                        body: uploadedAndThatsId,
                        children: [],
                    }
                ];
                let converted_content: Object = {
                    BookType: this.state.Epub_book.BookType,
                    PackagingVersion: this.state.Epub_book.PackagingVersion,
                    title: this.state.Epub_book.title,
                    children: convertedChildren,
                }
                let res = await this._bookContentService.update(
                    this.book_generator_id!,
                    (this.state.selectedBook! as { label: string, value: IBook }).value.id,
                    (this.state.contentType! as { label: string, value: string }).value,
                    converted_content,
                ).catch(error => {
                    this.content_modification();
                    this.handleError({ error: error.response, toastOptions: { toastId: 'createEpub_error' } });
                });
                if (res) {
                    this.book_generator_id = undefined;
                    this.Reset();
                    this.backTO();
                    this.apiSuccessNotify();
                }
            }
        }
    }

    ////////////   end update btn function ////////////////////


    //// start onChange function define  ///////

    onchange(children: Book_children[]) {
        if (this.state.selectedBookType === undefined) {
            return
        }
        if (this.state.selectedBookType === "Msd") {
            this.setState({
                ...this.state,
                Msd_book: {
                    ...this.state.Msd_book,
                    children: children,
                }
            })
        }
        if (this.state.selectedBookType === "Audio") {
            this.setState({
                ...this.state,
                Audio_book: {
                    ...this.state.Audio_book,
                    children: children,
                }
            })
        }
        if (this.state.selectedBookType === "Pdf") {
            this.setState({
                ...this.state,
                Pdf_book: {
                    ...this.state.Pdf_book,
                    children: children,
                }
            })
        }
        if (this.state.selectedBookType === "Epub") {
            this.setState({
                ...this.state,
                Epub_book: {
                    ...this.state.Epub_book,
                    children: children,
                }
            })
        }
    }

    onPdfChange(newBody: Book_body[]) {
        let newChildren: Book_children[] = [
            {
                front_id: AppGuid.generate(),
                title: "",
                body: newBody,
                children: [],
            }
        ];
        this.setState({
            ...this.state,
            Pdf_book: {
                ...this.state.Pdf_book,
                children: newChildren
            }
        })
    }

    onEpubChange(newBody: Book_body[]) {
        let newChildren: Book_children[] = [
            {
                front_id: AppGuid.generate(),
                title: "",
                body: newBody,
                children: [],
            }
        ];
        this.setState({
            ...this.state,
            Epub_book: {
                ...this.state.Epub_book,
                children: newChildren
            }
        })
    }

    //// end onChange function define  ///////


    //// start returner by book type function /////

    returnerGenerator_by_book_type(type: string | undefined) {
        if (type === undefined || this.state.selectedBook === null || this.state.contentType === null) {
            return <></>
        }
        if (type === "Msd") {
            return <>
                <ChapterGenerator
                    bookType={'Msd'}
                    booktitle={(this.state.selectedBook! as ICmp_select<IBook>).value.title}
                    bookContent={this.state.Msd_book.children}
                    onChangeBook={(bookContent: Book_children[]) => this.onchange(bookContent)}
                />
            </>
        }
        if (type === "Audio") {
            return <>
                <ChapterGenerator
                    bookType={'Audio'}
                    booktitle={(this.state.selectedBook! as ICmp_select<IBook>).value.title}
                    bookContent={this.state.Audio_book.children}
                    onChangeBook={(bookContent: Book_children[]) => this.onchange(bookContent)}
                />
            </>
        }
        if (type === "Pdf") {
            return <>
                <PdfGenerator
                    body={this.state.Pdf_book.children.length !== 0 ? ((this.state.Pdf_book.children as Book_children[])[0].body as book_body_pdf[]) : []}
                    onFileChange={(newBody: book_body_pdf[]) => this.onPdfChange(newBody)}
                />
            </>
        }
        if (type === "Epub") {
            return <>
                <EpubGenerator
                    body={this.state.Epub_book.children.length !== 0 ? ((this.state.Epub_book.children as Book_children[])[0].body as book_body_epub[]) : []}
                    onFileChange={(newBody: book_body_epub[]) => this.onEpubChange(newBody)}
                />
            </>
        }
    }

    //// end returner by book type function /////


    ///// start calculate create and update btns ///////

    btn_disable_status(): boolean {
        if (this.state.selectedBook !== null && this.state.contentType !== null) {
            if (this.state.selectedBookType === 'Msd' && this.state.Msd_book.children.length > 0) {
                return false;
            }
            if (this.state.selectedBookType === 'Audio' && this.state.Audio_book.children.length > 0) {
                return false;
            }
            if (this.state.selectedBookType === 'Pdf' && this.state.Pdf_book.children.length > 0) {
                if (((this.state.Pdf_book.children as Book_children[])[0].body as book_body_pdf[])[0].pdf.length > 0) {
                    return false;
                }
            }
            if (this.state.selectedBookType === 'Epub' && this.state.Epub_book.children.length > 0) {
                if (((this.state.Epub_book.children as Book_children[])[0].body as book_body_epub[])[0].epub.length > 0) {
                    return false;
                }
            }
        }
        return true;
    }

    ///// start calculate create and update btns ///////


    /// start uploading modal /////////

    render_upload_modal() {
        if (this.state.number_of_file_should_upload === 0) return;
        return (
            <>
                <Modal show={this.state.upload_modal}>
                    <Modal.Header className="row d-flex justify-content-center">
                        <div className="rounded-circle border border-primary spin-upload w-100px h-100px text-center pt-3"></div>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <div className="my-1 text-dark">
                            {this.state.number_of_uploaded + " " + Localization.from + " " + this.state.number_of_file_should_upload}
                        </div>
                        <div className="my-1 text-dark">
                            % {Math.floor(((this.state.number_of_uploaded * 100) / this.state.number_of_file_should_upload))}
                        </div>
                        <div className="my-1 text-dark">
                            {Localization.loading_with_dots}
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="row d-flex justify-content-center">
                        <BtnLoader
                            loading={false}
                            btnClassName="btn btn-danger shadow-default shadow-hover"
                            onClick={() => this.upload_stop_function()}
                        >
                            {Localization.stop}
                        </BtnLoader>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    /// end uploading modal /////////


    /// start error uploading modal /////////

    render_error_upload_modal() {
        // if (this.state.error_upload_modal_state === 0) return;
        return (
            <>
                <Modal show={this.state.error_upload_modal}>
                    {/* <Modal show={true}> */}
                    <Modal.Header className="row d-flex justify-content-center">
                        {
                            this.state.error_upload_modal_state === 1
                                ?
                                Localization.msg.ui.you_stop_uploading_process
                                :
                                this.state.error_upload_modal_state === 2
                                    ?
                                    Localization.msg.ui.upload_process_error_msg
                                    :
                                    undefined
                        }
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"row d-flex justify-content-between"}>
                            {
                                this.state.saveMode === SAVE_MODE.CREATE
                                    ?
                                    <>
                                        <BtnLoader
                                            loading={false}
                                            btnClassName="btn btn-danger shadow-default shadow-hover mx-2"
                                            onClick={() => this.content_modification()}
                                        >
                                            {Localization.cancel}
                                        </BtnLoader>
                                        <BtnLoader
                                            loading={false}
                                            btnClassName="btn btn-success shadow-default shadow-hover mx-2"
                                            onClick={() => this.create()}
                                        >
                                            {Localization.retry}
                                        </BtnLoader>
                                    </>
                                    :
                                    <>
                                        <BtnLoader
                                            loading={false}
                                            btnClassName="btn btn-danger shadow-default shadow-hover mx-2"
                                            onClick={() => this.content_modification()}
                                        >
                                            {Localization.cancel}
                                        </BtnLoader>
                                        <BtnLoader
                                            loading={false}
                                            btnClassName="btn btn-info shadow-default shadow-hover mx-2"
                                            onClick={() => this.update()}
                                        >
                                            {Localization.retry}
                                        </BtnLoader>
                                    </>
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    /// end error uploading modal /////////


    //// start upload and error upload modal function ///////

    private _getUploadFileState_timer: any;
    getUploadFileState() {
        this._getUploadFileState_timer = setTimeout(() => {

            const new_number = BGUtility.number_of_file_uploaded();
            if (this.state.number_of_uploaded !== new_number) {
                this.setState({ ...this.state, number_of_uploaded: new_number });
            }

            if (new_number !== this.state.number_of_file_should_upload || !this.state.uploadStop || !this.state.uploadRej) {
                this.getUploadFileState();
            }
        }, 1000);
    }

    private _getPdfUploadFileState_timer: any;
    getPdfUploadFileState() {
        this._getPdfUploadFileState_timer = setTimeout(() => {

            const new_number = BGUtility.number_of_pdf_file_uploaded();
            if (this.state.number_of_uploaded !== new_number) {
                this.setState({ ...this.state, number_of_uploaded: new_number });
            }

            if (new_number !== this.state.number_of_file_should_upload || !this.state.uploadStop || !this.state.uploadRej) {
                this.getPdfUploadFileState();
            }
        }, 1000);
    }

    private _getEpubUploadFileState_timer: any;
    getEpubUploadFileState() {
        this._getEpubUploadFileState_timer = setTimeout(() => {

            const new_number = BGUtility.number_of_epub_file_uploaded();
            if (this.state.number_of_uploaded !== new_number) {
                this.setState({ ...this.state, number_of_uploaded: new_number });
            }

            if (new_number !== this.state.number_of_file_should_upload || !this.state.uploadStop || !this.state.uploadRej) {
                this.getEpubUploadFileState();
            }
        }, 1000);
    }

    upload_stop_function() {
        BGUtility.stop_Upload();
    };

    content_modification() {
        this.setState({
            ...this.state,
            create_update_loading: false,
            number_of_file_should_upload: 0,
            number_of_uploaded: 0,
            uploadStop: false,
            uploadRej: false,
            upload_modal: false,
            error_upload_modal: false,
            error_upload_modal_state: 0,
        });
    };

    //// end upload and error upload modal function ///////


    // start render cmp

    render() {
        return (
            <>
                <div className="content">
                    <div className="row">
                        <div className="col-12">
                            <div className="template-box mb-4">
                                <div className="row">
                                    <div className="col-4">
                                        <label htmlFor="">{Localization.book}</label>
                                        <AsyncSelect
                                            onBlur={() => this.bookInputTouch_handler()}
                                            placeholder={Localization.book}
                                            cacheOptions
                                            defaultOptions
                                            value={this.state.selectedBook}
                                            loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback)}
                                            noOptionsMessage={(obj) => this.select_noOptionsMessage(obj)}
                                            onChange={(selectedBook) => this.handleBookChange(selectedBook)}
                                        // isDisabled={this.state.saveMode === SAVE_MODE.EDIT}
                                        />
                                        {this.bookInvalidFeedback()}
                                    </div>
                                    <div className="col-4">
                                        <label htmlFor="">{Localization.type + " " + Localization.content}</label>
                                        <Select
                                            onChange={(value: any) => this.handleBookContentTypeChange(value)}
                                            options={this.contentOptions}
                                            onBlur={() => this.typeInputTouch_handler()}
                                            placeholder={Localization.type + " " + Localization.content}
                                            value={this.state.contentType}
                                        // isDisabled={this.state.saveMode === SAVE_MODE.EDIT}
                                        />
                                        {this.typeInvalidFeedback()}
                                    </div>
                                    <div className="col-2 mt-3 pt-4">
                                        {Localization.title} : {this.book_title_returner()}
                                    </div>
                                    <div className="col-2 mt-3 pt-4">
                                        {Localization.type} : {this.book_type_returner()}
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                    <div className="mr-0 pr-0">
                                        {
                                            this.state.saveMode === SAVE_MODE.CREATE
                                                ?
                                                <>
                                                    <BtnLoader
                                                        loading={this.state.create_update_loading}
                                                        btnClassName="btn btn-success shadow-default shadow-hover"
                                                        onClick={() => this.create()}
                                                        disabled={this.btn_disable_status()}
                                                    >
                                                        {Localization.save + " " + Localization.content}
                                                    </BtnLoader>
                                                    <BtnLoader
                                                        loading={false}
                                                        btnClassName="btn btn-warning shadow-default shadow-hover ml-3"
                                                        onClick={() => this.Reset()}
                                                    >
                                                        {Localization.reset}
                                                    </BtnLoader>
                                                </>
                                                :
                                                <>
                                                    <BtnLoader
                                                        loading={this.state.create_update_loading}
                                                        btnClassName="btn btn-info shadow-default shadow-hover"
                                                        onClick={() => this.update()}
                                                        disabled={this.btn_disable_status()}
                                                    >
                                                        {Localization.update}
                                                    </BtnLoader>
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
                    <div className="row">
                        <div className="col-12">
                            <div className="template-box mb-4">
                                {
                                    this.returnerGenerator_by_book_type(this.state.selectedBookType)
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {this.render_upload_modal()}
                {this.render_error_upload_modal()}
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

export const BookGenerator = connect(
    state2props,
    dispatch2props
)(BookGeneratorComponent);