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
import AsyncSelect from 'react-select/async';
import { IBook } from '../../../model/model.book';
import { BookService } from '../../../service/service.book';
import { BOOK_TYPES } from '../../../enum/Book';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { AppGuid } from '../../../asset/script/guid';
import { ChapterGenerator } from '../ChapterGenerator/ChapterGenerator';
// import { AudioBookGenerator } from '../AudioBookGenerator/AudioBookGenerator';

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

interface IState {
    selectedBook: ICmp_select<IBook> | null;
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
    book: any[] = [
        {
            "title": "اولین فصل کتاب Book1",
            "body": [
                {
                    "type": "text",
                    "text": "حسین فریدون لحظاتی قبل از معرفی خود به اوین گفت: «اجرای حکم اینجانب نشان داد که \"برادر رییس جمهور بودن\" نه تنها هیچ مزیتی برای من نبود که می تواند خودش یک اتهام باشد! و من خوشحالم که حتی در این مقام برای انقلاب و نظامی که آن را دوست داشته و تلاش کرده ام قربانی می شوم."
                },
                {
                    "type": "text",
                    "text": "اولا. در این پرونده یک ریال از بیت المال حیف و میل نشده است و اصولا پای بیت المال درکار نبوده است. در واقع کل پولی که از آن حرف زده می شود پول شخصی یک نفر است که به فرد دیگری قرض داده شده و هیچ یک از آن دو نفر من نبوده ام و من فقط بر این قرض شاهد و ضامن بوده ام و یک ریال آن به جیب بنده یا خانواده بنده واریز نشده است ... که اگر خلافش بود اعلام کنید."
                },
                {
                    "type": "text",
                    "text": "ثانیا. من برخلاف کیفرخواست و دادنامه و حکم صادره سفارش هیچ کسی را به هیچ مقامی نکرده ام و هیچ مقامی تعیین و جابجا نشده است ... که اگر خلافش بود اعلام کنید."
                },
                {
                    "type": "text",
                    "text": "ثالثا. تمام پرونده تشکیل شده مستند به شنود غیر قانونی از جمله شنود از دفتر رییس جمهور است که هم غیر قانونی، هم غیر شرعی و هم غیر اخلاقی است و باید از سوی دولت و قوه قضاییه پی گیری شود ... و البته وقتی ضابط و شاکی و قاضی و رسانه هم یکی می شوند بهتر از این نمی شود ..."
                },
                {
                    "type": "control",
                    "control": "NEW_LINE"
                },
                {
                    "type": "text",
                    "text": "بر این اساس من آماده ام متن کامل حکم، دادنامه، کیفرخواست و مستندات در فضای عمومی برای اطلاع مردم منتشر شود تا سیه روی شود هر که در او غش باشد. وکیل من آماده پاسخگویی حقوقی به همه پرسشهای خبرنگاران است و به قوه قضاییه هم عرض می\u200Cکنم نگران من نباشد چون از روزی که این پرونده مطرح شده است، رسانه ها از ذکر نام بنده حتی در مرحله اتهام پرهیز نکردند و سخنگوی سابق قوه قضاییه که ظاهرا می\u200Cخواست قانون را رعایت کند و به صورت صوری از ذکر نام حسین فریدون پرهیز داشت از صفت \"برادر رییس جمهور\" برای بنده استفاده می کرد که کنایه ای صریح تر از اصل بود ... . در دادگاه علنی نیز تنها خبرنگاران رسانه های خاصی که با ضابط پرونده همراهی و همکاری داشتند می\u200Cتوانستند در دادگاه حاضر شوند. همین رسانه\u200Cها آن قدر حاشیه سازی کردند که قاضی ناگزیر از محکومیت متهمی بود که آنها پیشاپیش حکم محکومیتش را صادر کرده بودند."
                },
                {
                    "type": "control",
                    "control": "NEW_LINE"
                },
                {
                    "type": "text",
                    "text": "حال در این شرایط اگر مبنا بر شفافیت است من پیشنهاد میکنم شفافیت حداکثری پیشه کنند و چیزی از مردم پنهان ندارند تا روشن شود من به ملت و دولت و رییس جمهور و بیت المال هیچ خیانتی نکردم و امروز برای خدماتی که برای کشور کرده ام از حبس در ساواک تا جنگ با تجزیه طلبان و نیز مبارزه برای لغو تحریم ها هیچ شرمنده نیستم و هزینه همه آنها را پرداخت می کنم ... من این حبس را در ادامه زندان برای انقلاب، در تداوم گروگان گیری تجزیه طلبان، در کنار تلاش برای صلح و هزینه پیروزی برای دولت اعتدال می دانم و با همه دشواری این بار را تنها بر دوش می کشم اما مردم را به شهادت و قضاوت نهایی می طلبم که بر اساس جوسازی و کلی بافی قضاوت نکنند که قاضی نهایی خداوند حکیم و علیم و آنگاه مردم هستند."
                }
            ],
            "children": [
                {
                    "title": "Sub1",
                    "body": [
                        {
                            "type": "control",
                            "control": "NEW_LINE"
                        },
                        {
                            "type": "text",
                            "text": "زیر فصل اول "
                        }
                    ],
                    "children": [
                        {
                            "title": "Sub11",
                            "body": [
                                {
                                    "type": "control",
                                    "control": "NEW_LINE"
                                },
                                {
                                    "type": "text",
                                    "text": "زیر زیر فصل اول "
                                }
                            ],
                            "children": [
                                {}
                            ]
                        },
                        {
                            "title": "Sub12",
                            "body": [
                                {
                                    "type": "control",
                                    "control": "NEW_LINE"
                                },
                                {
                                    "type": "text",
                                    "text": "زیر دوم زیر فصل اول "
                                }
                            ],
                            "children": [

                            ]
                        }
                    ]
                }
            ]
        },
        {
            "title": "Second.Chapter",
            "body": [
                {
                    "type": "control",
                    "control": "NEW_LINE"
                },
                {
                    "type": "text",
                    "text": "فصل دوم"
                }
            ],
            "children": [
                {
                    "title": "SUB21",
                    "body": [
                        {
                            "type": "text",
                            "text": "سلام من دارم میام"
                        }
                    ],
                    "children": [
                        {
                            "title": "SUB2.11",
                            "body": [
                                {
                                    "type": "text",
                                    "text": "helo"
                                }
                            ]
                        },
                        {
                            "title": "SUB212",
                            "body": [
                                {
                                    "type": "text",
                                    "text": "helo"
                                }
                            ]
                        }

                    ]
                },
                {
                    "title": "SUB22",
                    "body": []
                }
            ]
        }
    ]
    state = {
        selectedBook: null,
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

    // componentDidMount(){
    //     this.setState({
    //         ...this.state,
    //         Epub_book : {
    //             ...this.state.Epub_book,
    //             children : this.book
    //         }
    //     })
    // }

    _bookService = new BookService();

    treeData: Book_children[] = [
        {
            front_id: AppGuid.generate(),
            title: 'chapter1',
            body: [],
            children: [
                {
                    front_id: AppGuid.generate(),
                    title: 'chapter11',
                    body: [],
                    children: [],
                },
                {
                    front_id: AppGuid.generate(),
                    title: 'chapter12',
                    body: [],
                    children: [],
                },
            ],
        },
    ];

    updateTree(treeData: Book_children[]) {
        this.treeData = treeData
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

    handleBookChange(selectedBook: any) {
        this.setState({
            ...this.state,
            selectedBook: selectedBook,
        }, () => this.setFileTitleAndType())
    }

    Reset() {
        this.setState({
            ...this.state,
            selectedBook: null,
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

    ////////////   end book selection func ////////////////////

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

    //// start onChange function define  ///////

    returnerGenerator_by_book_type() {
        if (this.state.selectedBookType === undefined || this.state.selectedBook === null) {
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

    render() {
        return (
            <>
                <div className="content">
                    <div className="row">
                        <div className="col-12">
                            <div className="template-box mb-4">
                                <div className="row">
                                    <div className="col-sm-6 col-xl-4">
                                        <label htmlFor="">{Localization.book}</label>
                                        <AsyncSelect
                                            placeholder={Localization.book}
                                            cacheOptions
                                            defaultOptions
                                            value={this.state.selectedBook}
                                            loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback)}
                                            noOptionsMessage={(obj) => this.select_noOptionsMessage(obj)}
                                            onChange={(selectedBook) => this.handleBookChange(selectedBook)}
                                        />
                                    </div>
                                    <div className="col-sm-2 col-xl-2 mt-3 pt-4">
                                        {Localization.title} : {this.book_title_returner()}
                                    </div>
                                    <div className="col-sm-2 col-xl-2 mt-3 pt-4">
                                        {Localization.type} : {this.book_type_returner()}
                                    </div>
                                    <div className="col-sm-2 col-xl-4 mt-3 pt-3" >
                                        <BtnLoader
                                            loading={false}
                                            btnClassName="btn btn-warning shadow-default shadow-hover pull-right"
                                            onClick={() => this.Reset()}
                                        >
                                            {Localization.reset}
                                        </BtnLoader>
                                    </div>
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