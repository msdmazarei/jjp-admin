import React from 'react';
import { History } from 'history';
import { BaseComponent } from '../../../_base/BaseComponent';
import { TInternationalization } from '../../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../../redux/app_state';
import { Input } from '../../../form/input/Input';
import { Localization } from '../../../../config/localization/localization';
import { Book_body } from '../../BookGenerator/BookGenerator';
import Select from 'react-select';
import { Dropdown } from 'react-bootstrap';
import { AppGuid } from '../../../../asset/script/guid';
import Dropzone from "react-dropzone";
import { toast } from 'react-toastify';

interface IProps {
    match?: any;
    history?: History;
    internationalization: TInternationalization;
    id: string;
    type: string;
    text?: string;
    control?: string;
    voice?: any;
    name?: string;
    onContentChange: (value: Book_body, isValid: boolean, id: string) => void;
    addContentBefore: (id: string) => void;
    addContentAfter: (id: string) => void;
    removeComingIdContent: (id: string) => void;
}

interface IState {
    type: { value: string, label: string } | null;
    id: string | undefined;
    text?: string | undefined;
    control?: { value: string, label: string } | null;
    voice?: any;
    name?: string;
}

class AudioContentGeneratorComponent extends BaseComponent<IProps, IState> {

    typesOption = [
        // { value: 'text', label: Localization.text },
        // { value: 'control', label: Localization.control },
        { value: 'voice', label: Localization.voice },
    ];

    controlsOption = [
        { value: 'NEW_LINE', label: Localization.NEW_LINE },
        { value: 'NEW_PAGE', label: Localization.NEW_PAGE }
    ];

    state = {
        type: null,
        id: undefined,
        text: undefined,
        control: this.controlsOption[0],
        voice: [],
        name: '',
    }

    type: { value: string, label: string } | null = null;
    id: string | undefined = undefined;
    text: string | undefined = undefined;
    control: { value: string, label: string } = this.controlsOption[0];
    voice: any = [];
    name: string = '';

