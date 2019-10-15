import React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { TInternationalization } from '../../../config/setup';
import { IToken } from '../../../model/model.token';
import { BaseComponent } from '../../_base/BaseComponent';
import { redux_state } from '../../../redux/app_state';
// import { DateTimeInput, DateTimeInputSimple, DateInput, DateInputSimple } from 'react-hichestan-datetimepicker';
import { DateInput } from 'react-hichestan-datetimepicker';
interface IState {
    value: string;
    timeStamp: number;
}

interface IProps {
    history?: History;
    internationalization: TInternationalization;
    token: IToken;
    defaultValue?: string;
    outTimeStamp?: number | string;
    value?: string;
    name?: string;
    className?: string;
    placeholder?: string;
    style?: {};
    lable?: string;
    gregorian?: boolean;
    autoOk?: boolean;
    disable?: boolean;
    onChangeReturnNumber?: (timeStamp: number , isValid:boolean) => void
    onChangeReturnString?: (timeStamp: string , isValid:boolean) => void
}

class AppDatePickerComponent extends BaseComponent<IProps, IState> {
    state = {
        value: '',
        timeStamp: 0,
    }

    componentDidMount() {
        this.changeTimeStampOutToString()
    }

    handleChange(value: any) {
        if (this.props.disable) {
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

    validationFunc(){
        return true;
    }

    transferTimestamp() {
        let stringTimeStamp = (this.state.timeStamp).toString();
        if (this.props.onChangeReturnNumber && this.props.onChangeReturnString) {
            this.props.onChangeReturnNumber(this.state.timeStamp , this.validationFunc());
            this.props.onChangeReturnString(stringTimeStamp , this.validationFunc());
        }
        if (this.props.onChangeReturnNumber) {
            this.props.onChangeReturnNumber(this.state.timeStamp , this.validationFunc());
        }
        if (this.props.onChangeReturnString) {
            this.props.onChangeReturnString(stringTimeStamp , this.validationFunc());
        }
        return;
    }

    changeTimeStampOutToString() {
        if (this.props.defaultValue) {
            this.setState({
                ...this.state,
                value: this.props.defaultValue
            })
        } else if (this.props.outTimeStamp) {
            let outPropsValue = Number(this.props.outTimeStamp);
            if (isNaN(outPropsValue)) {
                this.setState({
                    ...this.state,
                    value: ''
                })
            }
            let defVal = new Date((outPropsValue * 1000)).toString();
            this.setState({
                ...this.state,
                value: defVal
            })
        } else {
            this.setState({
                ...this.state,
                value: ''
            })
        }
    }


    render() {
        return (
            <div className={this.props.disable ? "row form-group app-datepicker all-event-disable" : "row form-group app-datepicker"}   >
                <label htmlFor="">{this.props.lable ? this.props.lable : ""}</label>
                    <DateInput
                        defaultValue={this.state.value}
                        value={this.state.value}
                        name={this.props.name}
                        autoOk={this.props.autoOk}
                        className={this.props.disable ? "form-control pt-3 inputs-wrapper bg-color-disable" : "form-control inputs-wrapper pt-3"}
                        onChange={(value: any) => this.handleChange(value)}
                        placeholder={this.props.placeholder}
                        style={this.props.style}
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