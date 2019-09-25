import React, { Fragment } from "react";
import { History } from 'history';
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { redux_state } from "../../redux/app_state";
import { BaseComponent } from "../_base/BaseComponent";
import { TInternationalization } from "../../config/setup";
import { IToken } from "../../model/model.token";
import { Localization } from "../../config/localization/localization";
import { AppWidgets } from "../tool/appWidgets/appWidgets";
import { TReport, reportListMapCmp } from "../tool/reports/ReportUtils";

export interface IProps {
  history: History;
  internationalization: TInternationalization;
  token: IToken;
}

interface IState {
  report_cmp_list: string[];
}

class DashboardComponent extends BaseComponent<IProps, IState> {
  state = {
    report_cmp_list: []
  }
  /// end of state

  // constructor(props: IProps) {
  //   super(props);
  // }
  async componentDidMount() {
    let res = await this.grtUserReport('test').catch(e => { });
    if (res) {
      this.setState({ report_cmp_list: res });
    }
  }

  grtUserReport(uer_id: string): Promise<TReport[]> {
    return new Promise((res, rej) => {
      res(["newst_comment","best_sells_chart","last_sell_with_type","year_sell_with_month"])
    })
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
          {
            this.state.report_cmp_list.map((report: TReport, r_index) => {
              const Cmpname = reportListMapCmp[report];
              return (
                <Fragment key={r_index}>
                  <div className="col-12 col-xl-6 mb-3">
                    <AppWidgets>
                      <Cmpname />
                    </AppWidgets>
                  </div>
                </Fragment>
              )
            })
          }
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