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
}

export type Book_body = book_body_control | Book_body_text | book_body_voice;

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
    selectedBookType: string | undefined;
    Epub_book: {
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
    }
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
        Epub_book: {
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
    }

    componentDidMount() {
        if (this.props.match.path.includes('api.......................')) {
            this.setState({ ...this.state, saveMode: SAVE_MODE.EDIT });
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

    type_uploadable() {
        if (this.state.selectedBook === null) {
            return false;
        } else {
            const b_t: any = (this.state.selectedBook! as ICmp_select<IBook>).value.type;
            if (b_t === 'Hard_Copy' || b_t === 'DVD' || b_t === 'Pdf') {
                return false;
            } else {
                return true;
            }
        }
    }

    setFileTitleAndType() {
        if (this.type_uploadable() === false) {
            this.setState({
                ...this.state,
                selectedBookType: undefined,
                Epub_book: {
                    ...this.state.Epub_book,
                    title: undefined,
                },
                Audio_book: {
                    ...this.state.Audio_book,
                    title: undefined,
                }
            })
        } else {
            this.setState({
                ...this.state,
                selectedBookType: (this.state.selectedBook! as ICmp_select<IBook>).value.type as BOOK_TYPES,
                Epub_book: {
                    ...this.state.Epub_book,
                    title: (this.state.selectedBook! as ICmp_select<IBook>).value.title,
                },
                Audio_book: {
                    ...this.state.Audio_book,
                    title: (this.state.selectedBook! as ICmp_select<IBook>).value.title,
                }
            })
        }

    }

    ////////////   start book selection func ////////////////////

    _bookService = new BookService();

    handleBookChange(selectedBook: any) {
        this.setState({
            ...this.state,
            selectedBook: selectedBook,
        }, () => this.setFileTitleAndType())
    }

    personRequstError_txt: string = Localization.no_item_found;

    async promiseOptions2(inputValue: any, callBack: any) {
        let filter = undefined;
        if (inputValue) {
            filter = { title: inputValue };
        }
        let res: any = await this._bookService.search(10, 0, filter).catch(err => {
            let err_msg = this.handleError({ error: err.response, notify: false });
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
        { value: 'origin', label: 'origin' },
        { value: 'brief', label: 'brief' },
    ];

    handleBookContentTypeChange(contentType: any) {
        this.setState({
            ...this.state,
            contentType: contentType,
        }, () => this.setFileTitleAndType())
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
        }, () => this.setFileTitleAndType())
    }

    ////////////   end reset page func ////////////////////


    ////////////   start create btn function ////////////////////

    create(){
        if(this.state.selectedBook === null || this.state.contentType === null){
            return
        }
    }

    ////////////   end create btn function ////////////////////


    ////////////   start update btn function ////////////////////

    update(){
        if(this.state.selectedBook === null || this.state.contentType === null){
            return
        }
    }

    ////////////   end update btn function ////////////////////


    //// start onChange function define  ///////

    onchange(children: Book_children[]) {
        if (this.state.selectedBookType === undefined) {
            return
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
        if (this.state.selectedBookType === "Audio") {
            this.setState({
                ...this.state,
                Audio_book: {
                    ...this.state.Audio_book,
                    children: children,
                }
            })
        }
    }

    //// end onChange function define  ///////


    //// start returner by book type function /////

    returnerGenerator_by_book_type() {
        if (this.state.selectedBookType === undefined || this.state.selectedBook === null || this.state.contentType === null) {
            return <></>
        }
        if (this.state.selectedBookType === "Epub") {
            return <>
                <ChapterGenerator
                    bookType={'Epub'}
                    booktitle={(this.state.selectedBook! as ICmp_select<IBook>).value.title}
                    bookContent={this.state.Epub_book.children}
                    onChangeBook={(bookContent: Book_children[]) => this.onchange(bookContent)}
                />
            </>
        }
        if (this.state.selectedBookType === "Audio") {
            return <>
                <ChapterGenerator
                    bookType={'Audio'}
                    booktitle={(this.state.selectedBook! as ICmp_select<IBook>).value.title}
                    bookContent={this.state.Audio_book.children}
                    onChangeBook={(bookContent: Book_children[]) => this.onchange(bookContent)}
                />
            </>
        }
    }

    //// end returner by book type function /////


    // start render cmp

    render() {
        return (
            <>
                <div className="content">
                    <div className="row">
                        <div className="col-12">
                            <div className="template-box mb-4">
                                <div className="row">
                                    <div className="col-3">
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
                                            isDisabled={this.state.saveMode === SAVE_MODE.EDIT}
                                        />
                                        {this.bookInvalidFeedback()}
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="">{Localization.type + " " + Localization.content}</label>
                                        <Select
                                            onChange={(value: any) => this.handleBookContentTypeChange(value)}
                                            options={this.contentOptions}
                                            onBlur={() => this.typeInputTouch_handler()}
                                            placeholder={Localization.type + " " + Localization.content}
                                            value={this.state.contentType}
                                            isDisabled={this.state.saveMode === SAVE_MODE.EDIT}
                                        />
                                        {this.typeInvalidFeedback()}
                                    </div>
                                    <div className="col-2 mt-3 pt-4">
                                        {Localization.title} : {this.book_title_returner()}
                                    </div>
                                    <div className="col-2 mt-3 pt-4">
                                        {Localization.type} : {this.book_type_returner()}
                                    </div>
                                    {
                                        this.state.saveMode === SAVE_MODE.CREATE
                                            ?
                                            <div className="col-2 mt-3 pt-3" >
                                                <BtnLoader
                                                    loading={false}
                                                    btnClassName="btn btn-warning shadow-default shadow-hover"
                                                    onClick={() => this.Reset()}
                                                >
                                                    {Localization.reset}
                                                </BtnLoader>
                                                <BtnLoader
                                                    loading={false}
                                                    btnClassName="btn btn-success shadow-default shadow-hover pull-right"
                                                    onClick={() => this.create()}
                                                >
                                                    {Localization.create}
                                                </BtnLoader>
                                            </div>
                                            :
                                            <div className="col-2 mt-3 pt-3" >
                                                <BtnLoader
                                                    loading={false}
                                                    btnClassName="btn btn-success shadow-default shadow-hover pull-right"
                                                    onClick={() => this.update()}
                                                >
                                                    {Localization.update}
                                                </BtnLoader>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="template-box mb-4">
                                {
                                    this.returnerGenerator_by_book_type()
                                }
                            </div>
                        </div>
                    </div>
                </div>
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