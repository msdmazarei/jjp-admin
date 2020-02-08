import React from 'react';
import {TagSelect} from './TagSelect'

interface IState {
    value: string[] | undefined;
    is_valid: boolean;
}

class ExampleComponent extends React.Component<any, IState>{
    state = {
        value: [],
        is_valid: false,
    }

    consoler_seter(newValue: string[], isValid: boolean){
        console.log('fired')
        this.setState({...this.state,value : newValue ,is_valid : isValid }, () => console.log(this.state.value , this.state.is_valid))
    }
    render() {
        return (
            <div className="content">
                <div className="row">
                    <div className="col-4">
                        <TagSelect 
                            // requierd
                            // isMulti
                            // maxNumberOfTag={5}
                            minNumberOfTag={3}
                            label='tag'
                            placeholder='tag'
                            clearable
                            requierdError='req'
                            validationError='out of range'
                            defualtValue={this.state.value}
                            onChange={(newValue: string[], isValid: boolean) => this.consoler_seter(newValue,isValid)}
                        />
                    </div>
                </div>
                <div className="row mt-5">
                    <button
                    className='btn btn-warning'
                    onClick={() => this.setState({...this.state , value : [] , is_valid : false})}
                    >
                        reset
                    </button>
                </div>
            </div>
        )
    }
}

export const Example = ExampleComponent;