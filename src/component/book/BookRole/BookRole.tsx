import React, { Fragment } from 'react';
import Select from 'react-select'
import { IPerson } from '../../../model/model.person';
import { BOOK_ROLES } from '../../../enum/Book';
import AsyncSelect from 'react-select/async';
import { PersonService } from "../../../service/service.person";
// import { IToken } from '../../../model/model.token';
import { connect, MapDispatchToProps } from 'react-redux';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { Localization } from '../../../config/localization/localization';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { QuickPerson } from '../../person/QuickPerson/QuickPerson';
import { AccessService } from '../../../service/service.access';
import { TPERMISSIONS } from '../../../enum/Permission';


interface IRoleRow {
    id: string;
    role: { label: string, value: BOOK_ROLES } | undefined;
    person: { label: string, value: IPerson } | undefined;
}
interface IState {
    list: IRoleRow[];
    quickPersonModalStatus: boolean;
    person: IPerson | undefined;
    quickPerson_index: number | undefined;
    pressCountStatus: number;
    isTouched: boolean;
    isValid: boolean;
    errorTxt: string;
}

type TOuterListItem = { role: BOOK_ROLES | undefined, person: IPerson | undefined, id?: string };
interface IProps {
    onChange: (list: TOuterListItem[], isValid: boolean) => void;
    validationFunc?: (list: TOuterListItem[]) => boolean;
    errorTxt?: string;
    defaultValue?: TOuterListItem[] | null;
    internationalization: TInternationalization;
    // token: IToken;
    required?: boolean;
    label?: string;
}

class BookRoleComponent extends BaseComponent<IProps, IState> {
    state = {
        list: this.convertOuterToInner(this.props.defaultValue || []), // todo
        quickPersonModalStatus: false,
        person: undefined,
        quickPerson_index: undefined,
        pressCountStatus: 0,
        isTouched: false,
        isValid: false,
        errorTxt: ''
    }
    roleOptions = [
        { value: BOOK_ROLES.Author, label: Localization.role_type_list.Author },
        { value: BOOK_ROLES.Writer, label: Localization.role_type_list.Writer },
        { value: BOOK_ROLES.Translator, label: Localization.role_type_list.Translator },
        // { value: BOOK_ROLES.Press, label: Localization.role_type_list.Press },
        { value: BOOK_ROLES.Contributer, label: Localization.role_type_list.Contributer },
        { value: BOOK_ROLES.Designer, label: Localization.role_type_list.Designer },
        { value: BOOK_ROLES.Narrator, label: Localization.role_type_list.Narrator },
    ];
    _personService = new PersonService();
    componentDidMount() {
        // this._personService.setToken(this.props.token);
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (
            JSON.stringify(this.convertInnerToOuter(this.convertOuterToInner(nextProps.defaultValue || [])))
            !== JSON.stringify(this.convertInnerToOuter(this.state.list))
        ) {
            let newList = [...nextProps.defaultValue || []];
            const isValid = this.handleValidate(this.convertOuterToInner(newList));
            this.setState({
                ...this.state,
                isValid: isValid,
                list: this.convertOuterToInner(newList)
            }, () => {
                this.props.onChange(newList, isValid);
                this.defultError_handler();
            });
        }
    }

    defultError_handler() {
        if (this.props.required) {
            this.setState({
                ...this.state,
                errorTxt: 'requierd',
            })
        }
    }

    addRow() {
        let newList = [...this.state.list]
        newList.push({ id: Math.random() + '', role: undefined, person: undefined });
        const isValid = this.handleValidate(newList);
        this.setState({
            ...this.state,
            isValid: isValid,
            isTouched: true,
            list: newList
        }, () => {
            this.props.onChange(this.convertInnerToOuter(this.state.list), isValid);
        });
    }

    removeRow(index: number) {
        let newlist = [...this.state.list]
        newlist.splice(index, 1);
        const isValid = this.handleValidate(newlist);
        this.setState({
            ...this.state,
            isValid: isValid,
            isTouched: true,
            list: newlist
        },
            () => {
                this.props.onChange(this.convertInnerToOuter(this.state.list), isValid);
            });
    }

    convertInnerToOuter(list: IRoleRow[]): TOuterListItem[] {
        let new_list = [...list];
        return new_list.map(item => {
            return {
                id: item.id,
                role: (item.role || { value: undefined }).value,
                person: (item.person || { value: undefined }).value
            }
        });
    }

    convertOuterToInner(list: TOuterListItem[]): IRoleRow[] {
        return list.map(item => {
            return {
                id: item.id || (Math.random() + ''),
                role: item.role ? { label: Localization.role_type_list[item.role], value: item.role } : undefined,
                person: item.person ? { label: this.getPersonFullName(item.person), value: item.person } : undefined
            }
        });
    }

    handleRoleChange(val: { label: string, value: BOOK_ROLES }, index: number) {
        let newlist = [...this.state.list];
        newlist[index].role = val;
        const isValid = this.handleValidate(newlist);
        this.setState({
            ...this.state,
            isValid: isValid,
            list: newlist
        },
            () => {
                this.props.onChange(this.convertInnerToOuter(this.state.list), isValid);
            });
    }


