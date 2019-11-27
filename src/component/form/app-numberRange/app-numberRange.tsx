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
    to: number | undefined;
};

class AppRangePickerComponent extends BaseComponent<IProps, IState> {

    state = {
        from: undefined,
        to: undefined,
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
            this.cmp_has_error = false;
        }
    }

    handleChange(price: number | undefined, isValid: boolean, type: string) {
        let cmp_validation: boolean = false;
        if (type === 'from') {
            if (this.state.to === undefined) {
                if (price === undefined) {
                    cmp_validation = false;
                    this.cmp_has_error = true;
                } else {
                    cmp_validation = true;
                    this.cmp_has_error = false;
                }
            } else {
                if (price === undefined) {
                    cmp_validation = true;
                    this.cmp_has_error = false;
                } else if (price <= this.state.to!) {
                    cmp_validation = true;
                    this.cmp_has_error = false;
                } else {
                    cmp_validation = false;
                    this.cmp_has_error = true;
                }
            }
            let from_isValid: boolean = (price === undefined || typeof price === 'string') ? false : true;
            let to_isValid: boolean = (this.state.to === undefined || typeof this.state.to === 'string') ? false : true;
            if(from_isValid === false && to_isValid === false){
                cmp_validation =false;
            }
            this.setState({
                ...this.state,
                from: price,
            }, () => this.props.onChange(this.state.from, from_isValid, this.state.to, to_isValid, cmp_validation))
        }
        if (type === 'to') {
            if (this.state.from === undefined) {
                if (price === undefined) {
                    cmp_validation = false;
                    this.cmp_has_error = true;
                } else {
                    cmp_validation = true;
                    this.cmp_has_error = false;
                }
            } else {
                if (price === undefined) {
                    cmp_validation = true;
                    this.cmp_has_error = false;
                } else if (price >= this.state.from!) {
                    cmp_validation = true;
                    this.cmp_has_error = false;
                } else {
                    cmp_validation = false;
                    this.cmp_has_error = true;
                }
            }
            let from_isValid: boolean = (this.state.from === undefined || typeof this.state.from === 'string') ? false : true;
            let to_isValid: boolean = (price === undefined || typeof price === 'string') ? false : true;
            this.setState({
                ...this.state,
                to: price,
            }, () => this.props.onChange(this.state.from, from_isValid, this.state.to, to_isValid, cmp_validation))
        }
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
            to: undefined,
        }, () => this.reseter2());
    }

    reseter2() {
        this.cmp_has_error = false;
        this.setState({
            from: undefined,
            to: undefined,
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
                            onChange={(value, isValid) => this.handleChange(value, isValid, "from")}
                            placeholder={Localization.from}
                            defaultValue={this.state.from}
                            pattern={AppRegex.number}
                            patternError={Localization.validation_msg.Just_enter_the_numeric_value}
                        />
                    </div>
                    <div className="col-5">
                        <FixNumber
                            onChange={(value, isValid) => this.handleChange(value, isValid, "to")}
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

export const AppRangePicker = connect(
    state2props,
    dispatch2props
)(AppRangePickerComponent);