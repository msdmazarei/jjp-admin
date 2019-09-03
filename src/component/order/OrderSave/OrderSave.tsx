import React, { Fragment } from 'react';
import { History } from 'history';
import { IPerson } from '../../../model/model.person';
import { OrderItems } from "../OrderItems/OrderItems";
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { Localization } from '../../../config/localization/localization';
import { IToken } from '../../../model/model.token';
import { ToastContainer, toast } from 'react-toastify';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { IBook } from '../../../model/model.book';
import { OrderService } from '../../../service/service.order';
import { PersonService } from '../../../service/service.person';

enum SAVE_MODE {
    CREATE = 'CREATE',
    EDIT = 'EDIT',
    DELETE = "DELETE"
}
  
interface IState { 
    // book: any;//IBook | undefined;
    order: {
        person_id: {
            value: string | undefined;
            isValid: boolean;
        };
        order_items: {
            value: { count: number, book: IBook }[] | any,
            isValid: boolean
        };
    };
    isFormValid: boolean;
    saveMode: SAVE_MODE;
    createLoader: boolean;
    updateLoader: boolean;
}
interface IProps {
    match: any;
    history: History;
    internationalization: TInternationalization;
    token: IToken;
}

class OrderSaveComponent extends BaseComponent<IProps, IState> {

    state = {
        order: {
            person_id: {
                value: undefined,
                isValid: true
            },
            order_items: {
                value: undefined,
                isValid: false
            },
        },
        isFormValid: false,
        saveMode: SAVE_MODE.CREATE,
        createLoader: false,
        updateLoader: false,
    }


    private _orderService = new OrderService();
    private _personService = new PersonService();
    private order_id: string | undefined;

    componentDidMount() {
        this._orderService.setToken(this.props.token);
        this._personService.setToken(this.props.token);

        if (this.props.match.path.includes('/order/:order_id/edit')) {
            // this.saveMode = "edit";
            this.setState({ ...this.state, saveMode: SAVE_MODE.EDIT });
            this.order_id = this.props.match.params.order_id;
            this.fetchOrderById(this.props.match.params.order_id);
        }
    }

    async fetchOrderById(order_id: string) {
        let res = await this._orderService.byId(order_id).catch(error => {
            this.handleError({ error: error.response });
        });
        // await this.__waitOnMe();
        if (res) {
            this.setState({
                ...this.state,
                order: {
                    ...this.state.order,
                    person_id: { ...this.state.order.person_id, value: res.data.person_id, isValid: true },
                    order_items: { ...this.state.order.order_items, value: res.data.order_items, isValid: true },
                }
            })
        }

    }