    handlePersonChange = (selectedPerson: any, index: number) => {
        let newlist = [...this.state.list];
        newlist[index].person = selectedPerson;
        const isValid = this.handleValidate(newlist);
        this.setState({
            ...this.state,
            isValid: isValid,
            list: newlist/* ,isValid */
        },
            () => {
                this.props.onChange(this.convertInnerToOuter(this.state.list), isValid);
            });
    }

    personRequstError_txt: string = Localization.no_item_found;

    async promiseOptions2(inputValue: any, callBack: any) {
        let filter = undefined;
        if (inputValue) {
            filter = {full_name : {$prefix : inputValue} };
        }
        let res: any = await this._personService.search(10, 0, filter).catch(err => {
            let err_msg = this.handleError({ error: err.response, notify: false, toastOptions: { toastId: 'promiseOptions2BookRolls_error' } });
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

    private setTimeout_val: any;
    debounce_300(inputValue: any, callBack: any, index: number) {
        if (this.setTimeout_val) {
            clearTimeout(this.setTimeout_val);
        }
        this.setTimeout_val = setTimeout(() => {
            this.promiseOptions2(inputValue, callBack);
        }, 1000);
    }

    select_noOptionsMessage(obj: { inputValue: string }) {
        return this.personRequstError_txt;
    }

    private _errorTxt = 'isReqi';
    handleValidate(list: IRoleRow[]): boolean {
        this._errorTxt = Localization.required_field;
        if(list.length === 0){
            return true
        };
        let valid = true;
        for (let i = 0; i < list.length; i++) {
            let obj = list[i];
            if (!obj.role || !obj.person) {
                valid = false;
                break;
            }
        }
        return valid;
    }

    ////////   start crate quick person  //////////

    quickpersonOpen(index: number) {
        this.setState({
            ...this.state,
            quickPersonModalStatus: true,
            quickPerson_index: index,
        })

    }
    quickpersonClose() {
        this.setState({
            ...this.state,
            quickPersonModalStatus: false,
        })
    }

    seterPerson(person: IPerson, index: number) {
        let newlist = [...this.state.list];
        const selectedPerson: {
            label: string;
            value: IPerson
        } = {
            label: this.getPersonFullName(person),
            value: person
        }
        newlist[index].person = selectedPerson;
        const isValid = this.handleValidate(newlist);
        this.setState({ ...this.state, list: newlist },
            () => {
                this.props.onChange(this.convertInnerToOuter(this.state.list), isValid);
            });
    }
    ////////   end crate quick person  //////////

    errorTxt_render() {
        if (!this.state.isTouched || this.state.isValid) return;
        return this._errorTxt;
    }

    render() {
        return (
            <>
                {
                    (this.props.label || this.props.required) ?
                        <label>
                            {this.props.label}
                            {/* {
                                this.props.required
                                    ?
                                    <span className="text-danger">*</span>
                                    : ''
                            } */}
                        </label>
                        : ''}
                <div className="role-img-container">
                    {(this.state.list).map((item, index) => (
                        <Fragment key={item.id}>
                            <div className="pl-5 mt-4">
                                <div className="row">
                                    <div className="col-md-5">
                                        <label htmlFor="">{Localization.role}</label>
                                        <Select
                                            onChange={(value: any) => this.handleRoleChange(value, index)}
                                            options={this.roleOptions}
                                            value={item.role}
                                            placeholder={Localization.role}
                                        />
                                    </div>
                                    <div className="col-md-5">
                                        <label htmlFor="">{Localization.person}</label>
                                        {
                                            AccessService.checkAccess(TPERMISSIONS.PERSON_ADD_PREMIUM)
                                                ?
                                                <i
                                                    title={Localization.Quick_person_creation}
                                                    className="fa fa-plus-circle cursor-pointer text-success mx-1"
                                                    onClick={() => this.quickpersonOpen(index)}
                                                ></i>
                                                :
                                                undefined
                                        }
                                        <AsyncSelect
                                            placeholder={Localization.person}
                                            cacheOptions
                                            defaultOptions
                                            value={item.person}
                                            loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback, index)}
                                            noOptionsMessage={(obj) => this.select_noOptionsMessage(obj)}
                                            onChange={(selectedPerson) => this.handlePersonChange(selectedPerson, index)}
                                        />
                                    </div>
                                    <div className="col-2 mt-2">
                                        <BtnLoader
                                            btnClassName="btn btn-danger btn-sm mt-4"
                                            onClick={() => this.removeRow(index)}
                                            loading={false}
                                            disabled={false}
                                        >
                                            &times;
                                        </BtnLoader>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    ))}
                    <div className="mx-4 px-3 my-3">
                        <div className="row">
                            <div className="d-flex justify-content-start">
                                <BtnLoader
                                    btnClassName="btn btn-success mx-4"
                                    onClick={() => this.addRow()}
                                    loading={false}
                                    disabled={false}
                                >
                                    +
                                </BtnLoader>
                            </div>
                        </div>
                    </div>
                    {/* <div className="text-center text-danger">
                        {this.errorTxt_render()}
                    </div> */}
                </div>
                {
                    <QuickPerson
                        onCreate={(person: IPerson, index: number) => this.seterPerson(person, index)}
                        data={this.state.quickPerson_index}
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

export const BookRole = connect(
    state2props,
    dispatch2props
)(BookRoleComponent);