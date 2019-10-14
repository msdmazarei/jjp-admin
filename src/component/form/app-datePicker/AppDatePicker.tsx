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
    outTimeStamp?: number;
    value?: string;
    name?: string;
    className?: string;
    placeholder?: string;
    style?: {};
    gregorian?: boolean;
    autoOk?: boolean;
    onChange?: (timeStamp: any) => void
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
        const t = value.target;
        const val = t.value;
        const ts = new Date(val).getTime() / 1000;
        this.setState({
            ...this.state,
            value: val,
            timeStamp: ts,
        }, () => this.transferTimestamp());
    }

    transferTimestamp() {
        if (this.props.onChange) {
            this.props.onChange(this.state.timeStamp)
        }
    }

    changeTimeStampOutToString() {
        if (this.props.defaultValue) {
            this.setState({
                ...this.state,
                value: this.props.defaultValue
            })
        } else if (this.props.outTimeStamp) {
            let defVal = new Date((this.props.outTimeStamp*1000)).toString();
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
            <div>
                <DateInput
                    defaultValue={this.state.value}
                    value={this.state.value}
                    name={this.props.name}
                    autoOk={this.props.autoOk}
                    className={this.props.className}
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