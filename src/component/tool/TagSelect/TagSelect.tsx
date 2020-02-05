import React from 'react';
import Select from 'react-select';

interface IProps {
    requierd?: boolean;
    isMulti?: boolean;
    maxNumberOfTag?: number;
    minNumberOfTag?: number;
    label?: string;
    placeholder?: string;
    className?: string;
    clearable?: boolean;
    menuIsOpen?: boolean;
    requierdError?: string;
    validationError?: string;
    defualtValue?: string | string[] | null | undefined;
    onChange?: (value: string[] | undefined, isValid: boolean) => void;
}

interface IState {
    value: { label: string, value: string }[] | null;
    inputValue: string;
    isValid : boolean;
}

class TagSelectComponent extends React.Component<IProps, IState>{
    state = {
        value: [],
        inputValue: '',
        isValid : false,
    }

    componentDidMount(){
        let defaultValue : { label: string, value: string }[] = [];
        if(this.props.defualtValue === undefined || this.props.defualtValue === null){
            this.setState({
                ...this.state,
                value : defaultValue,
                isValid : false,
            })
        }else if(typeof this.props.defualtValue === 'string'){
            let Tag : { label: string, value: string } = {label:this.props.defualtValue, value:this.props.defualtValue}
            defaultValue.push(Tag);
            this.setState({
                ...this.state,
                value : defaultValue,
                isValid : true,
            })
        }else{
            let array : string[] = this.props.defualtValue;
            for (let i = 0; i < array.length; i++) {
                let Tags : { label: string, value: string } = {label:array[i], value:array[i]};
                defaultValue.push(Tags);
            }
            this.setState({
                ...this.state,
                value : defaultValue,
                isValid : true,
            })
        }
    }

    state_Value_And_IsValid_passToPropsOnChange(){
        let valueForPassToProps : string[] = [];
        let array : { label: string, value: string }[] = this.state.value;
        if(array === [] || array === null){
            valueForPassToProps = []
        }else{
            for (let i = 0; i < array.length; i++) {
                let Tag : string = array[i].value
                valueForPassToProps.push(Tag)
            }
        }
        let finalValueForPassToProps : string[] | undefined = valueForPassToProps.length === 0 ? undefined : valueForPassToProps;
        let isValidForPassToProps : boolean = valueForPassToProps.length === 0 ? false : true;
        if(this.props.requierd === true){
            console.log(finalValueForPassToProps,isValidForPassToProps);
            if(this.props.onChange){
                this.props.onChange(finalValueForPassToProps,isValidForPassToProps)
            }
        }
        if(this.props.requierd === false || !this.props.requierd){
            console.log(finalValueForPassToProps,true);
            if(this.props.onChange){
                this.props.onChange(finalValueForPassToProps,true)
            }
        }
    }

    is_tag_exist(newTag : string): boolean{
        let array : { label: string, value: string }[] | null = this.state.value;
        if(array === null || array.length === 0 || array === []){
            return false;
        }else{
            let res : boolean = false;
            for (let i = 0; i < array.length; i++) {
                if(array[i].value === newTag){
                    res = true;
                    break;
                }
            }
            return res
        }
    }

    handle_tagsKeyDown(event: any/* SyntheticKeyboardEvent<HTMLElement> */) {
        if (!this.state.inputValue) return;
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                const newVal = this.state.inputValue;
                if(this.is_tag_exist(newVal) === true) return;
                const newValue : { label: string, value: string }[]  = this.state.value === null ? [{ label: newVal, value: newVal }] : [...this.state.value, { label: newVal, value: newVal }];
                this.setState({
                    ...this.state,
                    value: newValue,
                    inputValue: '',
                    isValid : newValue.length === 0 ? false : true,
                },() => console.log(this.state));
                event.preventDefault();
        }
    };

    tag_handleChange(newValue: { label: string, value: string }[]){
        if((this.state.value === [] || this.state.value === null)&&(newValue === [] || newValue === null)) return;
        this.setState({
            ...this.state,
            value : newValue,
            inputValue : '',
            isValid : newValue === null ? false : true,
        },() => console.log(this.state))
    }

    render() {
        return (
            <div className="content">
                {
                    this.props.label
                        ?
                        <label htmlFor="">{this.props.label}</label>
                        :
                        undefined
                }
                <Select
                    // isMulti={this.props.isMulti === true ? true : false}
                    isMulti
                    onChange={(value : any) => this.tag_handleChange(value)}
                    value={this.state.value}
                    placeholder={this.props.placeholder ? this.props.placeholder : undefined}
                    onKeyDown={(e) => this.handle_tagsKeyDown(e)}
                    inputValue={this.state.inputValue}
                    menuIsOpen={this.props.menuIsOpen === true ? true : false}
                    components={{
                        DropdownIndicator: null,
                    }}
                    isClearable={this.props.clearable === true ? true : false}
                    // isClearable
                    onInputChange={(inputVal) => this.setState({ ...this.state, inputValue: inputVal })}
                />
            </div>
        )
    }
}

export const TagSelect = TagSelectComponent