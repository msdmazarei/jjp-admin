import React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { TInternationalization } from '../../../config/setup';
import { BaseComponent } from '../../_base/BaseComponent';
import { redux_state } from '../../../redux/app_state';
import { FixNumber } from '../fix-number/FixNumber';
import { AppRegex } from '../../../config/regex';
import { Localization } from '../../../config/localization/localization';


interface IProps {
    history?: History;
    internationalization: TInternationalization;

    defultValue?: number | string | undefined;
    onChange?: (timestamp: string , isValid: boolean) => void;
    disable?: boolean;
    cmpLable?: string;
    hourPlaceholder?: string;
    minutePlaceholder?: string;
    secondPlaceholder?: string;
}

interface IState {
    duration: number;
    h: number;
    m: number;
    s: number;
}


class AppDurationPickerComponent extends BaseComponent<IProps, IState> {
    state = {
        duration: 0,
        h: 0,
        m: 0,
        s: 0,
    }

    componentDidMount() {
        this.convertOutTimeStampToInnerFormat();
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.defultValue === undefined || nextProps.defultValue === "NaN") {
            this.setState({
                ...this.state,
                duration: 0,
                h: 0,
                m: 0,
                s: 0,
            }, () => this.returnerValueToFather())
        }
        if (nextProps.defultValue !== this.props.defultValue) {
            if (nextProps.defultValue === undefined) {
                this.setState({
                    ...this.state,
                    duration: 0,
                    h: 0,
                    m: 0,
                    s: 0,
                }, () => this.returnerValueToFather())
            }
            let outTime = Number(nextProps.defultValue);
            if (outTime < 60) {
                this.setState({
                    duration: outTime,
                    s: outTime,
                    m: 0,
                    h: 0,
                });
            } else if (outTime >= 60 && outTime < 3600) {
                let minute = Math.floor(outTime / 60);
                let second = outTime - (minute * 60);
                this.setState({
                    duration: outTime,
                    h: 0,
                    m: minute,
                    s: second,
                });
            } else {
                let hour = Math.floor(outTime / 3600);
                if ((outTime - (hour * 3600)) < 60) {
                    let second = outTime % 3600;
                    this.setState({
                        duration: outTime,
                        h: hour,
                        m: 0,
                        s: second,
                    });
                } else {
                    let minute = Math.floor(((outTime - (hour * 3600)) / 60));
                    let second = (outTime - ((hour * 3600) + (minute * 60)));
                    this.setState({
                        duration: outTime,
                        h: hour,
                        m: minute,
                        s: second,
                    });
                }
            }
        }
    }

    convertOutTimeStampToInnerFormat() {
        if (this.props.defultValue) {
            let outTime = Number(this.props.defultValue);
            if (outTime < 60) {
                this.setState({
                    duration: outTime,
                    s: outTime,
                    m: 0,
                    h: 0,
                });
            } else if (outTime >= 60 && outTime < 3600) {
                let minute = Math.floor(outTime / 60);
                let second = outTime - (minute * 60);
                this.setState({
                    duration: outTime,
                    h: 0,
                    m: minute,
                    s: second,
                });
            } else {
                let hour = Math.floor(outTime / 3600);
                if ((outTime - (hour * 3600)) < 60) {
                    let second = outTime % 3600;
                    this.setState({
                        duration: outTime,
                        h: hour,
                        m: 0,
                        s: second,
                    });
                } else {
                    let minute = Math.floor(((outTime - (hour * 3600)) / 60));
                    let second = (outTime - ((hour * 3600) + (minute * 60)));
                    this.setState({
                        duration: outTime,
                        h: hour,
                        m: minute,
                        s: second,
                    });
                }
            }
        } else {
            this.setState({
                ...this.state,
                duration: 0,
                h: 0,
                m: 0,
                s: 0,
            })
        }
    }

    returnerValueToFather() {
        let stringDuration = this.state.duration === 0 ? '' : (this.state.duration).toString();
        if (this.props.onChange) {
            this.props.onChange(stringDuration, this.validationFunc());
        };
        return;
    }

    onSecondChange(sec: number) {
        if (isNaN(sec)) {
            return;
        }
        if (sec > 59 || sec < 0) {
            return;
        }

        let newDuration = Number(sec) + Number(this.state.m * 60) + Number(this.state.h * 3600);

        this.setState({
            ...this.state,
            s: sec,
            m: this.state.m,
            h: this.state.h,
            duration: newDuration,
        }, () => this.returnerValueToFather());
    }

    onMinuteChange(min: number) {
        if (isNaN(min)) {
            return;
        }
        if (min > 59 || min < 0) {
            return;
        }

        let newDuration = Number(this.state.s) + Number(min * 60) + Number(this.state.h * 3600);

        this.setState({
            ...this.state,
            s: this.state.s,
            m: min,
            h: this.state.h,
            duration: newDuration,
        }, () => this.returnerValueToFather());

    }

    onHourChange(hour: number) {
        if (isNaN(hour)) {
            return;
        }
        if (hour < 0) {
            return;
        }

        let newDuration = Number(this.state.s) + Number(this.state.m * 60) + Number(hour * 3600);

        this.setState({
            ...this.state,
            s: this.state.s,
            m: this.state.m,
            h: hour,
            duration: newDuration,
        }, () => this.returnerValueToFather());
    }

    validationFunc() {
        return true;
    }

    render() {
        return (
            <div className="row form-group app-durationpicker px-3">
                <label htmlFor="">{this.props.cmpLable ? this.props.cmpLable : ""}</label>
                <div className={this.props.disable ? "form-control inputs-wrapper bg-color-disable" : "form-control inputs-wrapper"}>
                    <div className="row">
                        <div className="w-3p"></div>
                        <div className="w-30p">
                            <FixNumber
                                disabled={this.props.disable ? true : false}
                                placeholder={this.props.secondPlaceholder ? this.props.secondPlaceholder : ""}
                                defaultValue={this.state.s === 0 ? '' : this.state.s}
                                onChange={(value) => this.onSecondChange(value)}
                                pattern={AppRegex.number}
                                patternError={Localization.validation_msg.Just_enter_the_numeric_value}
                            />
                        </div>
                        <div className="w-3p font-weight-bold">
                            :
                        </div>
                        <div className="w-30p">
                            <FixNumber
                                disabled={this.props.disable ? true : false}
                                placeholder={this.props.minutePlaceholder ? this.props.minutePlaceholder : ""}
                                defaultValue={this.state.m === 0 ? '' : this.state.m}
                                onChange={(value) => this.onMinuteChange(value)}
                                pattern={AppRegex.number}
                                patternError={Localization.validation_msg.Just_enter_the_numeric_value}
                            />
                        </div>
                        <div className="w-3p font-weight-bold">
                            :
                        </div>
                        <div className="w-30p">
                            <FixNumber
                                disabled={this.props.disable ? true : false}
                                placeholder={this.props.hourPlaceholder ? this.props.hourPlaceholder : ""}
                                defaultValue={this.state.h === 0 ? '' : this.state.h}
                                onChange={(value) => this.onHourChange(value)}
                                pattern={AppRegex.number}
                                patternError={Localization.validation_msg.Just_enter_the_numeric_value}
                            />
                        </div>
                    </div>
                </div>
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
        // token: state.token,
    };
};

export const AppDurationPicker = connect(
    state2props,
    dispatch2props
)(AppDurationPickerComponent);