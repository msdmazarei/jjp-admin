import React, { Fragment } from 'react';
import Select from 'react-select';

interface IProps {
    label?: string;
    placeholder?: string;
    className?: string;
    maxNumberOfTag?: number;
    minNumberOfTag?: number;
    clearable?: boolean;
    isMulti?: boolean;
    menuIsOpen?: boolean;
    requierdError?: string;
    validationError?: string;
    requierd?: boolean;
    defualtValue?: string | string[] | null | undefined;
    onChange?: (value: string[] | undefined, isValid: boolean) => void;
}

interface IState {
    value: { label: string, value: string }[];
    inputValue: string;
    isValid : boolean;
}

class TagSelectComponent extends React.Component<IProps, IState>{
    state = {
        value: [],
        inputValue: '',
        isValid : false,
    }

    state_Value_And_IsValid_passToPropsOnChange(){
        let valueForPassToProps : string[] = [];
        let array : { label: string, value: string }[] = this.state.value;
        for (let i = 0; i < array.length; i++) {
            let Tag : string = array[i].value
            valueForPassToProps.push(Tag)
        }
        let finalValueForPassToProps : string[] | undefined = valueForPassToProps.length === 0 ? undefined : valueForPassToProps;
        let isValidForPassToProps : boolean = valueForPassToProps.length === 0 ? false : true;
        if(this.props.requierd === true){
            if(this.props.onChange){
                this.props.onChange(finalValueForPassToProps,isValidForPassToProps)
            }
        }
        if(this.props.requierd === false || !this.props.requierd){
            if(this.props.onChange){
                this.props.onChange(finalValueForPassToProps,true)
            }
        }
    }

    handle_tagsKeyDown(event: any/* SyntheticKeyboardEvent<HTMLElement> */) {
        if (!this.state.inputValue) return;
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                const newVal = this.state.inputValue;
                const newValue : { label: string, value: string }[]  = [...this.state.value, { label: newVal, value: newVal }];
                this.setState({
                    ...this.state,
                    value: newValue,
                    inputValue: '',
                    isValid : newValue.length === 0 ? false : true,
                });
                event.preventDefault();
        }
    };

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
                    isMulti={this.props.isMulti === true ? true : false}
                    onChange={() => this.state_Value_And_IsValid_passToPropsOnChange()}
                    value={this.state.value}
                    placeholder={this.props.placeholder ? this.props.placeholder : undefined}
                    onKeyDown={(e) => this.handle_tagsKeyDown(e)}
                    inputValue={this.state.inputValue}
                    menuIsOpen={this.props.menuIsOpen === true ? true : false}
                    components={{
                        DropdownIndicator: null,
                    }}
                    isClearable={this.props.clearable === true ? true : false}
                    onInputChange={(inputVal) => this.setState({ ...this.state, inputValue: inputVal })}
                />
            </Fragment>
        )
    }
}

export const TagSelect = TagSelectComponent