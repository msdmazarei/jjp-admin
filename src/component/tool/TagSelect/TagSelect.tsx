import React, { Fragment } from 'react';
import Select from 'react-select';

interface IProps {
    requierd?: boolean;
    isMulti?: boolean;
    maxNumberOfTag?: number;
    minNumberOfTag?: number;
    label?: string;
    placeholder?: string;
    clearable?: boolean;
    defualtValue?: string[];
    requierdError?: string;
    validationError?: string;
    VAlidationFunc?: (value: string[]) => boolean;
    onChange?: (value: string[] , isValid: boolean) => void;
}

interface IState {
    value: { label: string, value: string }[] | null;
    inputValue: string;
    is_touch: boolean;
}

class TagSelectComponent extends React.Component<IProps, IState>{
    state = {
        value: [],
        inputValue: '',
        is_touch: false,
    }

    componentDidMount() {
        let defaultValue: { label: string, value: string }[] = [];
        if (this.props.defualtValue === undefined || this.props.defualtValue === null || this.props.defualtValue === []) {
            this.setState({
                ...this.state,
                value: defaultValue,
            })
        } else if (typeof this.props.defualtValue === 'string') {
            let Tag: { label: string, value: string } = { label: this.props.defualtValue, value: this.props.defualtValue }
            defaultValue.push(Tag);
            this.setState({
                ...this.state,
                value: defaultValue,
            })
        } else {
            let array: string[] = this.props.defualtValue;
            for (let i = 0; i < array.length; i++) {
                let Tags: { label: string, value: string } = { label: array[i], value: array[i] };
                defaultValue.push(Tags);
            }
            this.setState({
                ...this.state,
                value: defaultValue,
            })
        }
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps === this.props) {
            return
        } else {
            let defaultValue: { label: string, value: string }[] = [];
            if (nextProps.defualtValue === undefined || nextProps.defualtValue === null || nextProps.defualtValue === []) {
                this.setState({
                    ...this.state,
                    value: defaultValue,
                })
            } else if (typeof nextProps.defualtValue === 'string') {
                let Tag: { label: string, value: string } = { label: nextProps.defualtValue, value: nextProps.defualtValue }
                defaultValue.push(Tag);
                this.setState({
                    ...this.state,
                    value: defaultValue,
                })
            } else {
                let array: string[] = nextProps.defualtValue;
                for (let i = 0; i < array.length; i++) {
                    let Tags: { label: string, value: string } = { label: array[i], value: array[i] };
                    defaultValue.push(Tags);
                }
                this.setState({
                    ...this.state,
                    value: defaultValue,
                })
            }
        }
    }

    state_Value_And_IsValid_passToPropsOnChange() {
        let valueForPassToProps: string[] = [];
        let array: { label: string, value: string }[] = this.state.value;
        if (array === [] || array === null) {
            valueForPassToProps = []
        } else {
            for (let i = 0; i < array.length; i++) {
                let Tag: string = array[i].value
                valueForPassToProps.push(Tag)
            }
        }
        let finalValueForPassToProps: string[] | undefined = valueForPassToProps.length === 0 ? [] : valueForPassToProps;
        let isValidForPassToProps: boolean = this.props.VAlidationFunc ? this.validation_calculate_for_pass_to_props(valueForPassToProps)&&this.props.VAlidationFunc(finalValueForPassToProps) : this.validation_calculate_for_pass_to_props(valueForPassToProps);
        if(this.props.onChange){
            this.props.onChange(finalValueForPassToProps,isValidForPassToProps);
        }
    }

    validation_calculate_for_pass_to_props(array: string[]): boolean {
        let arrayLenght: number = 0;
        if (array === undefined || array === null || array.length === 0 || array === []) {
            arrayLenght = 0;
        } else {
            arrayLenght = array.length;
        }
        if ((this.props.isMulti === undefined || this.props.isMulti === false) && (this.props.requierd === false || this.props.requierd === undefined)) {
            if(arrayLenght <= 1){
                return true;
            }
            return false;
        } else if ((this.props.isMulti === undefined || this.props.isMulti === false) && this.props.requierd === true) {
            if (arrayLenght === 0 || arrayLenght > 1) {
                return false;
            }
            return true;
        } else if (this.props.isMulti === true && (this.props.requierd === false || this.props.requierd === undefined)) {
            if (this.props.maxNumberOfTag && arrayLenght > this.props.maxNumberOfTag) {
                return false;
            }
            if (this.props.minNumberOfTag && arrayLenght < this.props.minNumberOfTag) {
                return false;
            }
            return true;
        } else if (this.props.isMulti === true && this.props.requierd === true) {
            if (this.props.requierd && arrayLenght === 0) {
                return false;
            }
            if (this.props.maxNumberOfTag && arrayLenght > this.props.maxNumberOfTag) {
                return false;
            }
            if (this.props.minNumberOfTag && arrayLenght < this.props.minNumberOfTag) {
                return false;
            }
            return true;
        }
        return true;
    }

    is_tag_exist(newTag: string): boolean {
        let array: { label: string, value: string }[] | null = this.state.value;
        if (array === null || array.length === 0 || array === []) {
            return false;
        } else {
            let res: boolean = false;
            for (let i = 0; i < array.length; i++) {
                if (array[i].value === newTag) {
                    res = true;
                    break;
                }
            }
            return res
        }
    }

    handle_tagsKeyDown(event: any/* SyntheticKeyboardEvent<HTMLElement> */) {
        if((this.props.isMulti === undefined || this.props.isMulti === false) )
        if (!this.state.inputValue) return;
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                const newVal = this.state.inputValue;
                if((this.props.isMulti === undefined || this.props.isMulti === false) && this.state.value.length > 0) return;
                if (this.is_tag_exist(newVal) === true) return;
                const newValue: { label: string, value: string }[] = this.state.value === null ? [{ label: newVal, value: newVal }] : [...this.state.value, { label: newVal, value: newVal }];
                this.setState({
                    ...this.state,
                    value: newValue,
                    inputValue: '',
                    is_touch : true,
                }, () => this.state_Value_And_IsValid_passToPropsOnChange());
                event.preventDefault();
        }
    };

    tag_handleChange(newValue: { label: string, value: string }[]) {
        if ((this.state.value === [] || this.state.value === null) && (newValue === [] || newValue === null)) return;
        this.setState({
            ...this.state,
            value: newValue,
            inputValue: '',
            is_touch : true,
        }, () => this.state_Value_And_IsValid_passToPropsOnChange())
    }

    validationErrorHandle(array : any[]) {
        let arrayLenght: number = 0;
        if (array === undefined || array === null || array.length === 0 || array === []) {
            arrayLenght = 0;
        } else {
            arrayLenght = this.state.value.length;
        }

        if (this.state.is_touch === true) {
            if (this.props.requierd && this.props.requierd === true && arrayLenght === 0) {
                return <div>{this.props.requierdError}</div>
            } 
            if (this.props.maxNumberOfTag && arrayLenght > this.props.maxNumberOfTag) {
                return <div>{this.props.validationError}</div>
            }
            if(this.props.minNumberOfTag && arrayLenght < this.props.minNumberOfTag){
                return <div>{this.props.validationError}</div>
            }
        } else {
            return
        }
    }

    render() {
        return (
            <Fragment>
                {
                    this.props.label
                        ?
                        <label htmlFor="">{this.props.label}</label>
                        :
                        undefined
                }
                <Select
                    isMulti
                    onChange={(value: any) => this.tag_handleChange(value)}
                    value={this.state.value}
                    placeholder={this.props.placeholder ? this.props.placeholder : undefined}
                    onKeyDown={(e) => this.handle_tagsKeyDown(e)}
                    inputValue={this.state.inputValue}
                    menuIsOpen={false}
                    components={{
                        DropdownIndicator: null,
                    }}
                    isClearable={this.props.clearable === true ? true : false}
                    onInputChange={(inputVal) => this.setState({ ...this.state, inputValue: inputVal })}
                />
                {
                    this.validationErrorHandle(this.state.value)
                }
            </Fragment>
        )
    }
}

export const TagSelect = TagSelectComponent