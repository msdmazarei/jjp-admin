import React from "react";
import { History } from 'history';
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { redux_state } from "../../redux/app_state";
import { BaseComponent } from "../_base/BaseComponent";
import { TInternationalization } from "../../config/setup";
import { IToken } from "../../model/model.token";
import { Localization } from "../../config/localization/localization";
import { IBook } from "../../model/model.book";
// import { AppDatePicker } from "../form/app-datePicker/AppDatePicker";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Brush, ReferenceLine, ResponsiveContainer, LabelList } from 'recharts';
import { Table, IProps_table } from "../table/table";
import { IComment } from "../../model/model.comment";
import { BOOK_TYPES } from "../../enum/Book";
import 'moment/locale/fa';
import 'moment/locale/ar';
import moment from 'moment';
import moment_jalaali from 'moment-jalaali';
import { CommentService } from "../../service/service.comment";
export interface IProps {
  history: History;
  internationalization: TInternationalization;
  token: IToken;

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

class DashboardComponent extends BaseComponent<IProps, IState> {
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
    this.fetchComments();
  }


  // start list of services for request define

  private _commentService = new CommentService();

  // end list of services for request define

  // start request & set data for comment table

  async fetchComments() {
    this.setState({ ...this.state, commentTableLoader: true });
    let res = await this._commentService.search(10,0,{book: true}).catch(error => {
      this.handleError({ error: error.response });
      this.setState({
        ...this.state,
        commentTableLoader: false,
      });
    });
    if (res) {
      this.setState({
        ...this.state,
        comment_table:{
          ...this.state.comment_table,
          list:res.data.result
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

  static() {
    const sells: {
      timestamp: number;
      max_book_name: string;
      min_book_name: string;
      max_book_type: string;
      min_book_type: string;
      max_count: number;
      min_count: number;
    }[] = [
        {
          timestamp: 23568745261,
          max_book_name: "1",
          max_book_type: "1",
          min_book_name: "1",
          min_book_type: "1",
          max_count: 2,
          min_count: 1,
        },
        {
          timestamp: 23568745261,
          max_book_name: "2",
          max_book_type: "2",
          min_book_name: "2",
          min_book_type: "2",
          max_count: 4,
          min_count: 3,
        },
        {
          timestamp: 23568745261,
          max_book_name: "3",
          max_book_type: "3",
          min_book_name: "3",
          min_book_type: "3",
          max_count: 6,
          min_count: 5,
        },
        {
          timestamp: 23568745261,
          max_book_name: "4",
          max_book_type: "4",
          min_book_name: "4",
          min_book_type: "4",
          max_count: 8,
          min_count: 7,
        },
        {
          timestamp: 23568745261,
          max_book_name: "5",
          max_book_type: "5",
          min_book_name: "5",
          min_book_type: "5",
          max_count: 10,
          min_count: 9,
        },
        {
          timestamp: 23568745261,
          max_book_name: "6",
          max_book_type: "6",
          min_book_name: "6",
          min_book_type: "6",
          max_count: 12,
          min_count: 11,
        },
        {
          timestamp: 23568745261,
          max_book_name: "7",
          max_book_type: "7",
          min_book_name: "7",
          min_book_type: "7",
          max_count: 13,
          min_count: 12,
        },
      ];

    return sells;
  }


  render() {

    return (
      <div className="content">
        <div className="row">
          <div className="col-12 ">
            <h2>{Localization.dashboard}</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-6 col-12">
            <h2>{Localization.comment}</h2>
            <Table loading={this.state.commentTableLoader} list={this.state.comment_table.list} colHeaders={this.state.comment_table.colHeaders}></Table>
          </div>
        </div>
      </div>
    );
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

export const Dashboard = connect(
  state2props,
  dispatch2props
)(DashboardComponent);