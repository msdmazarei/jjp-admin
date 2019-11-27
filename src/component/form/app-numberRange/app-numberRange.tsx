import React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { TInternationalization } from '../../../config/setup';
import { BaseComponent } from '../../_base/BaseComponent';
import { redux_state } from '../../../redux/app_state';
import { Localization } from '../../../config/localization/localization';
import { FixNumber } from '../fix-number/FixNumber';
import { AppRegex } from '../../../config/regex';
import { string } from 'prop-types';

interface IProps {
    history?: History;
    internationalization: TInternationalization;
    from: number | undefined;
    to: number | undefined;
    onChange: (from: number | undefined, from_isValid: boolean, to: number | undefined, to_isValid: boolean, is_valid: boolean) => void;
    label: string;
};

interface IState {
    from: number | undefined;
    from_isValid: boolean;
    to: number | undefined;
    to_isValid: boolean;
    cmp_isValid: boolean;
};

class AppNumberRangeComponent extends BaseComponent<IProps, IState> {

    state = {
        from: undefined,
        from_isValid: false,
        to: undefined,
        to_isValid: false,
        cmp_isValid: false,
    };

    cmp_has_error: boolean = false;

    componentDidMount() {
        this.setState({
            from: this.props.from,
            to: this.props.to,
        })
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps === this.props) {
            return;
        } else {
            this.setState({
                from: nextProps.from,
                to: nextProps.to,
            })
        }
        if (nextProps.from === undefined && nextProps.to === undefined) {
            this.setState({
                from: undefined,
                from_isValid: false,
                to: undefined,
                to_isValid: false,
                cmp_isValid: false,
            })
            this.cmp_has_error = false;
        }
    }


    fromChange(value: any, Validation: boolean = true) {
        let isValid;
        let newVal: any = value;
        if (value === undefined || value === '' || Validation === false) {
            isValid = false;
            newVal = undefined;
        } else {
            isValid = true;
            newVal = Number(newVal);
        };
        this.setState({
            ...this.state,
            from: newVal,
            from_isValid: isValid
        }, () => this.cmpValidationCheck())
    }

    toChange(value: any, Validation: boolean = true) {
        let isValid;
        let newVal: any = value;
        if (value === undefined || value === '' || Validation === false) {
            isValid = false;
            newVal = undefined;
        } else {
            isValid = true;
            newVal = Number(newVal);
        };
        this.setState({
            ...this.state,
            to: newVal,
            to_isValid: isValid
        }, () => this.cmpValidationCheck())
    }

    cmpValidationCheck() {
        let cmpValidation: boolean = false;
        if (this.state.from_isValid === false && this.state.to_isValid === false) {
            cmpValidation = false;
            this.cmp_has_error = true;
        } else {
            if (this.state.from_isValid === true && this.state.to_isValid === false) {
                cmpValidation = true;
                this.cmp_has_error = false;
            }
            if (this.state.from_isValid === false && this.state.to_isValid === true) {
                cmpValidation = true;
                this.cmp_has_error = false;
            }
            if (this.state.from_isValid === true && this.state.to_isValid === true) {
                if (this.state.from! <= this.state.to!) {
                    cmpValidation = true;
                    this.cmp_has_error = false;
                } else {
                    cmpValidation = false;
                    this.cmp_has_error = true;
                }
            }
        };
        this.setState({
            ...this.state,
            cmp_isValid: cmpValidation,
        }, () => this.statePassToProps_onChangeFunc());
    }

    statePassToProps_onChangeFunc() {
        this.props.onChange(this.state.from, this.state.from_isValid, this.state.to, this.state.to_isValid, this.state.cmp_isValid);
    }

    validationFunc(from: any, to: any) {
        if (typeof from === "undefined" && typeof to === "undefined") {
            return false;
        }
        return true;
    }

    reseter() {
        this.setState({
            from: undefined,
            from_isValid: false,
            to: undefined,
            to_isValid: false,
            cmp_isValid: false,
        }, () => this.reseter2());
    }

    reseter2() {
        this.cmp_has_error = false;
        this.setState({
            from: undefined,
            from_isValid: false,
            to: undefined,
            to_isValid: false,
            cmp_isValid: false,
        }, () => this.props.onChange(undefined, false, undefined, false, false));
    }

    error_msg_handler(has_error: boolean) {
        if (has_error === true) {
            return <div className="select-feedback mt-n2 px-1">{Localization.selected_range_is_not_valid}</div>
        } else {
            return
        }
    }

    render() {
        return (
            <>
                <label htmlFor=""> {this.props.label}</label>
                <div className="row range-picker">
                    <div className="col-5">
                        <FixNumber
                            onChange={(value, isValid) => this.fromChange(value, isValid)}
                            placeholder={Localization.from}
                            defaultValue={this.state.from}
                            pattern={AppRegex.number}
                            patternError={Localization.validation_msg.Just_enter_the_numeric_value}
                        />
                    </div>
                    <div className="col-5">
                        <FixNumber
                            onChange={(value, isValid) => this.toChange(value, isValid)}
                            placeholder={Localization.to}
                            defaultValue={this.state.to}
                            pattern={AppRegex.number}
                            patternError={Localization.validation_msg.Just_enter_the_numeric_value}
                        />
                    </div>
                    <div className="col-2">
                        <i
                            title={Localization.reset}
                            className="fa fa-times fa-2x text-warning"
                            onClick={() => this.reseter()}
                        >
                        </i>
                    </div>
                </div>
                {this.error_msg_handler(this.cmp_has_error)}
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

export const AppNumberRange = connect(
    state2props,
    dispatch2props
)(AppNumberRangeComponent);