    __waitOnMe() {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res(true)
            }, 0)
        });
    }

    // on change functions 

    handleInputChange(value: any, isValid: boolean, inputType: any) {
        this.setState({
            ...this.state,
            order: {
                ...this.state.order, [inputType]: { value, isValid }
            }
            , isFormValid: this.checkFormValidate(isValid, inputType)
        })
    }

    handleSelectInputChange(value: any[], inputType: any, required: boolean = true) {
        let isValid;
        if ((!value || !value.length) && required) {
            isValid = false;
        } else {
            isValid = true;
        }
        this.setState({
            ...this.state,
            order: {
                ...this.state.order, [inputType]: { value: value || [], isValid: isValid }
            }
            , isFormValid: this.checkFormValidate(isValid, inputType)
        })

    }

    bookRollChange(list: any[], isValid: boolean) {
        this.setState({
            ...this.state,
            order: {
                ...this.state.order, order_items: { value: list, isValid: isValid }
            }
            , isFormValid: this.checkFormValidate(isValid, 'order_items')
        })
    }

    //  check form validation for avtive button

    checkFormValidate(isValid: boolean, inputType: any): boolean {
        let valid = true;
        let bookObj: any = { ...this.state.order };

        for (let i = 0; i < Object.keys(this.state.order).length; i++) {
            let IT = Object.keys(this.state.order)[i];
            if (IT !== inputType) {
                valid = valid && bookObj[IT].isValid;
                if (!bookObj[IT].isValid) {
                    break;
                }
            }
        }
        valid = valid && isValid;
        return valid;
    }
   

    // add book function 

    async create() {
        if (!this.state.isFormValid) return;
        this.setState({ ...this.state, createLoader: true });
      
        let roleList = (this.state.order.order_items.value || []).map((item: any) => { return { count: item.count, book_id: { id: item.book.id } } });

        const newOrder = {
            person_id: this.state.order.person_id.value,
            roles: roleList,
        }
        let res = await this._orderService.create(newOrder).catch(error => {
            this.handleError({ error: error.response });
        });
        this.setState({ ...this.state, createLoader: false });
        if (res) {
            this.apiSuccessNotify();
            this.resetForm();
        }
    }

    async update() {
        if (!this.state.isFormValid) return;
        this.setState({ ...this.state, updateLoader: true });

        let roleList = (this.state.order.order_items.value || []).map((item: any) => { return { count: item.count, book_id: { id: item.book.id } } });

        const newOrder = {
            person_id: this.state.order.person_id.value,
            roles: roleList,
        }
        let res = await this._orderService.update(newOrder, this.order_id!).catch(e => {
            this.handleError({ error: e.response });
        });
        this.setState({ ...this.state, updateLoader: false });
        if (res) {
            this.props.history.push('/order/manage');
            this.apiSuccessNotify();
        }
    }

    ////////////////// navigatin func ///////////////////////

    backTO() {
        this.gotoOrderManage();
    }

    gotoOrderManage() {
        this.props.history.push('/order/manage'); // /admin
    }

    /////////// reset form /////////////

    resetForm() {
        this.setState({
            ...this.state,
            order: {
                person_id: { value: undefined, isValid: true },
                order_items: { value: undefined, isValid: false },
            },
            isFormValid: false,
        })
    }

    /////////////////// render ////////////////////////

    render() {
        return (
            <>
                <div className="content">
                    <div className="row">
                        <div className="col-12">
                            <div className="template-box">
                                <div className="">
                                    {
                                        this.state.saveMode === SAVE_MODE.CREATE
                                            ?
                                            <h2 className="text-bold text-dark">{Localization.create_book}</h2>
                                            :
                                            <h2 className="text-bold text-dark">{Localization.book_update}</h2>
                                    }
                                </div>
                                {/* start give data by inputs */}
                                <div className="row">
                                    <div className="col-md-6 col-sm-12">
                                        <OrderItems
                                            defaultValue={this.state.order.order_items.value}
                                            onChange={(list, isValid) => this.bookRollChange(list, isValid)}
                                            required
                                            label={Localization.roles}
                                        ></OrderItems>
                                    </div>
                                </div>
                                {/* end of give data by inputs */}
                                <div className="d-flex justify-content-between mt-4">
                                    <div className="mr-0 pr-0">
                                        {
                                            this.state.saveMode === SAVE_MODE.CREATE
                                                ?
                                                <>
                                                    <BtnLoader
                                                        btnClassName="btn btn-success shadow-default shadow-hover"
                                                        loading={this.state.createLoader}
                                                        onClick={() => this.create()}
                                                        disabled={!this.state.isFormValid}
                                                    >
                                                        {Localization.create}
                                                    </BtnLoader>
                                                    <BtnLoader
                                                        btnClassName="btn btn-warning shadow-default shadow-hover ml-3"
                                                        loading={false}
                                                        onClick={() => this.resetForm()}
                                                        disabled={false}
                                                    >
                                                        {Localization.reset}
                                                    </BtnLoader>
                                                </>
                                                :
                                                <BtnLoader
                                                    btnClassName="btn btn-info shadow-default shadow-hover"
                                                    loading={this.state.updateLoader}
                                                    onClick={() => this.update()}
                                                    disabled={!this.state.isFormValid}
                                                >
                                                    {Localization.update}
                                                </BtnLoader>
                                        }
                                    </div>
                                    <BtnLoader
                                        btnClassName="btn btn-primary shadow-default shadow-hover"
                                        loading={false}
                                        onClick={() => this.backTO()}
                                        disabled={false}
                                    >
                                        {Localization.back}
                                    </BtnLoader>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer {...this.getNotifyContainerConfig()} />
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
        token: state.token,
    };
};

export const OrderSave = connect(
    state2props,
    dispatch2props
)(OrderSaveComponent);