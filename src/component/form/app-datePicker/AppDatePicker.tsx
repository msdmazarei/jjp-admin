import React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { TInternationalization } from '../../../config/setup';
import { BaseComponent } from '../../_base/BaseComponent';
import { redux_state } from '../../../redux/app_state';
// import { DateTimeInput, DateTimeInputSimple, DateInput, DateInputSimple } from 'react-hichestan-datetimepicker';
import { DateInput } from 'react-hichestan-datetimepicker';
interface IState {
    value: any;
    timeStamp: number;
}

interface IProps {
    history?: History;
    internationalization: TInternationalization;

    outTimeStamp?: number | undefined;
    value?: string;
    placeholder?: string;
    lable?: string;
    gregorian?: boolean;
    autoOk?: boolean;
    disable?: boolean;
    onChange?: (timeStamp: number, isValid: boolean) => void
}

class AppDatePickerComponent extends BaseComponent<IProps, IState> {
    state = {
        value: '',
        timeStamp: 0,
    }

    componentDidMount() {
        this.changeTimeStampOutToString();
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.outTimeStamp === undefined) {
            this.setState({
                ...this.state,
                value: '',
                timeStamp : 0,
            })
        }
        else if(nextProps.outTimeStamp !== this.props.outTimeStamp){
            // if (nextProps.outTimeStamp === undefined) {
            //     this.setState({
            //         ...this.state,
            //         value: '',
            //         timeStamp : 0,
            //     })
            // }
            let outPropsValue = Number(nextProps.outTimeStamp);
            let defVal = new Date((outPropsValue * 1000)).toString();
            this.setState({
                ...this.state,
                value: outPropsValue === 0 ? '' : defVal ,
                timeStamp:outPropsValue,
            })
        }
    }

    handleChange(value: any) {
        let format = value.target.date
        if (this.props.disable) {
            return;
        }
        if(format === null){
            return;
        }
        const t = value.target;
        const val = t.value;
        const ts = new Date(val).getTime() / 1000;
        this.setState({
            ...this.state,
            value: val,
            timeStamp: ts,
        }, () => this.transferTimestamp());
    }

    validationFunc() {
        return true;
    }

    transferTimestamp() {
        if (this.props.onChange) {
            this.props.onChange(this.state.timeStamp, this.validationFunc());
        }
        return;
    }

    changeTimeStampOutToString() {
        
        if(this.props.outTimeStamp && this.props.outTimeStamp === undefined){
            this.setState({
                ...this.state,
                value: '',
                timeStamp : 0,
            })
        }
        if (this.props.outTimeStamp) {
            if(isNaN(this.props.outTimeStamp)){
                this.setState({
                    ...this.state,
                    value: '',
                    timeStamp:0,
                })
            }
            let outPropsValue = Number(this.props.outTimeStamp);
            let defVal = new Date((outPropsValue * 1000)).toString();
            this.setState({
                ...this.state,
                value: defVal,
                timeStamp:outPropsValue,
            })
        } else {
            this.setState({
                ...this.state,
                value: '',
                timeStamp:0,
            })
        }
    }


    render() {
        return (
            <div className={this.props.disable ? "row form-group app-datepicker px-3 all-event-disable" : "row form-group app-datepicker px-3"}   >
                <label htmlFor="">{this.props.lable ? this.props.lable : ""}</label>
                <DateInput
                    value={this.state.value}
                    autoOk={this.props.autoOk}
                    className={this.props.disable ? "form-control pt-3 inputs-wrapper bg-color-disable" : "form-control inputs-wrapper pt-3"}
                    onChange={(value: any) => this.handleChange(value)}
                    placeholder={this.props.placeholder}
                    gregorian={this.props.gregorian}
                />
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