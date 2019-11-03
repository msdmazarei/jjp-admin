import React from 'react';
// import { History } from 'history';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
// import { IToken } from '../../../model/model.token';
// import { ToastContainer } from 'react-toastify';
import { Input } from '../../form/input/Input';
import { Localization } from '../../../config/localization/localization';
import { Book_body } from '../BookGenerator/BookGenerator';


interface IProps {
    // match: any;
    // history: History;
    internationalization: TInternationalization;
    title?: string;
    id: string;
    type:string;
    text?:string;
    control?:string
    onbodyChange: (value: Book_body, isValid: boolean, id: string) => void;
    addChildAfter: (id: string) => void;
    addChildBefore: (id: string) => void;
}

interface IState {

}

class BodyGeneratorComponent extends BaseComponent<IProps, IState> {

    addChildToBefore(id: string) {
        debugger;
    }

    addChildToAfter(id: string) {
        debugger;
    }

    chapterTitleChanged(value: any, isValid: boolean, id: string) {
        debugger;

    }


    render() {
        return (
            <>
                <i className="fa fa-plus fa-2x" onClick={() => this.props.addChildBefore(this.props.id)}></i>
                <div className={this.props.type==='text' ? '' : 'd-none'}>
                <Input
                is_textarea
                defaultValue={this.props.text ? this.props.text: ''}
                onChange={(value : any , isValid : boolean) => this.props.onbodyChange(value,isValid,this.props.id)}
                />
                </div>
                <i className="fa fa-plus fa-2x" onClick={() => this.props.addChildAfter(this.props.id)}></i>
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

export const BodyGenerator = connect(
    state2props,
    dispatch2props
)(BodyGeneratorComponent);