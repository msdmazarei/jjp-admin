import React from 'react';
import { PersonService } from "../../../service/service.person";
import { History } from 'history';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { Localization } from '../../../config/localization/localization';
// import { IToken } from '../../../model/model.token';
import { ToastContainer } from 'react-toastify';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { IPerson } from '../../../model/model.person';
import AsyncSelect from 'react-select/async';
import { OrderItems } from '../OrderItems/OrderItems';
import { OrderService } from '../../../service/service.order';
import { IBook } from '../../../model/model.book';
import { PriceService } from '../../../service/service.price';
import { QuickPerson } from '../../person/QuickPerson/QuickPerson';
import { permissionChecker } from '../../../asset/script/accessControler';
import { T_ITEM_NAME, CHECKTYPE, CONDITION_COMBINE } from '../../../enum/T_ITEM_NAME';

enum SAVE_MODE {
    CREATE = 'CREATE',
    EDIT = 'EDIT',
    DELETE = "DELETE"
}

interface IState {
    // order: {
    // person_id: {
    //     value: string | undefined;
    //     isValid: boolean
    // }
    person: {
        value: { label: string, value: IPerson } | any; // IPerson | any,
        isValid: boolean
    };
    order_items: {
        value: { count: number, book: IBook }[] | any,
        isValid: boolean
    };
    // }
    isFormValid: boolean;
    saveMode: SAVE_MODE;
    createLoader: boolean;
    updateLoader: boolean;
    saveBtnVisibility: boolean;
    fetchPrice_loader: boolean;
    totalPrice: number | string;
    quickPersonModalStatus: boolean;
}
interface IProps {
    match: any;
    history: History;
    internationalization: TInternationalization;
    // token: IToken;
}

class OrderSaveComponent extends BaseComponent<IProps, IState> {

    state = {
        // order: {
        // person_id: {
        //     value: undefined,
        //     isValid: false,
        // },
        person: {
            value: undefined,
            isValid: false,
        },
        order_items: {
            value: [],
            isValid: false
        },
        // },
        isFormValid: false,
        saveMode: SAVE_MODE.CREATE,
        createLoader: false,
        updateLoader: false,
        saveBtnVisibility: false,
        fetchPrice_loader: false,
        totalPrice: 0,
        quickPersonModalStatus: false,
    }

    private _orderService = new OrderService();
    private _personService = new PersonService();
    private _priceService = new PriceService();
    private order_id: string | undefined;

