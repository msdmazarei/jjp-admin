import React, { Fragment } from 'react';
import { History } from 'history';
import { IPerson } from '../../../model/model.person';
import { AppRegex } from '../../../config/regex';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { Localization } from '../../../config/localization/localization';
// import { ToastContainer } from 'react-toastify';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { FixNumber } from '../../form/fix-number/FixNumber';
import AsyncSelect from 'react-select/async';
import { PersonService } from '../../../service/service.person';
import { PressAccountingService } from '../../../service/service.pressAccounting';
// import { Store2 } from '../../../redux/store';
// import { RetryModal } from '../../tool/retryModal/retryModal';
// import { IUser } from '../../../model/model.user';
import { permissionChecker } from '../../../asset/script/accessControler';
import { T_ITEM_NAME, CHECKTYPE, CONDITION_COMBINE } from '../../../enum/T_ITEM_NAME';
import Select from 'react-select';
import { AppDatePicker } from '../../form/app-datePicker/AppDatePicker';
import { Input } from '../../form/input/Input';
import { toast, ToastContainer } from 'react-toastify';
import Dropzone from 'react-dropzone';
// import { IToken } from '../../../model/model.token';

enum SAVE_MODE {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    MAINLISTWIZARD = 'MAINLISTWIZARD',
    PRESSLISTWIZARD = 'PRESSLISTWIZARD',
    PRESSLISTWIZARDUPDATE = 'PRESSLISTWIZARDUPDATE'
}

enum SAVE_IN {
    PAYER = 'PAYER',
    RECEIVER = 'RECEIVER',
}

enum payment_type {
    Cash_payment = 'Cash_payment',
    Deposit_to_account = 'Deposit_to_account',
    Bank_check = 'Bank_check',
}

enum stringInputSelect {
    Deposit_to_account_bank_name = 'Deposit_to_account_bank_name',
    Bank_cheque_bank_name = 'Bank_cheque_bank_name',
    Bank_cheque_owner_cheque = 'Bank_cheque_owner_cheque',
}


interface ICmp_select<T> {
    label: string;
    value: T
}

interface IProps {
    match: any;
    history: History;
    internationalization: TInternationalization;
    // token: IToken;
}

interface IState {
    payment_persons: {
        payer: {
            person: ICmp_select<IPerson> | null;
            isValid: boolean;
        };
        receiver: {
            person: ICmp_select<IPerson> | null;
            isValid: boolean
        };
        amount: {
            value: number | undefined;
            isValid: boolean;
        };
    };
    Cash_payment: {
        date: {
            value: number | undefined;
            isValid: boolean;
        };
    };
    Deposit_to_account: {
        date: {
            value: number | undefined;
            isValid: boolean;
        };
        serial: {
            value: number | undefined;
            isValid: boolean;
        };
        bank_name: {
            value: string | undefined;
            isValid: boolean;
        };
        image: {
            value: string[],
            isValid: boolean
        };
    };
    Bank_cheque: {
        cheque_owner: {
            value: string | undefined;
            isValid: boolean;
        };
        date: {
            value: number | undefined;
            isValid: boolean;
        };
        serial: {
            value: number | undefined;
            isValid: boolean;
        };
        bank_name: {
            value: string | undefined;
            isValid: boolean;
        };
        image: {
            value: string[],
            isValid: boolean
        };
    }
    isFormValid: boolean;
    saveMode: SAVE_MODE;
    payment_type: ICmp_select<payment_type>;
    createLoader: boolean;
    updateLoader: boolean;
    retryModal: boolean;
}

class RecordNewPaymentComponent extends BaseComponent<IProps, IState> {

    payment_type = [
        { value: payment_type.Cash_payment, label: 'پرداخت نقدی' },
        { value: payment_type.Deposit_to_account, label: 'واریز به حساب بانکی' },
        { value: payment_type.Bank_check, label: 'چک بانکی' },
    ];

    /////////// end of Select's options define

