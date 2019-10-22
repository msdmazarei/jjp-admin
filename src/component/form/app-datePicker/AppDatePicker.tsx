import React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { TInternationalization } from '../../../config/setup';
import { BaseComponent } from '../../_base/BaseComponent';
import { redux_state } from '../../../redux/app_state';
// import { DateTimeInput, DateTimeInputSimple, DateInput, DateInputSimple } from 'react-hichestan-datetimepicker';
import { DateInput, DateTimeInput } from 'react-hichestan-datetimepicker';
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

interface IProps {
    history?: History;
    internationalization: TInternationalization;

    value: number | undefined;
    onChange?: (timeStamp: number, isValid: boolean) => void
    lable?: string;
    placeholder?: string;
    gregorian?: boolean;
    autoOk?: boolean;
    disable?: boolean;
    time?: boolean
};

interface IState {
    value1: string;
    value1_formatted: string;
    is_touch: boolean;
    gregorian_date: Date | null | undefined;
};

class AppDatePickerComponent extends BaseComponent<IProps, IState> {

    state = {
        value1: '',
        value1_formatted: '',
        is_touch: false,
        gregorian_date: null,
    };

    componentWillReceiveProps(nextProps: IProps) {
        if (this.props.internationalization.flag === 'fa') {
            if (nextProps.value !== this.props.value && nextProps.value !== undefined && nextProps === undefined) {
                return
            }
            if (nextProps.value !== this.props.value && nextProps.value !== undefined) {
                this.setState({
                    ...this.state,
                    value1: new Date(nextProps.value * 1000).toISOString(),
                });
            }
            if (nextProps.value === undefined && this.props.value === undefined) {
                this.setState({
                    ...this.state,
                    value1: '',
                    is_touch: false,
                });
            }
        } else {
            if (nextProps.value !== this.props.value && nextProps.value !== undefined) {
                this.setState({
                    ...this.state,
                    gregorian_date: new Date(nextProps.value * 1000),
                });
            }
            if (nextProps.value !== this.props.value && nextProps.value === undefined) {
                this.setState({
                    ...this.state,
                    gregorian_date: null,
                })
            }
        }
    }

    handleChange(event: any) {
        if (this.props.internationalization.flag === 'fa') {
            if (this.props.disable) {
                return;
            }
            if (this.state.is_touch && this.props.value === undefined) {
                this.setState({
                    value1: '',
                    value1_formatted: '',
                    is_touch: false,
                })
                return;
            }
            if (event.target.value === "") { return }
            const newState: any = {};
            const t = event.target;
            newState[t.name] = t.value;
            newState[t.name + '_formatted'] = t.formatted ? t.formatted : '';
            this.setState(newState);
            this.setState({
                ...this.state,
                is_touch: true,
            })

            const val = event.target.value;
            const ts = new Date(val).getTime() / 1000;
            if (this.props.onChange) {
                this.props.onChange(ts, this.validationFunc());
                return;
            }
        } else {
            if (this.props.disable) {
                return;
            }
            const ts = new Date(event).getTime() / 1000;
            this.setState({
                ...this.state,
                gregorian_date: event,
            });
            console.log(ts);
            console.log(event)
            if (this.props.onChange) {
                this.props.onChange(ts, this.validationFunc());
                return;
            }
        }
    }

    validationFunc() {
        return true;
    }

    return_jalali_picker() {
        return <>
            <label htmlFor=""> {this.props.lable ? this.props.lable : ""} </label>
            {
                this.props.time
                    ?
                    <DateTimeInput
                        value={this.state.value1}
                        name={'value1'}
                        // autoOk={this.props.autoOk}
                        className={this.props.disable ? "form-control pt-3 inputs-wrapper bg-color-disable" : "form-control inputs-wrapper pt-3"}
                        onChange={(value: any) => this.handleChange(value)}
                        placeholder={this.props.placeholder ? this.props.placeholder : ''}
                        gregorian={this.props.gregorian}
                    />
                    :
                    <DateInput
                        value={this.state.value1}
                        name={'value1'}
                        autoOk={this.props.autoOk}
                        className={this.props.disable ? "form-control pt-3 inputs-wrapper bg-color-disable" : "form-control inputs-wrapper pt-3"}
                        onChange={(value: any) => this.handleChange(value)}
                        placeholder={this.props.placeholder ? this.props.placeholder : ''}
                        gregorian={this.props.gregorian}
                    />
            }
        </>
    };

    return_gregorian_picker() {
        return <>
            <label htmlFor=""> {this.props.lable ? this.props.lable : ""} </label>
            {
                this.props.time
                    ?
                    <DatePicker
                        selected={this.state.gregorian_date}
                        onChange={(value) => this.handleChange(value)}
                        placeholderText={this.props.placeholder ? this.props.placeholder : ''}
                        disabled={this.props.disable ? true : false}
                        dateFormat="Pp"
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={1}
                        timeCaption="time"
                    />
                    :
                    <DatePicker
                        selected={this.state.gregorian_date}
                        onChange={(value) => this.handleChange(value)}
                        placeholderText={this.props.placeholder ? this.props.placeholder : ''}
                        disabled={this.props.disable ? true : false}
                        dateFormat="yyyy/MM/dd"
                    />
            }
        </>
    };

    render() {
        return (
            <div className={this.props.disable ? "row form-group app-datepicker px-3 all-event-disable" : "row form-group app-datepicker px-3"}   >
                {
                    this.props.internationalization.flag === 'fa'
                        ?
                        this.return_jalali_picker()
                        :
                        this.return_gregorian_picker()
                }
            </div>
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

export const AppDatePicker = connect(
    state2props,
    dispatch2props
)(AppDatePickerComponent);