    componentDidMount() {
        this.setState({
            type: { value: this.props.type, label: Localization[this.props.type] },
            id: this.props.id,
            text: this.props.text ? this.props.text : undefined,
            control: this.props.control ? { value: this.props.control, label: Localization[this.props.control] } : this.controlsOption[0],
            voice: (this.props.voice && this.props.voice !== '') ? this.props.voice : [],
            name: (this.props.name && typeof this.props.name === 'string') ? this.props.name : '',
        });
        this.type = { value: this.props.type, label: Localization[this.props.type] };
        this.id = this.props.id;
        this.text = this.props.text ? this.props.text : undefined;
        this.control = this.props.control ? { value: this.props.control, label: Localization[this.props.control] } : this.controlsOption[0];
        this.voice = (this.props.voice && this.props.voice !== '') ? this.props.voice : [];
        this.name = (this.props.name && typeof this.props.name === 'string') ? this.props.name : '';
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps === this.props) return;
        this.setState({
            type: { value: nextProps.type, label: Localization[nextProps.type] },
            id: nextProps.id,
            text: nextProps.text ? nextProps.text : undefined,
            control: nextProps.control ? { value: nextProps.control, label: Localization[nextProps.control] } : null,
            voice: (nextProps.voice && nextProps.voice !== '') ? nextProps.voice : [],
            name: (nextProps.name && typeof nextProps.name === 'string') ? nextProps.name : '',
        })
    }

    passBodyObjToProps() {
        if (this.state.type === null) return;
        if ((this.state.type! as { value: string, label: string }).value === 'text') {
            let Obj: { type: string, text: string, front_id: string } =
            {
                type: (this.state.type! as { value: string, label: string }).value,
                text: this.state.text === undefined ? '' : this.state.text!,
                front_id: this.props.id
            };
            this.props.onContentChange(Obj, true, this.props.id)
        }
        if ((this.state.type! as { value: string, label: string }).value === 'control') {
            let Obj: { type: string, control: string, front_id: string } =
            {
                type: (this.state.type! as { value: string, label: string }).value,
                control: this.state.control === null ? this.controlsOption[0].value : this.state.control.value,
                front_id: this.props.id
            };
            this.props.onContentChange(Obj, true, this.props.id)
        }
        if ((this.state.type! as { value: string, label: string }).value === 'voice') {
            let Obj: { type: string, voice: any, name: string, front_id: string } =
            {
                type: (this.state.type! as { value: string, label: string }).value,
                voice: this.state.voice === [] ? '' : this.state.voice,
                name: this.state.name,
                front_id: this.props.id
            };
            this.props.onContentChange(Obj, true, this.props.id)
        }
    }

    handleTypeChange(value: any) {
        if ((value as { value: string, label: string }).value === 'text') {
            this.type = value;
            this.control = this.controlsOption[0];
            this.voice = [];
            this.name = '';
            this.setState({
                ...this.state,
                type: this.type,
                control: this.control,
                voice: this.voice,
                name: this.name,
            }, () => this.passBodyObjToProps())
        }
        if ((value as { value: string, label: string }).value === 'control') {
            this.type = value;
            this.text = undefined;
            this.voice = [];
            this.name = '';
            this.setState({
                ...this.state,
                type: this.type,
                text: this.text,
                voice: this.voice,
                name: this.name,
            }, () => this.passBodyObjToProps())
        }
        if ((value as { value: string, label: string }).value === 'voice') {  // to do modify
            this.type = value;
            this.text = undefined;
            this.control = this.controlsOption[0];
            this.setState({
                ...this.state,
                type: this.type,
                text: this.text,
                control: this.control,
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
            voice: value
        }, () => this.passBodyObjToProps())
    }

    onTextChange(value: any, isValid: boolean) {
        this.text = value;
        this.control = this.controlsOption[0];
        this.setState({
            ...this.state,
            text: this.text,
            control: this.control,
        }, () => this.passBodyObjToProps())
    }

    removePreviousImgNotify() {
        toast.warn(Localization.validation_msg.just_one_image_person_can_have, this.getNotifyConfig());
    }

    onDropRejected(files: any[], event: any) {
        this.onDropRejectedNotify(files);
    }

    onDropRejectedNotify(files: any[]) {
        toast.warn(Localization.validation_msg.file_can_not_added, this.getNotifyConfig());
    }

    removeItemFromDZ() {
        this.voice = [];
        this.setState({
            ...this.state,
            voice: this.voice,
        }, () => this.passBodyObjToProps())
    }

    onDropVoice(file: any[]) {
        if (!file || !file.length) return;
        if (this.state.voice && this.state.voice!.length) {
            this.removePreviousImgNotify();
            return;
        }
        this.voice = file;
        this.name = this.voice[0].name ? this.voice[0].name : '';
        this.setState({
            ...this.state,
            voice: this.voice,
            name: this.name,
        }, () => this.passBodyObjToProps())
    }

    returner_voice_by_value_of_voice() {
        if (typeof this.state.voice === 'string') {
            return <div className="img-item m-2">
                <a rel="noopener noreferrer" target='_blank' href={"/api/serve-files/" + this.state.voice}>
                    <img className="w-50px h-50px profile-img-rounded" src={this.audioLogo} alt="" />
                    <span className="text-info mx-3">{this.state.name}</span>
                </a>
                <button title={Localization.remove} className="img-remover btn btn-danger btn-sm ml-2" onClick={() => this.removeItemFromDZ()}>&times;</button>
            </div>
        }
        return <div className="role-img-container">
            <Dropzone
                multiple={false}
                onDrop={(files) => this.onDropVoice(files)}
                // maxSize={5000000}
                accept="audio/mp3"
                onDropRejected={(files, event) => this.onDropRejected(files, event)}
            >
                {
                    (({ getRootProps, getInputProps }) => (
                        <section className="container">
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />
                                <p className="img-container text-center text-muted p-3">{Localization.DRAG_AND_DROP}</p>
                            </div>
                            <aside>
                                {
                                    this.state.voice.length === 0
                                        ?
                                        undefined
                                        :
                                        <>
                                            <h5 className="m-2">{Localization.preview}:</h5>
                                            <div className="image-wrapper mb-2">
                                                <div className="img-item m-2">
                                                    {
                                                        (this.state.voice) ? <img className="w-50px h-50px profile-img-rounded" alt="" src={this.audioLogo} /> : <img className="w-50px h-50px profile-img-rounded" src={this.audioLogo} alt="" />
                                                    }
                                                    {
                                                        this.state.voice.length === 0
                                                            ?
                                                            undefined
                                                            :
                                                            <span className="mx-2 text-dark">{this.state.name ? this.state.name : ""} {(this.voice[0].size && typeof this.voice[0].size === "number") ? '- ' + parseFloat((this.voice[0].size / 1024).toFixed(2)) + ' KB' : 'Unknown size'}</span>
                                                    }
                                                    <button title={Localization.remove} className="img-remover btn btn-danger btn-sm ml-4" onClick={() => this.removeItemFromDZ()}>&times;</button>
                                                </div>
                                            </div>
                                        </>
                                }
                            </aside>
                        </section>
                    ))
                }
            </Dropzone>
        </div >
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
                                    <Dropdown.Item className="text-center" onClick={() => this.props.removeComingIdContent(this.props.id)}>
                                        <span className="action-name">
                                            <i className="fa fa-trash text-danger mx-1" onClick={() => this.props.removeComingIdContent(this.props.id)}></i>
                                        </span>
                                        <span className="action-name">
                                            {Localization.remove}
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
                                            textarea_rows={10}
                                            defaultValue={this.state.text ? this.state.text : ''}
                                            onChange={(value: any, isValid: boolean) => this.onTextChange(value, isValid)}
                                        />
                                    </div>
                                    :
                                    undefined
                                :
                                undefined
                        }
                        {
                            this.state.type !== null
                                ?
                                (this.state.type! as { value: string, label: string }).value === 'voice'
                                    ?
                                    <div className="col-12">
                                        {
                                            this.returner_voice_by_value_of_voice()
                                        }
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

export const AudioContentGenerator = connect(
    state2props,
    dispatch2props
)(AudioContentGeneratorComponent);