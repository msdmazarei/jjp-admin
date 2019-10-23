import React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Modal } from "react-bootstrap";
import { TInternationalization } from '../../config/setup';
import { BaseComponent } from '../_base/BaseComponent';
import { redux_state } from '../../redux/app_state';
import { Localization } from '../../config/localization/localization';

interface IState {
}

interface IProps {
    internationalization: TInternationalization;
    modalShow: boolean;
    firstList: string[];
    onHide: (array: string[]) => void;
}

class DashboardReportsManageModalComponent extends BaseComponent<IProps, IState> {
    state = {
        firstList: []
    }

    componentWillReceiveProps() {
        this.setState({
            ...this.state,
            firstList: this.props.firstList
        })
    }

    onHide() {
        this.props.onHide(this.state.firstList);
    }

    state_toggle_change_handle(Index: number) {
        let newArray:string[] = this.state.firstList;
        if (newArray.length === 0){
            return;
        }
        if (newArray.length >0 && newArray[Index] === 'true') {
            newArray.splice(Index,1,'false');
            this.setState({
                ...this.state,
                firstList :newArray,
            })
        }else{
            newArray.splice(Index,1,'true');
            this.setState({
                ...this.state,
                firstList :newArray,
            })
        }
        console.log(this.state.firstList)
    }


    render_quick_person() {
        return (
            <>
                <Modal className="dashboard-reports-manage-modal" show={this.props.modalShow} onHide={() => this.onHide()}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-12">
                                <div className="text-center text-dark">{Localization.settings + " " + Localization.report}</div>
                            </div>
                            <div className="form-group">
                                <div className="mx-3">
                                    <input type="checkbox" className="app-checkbox"
                                        id={"0"}
                                        onChange={() => this.state_toggle_change_handle(0)}
                                    />
                                    {
                                        this.state.firstList[0] === 'true'
                                            ?
                                            <label className="check-mark"  htmlFor={"0"}></label>
                                            :
                                            <label  htmlFor={"0"}></label>
                                    }
                                    <label htmlFor={"0"}>
                                        <h6 className="text-dark ml-2">{Localization.name_of_report.ten_Recent_Comments}</h6>
                                    </label>
                                </div>
                                <div className="mx-3">
                                    <input type="checkbox" className="app-checkbox"
                                        id={"1"}
                                        onChange={() => this.state_toggle_change_handle(1)}
                                    />
                                    {
                                        this.state.firstList[1] === 'true'
                                            ?
                                            <label className="check-mark" htmlFor={"1"}></label>
                                            :
                                            <label htmlFor={"1"}></label>
                                    }
                                    <label htmlFor={"1"}>
                                        <h6 className="text-dark ml-2">{Localization.name_of_report.The_best_selling_and_least_selling_of_recent_weeks_and_months}</h6>
                                    </label>
                                </div>
                                <div className="mx-3">
                                    <input type="checkbox" className="app-checkbox"
                                        id={"2"}
                                        onChange={() => this.state_toggle_change_handle(2)}
                                    />
                                    {
                                        this.state.firstList[2] === 'true'
                                            ?
                                            <label className="check-mark" htmlFor={"2"}></label>
                                            :
                                            <label htmlFor={"2"}></label>
                                    }
                                    <label htmlFor={"2"}>
                                        <h6 className="text-dark ml-2">{Localization.name_of_report.fifteen_books_have_recently_been_sold_by_type}</h6>
                                    </label>
                                </div>
                                <div className="mx-3">
                                    <input type="checkbox" className="app-checkbox"
                                        id={"3"}
                                        onChange={() => this.state_toggle_change_handle(3)}
                                    />
                                    {
                                        this.state.firstList[3] === 'true'
                                            ?
                                            <label className="check-mark" htmlFor={"3"}></label>
                                            :
                                            <label htmlFor={"3"}></label>
                                    }
                                    <label htmlFor={"3"}>
                                        <h6 className="text-dark ml-2">{Localization.name_of_report.Monthly_sale_seasonal_and_yearly}</h6>
                                    </label>
                                </div>
                                <div className="mx-3">
                                    <input type="checkbox" className="app-checkbox"
                                        id={"4"}
                                        onChange={() => this.state_toggle_change_handle(4)}
                                    />
                                    {
                                        this.state.firstList[4] === 'true'
                                            ?
                                            <label className="check-mark" htmlFor={"4"}></label>
                                            :
                                            <label htmlFor={"4"}></label>
                                    }
                                    <label htmlFor={"4"}>
                                        <h6 className="text-dark ml-2">{Localization.name_of_report.Compare_publishers_sales_by_time_period}</h6>
                                    </label>
                                </div>
                                <div className="mx-3">
                                    <input type="checkbox" className="app-checkbox"
                                        id={"5"}
                                        onChange={() => this.state_toggle_change_handle(5)}
                                    />
                                    {
                                        this.state.firstList[5] === 'true'
                                            ?
                                            <label className="check-mark" htmlFor={"5"}></label>
                                            :
                                            <label htmlFor={"5"}></label>
                                    }
                                    <label htmlFor={"5"}>
                                        <h6 className="text-dark ml-2">{Localization.name_of_report.User_to_customer_conversion_process_chart}</h6>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }


    render() {
        return (
            <>
                {this.render_quick_person()}
            </>
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

export const DashboardReportsManageModal = connect(
    state2props,
    dispatch2props
)(DashboardReportsManageModalComponent);