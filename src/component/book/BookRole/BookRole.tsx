import React, { Fragment } from 'react';
// import { Input } from '../component/form/input/Input';
import Select from 'react-select'
import { IPerson } from '../../../model/model.person';
import { BOOK_ROLES } from '../../../enum/Book';
import AsyncSelect from 'react-select/async';
import { PersonService } from "../../../service/service.person";
import { IToken } from '../../../model/model.token';
import { connect, MapDispatchToProps } from 'react-redux';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { Localization } from '../../../config/localization/localization';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';

interface IRoleRow {
    id: string;
    role: { label: string, value: BOOK_ROLES } | undefined;
    person: { label: string, value: IPerson } | undefined;
}

interface IState {
    list: IRoleRow[];
}

type TOuterListItem = { role: BOOK_ROLES, person: IPerson, id?: string };

interface IProps {
    onChange: (list: TOuterListItem[], isValid: boolean) => void;
    defaultValue?: TOuterListItem[] | null;
    internationalization: TInternationalization;
    token: IToken;
    required?: boolean;
    label?: string;
}

class BookRoleComponent extends BaseComponent<IProps, IState> {

    state = {
        list: this.convertOuterToInner(this.props.defaultValue || []) // todo
    }

    roleOptions = [
        { value: 'Author', label: Localization.role_type_list.Author },
        { value: 'Writer', label: Localization.role_type_list.Writer },
        { value: 'Translator', label: Localization.role_type_list.Translator },
        { value: 'Press', label: Localization.role_type_list.Press },
        { value: 'Contributer', label: Localization.role_type_list.Contributer },
        { value: 'Designer', label: Localization.role_type_list.Designer }
    ];
    _personService = new PersonService();
    componentDidMount() {
        this._personService.setToken(this.props.token);
    }

    componentWillReceiveProps(nextProps: IProps) {
        // if (JSON.stringify(nextProps.defaultValue) !== JSON.stringify(this.props.defaultValue)) {
        // if (JSON.stringify(this.convertOuterToInner(nextProps.defaultValue || [])) !== JSON.stringify(this.state.list)) {
        if (
            JSON.stringify(this.convertInnerToOuter(this.convertOuterToInner(nextProps.defaultValue || [])))
            !== JSON.stringify(this.convertInnerToOuter(this.state.list))
        ) {
            // debugger;
            let newList = [...nextProps.defaultValue || []];
            this.setState({ ...this.state, list: this.convertOuterToInner(newList) }, () => {
                this.props.onChange(newList, this.handleValidate(this.state.list));
            });
        }
    }

    addRow() {
        let newList = [...this.state.list]
        newList.push({ id: Math.random() + '', role: undefined, person: undefined });
        this.setState({ ...this.state, list: newList }, () => {
            this.props.onChange(this.convertInnerToOuter(this.state.list), this.handleValidate(newList));
        });
    }

    removeRow(index: number) {
        let newlist = [...this.state.list]
        newlist.splice(index, 1);
        this.setState({ ...this.state, list: newlist },
            () => {
                this.props.onChange(this.convertInnerToOuter(this.state.list), this.handleValidate(newlist));
            });
    }

    // inputRoleChanged(val: any, index: number) {
    //     let newlist: any[] = [...this.state.list];
    //     newlist[index].role = val;
    //     this.setState({ ...this.state, list: newlist },
    //         () => {
    //             this.props.onChange(this.state.list, this.handleValidate(newlist));
    //         });
    // }

    convertInnerToOuter(list: IRoleRow[]): TOuterListItem[] {
        let f_l = list.filter(item => item.role && item.person);
        return f_l.map(item => {
            return {
                id: item.id,
                role: item.role!.value,
                person: item.person!.value
            }
        });
    }

    convertOuterToInner(list: TOuterListItem[]): IRoleRow[] {
        return list.map(item => {
            return {
                id: item.id || (Math.random() + ''),
                role: { label: item.role, value: item.role },
                person: { label: this.getPersonFullName(item.person), value: item.person }
            }
        });
    }

