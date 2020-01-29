import React from 'react';
import { History } from 'history';
import { IPerson } from '../../../model/model.person';
import { AppRegex } from '../../../config/regex';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { Localization } from '../../../config/localization/localization';
import { ToastContainer } from 'react-toastify';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { FixNumber } from '../../form/fix-number/FixNumber';
import AsyncSelect from 'react-select/async';
import { PersonService } from '../../../service/service.person';
import { PressAccountingService } from '../../../service/service.pressAccounting';
import { Store2 } from '../../../redux/store';
import { RetryModal } from '../../tool/retryModal/retryModal';
import { IUser } from '../../../model/model.user';
// import { IToken } from '../../../model/model.token';

interface ICmp_select<T> {
    label: string;
    value: T
}

enum SAVE_MODE {
    CREATE = 'CREATE',
    MAINLISTWIZARD = 'MAINLISTWIZARD',
    PRESSLISTWIZARD = 'PRESSLISTWIZARD'
}

interface IProps {
    match: any;
    history: History;
    internationalization: TInternationalization;
    // token: IToken;
}

interface IState {
    payment_data: {
        payer_id: {
            id: string | undefined;
            isValid: boolean;
        }
        receiver_id: {
            press: ICmp_select<IPerson> | null;
            isValid: boolean
        }
        amount: {
            value: number | undefined,
            isValid: boolean
        };
    };
    isFormValid: boolean;
    saveMode: SAVE_MODE;
    createLoader: boolean;
    updateLoader: boolean;
    retryModal: boolean;
}

class RecordNewPaymentComponent extends BaseComponent<IProps, IState> {

    /////////// end of Select's options define

    state = {
        payment_data: {
            payer_id: {
                id: undefined,
                isValid: false,
            },
            receiver_id: {
                press: null,
                isValid: false,
            },
            amount: {
                value: undefined,
                isValid: false,
            },
        },
        isFormValid: false,
        saveMode: SAVE_MODE.CREATE,
        createLoader: false,
        updateLoader: false,
        retryModal: false,
    }

    private _pressAccounting = new PressAccountingService();
    private _personService = new PersonService();
    

    componentDidMount() {
        this.payer_id_set_in_state();
        if (this.props.match.path.includes('/record_new_payment_manage_wizard/:press_id')) {
            this.setState({
                ...this.state,
                saveMode: SAVE_MODE.MAINLISTWIZARD
            }, () => this.fetch_receiver_person_in_SAVE_EDIT_mode_and_set_in_state(this.props.match.params.press_id))
        }
        if (this.props.match.path.includes('/record_new_payment_press_list_wizard/:press_id')) {
            this.setState({
                ...this.state,
                saveMode: SAVE_MODE.PRESSLISTWIZARD,
            }, () => this.fetch_receiver_person_in_SAVE_EDIT_mode_and_set_in_state(this.props.match.params.press_id))
        }
    }

    payer_id_set_in_state() {
        if(Store2.getState().logged_in_user === null){
            return;
        }
        this.setState({
            ...this.state,
            payment_data: {
                ...this.state.payment_data,
                payer_id: {
                    id: (Store2.getState().logged_in_user as IUser).person.id,
                    isValid: true,
                }
            }
        }, () => this.form_validation_func());
    }

    async fetch_receiver_person_in_SAVE_EDIT_mode_and_set_in_state(receiver_id: string) {
        this.setState({ ...this.state, retryModal: false })
        let res = await this._personService.byId(receiver_id).catch(error => {
            this.setState({ ...this.state, retryModal: true })
            this.handleError({ error: error.response, toastOptions: { toastId: 'fetch_receiver_person_in_SAVE_EDIT_mode_and_set_in_state_error' } })
        })

        if (res) {
            this.setState({
                ...this.state,
                payment_data: {
                    ...this.state.payment_data,
                    receiver_id: {
                        press: { label: this.getPersonFullName(res.data), value: res.data },
                        isValid: true
                    }
                },
                retryModal: false
            })
        }
    }

    onHideRetryModal() {
        this.setState({ ...this.state, retryModal: false })
    }

    // on change functions 

    handleInputChange(value: any, isValid: boolean) {
        let valid: boolean = false;
        if (value === '' || value === 0 || isValid === false) {
            valid = false;
        } else {
            valid = true;
        };
        this.setState({
            ...this.state,
            payment_data: {
                ...this.state.payment_data,
                amount: {
                    value: value,
                    isValid: valid,
                }
            }
        }, () => this.form_validation_func())
    }

