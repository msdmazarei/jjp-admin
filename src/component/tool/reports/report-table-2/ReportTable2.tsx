import React from "react";
import { History } from 'history';
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import { TInternationalization } from "../../../../config/setup";
import { IToken } from "../../../../model/model.token";
import { IProps_table, Table } from "../../../table/table";
import { Localization } from "../../../../config/localization/localization";
import { BOOK_TYPES } from "../../../../enum/Book";
import { redux_state } from "../../../../redux/app_state";
import { ReportBase } from "../ReportBase";
import { BookService } from "../../../../service/service.book";
import { IBook } from "../../../../model/model.book";
import Select from 'react-select'


export interface IProps {
    history?: History;
    internationalization: TInternationalization;
    token: IToken;
    init_tools: (tools: JSX.Element) => void
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


    // start set type of book

    handleSelectInputChange(value: { label: string, value: string }) {

        this.setState({
            ...this.state,
            type: value,
        },
            () => this.get_split(this.state.lastSellWithType_table.list, this.state.type.value))
    }

    // end set type of book


    // start list of services for request define

    private _bookService = new BookService();

    // end list of services for request define


    constructor(props: IProps) {
        super(props);
        this._bookService.setToken(this.props.token)
    }

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
        this.init_tools();
        this.fetchLastSellWithType();
    }


    // start request & set data for comment table

    async fetchLastSellWithType() {
        this.setState({ ...this.state, lastSellWithTypeTableLoader: true });
        let res = await this._bookService.search(200, 0).catch(error => {
            this.handleError({ error: error.response });
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
                () => this.get_split(this.state.lastSellWithType_table.list, this.state.type.value));
        }
    }

    // end request & set data for comment table


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

    // start function define & pass report tools to wrapper widget

    tools() {
        return (
            <>
                <div className="d-inline-block pull-left">
                    <button className="btn btn-sm btn-outline-secondary mb-2" onClick={() => this.refreshFunction()}>
                        <i className="fa fa-refresh"></i>
                    </button>
                </div>

                <div className="d-inline-block pull-left">
                    <button className="btn btn-sm btn-outline-secondary mb-2" onClick={() => this.refreshFunction()}>
                        <i className="fa fa-home"></i>
                    </button>
                </div>

                <div className="d-inline-block pull-left">
                    <button className="btn btn-sm btn-outline-secondary mb-2" onClick={() => this.refreshFunction()}>
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            </>
        )
    }

    refreshFunction() {
        this.fetchLastSellWithType();
    }

    init_tools() {
        this.props.init_tools(this.tools());
    }

    // end function define & pass report tools to wrapper widget


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


    // start function for render tools

    tools_render() {
        return (
            <div>haeder</div>
        )
    }

    // end function for render tools


    // start function for render content

    report_render() {
        return (
            <>
                <div className="row my-3">
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
        token: state.token,
    };
};

export const ReportlastSellWithTypeTable = connect(
    state2props,
    dispatch2props
)(ReportlastSellWithTypeTableComponent);