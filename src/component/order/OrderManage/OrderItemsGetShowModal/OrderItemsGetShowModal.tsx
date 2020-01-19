import React, { Fragment } from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { redux_state } from '../../../../redux/app_state';
import { BaseComponent } from '../../../_base/BaseComponent';
import { Dispatch } from 'redux';
import { TInternationalization } from '../../../../config/setup';
import { Localization } from '../../../../config/localization/localization';
import { BtnLoader } from '../../../form/btn-loader/BtnLoader';
import { Modal } from 'react-bootstrap';
import { IPerson } from '../../../../model/model.person';
import { IBook } from '../../../../model/model.book';
import { permissionChecker } from '../../../../asset/script/accessControler';
import { T_ITEM_NAME, CHECKTYPE, CONDITION_COMBINE } from '../../../../enum/T_ITEM_NAME';
import { OrderService } from '../../../../service/service.order';

interface IProps {
    internationalization: TInternationalization;
    modalShow: boolean;
    onHide: () => void;
    order_id: string;
}

interface IState {
    selectedOrderList: {
        total_price: number;
        person: {
            label: string;
            value: IPerson;
        };
        items: {
            count: number;
            book: IBook;
        }[];
    } | undefined;
    fetchOrderById_request_has_error: boolean;
    reTryBtnLoader: boolean;
}


class OrderItemsGetShowModalComponent extends BaseComponent<IProps, IState> {
    state = {
        selectedOrderList: undefined,
        fetchOrderById_request_has_error: false,
        reTryBtnLoader: false
    }

    private _orderService = new OrderService();

    componentDidMount() {
        this.setState({ ...this.state, selectedOrderList: undefined }, () => this.fetchOrderById(this.props.order_id));
    }

    componentWillUnmount() {
        this.setState({ ...this.state, selectedOrderList: undefined })
    }

    async fetchOrderById(order_id: string) {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.orderManageShowOrderTool], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
            return;
        }
        this.setState({ ...this.state, reTryBtnLoader: true });
        let res = await this._orderService.getOrder_items(order_id).catch(error => {
            this.setState({ ...this.state, fetchOrderById_request_has_error: true, reTryBtnLoader: false });
            this.handleError({ error: error.response, toastOptions: { toastId: 'fetchOrderById_error' } });
        });

        if (res) {
            let list = res.data.result;

            const order_items: { count: number, book: IBook }[] = [];
            list.forEach((item: any) => {
                order_items.push({
                    book: item.book,
                    count: item.count
                });
            });

            const order: {
                total_price: number;
                person: {
                    label: string;
                    value: IPerson;
                };
                items: {
                    count: number;
                    book: IBook;
                }[];
            } = {
                total_price: list[0].order.total_price,
                person: {
                    label: this.getUserFullName(list[0].order.person),
                    value: list[0].order.person,
                },
                items: order_items
            }

            this.setState({ ...this.state, selectedOrderList: order, fetchOrderById_request_has_error: false, reTryBtnLoader: false });
        }
    }

    returner_retry_modal_content(order_data: { total_price: number, person: { label: string, value: IPerson }, items: { count: number, book: IBook }[] } | undefined) {
        return (
            <>
                {
                    order_data !== undefined
                        ?
                        <Modal show={this.props.modalShow} onHide={() => this.props.onHide()}>
                            <Modal.Body>
                                <p className="delete-modal-content">
                                    <span className="text-muted">{Localization.Customer_Specifications}:&nbsp;</span>
                                    <p>{Localization.full_name + ": " + order_data.person.label}</p>
                                    <p>
                                        {
                                            <div className="white-content">
                                                <table className="table table-hover table-sm table-bordered bg-white text-dark">
                                                    <thead className="thead-light">
                                                        <tr className="table-light">
                                                            <th className="font-weight-bold" scope="col">{Localization.title}</th>
                                                            <th className="font-weight-bold" scope="col">{Localization.count}</th>
                                                            <th className="font-weight-bold" scope="col">{Localization.price}</th>
                                                            <th className="font-weight-bold" scope="col">{Localization.total_price}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            order_data.items.map((item, index) => (
                                                                <Fragment key={index}>
                                                                    {
                                                                        <tr>
                                                                            <td className="text-nowrap-ellipsis max-w-100px">{item.book.title}</td>
                                                                            <td className="">{item.count}</td>
                                                                            <td className="">{item.book.price}</td>
                                                                            <td className="">{item.book.price! * item.count}</td>
                                                                        </tr>
                                                                    }
                                                                </Fragment>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                                <p className="pull-right">
                                                    {Localization.Total_purchase}:&nbsp;<span>{order_data.total_price}</span>
                                                </p>
                                            </div>
                                        }
                                    </p>
                                </p>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.props.onHide()}>{Localization.close}</button>
                            </Modal.Footer>
                        </Modal>
                        :
                        this.state.fetchOrderById_request_has_error === true
                            ?
                            <Modal show={this.props.modalShow} onHide={() => this.props.onHide()}>
                                <Modal.Header>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="row">
                                        <div className="col-12">
                                            <p className="text-center text-dark mt-1">
                                                <i className="fa fa-exclamation-triangle fa-3x text-danger"></i>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <p className="text-center text-dark my-1">
                                                {Localization.msg.ui.msg5}
                                            </p>
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.props.onHide()}> {Localization.close} </button>
                                    <BtnLoader
                                        loading={this.state.reTryBtnLoader}
                                        btnClassName="btn btn-system shadow-default shadow-hover"
                                        onClick={() => this.fetchOrderById(this.props.order_id)}
                                    >
                                        {Localization.retry}
                                    </BtnLoader>
                                </Modal.Footer>
                            </Modal>
                            :
                            <Modal show={this.props.modalShow} onHide={() => this.props.onHide()}>
                                <Modal.Header className="row d-flex justify-content-center">
                                    <div className="rounded-circle border border-primary spin-upload w-100px h-100px text-center pt-3"></div>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="my-1 text-dark">
                                        {Localization.loading_with_dots}
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.props.onHide()}> {Localization.close} </button>
                                </Modal.Footer>
                            </Modal>
                }
            </>
        )
    }


    ////////   end crate quick person  //////////

    render() {
        return (
            <>
                {this.returner_retry_modal_content(this.state.selectedOrderList)}
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

export const OrderItemsGetShowModal = connect(
    state2props,
    dispatch2props
)(OrderItemsGetShowModalComponent);