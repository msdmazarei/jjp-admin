import React from "react";
import { History } from 'history';
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import { TInternationalization } from "../../../../config/setup";
// import { IToken } from "../../../../model/model.token";
import { IProps_table, Table } from "../../../table/table";
import { Localization } from "../../../../config/localization/localization";
import { BOOK_TYPES } from "../../../../enum/Book";
import { redux_state } from "../../../../redux/app_state";
import { ReportBase } from "../ReportBase";
import { BookService } from "../../../../service/service.book";
import { IBook } from "../../../../model/model.book";
import Select from 'react-select'
import { CSVLink } from "react-csv";


export interface IProps {
    history?: History;
    internationalization: TInternationalization;
    // token: IToken;
    init_title: (cmpTitle: JSX.Element) => void;
    init_tools: (tools: JSX.Element) => void;
}

interface IState {
    lastSellWithTypeTableLoader: boolean;
    lastSellWithType_table: IProps_table;
    type: {
        label: string;
        value: string;
    } | undefined;
    gregorianCalender: boolean;
    timeStampFrom: number;
    timeStampTo: number;
}

class ReportlastSellWithTypeTableComponent extends ReportBase<IProps, IState> {

    // start book type option

    typeOptions = [
        { value: 'Hard_Copy', label: Localization.book_type_list.Hard_Copy },
        { value: 'Audio', label: Localization.book_type_list.Audio },
        { value: 'Epub', label: Localization.book_type_list.Epub }
    ];

    // end book type option
    state = {
        lastSellWithTypeTableLoader: false,
        lastSellWithType_table: {
            list: [],
            colHeaders: [
                {
                    field: "title", title: Localization.title, cellTemplateFunc: (row: IBook) => {
                        if (row.title) {
                            return <div title={row.title} className="text-nowrap-ellipsis max-w-200px d-inline-block">
                                {row.title}
                            </div>
                        }
                        return '';
                    }
                },
                {
                    field: "images", title: Localization.images, templateFunc: () => {
                        return <b>{Localization.images}</b>
                    },
                    cellTemplateFunc: (row: IBook) => {
                        if (row.images && row.images.length) {
                            return <div className="text-center" >
                                <div className="d-inline-block w-100px h-100px">
                                    <img className="max-w-100px max-h-100px" src={"/api/serve-files/" + row.images[0]} alt="" onError={e => this.bookImageOnError(e)} />
                                </div>
                            </div>
                        }
                        else {
                            return <div className="text-center">
                                <div className="d-inline-block w-100px h-100px">
                                    <img className="max-w-100px max-h-100px" src={this.defaultBookImagePath} alt="" />
                                </div>
                            </div>
                        }
                    }
                },
                {
                    field: "type", title: Localization.type,
                    cellTemplateFunc: (row: IBook) => {
                        if (row.type) {
                            const b_type: any = row.type;
                            const b_t: BOOK_TYPES = b_type;
                            return Localization.book_type_list[b_t];
                        }
                        return '';
                    }
                },
                {
                    field: "creation_date", title: Localization.creation_date,
                    cellTemplateFunc: (row: IBook) => {
                        if (row.creation_date) {
                            return <div title={this._getTimestampToDate(row.creation_date)}>{this.getTimestampToDate(row.creation_date)}</div>
                        }
                        return '';
                    }
                },
                {
                    field: "price", title: Localization.price,
                    cellTemplateFunc: (row: IBook) => {
                        // row.price = 3436465;
                        if (row.price) {
                            return <span className="text-info">
                                {row.price.toLocaleString()}
                            </span>
                        }
                        else {
                            return <div className="text-muted text-center">-</div>;
                        }
                    }
                },
                {
                    field: "rate",
                    title: Localization.vote_s,
                    cellTemplateFunc: (row: IBook) => {
                        if (row.rate) {
                            return <span>
                                {row.rate} {Localization.from} 5 <small>({row.rate_no})</small>
                            </span>
                        }
                        return '';
                    }
                },
                { field: "duration", title: Localization.duration },
                { field: "pub_year", title: Localization.publication_date },
            ],
        },
        type: this.typeOptions[0],
        gregorianCalender: true,
        timeStampFrom: 0,
        timeStampTo: 0,
    }

