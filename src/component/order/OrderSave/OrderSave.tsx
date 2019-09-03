import React from 'react';
import { PersonService } from "../../../service/service.person";
import { History } from 'history';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { Localization } from '../../../config/localization/localization';
import { IToken } from '../../../model/model.token';
import { ToastContainer } from 'react-toastify';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { IPerson } from '../../../model/model.person';
import AsyncSelect from 'react-select/async';
import { OrderItems } from '../OrderItems/OrderItems';
import { OrderService } from '../../../service/service.order';

enum SAVE_MODE {
    CREATE = 'CREATE',
    EDIT = 'EDIT',
    DELETE = "DELETE"
}

interface IState {
    // user: any;//IUser | undefined;
    order :{
        person: {
            value: { label: string, value: IPerson } | undefined | null; // IPerson | any,
            isValid: boolean
        };
        order_items: {
            value: { role: string, person: IPerson }[] | any,
            isValid: boolean
        };
    }
    isFormValid: boolean;
    saveMode: SAVE_MODE;
    createLoader: boolean;
    updateLoader: boolean;
    saveBtnVisibility: boolean;
}
interface IProps {
    match: any;
    history: History;
    internationalization: TInternationalization;
    token: IToken;
}

class OrderSaveComponent extends BaseComponent<IProps, IState> {

    state = {
        order :{
            person: {
                value: undefined,
                isValid: false,
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
        saveBtnVisibility: false,
    }

    private _orderService = new OrderService();
    private _personService = new PersonService();
    private order_id: string | undefined;

    componentDidMount() {
        this._orderService.setToken(this.props.token);
        this._personService.setToken(this.props.token);

        if (this.props.match.path.includes('/order/:order_id/edit')) {
            this.setState({ ...this.state, saveMode: SAVE_MODE.EDIT });
            this.order_id = this.props.match.params.user_id;
            this.fetchOrderById(this.props.match.params.user_id);
        }
    }

    async fetchOrderById(user_id: string) {
        let res = await this._orderService.byId(user_id).catch(error => {
            this.handleError({ error: error.response });
        });
        // await this.__waitOnMe();
        if (res) {
            this.setState({
                ...this.state,
                order: {
                    ...this.state.order,
                    person: { ...this.state.order.person, value: res.data.person, isValid: true },
                    order_items: { ...this.state.order.order_items, value: res.data.oredr_items, isValid: true },

                },
                saveBtnVisibility: true
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

    handlePersonChange = (selectedPerson: { label: string, value: IPerson }) => {
        let newperson = { ...selectedPerson };
        let isValid = true;      // newperson = selectedPerson;
        this.setState({
            ...this.state, order: {
                ...this.state.order, person: {
                    ...this.state.order.person,
                    value: newperson,
                    isValid:true,
                },
            },
            isFormValid: this.checkFormValidate(isValid, 'person')
        })
    }




    //  check form validation for avtive button

    checkFormValidate(isValid: boolean, inputType: any): boolean {
        let valid = true;
        let userObj: any = { ...this.state.order };

        for (let i = 0; i < Object.keys(this.state.order).length; i++) {
            let IT = Object.keys(this.state.order)[i];
            if (IT !== inputType) {
                valid = valid && userObj[IT].isValid;
                if (!userObj[IT].isValid) {
                    break;
                }
            }
        }
        valid = valid && isValid;
        return valid;
    }


    // add user function 

    async create() {
        this.setState({ ...this.state, createLoader: true });
        const neworder = {
            // person_id: "string",
            /*order_items :{
                book_id:"string",
                count : number,
            }[]
            */
        }

        let res = await this._orderService.create(neworder).catch(error => {
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

        const newOrder = {
            // person_id: "string",
            /*order_items :{
                book_id:"string",
                count : number,
            }[]
            */
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

    ////////// navigation function //////////////////

    backTO() {
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
            filter = { person: inputValue };
        }
        let res: any = await this._personService.search(10, 0, filter).catch(err => {
            let err_msg = this.handleError({ error: err.response, notify: false });
            this.personRequstError_txt = err_msg.body;
        });

        if (res) {
            let persons = res.data.result.map((ps: any) => {
                return { label: this.getPersonFullName(ps), value: ps }
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


    /////////////////////////////////////


    bookRollChange(list: any[], isValid: boolean) {
        this.setState({
            ...this.state,
            order: {
                ...this.state.order, order_items: { value: list, isValid: isValid }
            }
            , isFormValid: this.checkFormValidate(isValid, 'order-items')
        })
    }

    // reset form /////////////

    resetForm() {
        this.setState({
            ...this.state,
            order: {
                person: { value: null, isValid: false },
                order_items: { value: undefined, isValid: false },
            },
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
                                    <div className="col-md-3 col-sm-6">
                                        <label >{Localization.person}{<span className="text-danger">*</span>}</label>
                                        <AsyncSelect
                                            placeholder={Localization.person}
                                            cacheOptions
                                            defaultOptions
                                            value={this.state.order.person.value}
                                            loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback)}
                                            noOptionsMessage={(obj) => this.select_noOptionsMessage(obj)}
                                            onChange={(selectedPerson: any) => this.handlePersonChange(selectedPerson)}
                                        />
                                    </div>
                                    <div className="col-md-6 col-sm-6">
                                        <OrderItems
                                            defaultValue={this.state.order.order_items.value}
                                            onChange={(list, isValid) => this.bookRollChange(list, isValid)}
                                            required
                                            label={Localization.order}
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
                                                <>
                                                    {
                                                        this.state.saveBtnVisibility ?
                                                            <BtnLoader
                                                                btnClassName="btn btn-info shadow-default shadow-hover"
                                                                loading={this.state.updateLoader}
                                                                onClick={() => this.update()}
                                                                disabled={!this.state.isFormValid}
                                                            >
                                                                {Localization.update}
                                                            </BtnLoader>
                                                            : ''
                                                    }
                                                </>

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