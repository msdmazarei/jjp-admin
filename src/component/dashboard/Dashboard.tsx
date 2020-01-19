import React, { Fragment } from "react";
import { History } from 'history';
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { redux_state } from "../../redux/app_state";
import { BaseComponent } from "../_base/BaseComponent";
import { TInternationalization } from "../../config/setup";
// import { IToken } from "../../model/model.token";
import { Localization } from "../../config/localization/localization";
import { AppWidgets } from "../tool/appWidgets/appWidgets";
import { TReport, reportListMapCmp } from "../tool/reports/ReportUtils";
import { DashboardReportsManageModal } from "./DashboardReportsManage"
import { ToastContainer } from "react-toastify";
import { permissionChecker } from "../../asset/script/accessControler";
import { T_ITEM_NAME, CHECKTYPE, CONDITION_COMBINE } from "../../enum/T_ITEM_NAME";

export interface IProps {
  history: History;
  internationalization: TInternationalization;
  // token: IToken;
}

interface IState {
  report_cmp_list: string[];
  report_cmp_status: string[];
  reportManagerModalShow: boolean;
}

class DashboardComponent extends BaseComponent<IProps, IState> {
  state = {
    report_cmp_list: [],
    report_cmp_status: ['true', 'true', 'true', 'true', 'true', 'true'],
    reportManagerModalShow: false,
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
      res([
        "newst_comment",
        "best_sells_chart",
        "last_sell_with_type",
        "year_sell_with_month",
        "Compear_publisher_sells",
        "store_customer_performance"
      ])
    })
  }

  is_allow_render_report(r_name: TReport): boolean {
    if(permissionChecker.is_allow_item_render([T_ITEM_NAME.dashboard],CHECKTYPE.ONE_OF_ALL,CONDITION_COMBINE.DOSE_NOT_HAVE) === false){
      return false;
    }
    if(permissionChecker.is_allow_item_render([T_ITEM_NAME.advancedDashboard],CHECKTYPE.ALL,CONDITION_COMBINE.DOSE_NOT_HAVE) === true){
      return true
    }
    if (r_name === 'newst_comment') {
      return false;
    }
    if (r_name === 'best_sells_chart' ) {
      return true;
    }
    if (r_name === 'last_sell_with_type') {
      return true;
    }
    if (r_name === 'year_sell_with_month') {
      return true;
    }
    if (r_name === 'Compear_publisher_sells') {
      return true;
    }
    if (r_name === 'store_customer_performance') {
      return false; 
    }
    return false;
  }

  reports_status_handler(index: number) {
    const array: string[] = this.state.report_cmp_status;
    array[index] = 'false';
    this.setState({
      ...this.state,
      report_cmp_status: array,
    })
  }

  render_reports_func(): JSX.Element {
    return <div className="row">
      {
        this.state.report_cmp_list.map((report: TReport, r_index: number) => {
          if(this.is_allow_render_report(report) === true){
            const Cmpname = reportListMapCmp[report];
            const status: string = this.state.report_cmp_status[r_index];
            return (
              <Fragment key={r_index}>
                <div className={"col-12 col-xl-6 mb-3 widget-wrapper " + (status === 'false' ? 'd-none' : '')}>
                  <AppWidgets
                    reShow={status ? true : false}
                    onClose={() => this.reports_status_handler(r_index)}
                  >
                    <Cmpname />
                  </AppWidgets>
                </div>
              </Fragment>
            )
          }else{
            undefined
          }
        })
      }
    </div>
  }

  reportManagerModalShow_handler() {
    this.setState({
      ...this.state,
      reportManagerModalShow: true,
    })
  }

  reportManagerModal_seter(newList: string[]) {
    this.setState({
      ...this.state,
      reportManagerModalShow: false,
      report_cmp_status: newList,
    })
  }


  render() {
    return (
      <div className="content">
        {
          permissionChecker.is_allow_item_render([T_ITEM_NAME.dashboard], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true
            ?
            <div
              className='bg-dark p-1 dashboard-report-manage-btn-wraper'
            >
              <i
                title={Localization.settings}
                className="fa fa-cog fa-2x dashboard-report-manage-btn"
                onClick={() => this.reportManagerModalShow_handler()}
              ></i>
            </div>
            :
            undefined
        }
        <div className="row">
          <div className="col-12">
            <h2>{Localization.dashboard}</h2>
          </div>
        </div>
        {
          permissionChecker.is_allow_item_render([T_ITEM_NAME.dashboard], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true
            ?
            <>
              {this.render_reports_func()}
              <DashboardReportsManageModal
                modalShow={this.state.reportManagerModalShow}
                firstList={this.state.report_cmp_status}
                onHide={(newList) => this.reportManagerModal_seter(newList)}
              />
            </>
            :
            undefined
        }
        <ToastContainer {...this.getNotifyContainerConfig()} />
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
    // token: state.token,
  };
};

export const Dashboard = connect(
  state2props,
  dispatch2props
)(DashboardComponent);