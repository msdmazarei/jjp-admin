import React, { Fragment } from 'react';
import { IPerson } from '../../../model/model.person';
import { BOOK_ROLES, BOOK_TYPES } from '../../../enum/Book';
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
import { BookService } from '../../../service/service.book';

interface IRoleRow {
    id: string;
    role: { label: string, value: BOOK_ROLES } | undefined;
    person: { label: string, value: IPerson } | undefined;
}
interface IState {
    list: IRoleRow[];
}

type TOuterListItem = { role: BOOK_ROLES | undefined, person: IPerson | undefined, id?: string };
interface IProps {
    onChange: (list: TOuterListItem[], isValid: boolean) => void;
    defaultValue?: TOuterListItem[] | null;
    internationalization: TInternationalization;
    token: IToken;
    required?: boolean;
    label?: string;
}

class OrderItemsComponent extends BaseComponent<IProps, IState> {
    state = {
        list: this.convertOuterToInner(this.props.defaultValue || []) // todo
    }
    
    _personService = new PersonService();
    _bookService = new BookService();



    componentDidMount() {
        this._personService.setToken(this.props.token);
    }
    componentWillReceiveProps(nextProps: IProps) {
        if (
            JSON.stringify(this.convertInnerToOuter(this.convertOuterToInner(nextProps.defaultValue || [])))
            !== JSON.stringify(this.convertInnerToOuter(this.state.list))
        ) {
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
        this.setState({ ...this.state, list: newlist },
            () => {
                this.props.onChange(this.convertInnerToOuter(this.state.list), this.handleValidate(newlist));
            });
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


    ////////////   start person selection func ////////////////////

    handlePersonChange = (selectedPerson: any, index: number) => {
        let newlist = [...this.state.list];
        newlist[index].person = selectedPerson;
        this.setState({ ...this.state, list: newlist },
            () => {
                this.props.onChange(this.convertInnerToOuter(this.state.list), this.handleValidate(newlist));
            });
    }

    personRequstError_txt: string = Localization.no_item_found;

    async promiseOptions2(inputValue: any, callBack: any) {
        let filter = undefined;
        if (inputValue) {
            filter = { title: inputValue };
        }
        let res: any = await this._bookService.search(10, 0,filter).catch(err => {
            let err_msg = this.handleError({ error: err.response, notify: false });
            this.personRequstError_txt = err_msg.body;
        });

        if (res) {
            let books = res.data.result.map((ps: any) => {
                const b_type: any = ps.type;
                const b_t: BOOK_TYPES = b_type;
                let type = Localization.book_type_list[b_t];
                return { label: ps.title + " - " + type , value: ps }
            });
            this.personRequstError_txt = Localization.no_item_found;
            callBack(books);
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


    ////////////   end person selection func ////////////////////

   

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
                                    <div className="col-md-6">
                                        <label htmlFor="">{Localization.book}</label>
                                        <AsyncSelect
                                            placeholder={Localization.book}
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

export const OrderItems = connect(
    state2props,
    dispatch2props
)(OrderItemsComponent);