    bookPressChange(selectedPerson: { label: string, value: IPerson } | null) {
        if (selectedPerson === null) {
            this.setState({
                ...this.state,
                payment_data: {
                    ...this.state.payment_data,
                    receiver_id: {
                        press: null,
                        isValid: false,
                    }
                },
            }, () => this.form_validation_func());
        } else {
            this.setState({
                ...this.state,
                payment_data: {
                    ...this.state.payment_data,
                    receiver_id: {
                        press: selectedPerson,
                        isValid: true,
                    }
                },
            }, () => this.form_validation_func());
        };
    }

    form_validation_func() {
        if (this.state.payment_data.amount.isValid === true
            && this.state.payment_data.payer_id.isValid === true
            && this.state.payment_data.receiver_id.isValid === true) {
            this.setState({ ...this.state, isFormValid: true })
        } else {
            this.setState({ ...this.state, isFormValid: false })
        }
    }

    ////////////////// navigatin func ///////////////////////

    backTO() {
        if(this.state.saveMode === SAVE_MODE.PRESSLISTWIZARD){
            this.gotoPressList();
        }else{
            this.gotoMainList();
        }
    }

    gotoMainList() {
        this.props.history.push(`/press_accounts/manage`);
    }

    gotoPressList() {
        this.props.history.push(`/press_account_list/${this.props.match.params.press_id}/manage`);
    }

    async create() {
        if (this.state.isFormValid === false) {
            return;
        }
        const created_payment_data: { payer_id: string, receiver_id: string, amount: number } = {
            payer_id: this.state.payment_data.payer_id.id!,
            receiver_id: (this.state.payment_data.receiver_id.press as any).id,
            amount: this.state.payment_data.amount.value!
        };
        this.setState({ ...this.state, createLoader: true });
        let res = await this._pressAccounting.addPaymentToEachPressAccount(created_payment_data).catch(error => {
            this.setState({ ...this.state, createLoader: false })
            this.handleError({ error: error.response, toastOptions: { toastId: 'addPaymentToEachPressAccount' } })
        });
        if (res) {
            this.apiSuccessNotify();
            this.resetForm();
        }
    }

    /////////// reset form /////////////

    resetForm() {
        this.setState({
            ...this.state,
            payment_data: {
                payer_id: {
                    id: this.state.payment_data.payer_id.id,
                    isValid: this.state.payment_data.payer_id.isValid,
                },
                receiver_id: {
                    press: null,
                    isValid: false,
                },
                amount: {
                    value: undefined,
                    isValid: false,
                },
            },
            isFormValid: false,
            createLoader: false,
            updateLoader: false,
        })
    }

    ////// request for book roll person ////////

    private personRequstError_txt: string = Localization.no_item_found;

    async promiseOptions2(inputValue: any, callBack: any) {

        let res: any = await this._personService.searchPress(10, 0, inputValue).catch(err => {
            let err_msg = this.handleError({ error: err.response, notify: false, toastOptions: { toastId: 'promiseOptions2BookPress_error' } });
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

    /////////////////////////////////////

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
                                    <div className="col-md-4 col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="">{Localization.role_type_list.Press}<span className="text-danger">*</span></label>
                                            <AsyncSelect
                                                isClearable
                                                placeholder={Localization.role_type_list.Press}
                                                cacheOptions
                                                defaultOptions
                                                value={this.state.payment_data.receiver_id.press}
                                                loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback)}
                                                noOptionsMessage={(obj) => this.select_noOptionsMessage(obj)}
                                                onChange={(selectedPerson: any) => this.bookPressChange(selectedPerson)}
                                                isDisabled={(this.state.saveMode === SAVE_MODE.MAINLISTWIZARD || this.state.saveMode === SAVE_MODE.PRESSLISTWIZARD) ? true : false}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-6">
                                        <FixNumber
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid)}
                                            label={Localization.price}
                                            placeholder={Localization.price}
                                            defaultValue={this.state.payment_data.amount.value}
                                            pattern={AppRegex.number}
                                            patternError={Localization.validation_msg.Just_enter_the_numeric_value}
                                        />
                                    </div>
                                </div>
                                {/* end of give data by inputs */}
                                <div className="d-flex justify-content-between mt-4">
                                    <div className="mr-0 pr-0">
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
                <RetryModal
                    modalShow={this.state.retryModal}
                    onHide={() => this.onHideRetryModal()}
                    onRetry={() => this.fetch_receiver_person_in_SAVE_EDIT_mode_and_set_in_state(this.props.match.params.press_id)}
                />
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
        // token: state.token,
    };
};

export const RecordNewPayment = connect(
    state2props,
    dispatch2props
)(RecordNewPaymentComponent);