    componentDidMount() {
        if (this.props.match.path.includes('/order/:order_id/edit')) {
            if (permissionChecker.is_allow_item_render([T_ITEM_NAME.orderEdit],CHECKTYPE.ONE_OF_ALL,CONDITION_COMBINE.DOSE_NOT_HAVE) === true) {
                this.setState({ ...this.state, saveMode: SAVE_MODE.EDIT });
                this.order_id = this.props.match.params.order_id;
                this.fetchOrderById(this.props.match.params.order_id);
            } else {
                this.noAccessRedirect(this.props.history);
            }
        } else {
            if (permissionChecker.is_allow_item_render([T_ITEM_NAME.orderSave],CHECKTYPE.ONE_OF_ALL,CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
                this.noAccessRedirect(this.props.history);
            }
        }
    }

    async fetchOrderById(order_id: string) {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.orderEdit],CHECKTYPE.ONE_OF_ALL,CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
            return;
        }
        let res = await this._orderService.getOrder_items(order_id).catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'fetchOrderByIdEdit_error' } });
        });
        if (res) {
            let list = res.data.result;

            const order_items: { value: { count: number, book: IBook, id: string; }[], isValid: boolean } = { value: [], isValid: true };
            list.forEach((item) => {
                // order_obj.order_items.value.push({
                order_items.value.push({
                    book: item.book,
                    count: item.count,
                    id: item.id
                });
            });

            // order_obj.order_items.isValid = true;

            this.setState({
                ...this.state,
                // order: order_obj,
                person: { value: { value: list[0].order.person, label: this.getPersonFullName(list[0].order.person) }, isValid: true },
                order_items: order_items,
                saveBtnVisibility: true
            })
        }

    }


    // on change functions 


    handlePersonChange = (selectedPerson: { label: string, value: IPerson }) => {
        let newperson = { ...selectedPerson };
        let isValid = true;      // newperson = selectedPerson;
        this.setState({
            ...this.state, person: {
                ...this.state.person,
                value: newperson,
                isValid: true,
            },
            isFormValid: this.checkFormValidate(isValid, 'person'),
        }, () => {
            this.fetchPrice();
        });
        // this.fetchPrice();
    }

    orderItemsChange(list: any[], isValid: boolean) {
        this.setState(
            {
                ...this.state, order_items: { value: list, isValid: isValid },
                isFormValid: this.checkFormValidate(isValid, 'order-items')
            }, () => {
                this.fetchPrice();
            }
        );

    }



    //  check form validation for avtive button

    checkFormValidate(isValid: boolean, inputType: any): boolean {
        let valid = true;
        if (inputType === "order-items") {
            valid = valid && this.state.person.isValid;
            if (!this.state.person.isValid) {
                return false;
            }
        }
        if (inputType === "person") {
            valid = valid && this.state.order_items.isValid;
            if (!this.state.order_items.isValid) {
                return false;
            }
        }
        valid = valid && isValid;
        // if (valid) {
        //     this.fetchPrice();
        // }
        return valid;

        // for (let i = 0; i < Object.keys(this.state).length; i++) {
        //     let IT = Object.keys(this.state)[i];
        //     if (IT !== inputType) {
        //         valid = valid && orderObj[IT].isValid;
        //         if (!orderObj[IT].isValid) {
        //             break;
        //         }
        //     }
        // }
        // valid = valid && isValid;
        // return valid;
    }


    // add order function 

    async create() {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.orderSave],CHECKTYPE.ONE_OF_ALL,CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
            return;
        }
        if (!this.state.isFormValid) return;
        this.setState({ ...this.state, createLoader: true });

        const person: { label: string, value: IPerson } = this.state.person.value!;
        const newOrder = {
            person_id: person!.value.id,
            items: this.state.order_items.value.map((oi: { count: number, book: IBook }) => {
                return {
                    book_id: oi.book.id,
                    count: oi.count,
                }
            })
        }

        let res = await this._orderService.create(newOrder).catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'createOrder_error' } });
        });
        this.setState({ ...this.state, createLoader: false });

        if (res) {
            this.apiSuccessNotify();
            this.resetForm();
        }
    }

    async update() {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.orderEdit],CHECKTYPE.ONE_OF_ALL,CONDITION_COMBINE.DOSE_NOT_HAVE) === false) {
            return;
        }
        this.setState({ ...this.state, updateLoader: true });
        if (this.state.order_items.value === []) {
            return;
        }
        const person: { label: string, value: IPerson } = this.state.person.value!;
        const newOrder = {
            person_id: person!.value.id,
            items: this.state.order_items.value.map((oi: { count: number, book: IBook }) => {
                return {
                    book_id: oi.book.id,
                    count: oi.count,
                }
            })
        }

        let res = await this._orderService.update(newOrder, this.order_id!).catch(e => {
            this.handleError({ error: e.response, toastOptions: { toastId: 'updateOrder_error' } });
        });
        this.setState({ ...this.state, updateLoader: false });
        if (res) {
            this.props.history.push('/order/manage');
            this.apiSuccessNotify();
        }

    }

    ////////// navigation function //////////////////

    backTO() {
        if(permissionChecker.is_allow_item_render([T_ITEM_NAME.orderManage],CHECKTYPE.ONE_OF_ALL,CONDITION_COMBINE.DOSE_NOT_HAVE) === false){
            return;
        }
        this.gotoOrderManage();
    }

    gotoOrderManage() {
        this.props.history.push('/order/manage');
    }

    ////// request for person ////////

    private personRequstError_txt: string = Localization.no_item_found;

    async promiseOptions2(inputValue: any, callBack: any) {
        let filter = undefined;
        if (inputValue) {
            filter = { full_name: { $prefix: inputValue } };
        }
        let res: any = await this._personService.search(10, 0, filter).catch(err => {
            let err_msg = this.handleError({ error: err.response, notify: false, toastOptions: { toastId: 'promiseOptions2OrderSaveAndEdit_error' } });
            this.personRequstError_txt = err_msg.body;
        });

        if (res) {
            let persons = res.data.result.map((ps: any) => {
                return { label: ps.cell_no ? (this.getPersonFullName(ps) + " - " + ps.cell_no) : this.getPersonFullName(ps), value: ps }
            });
            this.personRequstError_txt = Localization.no_item_found;
            callBack(persons);
        } else {
            callBack();
        }
    }

    private setTimeout_person_val: any;
    debounce_300(inputValue: any, callBack: any) {
        if (this.setTimeout_person_val) {
            clearTimeout(this.setTimeout_person_val);
        }
        this.setTimeout_person_val = setTimeout(() => {
            this.promiseOptions2(inputValue, callBack);
        }, 1000);
    }

    select_noOptionsMessage(obj: { inputValue: string }) {
        return this.personRequstError_txt;
    }



    /////  start calc total price by person_id & items list /////

    private async fetchPrice(toastError: boolean = true) {
        if (!this.state.isFormValid) return;
        if (!this.state.person.value === undefined || this.state.order_items.value === []) return;

        this.setState({ ...this.state, fetchPrice_loader: true });

        let order_items = this.state.order_items.value.map((oi: { count: number, book: IBook }) => {
            return {
                book_id: oi.book.id,
                count: oi.count,
            }
        })
        const person: { label: string, value: IPerson } = this.state.person.value!;
        const person_id: string = person!.value.id;

        let res_fetchPrice = await this._priceService.calcPrice(order_items, person_id).catch(error => {
            let msgObj = this.handleError({ error: error.response, notify: toastError, toastOptions: { toastId: 'fetchTotalPrice_error' } });
            this.setState({ ...this.state, fetchPrice_loader: false, totalPrice: msgObj.body });
        });

        // this.setState({ ...this.state, fetchPrice_loader: false });

        if (res_fetchPrice) {
            this.setState({ ...this.state, totalPrice: res_fetchPrice.data.total_price, fetchPrice_loader: false });
        }

    }

    totalPrice_render() {
        // this.state.totalPrice.toLocaleString()
        if (typeof this.state.totalPrice === 'string') {
            return <small className="text-danger">{this.state.totalPrice}</small>
        } else {
            return (this.state.totalPrice || '').toLocaleString();
        }
    }

    /////  end calc total price by person_id & items list /////


    ////////   start crate quick person  //////////

    quickpersonOpen() {
        this.setState({
            ...this.state,
            quickPersonModalStatus: true,
        })

    }

    quickpersonClose() {
        this.setState({
            ...this.state,
            quickPersonModalStatus: false,
        })
    }

    seterPerson(person: IPerson) {
        const createdPerson:
            { label: string, value: IPerson } =
        {
            label: person.cell_no ? (this.getPersonFullName(person) + " - " + person.cell_no) : this.getPersonFullName(person),
            value: person
        }
        let newperson = createdPerson;
        let isValid = true;      // newperson = selectedPerson;
        this.setState({
            ...this.state, person: {
                ...this.state.person,
                value: newperson,
                isValid: true,
            },
            isFormValid: this.checkFormValidate(isValid, 'person'),
        }, () => {
            this.fetchPrice();
        });


    }

    ////////   end crate quick person  //////////


    // reset form /////////////

    resetForm() {
        this.setState({
            ...this.state,
            person: { value: null, isValid: false },
            order_items: { value: undefined, isValid: false },
            isFormValid: false,
        })
    }

    ////// render ////////
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
                                            <h2 className="text-bold text-dark">{Localization.create_order}</h2>
                                            :
                                            <h2 className="text-bold text-dark">{Localization.order_update}</h2>
                                    }
                                </div>
                                {/* start give data by inputs */}
                                <div className="row">
                                    <div className="col-md-6 col-sm-12">
                                        <label >{Localization.person}{<span className="text-danger">*</span>}</label>
                                        {
                                            permissionChecker.is_allow_item_render([T_ITEM_NAME.quickPersonSave],CHECKTYPE.ONE_OF_ALL,CONDITION_COMBINE.DOSE_NOT_HAVE) === true
                                                ?
                                                <i
                                                    title={Localization.Quick_person_creation}
                                                    className="fa fa-plus-circle cursor-pointer text-success mx-1"
                                                    onClick={() => this.quickpersonOpen()}
                                                ></i>
                                                :
                                                undefined
                                        }
                                        <AsyncSelect
                                            placeholder={Localization.person}
                                            cacheOptions
                                            defaultOptions
                                            value={this.state.person.value}
                                            loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback)}
                                            noOptionsMessage={(obj) => this.select_noOptionsMessage(obj)}
                                            onChange={(selectedPerson: any) => this.handlePersonChange(selectedPerson)}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 col-sm-12">
                                        <div className="mt-4">
                                            <OrderItems
                                                defaultValue={this.state.order_items.value}
                                                onChange={(list, isValid) => this.orderItemsChange(list, isValid)}
                                                required
                                                label={Localization.order}
                                            ></OrderItems>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 col-sm-12">
                                        {
                                            <div className="mt-4">
                                                <h4 className="d-inline-block text-muted">{Localization.total_price}: </h4>
                                                {
                                                    !this.state.isFormValid
                                                        ?
                                                        0
                                                        :
                                                        <BtnLoader
                                                            btnClassName="btn py-0"
                                                            loading={this.state.fetchPrice_loader}
                                                            onClick={() => this.fetchPrice()}
                                                        >
                                                            <h4 className="mb-0 text-info">
                                                                {this.totalPrice_render()}
                                                                <small className="ml-3">({Localization.recalculate})</small>
                                                            </h4>
                                                        </BtnLoader>
                                                }

                                            </div>
                                        }

                                    </div>
                                </div>
                                {/* end of give data by inputs */}
                                <div className="d-flex justify-content-between mt-4">
                                    <div className="mr-0 pr-0">
                                        {
                                            this.state.saveMode === SAVE_MODE.CREATE
                                                ?
                                                <>
                                                    {
                                                        permissionChecker.is_allow_item_render([T_ITEM_NAME.orderSave],CHECKTYPE.ONE_OF_ALL,CONDITION_COMBINE.DOSE_NOT_HAVE) === true
                                                            ?
                                                            <BtnLoader
                                                                btnClassName="btn btn-success shadow-default shadow-hover"
                                                                loading={this.state.createLoader}
                                                                onClick={() => this.create()}
                                                                disabled={!this.state.isFormValid}
                                                            >
                                                                {Localization.create}
                                                            </BtnLoader>
                                                            :
                                                            undefined
                                                    }
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
                                                <>
                                                    {
                                                        (permissionChecker.is_allow_item_render([T_ITEM_NAME.orderEdit],CHECKTYPE.ONE_OF_ALL,CONDITION_COMBINE.DOSE_NOT_HAVE) && this.state.saveBtnVisibility)
                                                            ?
                                                            <BtnLoader
                                                                btnClassName="btn btn-info shadow-default shadow-hover"
                                                                loading={this.state.updateLoader}
                                                                onClick={() => this.update()}
                                                                disabled={!this.state.isFormValid}
                                                            >
                                                                {Localization.update}
                                                            </BtnLoader>
                                                            :
                                                            ''
                                                    }
                                                </>

                                        }
                                    </div>
                                    {
                                        permissionChecker.is_allow_item_render([T_ITEM_NAME.orderManage],CHECKTYPE.ONE_OF_ALL,CONDITION_COMBINE.DOSE_NOT_HAVE) === true
                                            ?
                                            <BtnLoader
                                                btnClassName="btn btn-primary shadow-default shadow-hover"
                                                loading={false}
                                                onClick={() => this.backTO()}
                                                disabled={false}
                                            >
                                                {Localization.back}
                                            </BtnLoader>
                                            :
                                            undefined
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer {...this.getNotifyContainerConfig()} />
                {
                    <QuickPerson
                        data={0}
                        onCreate={(person: IPerson, index: number) => this.seterPerson(person)}
                        modalShow={this.state.quickPersonModalStatus}
                        onHide={() => this.quickpersonClose()}
                    ></QuickPerson>
                }
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

export const OrderSave = connect(
    state2props,
    dispatch2props
)(OrderSaveComponent);