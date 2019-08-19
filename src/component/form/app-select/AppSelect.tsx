import React from 'react';
import Select from 'react-select';
import { Localization } from '../../../config/localization/localization';

interface AppSelectProps {
    defaultValue?: any;
    onChange: (value: any, isValid: boolean) => void;
    elRef?: (elName: HTMLInputElement | HTMLTextAreaElement) => void;
    pattern?: RegExp;
    patternName?: 'password' | 'number' | 'email';
    patternError?: string;
    label?: string;
    required?: boolean;
    validationFunc?: (value: any) => boolean;
    type?: 'text' | 'password';
    is_textarea?: boolean;
    textarea_rows?: number;
    options:[]
}
interface AppSelectState {
    invalid?: boolean;
    touched?: boolean;
    selectedOption : any;
}

class AppSelect extends React.Component<AppSelectProps, AppSelectState> {
    state = {
        invalid: false,
        touched: false,
        selectedOption: null,
    };

    static defaultProps = {
        type: 'text'
    };

    id = 'input_' + Math.random();
    inputRef!: HTMLInputElement | HTMLTextAreaElement;


    setValidate(value: any) {
        this.setState({ ...this.state, invalid: !this.handleValidate(value) });
    }
    componentDidMount() {
        this.setValidate(this.props.defaultValue);
    }
    componentWillReceiveProps(props: AppSelectProps) {
        // this.setValidate(props.defaultValue);

        // if (this.handleValidate(props.defaultValue) !== this.handleValidate(this.props.defaultValue)) {
        if (
            (this.handleValidate(props.defaultValue) !== !this.state.invalid)
            &&
            (!this.isEmpty(this.props.defaultValue) || !this.isEmpty(props.defaultValue))
        ) {
            this.setValidate(props.defaultValue);
            this.props.onChange(props.defaultValue, this.handleValidate(props.defaultValue));
        }

        /* if (this.handleValidate(props.defaultValue) !== this.handleValidate(this.props.defaultValue)) {
            this.setValidate(props.defaultValue);
        }
        if (props.defaultValue !== this.props.defaultValue) {
            this.props.onChange(props.defaultValue, this.handleValidate(props.defaultValue));
        } */
    }
    isEmpty(val: any): boolean {
        if (val || val === 0) { return false }
        return true;
    }
    handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        this.setValidate(event.target.value);
        this.props.onChange(event.target.value, this.handleValidate(event.target.value));
    }
    onBlur() {
        this.setState({ ...this.state, touched: true });
    }
    handleValidate(val: any): boolean {
        if (this.props.required && !val) {
            return false;
        } else if (this.props.pattern && val) {
            if (!this.props.validationFunc) {
                return this.props.pattern.test(val);
            } else {
                return this.props.pattern.test(val) && this.props.validationFunc(val);
            }
        } else if (this.props.validationFunc) {
            return this.props.validationFunc(val);
        }
        return true;
    }
    invalidFeedback() {
        let invalidMsg = Localization.invalid_value;
        // if (this.props.required && !this.props.defaultValue) {
        if (this.props.required && (this.inputRef && !this.inputRef.value)) {
            invalidMsg = Localization.required_field; // this field is required
        } else if (this.props.patternError) {
            invalidMsg = this.props.patternError;
        }

        if (!this.state.invalid) { return; }

        return (
            <div className="invalid-feedback">
                {invalidMsg}
            </div>
        )
    }
    setRef(el: HTMLInputElement | HTMLTextAreaElement | null) {
        if (el) {
            this.inputRef = el;
            this.props.elRef && this.props.elRef(el);
        }
    }
    render() {
        const { selectedOption } = this.state;
        return (
            <div className="form-group">
                {
                    this.props.label &&
                    <label htmlFor={this.id}>{this.props.label}</label>
                }
                {
                   
                        <Select
                        options={this.props.options}
                        id={this.id}
                        type={this.props.type}
                        className={`form-control ${this.state.invalid && this.state.touched ? 'is-invalid' : ''}`}
                        value={selectedOption}
                        onChange={(e :any) => this.handleChange(e)}
                        defaultValue={this.props.defaultValue}
                        onBlur={() => this.onBlur()}
                        />
                        
                }

                {this.invalidFeedback()}
            </div>
        )
    }
}

export { AppSelect };