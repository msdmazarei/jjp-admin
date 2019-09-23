import React from "react";
import { History } from 'history';
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { redux_state } from "../../redux/app_state";
import { BaseComponent } from "../_base/BaseComponent";
import { TInternationalization } from "../../config/setup";
import { IToken } from "../../model/model.token";
import { Localization } from "../../config/localization/localization";
import { AppWidgets } from "../tool/appWidgets/appWidgets";
import { ReportCommentTable } from "../tool/reports/report-table-1/ReportTable1";
export interface IProps {
  history: History;
  internationalization: TInternationalization;
  token: IToken;
}

interface IState {

}

class DashboardComponent extends BaseComponent<IProps, IState> {
  state = {
  }
  /// end of state

  // constructor(props: IProps) {
  //   super(props);
  // }

  render() {
    return (
      <div className="content">
        <div className="row">
          <div className="col-12 ">
            <h2>{Localization.dashboard}</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-xl-6">
            <AppWidgets>
              <ReportCommentTable />
            </AppWidgets>
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