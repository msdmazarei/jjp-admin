import React from 'react';
import { Localization } from '../../../config/localization/localization';

interface InputProps {
    // value?: any;
    defaultValue?: any;
    onChange: (value: any, isValid: boolean) => void;
    elRef?: (elName: HTMLInputElement | HTMLTextAreaElement) => void;
    pattern?: RegExp;
    patternName?: 'password' | 'number' | 'email';
    patternError?: string;
    type?: 'text' | 'password';
    label?: string;
    required?: boolean;
    validationFunc?: (value: any) => boolean;
    placeholder?: string;
    is_textarea?: boolean;
    textarea_rows?: number;
}
interface InputState {
    invalid?: boolean;
    touched?: boolean;
}

class Textarea extends React.Component<InputProps, InputState> {
    state = {
        invalid: false,
        touched: false
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
    componentWillReceiveProps(props: InputProps) {
        // this.setValidate(props.defaultValue);

        // if (this.handleValidate(props.defaultValue) !== this.handleValidate(this.props.defaultValue)) {
        if (this.handleValidate(props.defaultValue) !== !this.state.invalid) {
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
        } else if (this.props.pattern) {
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
        return (
            <div className="form-group">
                {
                    this.props.label &&
                    <label htmlFor={this.id}>{this.props.label}</label>
                }
                {
                    !this.props.is_textarea
                        ?
                        <input
                            id={this.id}
                            type={this.props.type}
                            className={`form-control ${this.state.invalid && this.state.touched ? 'is-invalid' : ''}`}
                            // value={this.props.value}
                            defaultValue={this.props.defaultValue}
                            onChange={e => this.handleChange(e)}
                            // ref={this.props.elRef}
                            ref={inputEl => this.setRef(inputEl)}
                            onBlur={() => this.onBlur()}
                            placeholder={this.props.placeholder}
                        />
                        :
                        <textarea
                            id={this.id}
                            className={`form-control ${this.state.invalid && this.state.touched ? 'is-invalid' : ''}`}
                            rows={this.props.textarea_rows || 4}

                            defaultValue={this.props.defaultValue}
                            onChange={e => this.handleChange(e)}
                            ref={inputEl => this.setRef(inputEl)}
                            onBlur={() => this.onBlur()}
                            placeholder={this.props.placeholder}
                        ></textarea>
                }

                {this.invalidFeedback()}
            </div>
        )
    }
}

export { Textarea };