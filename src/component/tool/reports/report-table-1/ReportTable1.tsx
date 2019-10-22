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
import { IComment } from "../../../../model/model.comment";
import { BOOK_TYPES } from "../../../../enum/Book";
import { CommentService } from "../../../../service/service.comment";
import { redux_state } from "../../../../redux/app_state";
import { ReportBase } from "../ReportBase";
import { CSVLink } from "react-csv";
export interface IProps {
    history?: History;
    internationalization: TInternationalization;
    // token: IToken;
    init_title: (cmpTitle: JSX.Element) => void;
    init_tools: (tools: JSX.Element) => void;
}

interface IState {
    comment_table: IProps_table;
    commentTableLoader: boolean;
    gregorianCalender: boolean;
    timeStampFrom: number;
    timeStampTo: number;
}

class ReportCommentTableComponent extends ReportBase<IProps, IState> {
    state = {
        commentTableLoader: false,
        comment_table: {
            list: [],
            colHeaders: [
                {
                    field: "creation_date", title: Localization.creation_date,
                    cellTemplateFunc: (row: IComment) => {
                        if (row.creation_date) {
                            return <div title={this._getTimestampToDate(row.creation_date)}>{this.getTimestampToDate(row.creation_date)}</div>
                        }
                        return '';
                    }
                },
                {
                    field: "creator", title: Localization.user, cellTemplateFunc: (row: IComment) => {
                        if (row.creator) {
                            return <div title={row.creator} className="text-nowrap-ellipsis max-w-100px d-inline-block">
                                {row.creator}
                            </div>
                        }
                        return '';
                    }
                },
                {
                    field: "name last_name", title: Localization.full_name, cellTemplateFunc: (row: IComment) => {
                        if (row.person) {
                            return <div title={this.getPersonFullName(row.person)} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                                {this.getPersonFullName(row.person)}
                            </div>
                        }
                        return '';
                    }
                },
                {
                    field: "book title", title: Localization.book_title, cellTemplateFunc: (row: IComment) => {
                        if (row.book && row.book.title) {
                            return <div title={row.book.title} className="text-nowrap-ellipsis max-w-150px d-inline-block">
                                {row.book.title}
                            </div>
                        }
                        return '';
                    }
                },
                {
                    field: "book type", title: Localization.book_type, cellTemplateFunc: (row: IComment) => {
                        if (row.book && row.book.type) {
                            const b_type: any = row.book.type;
                            const b_t: BOOK_TYPES = b_type;
                            return Localization.book_type_list[b_t];
                        }
                        else {
                            return <div className="text-muted text-center">-</div>;
                        }
                    }
                },
                {
                    field: "body", title: Localization.comment, cellTemplateFunc: (row: IComment) => {
                        if (row.person) {
                            return <div title={row.body} className="text-nowrap-ellipsis max-w-200px d-inline-block">
                                {row.body}
                            </div>
                        }
                        return '';
                    }
                },
                {
                    field: "reports", title: Localization.number_of_reports, cellTemplateFunc: (row: IComment) => {
                        if (row.reports) {
                            return <div title={row.reports.toLocaleString()} className="text-center">
                                {row.reports}{
                                    row.reported_by_user
                                        ?
                                        <span> - <i title={Localization.reported_by_user} className="fa fa-check text-danger"></i></span>
                                        :
                                        ""
                                }
                            </div>
                        }
                        else {
                            return <div className="text-muted text-center">-</div>;
                        }
                    }
                },
            ],
        },
        gregorianCalender: true,
        timeStampFrom: 0,
        timeStampTo: 0,
    }

    /// end of state

    private _report_title: string = Localization.name_of_report.ten_Recent_Comments;


    // start list of services for request define

    private _commentService = new CommentService();

    // end list of services for request define


    // constructor(props: IProps) {
    //     super(props);
    //     // this._commentService.setToken(this.props.token)
    // }

    componentDidMount() {
        if (this.props.internationalization.flag === "fa") {
            this.setState({
                ...this.state,
                gregorianCalender: false,
                commentTableLoader: true,
            })
        } else {
            this.setState({
                ...this.state,
                gregorianCalender: true,
                commentTableLoader: true,
            })
        };
        this.fetchComments();
        this.init_title();
        this.init_tools();
    }


    // start request & set data for comment table

    async fetchComments() {
        this.setState({ ...this.state, commentTableLoader: true });
        let res = await this._commentService.search(10, 0, { book: true }).catch(error => {
            this.handleError({ error: error.response });
            this.setState({
                ...this.state,
                commentTableLoader: false,
            });
        });
        if (res) {
            this.setState({
                ...this.state,
                comment_table: {
                    ...this.state.comment_table,
                    list: res.data.result
                },
                commentTableLoader: false,
            }, () => this.init_renders());
        }
    }

    init_renders() {
        this.init_title();
        this.init_tools();
    }

    // end request & set data for comment table


    // start define custom tools & pass that to widget

    tools() {
        return (
            <>
                <i className="tool fa fa-refresh" onClick={() => this.refreshFunction()}></i>
                <i className={this.state.comment_table.list.length === 0 ? 'd-none' : "tool fa fa-file-pdf-o"} onClick={(e) => this.goToPdfFunction(e)}></i>
                <CSVLink
                    headers={this.excelDataHeaderPassToDownloader()}
                    data={this.excelDataPassToDownloader(this.state.comment_table.list)}
                    filename={'ten-recent-comment.csv'}
                >
                    <i className={this.state.comment_table.list.length === 0 ? 'd-none' : "tool fa fa-file-excel-o"}></i>
                </CSVLink>
            </>
        )
    }

    refreshFunction() {
        this.fetchComments();
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

    // end define custom tools & pass that to widget


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
            { label: Localization.creation_date, key: "creation_date" },
            { label: Localization.user, key: "creator" },
            { label: Localization.full_name, key: "fullname" },
            { label: Localization.book_title, key: "book_title" },
            { label: Localization.book_type, key: "book_type" },
            { label: Localization.comment, key: "comment" },
            { label: Localization.number_of_reports, key: "number_of_reports" }
        ];

        return headers
    }

    excelDataPassToDownloader(list: any[]) {

        const newList: any[] = list.map(item => {
            let type;
            if (item.book && item.book.type) {
                const b_type: any = item.book.type;
                const b_t: BOOK_TYPES = b_type;
                type = Localization.book_type_list[b_t];
            }
            return {
                creation_date: this.getTimestampToDate(item.creation_date),
                creator: item.creator,
                fullname: this.getPersonFullName(item.person),
                book_title: item.book!.title,
                book_type: type,
                comment: item.body,
                number_of_reports: item.reports ? item.reports : "-",
            }
        });

        return newList;
    }

    // end report export in excel format tool function 


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


    report_render() {
        return (
            <Table loading={this.state.commentTableLoader} list={this.state.comment_table.list} colHeaders={this.state.comment_table.colHeaders}></Table>
        );
    }

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

export const ReportCommentTable = connect(
    state2props,
    dispatch2props
)(ReportCommentTableComponent);