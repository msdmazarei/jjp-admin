import React, { Fragment } from 'react';
import { BOOK_TYPES } from '../../../enum/Book';
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
import { IBook } from '../../../model/model.book';

interface IBookRow {
    id: string;
    count: number;
    book: { label: string, value: IBook } | undefined;
}
interface IState {
    list: IBookRow[];
}

type TOuterListItem = { id?: string, count: number, book: IBook };
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
        this._bookService.setToken(this.props.token);
    }
    componentWillReceiveProps(nextProps: IProps) {
        // return;
        if (
            JSON.stringify(this.convertInnerToOuter(this.convertOuterToInner(nextProps.defaultValue || [])))
            !== JSON.stringify(this.convertInnerToOuter(this.state.list))
        ) {
            // if (
            //     JSON.stringify(this.convertOuterToInner((nextProps.defaultValue || [])))
            //     !== JSON.stringify(this.convertOuterToInner(this.convertInnerToOuter(this.state.list)))
            // ) {

            let newList = [...nextProps.defaultValue || []];
            this.setState({ ...this.state, list: this.convertOuterToInner(newList) }, () => {
                this.props.onChange(newList, this.handleValidate(this.state.list));
            });
        }
    }

    addRow() {
        let newList = [...this.state.list]
        newList.push({ id: Math.random() + '', count: 1, book: undefined });
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
    convertInnerToOuter(list: IBookRow[]): TOuterListItem[] {
        let new_list = [...list];
        return new_list.map(item => {
            return {
                id: item.id,
                count: item.count,
                book: (item.book! || {}).value
            }
        });
    }

    convertOuterToInner(list: TOuterListItem[]): IBookRow[] {
        return list.map(item => {
            const b_type: any = (item.book! || {}).type;
            const b_t: BOOK_TYPES = b_type;
            let type = Localization.book_type_list[b_t];
            return {
                id: item.id || (Math.random() + ''),
                count: item.count,
                book: item.book ? { label: item.book.title + " - " + type, value: item.book } : undefined
            }
        });
    }


    select_noOptionsMessage(obj: { inputValue: string }) {
        return this.personRequstError_txt;
    }

    handleValidate(list: IBookRow[]): boolean {
        let valid = true;
        for (let i = 0; i < list.length; i++) {
            let obj = list[i];
            if (!obj.count || !obj.book || typeof obj.book.value.price !== 'number') {
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

    handleBookChange = (selectedBook: any, index: number) => {
        let newlist = [...this.state.list];
        newlist[index].book = selectedBook;
        newlist[index].count = 1;
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
        let res: any = await this._bookService.search(10, 0, filter).catch(err => {
            let err_msg = this.handleError({ error: err.response, notify: false });
            this.personRequstError_txt = err_msg.body;
        });

        if (res) {
            let books = res.data.result.map((ps: any) => {
                const b_type: any = ps.type;
                const b_t: BOOK_TYPES = b_type;
                let type = Localization.book_type_list[b_t];
                return { label: ps.title + " - " + type, value: ps }
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


    ///////////////////   book counter func ////////////////////////

    private updateCartItem_up(item: any, index: number) {
        if (!this.is_countable_book(item.book.value)) {
            return;
        }
        let newlist = [...this.state.list]
        newlist[index].count = newlist[index].count + 1;
        this.setState({ ...this.state, list: newlist },
            () => {
                this.props.onChange(this.convertInnerToOuter(this.state.list), this.handleValidate(newlist));
            });
    }

    private updateCartItem_down(item: any, index: number) {
        if (!this.is_countable_book(item.book.value)) {
            return;
        }
        let newlist = [...this.state.list]
        if (newlist[index].count < 2) {
            return;
        }
        newlist[index].count = newlist[index].count - 1;
        this.setState({ ...this.state, list: newlist },
            () => {
                this.props.onChange(this.convertInnerToOuter(this.state.list), this.handleValidate(newlist));
            });
    }

    private is_countable_book(book: IBook): boolean {
        if (book.type === BOOK_TYPES.Hard_Copy || book.type === BOOK_TYPES.DVD) {
            return true;
        }
        return false;
    }


    ////////////////////////////////////////////////////////////////



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
                                    <div  title={Localization.remove} className="col-md-1 mt-2">
                                        <BtnLoader
                                            btnClassName="btn btn-outline-danger btn-remove-orderitems btn-sm mt-4"
                                            onClick={() => this.removeRow(index)}
                                            loading={false}
                                            disabled={false}
                                        >
                                            &times;
                                        </BtnLoader>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="">{Localization.book}</label>
                                        <AsyncSelect
                                            placeholder={Localization.book}
                                            cacheOptions
                                            defaultOptions
                                            value={item.book}
                                            loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback)}
                                            noOptionsMessage={(obj) => this.select_noOptionsMessage(obj)}
                                            onChange={(selectedBook) => this.handleBookChange(selectedBook, index)}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        {
                                            item.book
                                                ?
                                                <div className="item-count-wrapper text-center mr-3">
                                                    <div className={
                                                        !this.is_countable_book(item.book.value)
                                                            ?
                                                            "btn btn-light btn-sm cursor-pointer disabled"
                                                            :
                                                            "btn btn-light btn-sm cursor-pointer"
                                                    }
                                                        onClick={() => this.updateCartItem_up(item, index)}>
                                                        <i className="fa fa-angle-up"></i>
                                                    </div>
                                                    {
                                                        this.is_countable_book(item.book.value) ?
                                                            <div className="item-count rounded">{item.count}</div>
                                                            :
                                                            <div className="item-count rounded disable">{item.count}</div>
                                                    }
                                                    <div className={
                                                        "btn btn-light btn-sm cursor-pointer " +
                                                        (item.count! < 2 ? 'disabled' : '')
                                                    }
                                                        onClick={() => this.updateCartItem_down(item, index)}>
                                                        <i className="fa fa-angle-down"></i>
                                                    </div>
                                                </div>
                                                :
                                                ""
                                        }
                                    </div>
                                    <div className="col-md-3">
                                        {
                                            item.book && item.book.value.price
                                                ?
                                                <div className="total-price rounded">
                                                    {
                                                        (item.count * item.book.value.price).toLocaleString()
                                                    }
                                                </div>
                                                :
                                                ""
                                        }
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    ))}
                    <div className="mx-4 px-3 my-4">
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