import React, { Fragment } from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Modal } from "react-bootstrap";
import { TInternationalization } from '../../config/setup';
import { BaseComponent } from '../_base/BaseComponent';
import { redux_state } from '../../redux/app_state';
import { Localization } from '../../config/localization/localization';
import { TReportName } from '../tool/reports/ReportUtils';

interface IState {
    firstList: string[] | [];
}

interface IProps {
    internationalization: TInternationalization;
    modalShow: boolean;
    firstList: string[];
    onHide: (array: string[]) => void;
}

class DashboardReportsManageModalComponent extends BaseComponent<IProps, IState> {
    state = {
        firstList: [],
    }

    componentWillReceiveProps() {
        this.setState({
            ...this.state,
            firstList: this.props.firstList,
        })
    }

    onHide() {
        this.props.onHide(this.state.firstList);
    }

    state_toggle_change_handle(Index: number) {
        let newArray: string[] = this.state.firstList;
        if (newArray.length === 0) {
            return;
        }
        if (newArray.length > 0 && newArray[Index] === 'true') {
            newArray.splice(Index, 1, 'false');
            this.setState({
                ...this.state,
                firstList: newArray,
            })
        } else {
            newArray.splice(Index, 1, 'true');
            this.setState({
                ...this.state,
                firstList: newArray,
            })
        }
    }

    returner_report_title_name(i: number) {
        if (this.props.firstList.length === 0) {
            return;
        }
        const repObj = Localization.name_of_report;
        let count: number = 0;
        for (let key in repObj) {
            if (count === i) {
                return Localization.name_of_report[key as TReportName];
            } else {
                count++
            }
        }
    }

    returner_report_option() {
        return (
            <>
                {
                    this.state.firstList !== [] && this.props.firstList.map((value: any, i: number) => {
                        return <Fragment key={i}>
                            <div className="mx-3">
                                <input type="checkbox" className="app-checkbox"
                                    id={i.toString()}
                                    onChange={() => this.state_toggle_change_handle(i)}
                                />
                                {
                                    this.state.firstList[i] === 'true'
                                        ?
                                        <>
                                            <i
                                                onClick={() => this.state_toggle_change_handle(i)}
                                                className="fa fa-check-square-o"
                                            >
                                            </i>
                                            <label htmlFor={i.toString()}>
                                                <h6 className="text-dark ml-2 mt-3">{this.returner_report_title_name(i)}</h6>
                                            </label>
                                        </>
                                        :
                                        <>
                                            <i
                                                onClick={() => this.state_toggle_change_handle(i)}
                                                className="fa fa-square-o"
                                            >
                                            </i>
                                            <label htmlFor={i.toString()}>
                                                <h6 className="text-dark ml-2 mt-3">{this.returner_report_title_name(i)}</h6>
                                            </label>
                                        </>
                                }
                            </div>
                        </Fragment>
                    })
                }
            </>
        )
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
                                {this.returner_report_option()}
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