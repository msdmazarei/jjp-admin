import React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { TInternationalization } from '../../../config/setup';
import { BaseComponent } from '../../_base/BaseComponent';
import { redux_state } from '../../../redux/app_state';
// import { DateTimeInput, DateTimeInputSimple, DateInput, DateInputSimple } from 'react-hichestan-datetimepicker';
import { DateInput } from 'react-hichestan-datetimepicker';


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
}

class AppDatePickerComponent extends BaseComponent<IProps> {

    handleChange(value: any) {
        if (this.props.disable) {
            return;
        }
        const val = value.target.value;
        const ts = new Date(val).getTime() / 1000;
        if(this.props.onChange){
            this.props.onChange(ts , this.validationFunc() )
        }
    }

    validationFunc() {
        return true;
    }

    render() {
        return (
            <div className={this.props.disable ? "row form-group app-datepicker px-3 all-event-disable" : "row form-group app-datepicker px-3"}   >
                <label htmlFor="">{this.props.lable ? this.props.lable : ""}</label>
                <DateInput
                    value={this.props.value === undefined ? '' : new Date(this.props.value * 1000).toString()}
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