    handleRoleChange(val: { label: string, value: BOOK_ROLES }, index: number) {
        let newlist = [...this.state.list];
        newlist[index].role = val;
        this.setState({ ...this.state, list: newlist },
            () => {
                this.props.onChange(this.convertInnerToOuter(this.state.list), this.handleValidate(newlist));
            });
    }

    /* inputPersonChanged(val: any, index: number) {
        let newlist: any[] = [...this.state.list];
        newlist[index].person = val;
        this.setState({ ...this.state, list: newlist },
            () => {
                this.props.onChange(this.convertInnerToOuter(this.state.list), this.handleValidate(newlist));
            });
    } */

    // { label: string; value: IPerson; } | null | undefined
    handlePersonChange = (selectedPerson: any, index: number) => {
        // this.setState({ ...this.state, person: selectedPerson.value });
        let newlist = [...this.state.list];
        newlist[index].person = selectedPerson;
        this.setState({ ...this.state, list: newlist },
            () => {
                this.props.onChange(this.convertInnerToOuter(this.state.list), this.handleValidate(newlist));
            });
    }

    private getPersonFullName(person: IPerson): string {
        return (person.name || '') + ' ' + (person.last_name || '');
    }

    personRequstError_txt: string = Localization.no_item_found;

    async promiseOptions2(inputValue: any, callBack: any) {
        let filter = undefined;
        if (inputValue) {
            filter = { person: inputValue };
        }
        let res: any = await this._personService.search(10, 0, filter).catch(err => {
            let err_msg = this.handleError({ error: err, notify: false });
            this.personRequstError_txt = err_msg.body;
            // this.personRequstError_txt = (err.response || {}).statusText + ' ' + (err.response || {}).status;
        });

        if (res) {
            let persons = res.data.result.map((ps: any) => {
                return { label: this.getPersonFullName(ps), value: ps }
            });
            this.personRequstError_txt = Localization.no_item_found;//'no item';
            callBack(persons);
        } else {
            callBack();
        }
    }

    private setTimeout_val: any;
    debounce_300(inputValue: any, callBack: any) {
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

    handleValidate(list: IRoleRow[]): boolean {
        let valid = true;
        for (let i = 0; i < list.length; i++) {
            let obj = list[i];
            if (!obj.role || !obj.person) {
                valid = false;
                break;
            }
        }
        if (this.props.required && !list.length) {
            valid = false;
        }
        return valid;
    }

    render() {
        return (
            <>
                {
                    (this.props.label || this.props.required) ?
                        <label>
                            {this.props.label}
                            {
                                this.props.required
                                    ?
                                    <span className="text-danger">*</span>
                                    : ''
                            }
                        </label>
                        : ''}
                <div className="role-img-container">
                    {(this.state.list).map((item, index) => (
                        <Fragment key={item.id}>
                            <div className="pl-5 mt-4">
                                <div className="row">
                                    <div className="col-md-5">
                                        {/* <Input
                                            label="role"
                                            defaultValue={item.role}
                                            onChange={(val) => this.inputRoleChanged(val, index)}
                                            required
                                        /> */}
                                        <label htmlFor="">{Localization.role}</label>
                                        <Select
                                            onChange={(value: any) => this.handleRoleChange(value, index)}
                                            options={this.roleOptions}
                                            value={item.role}
                                            placeholder={Localization.role}
                                        />
                                    </div>
                                    <div className="col-md-5">
                                        {/* <Input
                                            label="person"
                                            defaultValue={item.person}
                                            onChange={(val) => this.inputPersonChanged(val, index)}
                                            required
                                        /> */}
                                        <label htmlFor="">{Localization.person}</label>
                                        <AsyncSelect
                                            placeholder={Localization.person}
                                            cacheOptions
                                            defaultOptions
                                            value={item.person}
                                            loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback)}
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
                </div>
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

export const BookRole = connect(
    state2props,
    dispatch2props
)(BookRoleComponent);