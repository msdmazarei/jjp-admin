import React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { TInternationalization } from '../../../config/setup';
import { IToken } from '../../../model/model.token';
import { BaseComponent } from '../../_base/BaseComponent';
import { redux_state } from '../../../redux/app_state';
import { FixNumber } from '../fix-number/FixNumber';


interface IProps {
    history?: History;
    internationalization: TInternationalization;
    token: IToken;

    defultValue?: number | string;
    onChangeReturnNumber?: (timestamp: number) => void;
    onChangeReturnString?: (timestamp: string) => void;
    className?: string;
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
        let stringDuration = (this.state.duration).toString();
        if (this.props.onChangeReturnNumber && this.props.onChangeReturnString) {
            this.props.onChangeReturnNumber(this.state.duration);
            this.props.onChangeReturnString(stringDuration);
        };
        if (this.props.onChangeReturnNumber) {
            this.props.onChangeReturnNumber(this.state.duration);
        };
        if (this.props.onChangeReturnString) {
            this.props.onChangeReturnString(stringDuration);
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


    render() {
        return (
            <div className="row form-group app-durationpicker">
                <label htmlFor="">{this.props.cmpLable ? this.props.cmpLable : ""}</label>
                <div className={this.props.disable ? "form-control inputs-wrapper bg-color-disable" : "form-control inputs-wrapper"}>
                    <div className="row">
                        <div className="w-3p"></div>
                        <div className="w-30p">
                            <FixNumber
                                disabled={this.props.disable ? true : false}
                                placeholder={this.props.secondPlaceholder ? this.props.secondPlaceholder : ""}
                                defaultValue={this.state.s}
                                onChange={(value) => this.onSecondChange(value)}
                            />
                        </div>
                        <div className="w-3p font-weight-bold">
                            :
                        </div>
                        <div className="w-30p">
                            <FixNumber
                                disabled={this.props.disable ? true : false}
                                placeholder={this.props.minutePlaceholder ? this.props.minutePlaceholder : ""}
                                defaultValue={this.state.m}
                                onChange={(value) => this.onMinuteChange(value)}
                            />
                        </div>
                        <div className="w-3p font-weight-bold">
                            :
                        </div>
                        <div className="w-30p">
                            <FixNumber
                                disabled={this.props.disable ? true : false}
                                placeholder={this.props.hourPlaceholder ? this.props.hourPlaceholder : ""}
                                defaultValue={this.state.h}
                                onChange={(value) => this.onHourChange(value)}
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
        token: state.token,
    };
};

export const AppDurationPicker = connect(
    state2props,
    dispatch2props
)(AppDurationPickerComponent);