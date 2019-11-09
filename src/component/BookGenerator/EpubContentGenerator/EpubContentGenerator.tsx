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
import { Dropdown } from 'react-bootstrap';
import { AppGuid } from '../../../asset/script/guid';


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

class EpubContentGeneratorComponent extends BaseComponent<IProps, IState> {

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

    type : { value: string, label: string } | null = null;
    id : string | undefined = undefined;
    text : string | undefined = undefined;
    control : { value: string, label: string } = this.controlsOption[0];

    componentDidMount() {
        this.setState({
            type: { value: this.props.type, label: this.props.type },
            id: this.props.id,
            text: this.props.text ? this.props.text : undefined,
            control: this.props.control ? { value: this.props.control, label: this.props.control } : this.controlsOption[0],
        });
        this.type= { value: this.props.type, label: this.props.type };
        this.id= this.props.id;
        this.text= this.props.text ? this.props.text : undefined;
        this.control= this.props.control ? { value: this.props.control, label: this.props.control } : this.controlsOption[0];
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
            let Obj: { type: string, text: string, front_id: string } = 
            { type: (this.state.type! as { value: string, label: string }).value, 
            text: this.state.text === undefined ? '' : this.state.text!, 
            front_id: this.props.id };
            this.props.onContentChange(Obj, true, this.props.id)
        }
        if ((this.state.type! as { value: string, label: string }).value === 'control') {
            let Obj: { type: string, control: string, front_id: string } = 
            { type: (this.state.type! as { value: string, label: string }).value, 
            control: this.state.control === null ? this.controlsOption[0].value : this.state.control.value, 
            front_id: this.props.id };
            this.props.onContentChange(Obj, true, this.props.id)
        }
    }

    handleTypeChange(value: any) {
        if ((value as { value: string, label: string }).value === 'text') {
            this.type = value;
            this.setState({
                ...this.state,
                type: this.type,
                control: this.control,
            }, () => this.passBodyObjToProps())
        }
        if ((value as { value: string, label: string }).value === 'control') {
            this.type = value;
            this.text = undefined;
            this.setState({
                ...this.state,
                type: this.type,
                text: this.text
            }, () => this.passBodyObjToProps())
        }
    }

    handleControlChange(value: any) {
        this.control = value;
        this.text = undefined;
        this.setState({
            ...this.state,
            control: this.control,
            text: this.text,
        }, () => this.passBodyObjToProps())
    }

    // private setTimeout_person_val: any;
    // debounce_300(inputValue: any , isValid: boolean) {
    //     if (this.setTimeout_person_val) {
    //         clearTimeout(this.setTimeout_person_val);
    //     };
    //     this.setTimeout_person_val = setTimeout(() => {
    //         this.onTextChange(inputValue, isValid);
    //     }, 300);
    // }

    onTextChange(value: any, isValid: boolean) {
        this.text = value;
        this.control = this.controlsOption[0];
        this.setState({
            ...this.state,
            text: this.text,
            control: this.control,
        }, () => this.passBodyObjToProps())
    }

    render() {
        return (
            <>
                <div className="col-12 my-2">
                    <div className="row px-2">
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
                        <div className="col-5">
                            {
                                this.state.type !== null
                                    ?
                                    (this.state.type! as { value: string, label: string }).value === 'control'
                                        ?
                                        <div className="form-group">
                                            <label htmlFor="">control</label>
                                            <Select
                                                onChange={(value: any) => this.handleControlChange(value)}
                                                options={this.controlsOption}
                                                value={this.state.control}
                                                placeholder={'control'}
                                            />
                                        </div>
                                        :
                                        undefined
                                    :
                                    undefined
                            }
                        </div>
                        <div className="col-2 mt-4">
                        <Dropdown>
                            <Dropdown.Toggle
                                title={Localization.more}
                                split
                                variant="light"
                                className="px-3 bg-light btn"
                                id={AppGuid.generate()}
                            >
                                <i title={Localization.more} className="fa fa-pencil text-dark dropdown-icon"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu-right action-dropdown-menu">
                                <Dropdown.Item className="text-center" onClick={() => this.props.addContentBefore(this.props.id)}>
                                    <span className="action-name">
                                        <i className="fa fa-pencil text-info mx-1" onClick={() => this.props.addContentBefore(this.props.id)}></i>
                                    </span>
                                    <span className="action-name">
                                        {Localization.book_generator.addContentBefore}
                                    </span>
                                </Dropdown.Item>
                                <Dropdown.Item className="text-center" onClick={() => this.props.addContentAfter(this.props.id)}>
                                    <span className="action-name">
                                        <i className="fa fa-pencil text-info mx-1" onClick={() => this.props.addContentAfter(this.props.id)}></i>
                                    </span>
                                    <span className="action-name">
                                        {Localization.book_generator.addContentAfter}
                                    </span>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        </div>
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

export const EpubContentGenerator = connect(
    state2props,
    dispatch2props
)(EpubContentGeneratorComponent);