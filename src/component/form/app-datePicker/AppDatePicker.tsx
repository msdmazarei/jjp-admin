import React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { Dispatch } from 'redux';
import DatePicker from 'react-datepicker2';
import { TInternationalization } from '../../../config/setup';
import { IToken } from '../../../model/model.token';
import { BaseComponent } from '../../_base/BaseComponent';
import { redux_state } from '../../../redux/app_state';
import moment from 'moment';
import moment_jalaali from "moment-jalaali";
// import 'moment/locale/fa';
// import moment from 'moment';
// moment_jalaali.locale('fa');
// moment.locale('fa');
interface IState {
    value: any;
    timeStamp: number;
    isGregorian: boolean;
}

interface IProps {
    internationalization: TInternationalization;
    token: IToken;
    onchange?: (timeStamp: number) => void;
    isGregorian?: boolean;
    timePicker?: boolean;
    disabled?: boolean;
    min?: number;
    max?: number;
    ranges?: {}[];
    inputFormat?: string;
    inputJalaaliFormat?: string;
    class?: string;
    value?: any; // number;
}

class AppDatePickerComponent extends BaseComponent<IProps, IState> {
    state = {
        timeStamp: 0,
        // value: moment_jalaali('1396/7/6', 'jYYYY/jM/jD'), // moment_jalaali(),
        // value: undefined,
        // value: moment(),
        // value: moment('1396/7/6', 'jYYYY/jM/jD')
        isGregorian: false,
        // value: this.props.value ? moment_jalaali.unix(this.props.value).format("YYYY/MM/DD") : undefined
        // value: this.props.value ? moment_jalaali.unix(this.props.value) : undefined
        // value: this.props.value ? moment_jalaali(this.props.value) : undefined,
        // value: this.props.value ? moment.unix(this.props.value) : undefined
        value: moment_jalaali('1991-10-22')
    }

    constructor(p: IProps) {
        super(p);
        // let egfbd = moment();
        // let csacegfbd = moment_jalaali();
        // debugger
        // console.log(moment_jalaali('1396/7/6', 'jYYYY/jM/jD'));
        // console.log(moment_jalaali.unix(this.props.value));
    }

    setDate(value: any) {
        debugger;
        if (value && this.state.value && value.unix() === this.state.value.unix()) return;
        this.setState({
            ...this.state,
            // timeStamp: new Date(value).getTime() / 1000,
            value: value
        }, () => {
            if (this.props.onchange) {
                this.props.onchange(this.state.timeStamp)
                // console.log(value);
                // console.log(this.state.timeStamp)
            }
        });

    }
    chage() {
        this.setState({ isGregorian: !this.state.isGregorian })
    }
    render() {
        return (
            <>
                <div dir={''}>
                    <div className="btn btn-danger" onClick={() => this.chage()}>click</div>

                    <DatePicker
                        value={this.state.value}
                        // isGregorian={this.props.isGregorian}
                        // isGregorian={false}
                        // disabled={this.props.disabled}
                        // timePicker={this.props.timePicker}
                        // min={this.props.min}
                        // max={this.props.max}
                        // isGregorian={this.state.isGregorian}
                        // ranges={this.props.ranges}
                        // inputFormat={this.props.inputFormat}
                        // inputJalaaliFormat={this.props.inputJalaaliFormat}
                        onChange={(value: any) => this.setDate(value)}
                        // className={this.props.class}

                        // initialDate: '1991-10-22',
                        displayFormat={'jYYYY/jM/jD'}
                        timePicker={false}
                        isGregorian={false}
                    ></DatePicker>
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

export const AppDatePicker = connect(
    state2props,
    dispatch2props
)(AppDatePickerComponent);