    /// end of state

    private _report_title: string = Localization.name_of_report.fifteen_books_have_recently_been_sold_by_type;


    // start list of services for request define

    private _bookService = new BookService();

    // end list of services for request define


    // constructor(props: IProps) {
    //     super(props);
    //     // this._bookService.setToken(this.props.token)
    // }

    componentDidMount() {
        if (this.props.internationalization.flag === "fa") {
            this.setState({
                ...this.state,
                gregorianCalender: false,
                lastSellWithTypeTableLoader: true,
            })
        } else {
            this.setState({
                ...this.state,
                gregorianCalender: true,
                lastSellWithTypeTableLoader: true,
            })
        };
        this.fetchLastSellWithType();
        this.init_title();
        this.init_tools();
    }


    // start request & set data for comment table

    async fetchLastSellWithType() {
        this.setState({ ...this.state, lastSellWithTypeTableLoader: true });
        let res = await this._bookService.search(200, 0).catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'fetchLastSellWithTypeDashboard_error' } });
            this.setState({
                ...this.state,
                lastSellWithTypeTableLoader: false,
            });
        });
        if (res) {
            this.setState({
                ...this.state,
                lastSellWithType_table: {
                    ...this.state.lastSellWithType_table,
                    list: res.data.result
                },
                lastSellWithTypeTableLoader: false,
            },
                () => this.init_renders());
        }
    }
    
    init_renders() {
        this.init_title();
        this.init_tools();
        this.get_split(this.state.lastSellWithType_table.list, this.state.type.value);
    }

    // end request & set data for comment table


    // start function define & pass report tools to wrapper widget

    tools() {
        return (
            <>
                <i className="tool fa fa-refresh" onClick={() => this.refreshFunction()}></i>
                <i className={this.state.lastSellWithType_table.list.length === 0 ? 'd-none' : "tool fa fa-file-pdf-o"} onClick={(e) => this.goToPdfFunction(e)}></i>
                <CSVLink
                    headers={this.excelDataHeaderPassToDownloader()}
                    data={this.excelDataPassToDownloader(this.get_split(this.state.lastSellWithType_table.list, this.state.type.value))}
                    filename={'ten-recent-comment.csv'}
                >
                    <i className={this.state.lastSellWithType_table.list.length === 0 ? 'd-none' : "tool fa fa-file-excel-o"}></i>
                </CSVLink>
            </>
        )
    }

    refreshFunction() {
        this.fetchLastSellWithType();
    }

    init_tools() {
        this.props.init_tools(this.tools());
    }

    title_render() {
        return (
            <>
                <div className="text-center">{this._report_title}</div>
            </>
        )
    }

    async init_title() {
        await this.waitOnMe();
        this.props.init_title(this.title_render());
    }

    // end function define & pass report tools to wrapper widget


    // start report export in pdf format tool function 

    goToPdfFunction(e: any) {
        const widget = this.upToParent(e.currentTarget, 'app-widget');
        const content = widget && widget.querySelector('.widget-body table');
        const table = content!.cloneNode(true)
        const newTab = window.open();
        const head = document.querySelector('html head');
        const style = head!.cloneNode(true);
        if (newTab) {
            const oldHeadNewTab = newTab.document.querySelector('head')!;
            oldHeadNewTab!.parentNode!.removeChild(oldHeadNewTab);
            newTab.document.querySelector('html')!.prepend(style!);
            newTab.document.body.classList.add('rtl');
            newTab.document.body.classList.add('printStatus');
            newTab.document.body.classList.add('only-print-visibility');
            const body = newTab.document.querySelector('body')!;
            body.appendChild(table);
            newTab.print();
            // newTab.close();
        }
    }

    upToParent(el: any, className: string) {
        while (el && el.parentNode) {
            el = el.parentNode;
            if (el.classList.contains(className)) {
                return el;
            }
        }
        return null;
    }

    // end report export in pdf format tool function 


    // start report export in excel format tool function 

    excelDataHeaderPassToDownloader() {

        const headers = [
            { label: Localization.book_title, key: "book_title" },
            { label: Localization.book_type, key: "book_type" },
            { label: Localization.creation_date, key: "creation_date" },
            { label: Localization.price, key: "price" },
            { label: Localization.vote_s, key: "rate" },
            { label: Localization.duration, key: "duration" },
            { label: Localization.publication_date, key: "publication_date" },
        ];

        return headers
    }

    excelDataPassToDownloader(list: any[]) {

        const newList: any[] = list.map(item => {
            let type;
            if (item && item.type) {
                const b_type: any = item.type;
                const b_t: BOOK_TYPES = b_type;
                type = Localization.book_type_list[b_t];
            }
            return {
                book_title : item.title ,
                book_type: type,
                creation_date: this.getTimestampToDate(item.creation_date),
                price: item.price,
                rate: item.rate + " " + Localization.from + " " + 5 ,
                duration: item.duration,
                publication_date: item.pub_year,
            }
        });

        return newList;
    }

    // end report export in excel format tool function 


    // start set type of book

    handleSelectInputChange(value: { label: string, value: string }) {

        this.setState({
            ...this.state,
            type: value,
        },
            () => this.get_split(this.state.lastSellWithType_table.list, this.state.type.value))
    }

    // end set type of book


    // start functio to split type of books in sevrel arrays

    get_split(total_list: any, type: string) {
        const Hard_Copy: {}[] = [];
        const Epub: {}[] = [];
        const Audio: {}[] = [];

        total_list.map((book: IBook, index: any) => (

            book.type === "Hard_Copy"
                ?
                Hard_Copy.push(book)
                :
                book.type === "Epub"
                    ?
                    Epub.push(book)
                    :
                    book.type === "Audio"
                        ?
                        Audio.push(book)
                        :
                        undefined
        ));
        if (type === "Hard_Copy") {
            return Hard_Copy
        };
        if (type === "Epub") {
            return Epub
        };
        if (type === "Audio") {
            return Audio
        } else {
            return Hard_Copy
        }
    }

    // end functio to split type of books in sevrel arrays


    // start timestamp to date for comment table

    getTimestampToDate(timestamp: number) {
        if (this.props.internationalization.flag === "fa") {
            return moment_jalaali(timestamp * 1000).locale("en").format('jYYYY/jM/jD');
        }
        else {
            return moment(timestamp * 1000).format('YYYY/MM/DD');
        }
    }

    _getTimestampToDate(timestamp: number) {
        if (this.props.internationalization.flag === "fa") {
            return this.getFromNowDate(timestamp);
        }
        else {
            return this.getFromNowDate(timestamp);
        }
    }

    // end timestamp to date for comment table


    // start function for render content

    report_render() {
        return (
            <>
                <div className="row mb-3">
                    <div className="col-12 col-md-6">
                        <div className="ml-2">
                            <label htmlFor="">{Localization.type}</label>
                            <Select
                                onChange={(value: any) => this.handleSelectInputChange(value)}
                                options={this.typeOptions}
                                value={this.state.type}
                                placeholder={Localization.type}
                            />
                        </div>
                    </div>
                </div>
                <Table
                    loading={this.state.lastSellWithTypeTableLoader}
                    list={this.get_split(this.state.lastSellWithType_table.list, this.state.type.value)}
                    colHeaders={this.state.lastSellWithType_table.colHeaders}
                >
                </Table>
            </>
        );
    }

    // end function for render content


    render() {
        return (
            this.report_render()
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

export const ReportlastSellWithTypeTable = connect(
    state2props,
    dispatch2props
)(ReportlastSellWithTypeTableComponent);