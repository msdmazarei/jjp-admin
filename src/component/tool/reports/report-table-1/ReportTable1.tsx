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
import { IComment } from "../../../../model/model.comment";
import { BOOK_TYPES } from "../../../../enum/Book";
import { CommentService } from "../../../../service/service.comment";
import { redux_state } from "../../../../redux/app_state";
import { ReportBase } from "../ReportBase";

export interface IProps {
    history?: History;
    internationalization: TInternationalization;
    token: IToken;
    init_tools: (tools: JSX.Element) => void
}

interface IState {
    comment_table: IProps_table;
    commentTableLoader: boolean;
    gregorianCalender: boolean;
    timeStampFrom: number;
    timeStampTo: number;
    defultValue: string;
    maxMinSell: {
        date: string;
        max_book: string;
        min_book: string;
        max_count: number,
        min_count: number,
    }[];
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
        defultValue: "2000/05/09",
        maxMinSell: [],
    }

    /// end of state

    constructor(props: IProps) {
        super(props);
        this._commentService.setToken(this.props.token)
    }

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
        this.init_tools();
        this.fetchComments();
    }

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
        this.fetchComments();
    }

    init_tools() {
        this.props.init_tools(this.tools());
    }


    // start list of services for request define

    private _commentService = new CommentService();

    // end list of services for request define

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
            });
        }
    }

    // end request & set data for comment table


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

    tools_render() {
        return (
            <div>haeder</div>
        )
    }

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
        token: state.token,
    };
};

export const ReportCommentTable = connect(
    state2props,
    dispatch2props
)(ReportCommentTableComponent);