    state = {
        payment_persons: {
            payer: {
                person: null,
                isValid: false,
            },
            receiver: {
                person: null,
                isValid: false,
            },
            amount: {
                value: undefined,
                isValid: false,
            }
        },
        Cash_payment: {
            date: {
                value: undefined,
                isValid: false
            },
        },
        Deposit_to_account: {
            date: {
                value: undefined,
                isValid: false,
            },
            serial: {
                value: undefined,
                isValid: false,
            },
            bank_name: {
                value: undefined,
                isValid: false,
            },
            image: {
                value: [],
                isValid: false,
            },
        },
        Bank_cheque: {
            cheque_owner: {
                value: undefined,
                isValid: false,
            },
            date: {
                value: undefined,
                isValid: false,
            },
            serial: {
                value: undefined,
                isValid: false,
            },
            bank_name: {
                value: undefined,
                isValid: false,
            },
            image: {
                value: [],
                isValid: false,
            },
        },
        isFormValid: false,
        saveMode: SAVE_MODE.CREATE,
        payment_type: this.payment_type[0],
        createLoader: false,
        updateLoader: false,
        retryModal: false,
    }

    private _pressAccounting = new PressAccountingService();
    private _personService = new PersonService();


    componentDidMount() {
        if (this.props.match.path.includes('/record_new_payment') ||
            this.props.match.path.includes('/record_new_payment_manage_wizard/:press_id') ||
            this.props.match.path.includes('/record_new_payment_press_list_wizard/:press_id')) {
            if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingRecordNewPayment], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true) {
                if (this.props.match.path.includes('/record_new_payment_manage_wizard/:press_id')) {
                    this.setState({
                        ...this.state,
                        saveMode: SAVE_MODE.MAINLISTWIZARD
                    }, () => this.fetch_payer_or_receiver_and_set_in_state(this.props.match.params.press_id, SAVE_IN.RECEIVER))
                }
                if (this.props.match.path.includes('/record_new_payment_press_list_wizard/:press_id')) {
                    this.setState({
                        ...this.state,
                        saveMode: SAVE_MODE.PRESSLISTWIZARD,
                    }, () => this.fetch_payer_or_receiver_and_set_in_state(this.props.match.params.press_id, SAVE_IN.RECEIVER))
                }
            } else {
                this.noAccessRedirect(this.props.history);
            }
        }

        if (this.props.match.path.includes('/update_recorded_payment/:payment_id') ||
            this.props.match.path.includes('/update_recorded_payment_manage_wizard/:payment_id')) {
            if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingUpdatePayment], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true) {
                if (this.props.match.path.includes('/update_recorded_payment/:payment_id')) {
                    this.setState({
                        ...this.state,
                        saveMode: SAVE_MODE.UPDATE,
                    }, () => this.fetch_payment_by_id_and_set_in_state_and_call_payer_fetcher_func(this.props.match.params.payment_id))
                }
                if (this.props.match.path.includes('/update_recorded_payment_manage_wizard/:payment_id')) {
                    this.setState({
                        ...this.state,
                        saveMode: SAVE_MODE.PRESSLISTWIZARDUPDATE,
                    }, () => this.fetch_payment_by_id_and_set_in_state_and_call_payer_fetcher_func(this.props.match.params.payment_id))
                }
            } else {
                this.noAccessRedirect(this.props.history);
            }
        }
    }

    async fetch_payment_by_id_and_set_in_state_and_call_payer_fetcher_func(payment_id: string) {
        this.setState({ ...this.state, retryModal: false })
        let res = await this._pressAccounting.getFieldOfPressAccountList(payment_id).catch(error => {
            this.setState({ ...this.state, retryModal: true })
            this.handleError({ error: error.response, toastOptions: { toastId: 'fetch_payment_by_id_and_set_in_state_and_call_payer_fetcher_func' } })
        })

        if (res) {
            let receiver_person: { label: string, value: IPerson } | null = { label: this.getPersonFullName(res.data.receiver), value: res.data.receiver };
            let receiver_person_valid: boolean = receiver_person === null ? false : true;
            let amount_num: number = res.data.amount;
            let amount_num_valid: boolean = typeof amount_num === 'number' ? true : false;
            let payer_id: string = res.data.payer_id;
            this.setState({
                ...this.state,
                payment_persons: {
                    ...this.state.payment_persons,
                    receiver: {
                        person: receiver_person,
                        isValid: receiver_person_valid
                    },
                    amount: {
                        value: amount_num,
                        isValid: amount_num_valid
                    },
                }
            }, () => {
                this.form_validation_func();
                this.fetch_payer_or_receiver_and_set_in_state(payer_id, SAVE_IN.PAYER);
            })
        }
    }

    async fetch_payer_or_receiver_and_set_in_state(id: string, person_type: SAVE_IN) {
        this.setState({ ...this.state, retryModal: false })
        let res = await this._personService.byId(id).catch(error => {
            this.setState({ ...this.state, retryModal: true })
            this.handleError({ error: error.response, toastOptions: { toastId: 'fetch_receiver_person_in_SAVE_EDIT_mode_and_set_in_state_error' } })
        })

        if (res) {
            if (person_type === SAVE_IN.RECEIVER) {
                this.setState({
                    ...this.state,
                    payment_persons: {
                        ...this.state.payment_persons,
                        receiver: {
                            person: { label: this.getPersonFullName(res.data), value: res.data },
                            isValid: true
                        }
                    },
                    retryModal: false
                }, () => this.form_validation_func())
            }
            if (person_type === SAVE_IN.PAYER) {
                this.setState({
                    ...this.state,
                    payment_persons: {
                        ...this.state.payment_persons,
                        payer: {
                            person: { label: this.getPersonFullName(res.data), value: res.data },
                            isValid: true
                        }
                    },
                    retryModal: false
                }, () => this.form_validation_func())
            }
        }
    }

    onHideRetryModal() {
        this.setState({ ...this.state, retryModal: false })
    }

    // on change functions 

    payer_or_receiver_Change(selectedPerson: { label: string, value: IPerson } | null, input: string) {
        if (selectedPerson === null) {
            this.setState({
                ...this.state,
                payment_persons: {
                    ...this.state.payment_persons,
                    [input]: {
                        person: null,
                        isValid: false,
                    }
                },
            }, () => this.form_validation_func());
        } else {
            this.setState({
                ...this.state,
                payment_persons: {
                    ...this.state.payment_persons,
                    [input]: {
                        person: selectedPerson,
                        isValid: true,
                    }
                },
            }, () => this.form_validation_func());
        };
    }

    changeTypeOfPayment(value: { value: payment_type, label: string }) {
        this.setState({
            ...this.state,
            Cash_payment: {
                date: {
                    value: undefined,
                    isValid: false
                },
            },
            Deposit_to_account: {
                date: {
                    value: undefined,
                    isValid: false,
                },
                serial: {
                    value: undefined,
                    isValid: false,
                },
                bank_name: {
                    value: undefined,
                    isValid: false,
                },
                image: {
                    value: [],
                    isValid: false,
                },
            },
            Bank_cheque: {
                cheque_owner: {
                    value: undefined,
                    isValid: false,
                },
                date: {
                    value: undefined,
                    isValid: false,
                },
                serial: {
                    value: undefined,
                    isValid: false,
                },
                bank_name: {
                    value: undefined,
                    isValid: false,
                },
                image: {
                    value: [],
                    isValid: false,
                },
            },
            payment_type: value,
        }, () => this.form_validation_func())
    }

    handleInputOfAmountChange(newValue: any, isValid: boolean) {
        let valid: boolean = false;
        if (newValue === '' || Number(newValue) === 0 || isValid === false) {
            valid = false;
        } else {
            valid = true;
        };
        this.setState({
            ...this.state,
            payment_persons: {
                ...this.state.payment_persons,
                amount: {
                    value: newValue,
                    isValid: valid,
                }
            }
        }, () => this.form_validation_func())
    }

    date_of_payment_setter(newValue: number | undefined, isValid: boolean, typeOfPayment: string) {
        let valid: boolean = newValue === undefined ? false : true;
        if (typeOfPayment === 'Cash_payment') {
            this.setState({
                ...this.state,
                Cash_payment: {
                    ...this.state.Cash_payment,
                    date: {
                        value: newValue,
                        isValid: valid,
                    },
                }
            }, () => this.form_validation_func())
        }
        if (typeOfPayment === 'Deposit_to_account') {
            this.setState({
                ...this.state,
                Deposit_to_account: {
                    ...this.state.Deposit_to_account,
                    date: {
                        value: newValue,
                        isValid: valid,
                    },
                }
            }, () => this.form_validation_func())
        }
        if (typeOfPayment === 'Bank_check') {
            this.setState({
                ...this.state,
                Bank_cheque: {
                    ...this.state.Bank_cheque,
                    date: {
                        value: newValue,
                        isValid: valid,
                    },
                }
            }, () => this.form_validation_func())
        }
    }

    handleStringInputChange(newValue: any, isValid: boolean, changeCase: stringInputSelect) {
        let valid: boolean = false;
        if (newValue === '' || newValue === undefined || isValid === false) {
            valid = false;
        } else {
            valid = true;
        };
        if (changeCase === stringInputSelect.Deposit_to_account_bank_name) {
            this.setState({
                ...this.state,
                Deposit_to_account: {
                    ...this.state.Deposit_to_account,
                    bank_name: {
                        value: newValue,
                        isValid: valid,
                    }
                }
            }, () => this.form_validation_func())
        }
        if (changeCase === stringInputSelect.Bank_cheque_bank_name) {
            this.setState({
                ...this.state,
                Bank_cheque: {
                    ...this.state.Bank_cheque,
                    bank_name: {
                        value: newValue,
                        isValid: valid,
                    }
                }
            }, () => this.form_validation_func())
        }
        if (changeCase === stringInputSelect.Bank_cheque_owner_cheque) {
            this.setState({
                ...this.state,
                Bank_cheque: {
                    ...this.state.Bank_cheque,
                    cheque_owner: {
                        value: newValue,
                        isValid: valid,
                    }
                }
            }, () => this.form_validation_func())
        }
    }

    handleNumberInputChange(newValue: any, isValid: boolean, changeCase: payment_type) {
        let valid: boolean = false;
        if (newValue === '' || newValue === undefined || Number(newValue) === 0 || isValid === false) {
            valid = false;
        } else {
            valid = true;
        };
        if (changeCase === payment_type.Deposit_to_account) {
            this.setState({
                ...this.state,
                Deposit_to_account: {
                    ...this.state.Deposit_to_account,
                    serial: {
                        value: newValue,
                        isValid: valid,
                    }
                }

            }, () => this.form_validation_func())
        }
        if (changeCase === payment_type.Bank_check) {
            this.setState({
                ...this.state,
                Bank_cheque: {
                    ...this.state.Bank_cheque,
                    serial: {
                        value: newValue,
                        isValid: valid,
                    }
                }

            }, () => this.form_validation_func())
        }
    }

    /// start functions of image 

    onDropRejected(files: any[], event: any) {
        this.onDropRejectedNotify(files);
    }

    onDropRejectedNotify(files: any[]) {
        toast.warn(Localization.validation_msg.file_can_not_added, this.getNotifyConfig());
    }

    removePreviousImgNotify() {
        toast.warn(Localization.validation_msg.just_one_image_person_can_have, this.getNotifyConfig());
    }

    onDrop(files: any[], payment_t: payment_type) {
        if(payment_t === payment_type.Deposit_to_account){
            if (!files || !files.length) return;
            if (this.state.Deposit_to_account.image.value && this.state.Deposit_to_account.image.value!.length) {
                this.removePreviousImgNotify();
                return;
            }
            this.setState({
                ...this.state, Deposit_to_account: {
                    ...this.state.Deposit_to_account,
                    image: {
                        isValid: true,
                        value: files
                    }
                }
            }, () => this.form_validation_func())
        }
        if (payment_t === payment_type.Bank_check) {
            if (!files || !files.length) return;
            if (this.state.Bank_cheque.image.value && this.state.Bank_cheque.image.value!.length) {
                this.removePreviousImgNotify();
                return;
            }
            this.setState({
                ...this.state, Bank_cheque: {
                    ...this.state.Bank_cheque,
                    image: {
                        isValid: true,
                        value: files
                    }
                }
            }, () => this.form_validation_func())
        }
    }

    tmpUrl_list: string[] = [];

    getTmpUrl(file: any): string {
        const tmUrl = URL.createObjectURL(file);
        this.tmpUrl_list.push(tmUrl);
        return tmUrl;
    }

    removeItemFromDZ(index: number, payment_t: payment_type/* , url: string */) {
        if(payment_t === payment_type.Deposit_to_account){
            let newFiles = (this.state.Deposit_to_account.image.value || []);
            if (newFiles) {
                newFiles.splice(index, 1);
            }
            this.setState({
                ...this.state, Deposit_to_account: {
                    ...this.state.Deposit_to_account,
                    image: {
                        isValid: false,
                        value: [...newFiles]
                    }
                }
            }, () => this.form_validation_func())
        }
        if(payment_t === payment_type.Bank_check){
            let newFiles = (this.state.Bank_cheque.image.value || []);
            if (newFiles) {
                newFiles.splice(index, 1);
            }
            this.setState({
                ...this.state, Bank_cheque: {
                    ...this.state.Bank_cheque,
                    image: {
                        isValid: false,
                        value: [...newFiles]
                    }
                }
            }, () => this.form_validation_func())
        }
    }

    /// end functions of image 

    validation_with_payment_type(): boolean {
        if (this.state.payment_type.value === payment_type.Cash_payment) {
            if (this.state.Cash_payment.date.isValid === true) {
                return true;
            } else {
                return false;
            }
        } else if (this.state.payment_type.value === payment_type.Deposit_to_account) {
            if (this.state.Deposit_to_account.bank_name.isValid === true &&
                this.state.Deposit_to_account.date.isValid === true &&
                this.state.Deposit_to_account.serial.isValid === true) {
                return true;
            } else {
                return false;
            }
        } else {
            if (this.state.Bank_cheque.bank_name.isValid === true &&
                this.state.Bank_cheque.cheque_owner.isValid === true &&
                this.state.Bank_cheque.date.isValid === true &&
                this.state.Bank_cheque.serial.isValid === true &&
                this.state.Bank_cheque.image.isValid === true) {
                return true;
            } else {
                return false;
            }
        }
    }

    form_validation_func() {
        if (this.state.payment_persons.amount.isValid === true
            && this.state.payment_persons.payer.isValid === true
            && this.state.payment_persons.receiver.isValid === true
            && this.validation_with_payment_type() === true) {
            this.setState({ ...this.state, isFormValid: true })
        } else {
            this.setState({ ...this.state, isFormValid: false })
        }
    }

    ////////////////// navigatin func ///////////////////////

    backTO() {
        if (this.state.saveMode === SAVE_MODE.PRESSLISTWIZARD) {
            this.gotoPressList();
        } else {
            this.gotoMainList();
        }
    }

    gotoMainList() {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountingManage], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true) {
            this.props.history.push(`/press_accounts/manage`);
        } else {
            this.noAccessRedirect(this.props.history);
        }
    }

    gotoPressList() {
        if (permissionChecker.is_allow_item_render([T_ITEM_NAME.pressAccountList], CHECKTYPE.ONE_OF_ALL, CONDITION_COMBINE.DOSE_NOT_HAVE) === true) {
            this.props.history.push(`/press_account_list/${this.props.match.params.press_id}/manage`);
        } else {
            this.noAccessRedirect(this.props.history);
        }
    }

    async create() {
        if (this.state.isFormValid === false) {
            return;
        }
        if (this.state.payment_persons.receiver.person === null || this.state.payment_persons.payer.person === null) {
            return;
        }
        const created_payment_data: { payer_id: string, receiver_id: string, amount: number } = {
            payer_id: (this.state.payment_persons.payer.person as any).value.id,
            receiver_id: (this.state.payment_persons.receiver.person as any).value.id,
            amount: Number(this.state.payment_persons.amount.value!)
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
            payment_persons: {
                payer: {
                    person: null,
                    isValid: false,
                },
                receiver: {
                    person: null,
                    isValid: false,
                },
                amount: {
                    value: undefined,
                    isValid: false,
                }
            },
            Cash_payment: {
                date: {
                    value: undefined,
                    isValid: false
                }
            },
            Deposit_to_account: {
                date: {
                    value: undefined,
                    isValid: false,
                },
                serial: {
                    value: undefined,
                    isValid: false,
                },
                bank_name: {
                    value: undefined,
                    isValid: false,
                },
                image: {
                    value: [],
                    isValid: false,
                },
            },
            Bank_cheque: {
                cheque_owner: {
                    value: undefined,
                    isValid: false,
                },
                date: {
                    value: undefined,
                    isValid: false,
                },
                serial: {
                    value: undefined,
                    isValid: false,
                },
                bank_name: {
                    value: undefined,
                    isValid: false,
                },
                image: {
                    value: [],
                    isValid: false,
                },
            },
            isFormValid: false,
            payment_type: this.payment_type[0],
            createLoader: false,
            updateLoader: false,
            retryModal: false,
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

    return_of_render_by_payment_type(type: payment_type) {
        ///////////////////////////
        if (type === payment_type.Cash_payment) {
            return (
                <>
                    <div className="row">
                        <div className="col-12">
                            <h5 className="mt-3">اطلاعات پرداخت نقدی</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 col-sm-6">
                            <FixNumber
                                onChange={(value, isValid) => this.handleInputOfAmountChange(value, isValid)}
                                required
                                label={Localization.Amount_of_payment}
                                placeholder={Localization.Amount_of_payment}
                                defaultValue={this.state.payment_persons.amount.value}
                                pattern={AppRegex.number}
                                patternError={Localization.validation_msg.Just_enter_the_numeric_value}
                            />
                        </div>
                        <div className="col-md-4 col-sm-6">
                            <AppDatePicker
                                label={Localization.pay_time}
                                value={this.state.Cash_payment.date.value}
                                onChange={(value, isValid) => this.date_of_payment_setter(value, isValid, "Cash_payment")}
                                placeholder={Localization.pay_time}
                                gregorian={this.props.internationalization.flag === 'fa' ? false : true}
                                autoOk={true}
                            // time
                            />
                        </div>
                    </div>
                </>
            )
            ///////////////////////////
        } else if (type === payment_type.Deposit_to_account) {
            return (
                <>
                    <div className="row">
                        <div className="col-12">
                            <h5 className="mt-3">اطلاعات فیش واریز به حساب بانکی</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 col-sm-6">
                            <FixNumber
                                onChange={(value, isValid) => this.handleInputOfAmountChange(value, isValid)}
                                required
                                label={Localization.Amount_of_payment}
                                placeholder={Localization.Amount_of_payment}
                                defaultValue={this.state.payment_persons.amount.value}
                                pattern={AppRegex.number}
                                patternError={Localization.validation_msg.Just_enter_the_numeric_value}
                            />
                        </div>
                        <div className="col-md-4 col-sm-6">
                            <AppDatePicker
                                label={Localization.pay_time}
                                value={this.state.Deposit_to_account.date.value}
                                onChange={(value, isValid) => this.date_of_payment_setter(value, isValid, "Deposit_to_account")}
                                placeholder={Localization.pay_time}
                                gregorian={this.props.internationalization.flag === 'fa' ? false : true}
                                autoOk={true}
                            // time
                            />
                        </div>
                        <div className="col-md-4 col-sm-6">
                            <Input
                                onChange={(value, isValid) => this.handleStringInputChange(value, isValid, stringInputSelect.Deposit_to_account_bank_name)}
                                label={'بانک'}
                                placeholder={'بانک'}
                                required
                                defaultValue={this.state.Deposit_to_account.bank_name.value}
                            />
                        </div>
                        <div className="col-md-4 col-sm-6">
                            <FixNumber
                                onChange={(value, isValid) => this.handleNumberInputChange(value, isValid, payment_type.Deposit_to_account)}
                                required
                                label={'سریال فیش'}
                                placeholder={'سریال فیش'}
                                defaultValue={this.state.Deposit_to_account.serial.value}
                                pattern={AppRegex.number}
                                patternError={Localization.validation_msg.Just_enter_the_numeric_value}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <label htmlFor="">{Localization.profile_image}</label>
                            <div className="role-img-container">
                                <Dropzone
                                    multiple={false}
                                    onDrop={(files) => this.onDrop(files,payment_type.Deposit_to_account)}
                                    maxSize={838860}
                                    accept="image/*"
                                    onDropRejected={(files, event) => this.onDropRejected(files, event)}
                                >
                                    {
                                        (({ getRootProps, getInputProps }) => (
                                            <section className="container">
                                                <div {...getRootProps({ className: 'dropzone' })}>
                                                    <input {...getInputProps()} />
                                                    <p className="img-container text-center text-muted p-3">{Localization.DRAG_AND_DROP}</p>
                                                </div>
                                                <aside>
                                                    <h5 className="m-2">{Localization.preview}:</h5>
                                                    <div className="image-wrapper mb-2">{
                                                        (this.state.Deposit_to_account.image.value || []).map((file: any, index) => {
                                                            let tmUrl = '';
                                                            let fileName = '';
                                                            let fileSize = '';
                                                            if (typeof file === "string") {
                                                                // fileName = file;
                                                                tmUrl = '/api/serve-files/' + file;
                                                            } else {
                                                                fileName = file.name;
                                                                fileSize = '- ' + parseFloat((file.size / 1024).toFixed(2)) + ' KB';
                                                                tmUrl = this.getTmpUrl(file);
                                                            }
                                                            return <Fragment key={index}>
                                                                {/* <div className="img-item m-2"> */}
                                                                <div className="row">
                                                                    {
                                                                        (this.state.Bank_cheque.image.value)
                                                                            ?
                                                                            <>
                                                                                <div className="col-12">
                                                                                    <img className="border-rounded m-2" src={tmUrl} alt="" onError={e => this.personImageOnError(e)} />
                                                                                </div>
                                                                                <div className="justify-content-between my-2">
                                                                                    <button title={Localization.remove} className="img-remover btn btn-danger btn-sm ml-4" onClick={() => this.removeItemFromDZ(index , payment_type.Deposit_to_account/* , tmUrl */)}>&times;</button>
                                                                                    <span className="mx-2 text-dark">{fileName} {fileSize}</span>
                                                                                </div>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <div className="col-12">
                                                                                    <img className="w-50px h-50px profile-img-rounded" src={this.defaultPersonImagePath} alt="" />
                                                                                </div>
                                                                                <div className="justify-content-between my-2">
                                                                                    <button title={Localization.remove} className="img-remover btn btn-danger btn-sm ml-4" onClick={() => this.removeItemFromDZ(index , payment_type.Deposit_to_account/* , tmUrl */)}>&times;</button>
                                                                                    <span className="mx-2 text-dark">{fileName} {fileSize}</span>
                                                                                </div>
                                                                            </>
                                                                    }
                                                                    <div className="col-12">

                                                                    </div>
                                                                    <div className="col-12">

                                                                    </div>
                                                                </div>
                                                            </Fragment>
                                                        })
                                                    }</div>
                                                </aside>
                                            </section>
                                        ))
                                    }
                                </Dropzone>
                            </div>
                        </div>
                    </div>
                </>
            )
            ///////////////////////////
        } else {
            return (
                <>
                    <div className="row">
                        <div className="col-12">
                            <h5 className="mt-3">اطلاعات چک بانکی صادر شده</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 col-sm-6">
                            <FixNumber
                                onChange={(value, isValid) => this.handleInputOfAmountChange(value, isValid)}
                                required
                                label={Localization.Amount_of_payment}
                                placeholder={Localization.Amount_of_payment}
                                defaultValue={this.state.payment_persons.amount.value}
                                pattern={AppRegex.number}
                                patternError={Localization.validation_msg.Just_enter_the_numeric_value}
                            />
                        </div>
                        <div className="col-md-4 col-sm-6">
                            <AppDatePicker
                                label={Localization.pay_time}
                                value={this.state.Bank_cheque.date.value}
                                onChange={(value, isValid) => this.date_of_payment_setter(value, isValid, "Bank_check")}
                                placeholder={Localization.pay_time}
                                gregorian={this.props.internationalization.flag === 'fa' ? false : true}
                                autoOk={true}
                            // time
                            />
                        </div>
                        <div className="col-md-4 col-sm-6">
                            <Input
                                onChange={(value, isValid) => this.handleStringInputChange(value, isValid, stringInputSelect.Bank_cheque_owner_cheque)}
                                label={'صادر کننده چک'}
                                placeholder={'صادر کننده چک'}
                                required
                                defaultValue={this.state.Bank_cheque.cheque_owner.value}
                            />
                        </div>
                        <div className="col-md-4 col-sm-6">
                            <Input
                                onChange={(value, isValid) => this.handleStringInputChange(value, isValid, stringInputSelect.Bank_cheque_bank_name)}
                                label={'بانک'}
                                placeholder={'بانک'}
                                required
                                defaultValue={this.state.Bank_cheque.bank_name.value}
                            />
                        </div>
                        <div className="col-md-4 col-sm-6">
                            <FixNumber
                                onChange={(value, isValid) => this.handleNumberInputChange(value, isValid, payment_type.Bank_check)}
                                required
                                label={'سریال چک'}
                                placeholder={'سریال چک'}
                                defaultValue={this.state.Bank_cheque.serial.value}
                                pattern={AppRegex.number}
                                patternError={Localization.validation_msg.Just_enter_the_numeric_value}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <label htmlFor="">{Localization.profile_image}</label>
                            <div className="role-img-container">
                                <Dropzone
                                    multiple={false}
                                    onDrop={(files) => this.onDrop(files,payment_type.Bank_check)}
                                    maxSize={838860}
                                    accept="image/*"
                                    onDropRejected={(files, event) => this.onDropRejected(files, event)}
                                >
                                    {
                                        (({ getRootProps, getInputProps }) => (
                                            <section className="container">
                                                <div {...getRootProps({ className: 'dropzone' })}>
                                                    <input {...getInputProps()} />
                                                    <p className="img-container text-center text-muted p-3">{Localization.DRAG_AND_DROP}</p>
                                                </div>
                                                <aside>
                                                    <h5 className="m-2">{Localization.preview}:</h5>
                                                    <div className="image-wrapper mb-2">{
                                                        (this.state.Bank_cheque.image.value || []).map((file: any, index) => {
                                                            let tmUrl = '';
                                                            let fileName = '';
                                                            let fileSize = '';
                                                            if (typeof file === "string") {
                                                                // fileName = file;
                                                                tmUrl = '/api/serve-files/' + file;
                                                            } else {
                                                                fileName = file.name;
                                                                fileSize = '- ' + parseFloat((file.size / 1024).toFixed(2)) + ' KB';
                                                                tmUrl = this.getTmpUrl(file);
                                                            }
                                                            return <Fragment key={index}>
                                                                {/* <div className="img-item m-2"> */}
                                                                <div className="row">
                                                                    {
                                                                        (this.state.Bank_cheque.image.value)
                                                                            ?
                                                                            <>
                                                                                <div className="col-12">
                                                                                    <img className="border-rounded m-2" src={tmUrl} alt="" onError={e => this.personImageOnError(e)} />
                                                                                </div>
                                                                                <div className="justify-content-between my-2">
                                                                                    <button title={Localization.remove} className="img-remover btn btn-danger btn-sm ml-4" onClick={() => this.removeItemFromDZ(index , payment_type.Bank_check/* , tmUrl */)}>&times;</button>
                                                                                    <span className="mx-2 text-dark">{fileName} {fileSize}</span>
                                                                                </div>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <div className="col-12">
                                                                                    <img className="w-50px h-50px profile-img-rounded" src={this.defaultPersonImagePath} alt="" />
                                                                                </div>
                                                                                <div className="justify-content-between my-2">
                                                                                    <button title={Localization.remove} className="img-remover btn btn-danger btn-sm ml-4" onClick={() => this.removeItemFromDZ(index , payment_type.Bank_check/* , tmUrl */)}>&times;</button>
                                                                                    <span className="mx-2 text-dark">{fileName} {fileSize}</span>
                                                                                </div>
                                                                            </>
                                                                    }
                                                                    <div className="col-12">

                                                                    </div>
                                                                    <div className="col-12">

                                                                    </div>
                                                                </div>
                                                            </Fragment>
                                                        })
                                                    }</div>
                                                </aside>
                                            </section>
                                        ))
                                    }
                                </Dropzone>
                            </div>
                        </div>
                    </div>
                </>
            )
        }

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
                                    <h2 className="text-bold text-dark">{Localization.record_pay}</h2>
                                </div>
                                {/* start give data by inputs */}
                                <div className="row">
                                    <div className="col-md-4 col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="">{Localization.payer}<span className="text-danger">*</span></label>
                                            <AsyncSelect
                                                isClearable
                                                placeholder={Localization.payer}
                                                cacheOptions
                                                defaultOptions
                                                value={this.state.payment_persons.payer.person}
                                                loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback)}
                                                noOptionsMessage={(obj) => this.select_noOptionsMessage(obj)}
                                                onChange={(selectedPerson: any) => this.payer_or_receiver_Change(selectedPerson, 'payer')}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="">{Localization.role_type_list.Press}<span className="text-danger">*</span></label>
                                            <AsyncSelect
                                                isClearable
                                                placeholder={Localization.role_type_list.Press}
                                                cacheOptions
                                                defaultOptions
                                                value={this.state.payment_persons.receiver.person}
                                                loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback)}
                                                noOptionsMessage={(obj) => this.select_noOptionsMessage(obj)}
                                                onChange={(selectedPerson: any) => this.payer_or_receiver_Change(selectedPerson, 'receiver')}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="">{'payment type'} <span className="text-danger">*</span></label>
                                            <Select
                                                onChange={(value: any) => this.changeTypeOfPayment(value)}
                                                options={this.payment_type}
                                                value={this.state.payment_type}
                                                placeholder={Localization.language}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {this.return_of_render_by_payment_type(this.state.payment_type.value)}
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