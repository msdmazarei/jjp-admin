import React from "react";
import { History } from 'history';
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import { TInternationalization } from "../../../../config/setup";
import { IProps_table, Table } from "../../../table/table";
import { Localization } from "../../../../config/localization/localization";
import { BOOK_TYPES } from "../../../../enum/Book";
import { redux_state } from "../../../../redux/app_state";
import { ReportBase } from "../ReportBase";
import { IBook } from "../../../../model/model.book";
import Select from 'react-select'
import { CSVLink } from "react-csv";
import { ReportService } from "../../../../service/service.reports";


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
}

class ReportlastSellWithTypeTableComponent extends ReportBase<IProps, IState> {

    // start book type option

    typeOptions = [
        { value: 'Hard_Copy', label: Localization.book_type_list.Hard_Copy },
        { value: 'Audio', label: Localization.book_type_list.Audio },
        { value: 'Epub', label: Localization.book_type_list.Epub },
        { value: 'DVD', label: Localization.book_type_list.DVD },
        { value: 'Pdf', label: Localization.book_type_list.Pdf },
        { value: 'Msd', label: Localization.book_type_list.Msd },
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
                                <div className="d-inline-block w-50px h-50px">
                                    <img className="max-w-50px max-h-50px" src={"/api/serve-files/" + row.images[0]} alt="" onError={e => this.bookImageOnError(e)} />
                                </div>
                            </div>
                        }
                        else {
                            return <div className="text-center">
                                <div className="d-inline-block w-50px h-50px">
                                    <img className="max-w-50px max-h-50px" src={this.defaultBookImagePath} alt="" />
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
                // {
                //     field: "price", title: Localization.price,
                //     cellTemplateFunc: (row: IBook) => {
                //         if (row.price) {
                //             return <div className="text-info text-center">{row.price.toLocaleString()}</div>
                //         } else if (row.price === 0) {
                //             return <div className="text-info text-center">0</div>;
                //         } else {
                //             return <div className="text-danger text-center">---</div>;
                //         }
                //     }
                // },
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
                {
                    field: "duration", title: Localization.duration,
                    cellTemplateFunc: (row: IBook) => {
                        let hour;
                        let minute;
                        let second;
                        if (row.duration) {
                            if (row.duration === 'NaN') {
                                return ''
                            }
                            if (row.type !== 'Audio') {
                                return ''
                            }
                            let totalTime = Number(row.duration);
                            if (totalTime === 0) {
                                return ''
                            }
                            if (totalTime < 60) {
                                hour = 0;
                                minute = 0;
                                second = totalTime;
                                return <div title={row.duration} className="text-right d-inline-block text-nowrap-ellipsis max-w-100px"> {second} : {minute} : {hour}</div>
                            }
                            if (totalTime >= 60 && totalTime < 3600) {
                                let min = Math.floor(totalTime / 60);
                                let sec = totalTime - (min * 60);
                                hour = 0;
                                minute = min;
                                second = sec;
                                return <div title={row.duration} className="text-right d-inline-block text-nowrap-ellipsis max-w-100px"> {second} : {minute} : {hour}</div>
                            } else {
                                let hours = Math.floor(totalTime / 3600);
                                if ((totalTime - (hours * 3600)) < 60) {
                                    let sec = totalTime % 3600;
                                    hour = hours;
                                    minute = 0;
                                    second = sec;
                                    return <div title={row.duration} className="text-right d-inline-block text-nowrap-ellipsis max-w-100px"> {second} : {minute} : {hour}</div>
                                } else {
                                    let min = Math.floor(((totalTime - (hours * 3600)) / 60));
                                    let sec = (totalTime - ((hours * 3600) + (min * 60)));
                                    hour = hours;
                                    minute = min;
                                    second = sec;
                                    return <div title={row.duration} className="text-right d-inline-block text-nowrap-ellipsis max-w-100px"> {second} : {minute} : {hour}</div>
                                }
                            }
                        }
                        return '';
                    }
                },
                {
                    field: "pub_year", title: Localization.publication_date
                    , cellTemplateFunc: (row: IBook) => {
                        if (row.pub_year) {
                            return <div title={this._getTimestampToDate(row.pub_year)}>{this.getTimestampToDate(row.pub_year)}</div>
                        }
                        return '';
                    }
                },
            ],
        },
        type: this.typeOptions[0],
    }

    /// end of state

    private _report_title: string = Localization.name_of_report.fifteen_books_have_recently_been_sold_by_type;


    // start list of services for request define

    private _reportService = new ReportService();

    // end list of services for request define


    // constructor(props: IProps) {
    //     super(props);
    //     // this._bookService.setToken(this.props.token)
    // }

    componentDidMount() {
        this.fetchLastSellWithType();
        this.init_title();
        this.init_tools();
    }


    // start request & set data for comment table

    async fetchLastSellWithType() {
        this.setState({ ...this.state, lastSellWithTypeTableLoader: true });
        let res = await this._reportService.last_sell_by_book_type(this.state.type.value).catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'fetchLastSellWithTypeDashboard_error' } });
            this.setState({
                ...this.state,
                lastSellWithTypeTableLoader: false,
            });
        });
        if (res) {
            let slicedArray : any[] = res.data.result.slice(0,15);
            this.setState({
                ...this.state,
                lastSellWithType_table: {
                    ...this.state.lastSellWithType_table,
                    list: res.data.result.length > 15 ? slicedArray : res.data.result,
                },
                lastSellWithTypeTableLoader: false,
            },() => this.init_renders());
        }
    }

    init_renders() {
        this.init_title();
        this.init_tools();
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
                    data={this.excelDataPassToDownloader(this.state.lastSellWithType_table.list)}
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
                book_title: item.title,
                book_type: type,
                creation_date: this.getTimestampToDate(item.creation_date),
                price: item.price,
                rate: item.rate + " " + Localization.from + " " + 5,
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
        }, () => this.fetchLastSellWithType())
    }

    // end set type of book


    // start timestamp to date for comment table

    getTimestampToDate(timestamp: number) {
        if (this.props.internationalization.flag === "fa") {
            return moment_jalaali(timestamp * 1000).format('jYYYY/jM/jD');
        }
        else {
            return moment(timestamp * 1000).locale("en").format('YYYY/MM/DD');
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
                    list={this.state.lastSellWithType_table.list}
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