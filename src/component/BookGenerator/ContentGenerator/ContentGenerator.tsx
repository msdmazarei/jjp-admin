import React from 'react';
import { History } from 'history';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { Input } from '../../form/input/Input';
import { Localization } from '../../../config/localization/localization';
import { Book_body } from '../BookGenerator/BookGenerator';
import Select from 'react-select';


interface IProps {
    match?: any;
    history?: History;
    internationalization: TInternationalization;
    id: string;
    type: string;
    text?: string;
    control?: string
    onContentChange: (value: Book_body, isValid: boolean, id: string) => void;
    addContentBefore: (id: string) => void;
    addContentAfter: (id: string) => void;
}

interface IState {
    type: { value: string, label: string } | null;
    id: string | undefined;
    text?: string | undefined;
    control?: { value: string, label: string } | null;
}

class ContentGeneratorComponent extends BaseComponent<IProps, IState> {

    typesOption = [
        { value: 'text', label: 'text' },
        { value: 'control', label: 'control' }
    ];

    controlsOption = [
        { value: 'new_line', label: 'new_line' },
        { value: 'new_page', label: 'new_page' }
    ];

    state = {
        type: null,
        id: undefined,
        text: undefined,
        control: this.controlsOption[0],
    }

    componentDidMount() {
        this.setState({
            type: { value: this.props.type, label: this.props.type },
            id: this.props.id,
            text: this.props.text ? this.props.text : undefined,
            control: this.props.control ? { value: this.props.control, label: this.props.control } : this.controlsOption[0],
        })
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps === this.props) return;
        this.setState({
            type: { value: nextProps.type, label: nextProps.type },
            id: nextProps.id,
            text: nextProps.text ? nextProps.text : undefined,
            control: nextProps.control ? { value: nextProps.control, label: nextProps.control } : null,
        })
    }

    passBodyObjToProps() {
        if (this.state.type === null) return
        if ((this.state.type! as { value: string, label: string }).value === 'text') {
            let Obj: { type: string, text: string, id: string } = { type: (this.state.type! as { value: string, label: string }).value, text: this.state.text === undefined ? '' : this.state.text!, id: this.props.id };
            this.props.onContentChange(Obj, true, this.props.id)
        }
        if ((this.state.type! as { value: string, label: string }).value === 'control') {
            let Obj: { type: string, control: string, id: string } = { type: (this.state.type! as { value: string, label: string }).value, control: this.state.control.value, id: this.props.id };
            this.props.onContentChange(Obj, true, this.props.id)
        }
    }

    handleTypeChange(value: any) {
        if ((value as { value: string, label: string }).value === 'text') {
            this.setState({
                ...this.state,
                type: value,
                control: this.controlsOption[0],
            }, () => this.passBodyObjToProps())
        }
        if ((value as { value: string, label: string }).value === 'control') {
            this.setState({
                ...this.state,
                type: value,
                text: undefined
            })
        }
    }

    handleControlChange(value: any) {
        this.setState({
            ...this.state,
            control: value,
            text: undefined,
        }, () => this.passBodyObjToProps())
    }

    onTextChange(value: any, isValid: boolean) {
        this.setState({
            ...this.state,
            text: value,
            control: this.controlsOption[0],
        }, () => this.passBodyObjToProps())
    }

    render() {
        return (
            <>
                <div className="col-11">
                    <div className="row">
                        <div className="col-5">
                            <div className="form-group">
                                <label htmlFor="">{Localization.type}</label>
                                <Select
                                    onChange={(value: any) => this.handleTypeChange(value)}
                                    options={this.typesOption}
                                    value={this.state.type}
                                    placeholder={Localization.type}
                                />
                            </div>
                        </div>
                        <div className="col-1"></div>
                        {
                            this.state.type !== null
                                ?
                                (this.state.type! as { value: string, label: string }).value === 'control'
                                    ?
                                    <div className="col-5">
                                        <div className="form-group">
                                            <label htmlFor="">control</label>
                                            <Select
                                                onChange={(value: any) => this.handleControlChange(value)}
                                                options={this.controlsOption}
                                                value={this.state.control}
                                                placeholder={'control'}
                                            />
                                        </div>
                                    </div>
                                    :
                                    undefined
                                :
                                undefined
                        }
                        {
                            this.state.type !== null
                                ?
                                (this.state.type! as { value: string, label: string }).value === 'text'
                                    ?
                                    <div className="col-12">
                                        <Input
                                            is_textarea
                                            defaultValue={this.state.text ? this.state.text : ''}
                                            onChange={(value: any, isValid: boolean) => this.onTextChange(value, isValid)}
                                        />
                                    </div>
                                    :
                                    undefined
                                :
                                undefined
                        }
                    </div>
                </div>
                <div className="col-1">
                    <div className="d-block">
                        <i className="fa fa-plus fa-2x" onClick={() => this.props.addContentBefore(this.props.id)}></i>
                    </div>
                    <div className="d-block">
                        <i className="fa fa-plus fa-2x" onClick={() => this.props.addContentAfter(this.props.id)}></i>
                    </div>
                </div>
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

export const ContentGenerator = connect(
    state2props,
    dispatch2props
)(ContentGeneratorComponent);