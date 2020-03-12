import React from "react";
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { redux_state } from "../../../redux/app_state";
import { IUser } from "../../../model/model.user";
import { TInternationalization } from "../../../config/setup";
import { BaseComponent } from "../../_base/BaseComponent";
import { History } from "history";
import { ToastContainer } from "react-toastify";
import { NETWORK_STATUS } from "../../../enum/NetworkStatus";

interface IProps {
  logged_in_user: IUser | null;
  internationalization: TInternationalization;
  history: History;
  network_status: NETWORK_STATUS;
}

interface IState {
}

class DashboardComponent extends BaseComponent<IProps, IState> {
  state = {
  };

  render() {
    return (
      <>
        <div>catod admin dashboard</div>

        <ToastContainer {...this.getNotifyContainerConfig()} />
      </>
    );
  }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
  return {
  };
};

const state2props = (state: redux_state) => {
  return {
    logged_in_user: state.logged_in_user,
    internationalization: state.internationalization,
    network_status: state.network_status,
  };
};

export const Dashboard = connect(
  state2props,
  dispatch2props
)(DashboardComponent);
