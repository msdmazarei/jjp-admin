import React, { Fragment } from 'react';
import { History } from 'history';
import { BaseComponent } from '../../../_base/BaseComponent';
import { TInternationalization } from '../../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../../redux/app_state';
import { Input } from '../../../form/input/Input';
import { Book_body, Book_body_text, book_body_control, book_body_voice } from '../../BookGenerator/BookGenerator';
import { AppGuid } from '../../../../asset/script/guid';
import { EpubContentGenerator } from '../EpubContentGenerator/EpubContentGenerator';
import { Dropdown } from 'react-bootstrap';
import { Localization } from '../../../../config/localization/localization';
import { AudioContentGenerator } from '../AudioContentGenerator/AudioContentGenerator';
interface IProps {
    match?: any;
    history?: History;
    internationalization: TInternationalization;
    bookType: string;
    id: string;
    title: string;
    body: Book_body[];
    onBodyChange: (newbody: Book_body[], title: string, id: string) => void;
    addSubChapter: (id: string) => void;
}

interface IState {
    id: string | undefined;
    title: string | undefined;
    body: Book_body[];
}

class BodyGeneratorComponent extends BaseComponent<IProps, IState> {

    state = {
        id: undefined,
        title: undefined,
        body: [],
    }

    id: string | undefined = undefined;
    title: string | undefined = undefined;
    body: Book_body[] = [];

    componentDidMount() {
        this.setState({
            ...this.state,
            id: this.props.id,
            title: this.props.title,
            body: this.props.body.length === 0 ? [] : this.props.body,
        });
        this.id = this.props.id;
        this.title = this.props.title;
        this.body = this.props.body.length === 0 ? [] : this.props.body;
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps === this.props) return;
        this.setState({
            ...this.state,
            id: nextProps.id,
            title: nextProps.title,
            body: nextProps.body.length === 0 ? [] : nextProps.body,
        });
    }

    searchTree(body: Book_body[], id: string): Book_body | null {
        for (let i = 0; i < body.length; i++) {
            if (body[i].front_id === id) {
                return body[i]
            }
        }
        return null
    }

    passBodyArray_titleToProps() {
        if (this.props.id === '') return;
        this.props.onBodyChange(this.state.body, this.state.title === undefined ? '' : this.state.title!, this.props.id);
    }

    addSubChapter() {
        if (this.props.id === '') return;
        this.props.addSubChapter(this.props.id);
    }

    onChapterTitleChange(value: any, isValid: boolean) {
        this.title = value;
        this.setState({
            ...this.state,
            title: this.title,
        }, () => this.passBodyArray_titleToProps());
    }

    addContent() {
        const newId: string = AppGuid.generate();
        let newContent: { type: string, text: string, front_id: string } = { type: 'text', text: '', front_id: newId };
        this.body.push(newContent);
        this.setState({
            ...this.state,
            body: this.body,
        }, () => this.passBodyArray_titleToProps());
    }

    addContentBefore(id: string) {
        let Obj = this.searchTree(this.body, id);
        if (Obj === null) return;
        let index: number = this.body.indexOf(Obj)
        const newId: string = AppGuid.generate();
        let newContent: { type: string, text: string, front_id: string } = { type: 'text', text: '', front_id: newId };
        this.body.splice(index, 0, newContent);
        this.setState({
            ...this.state,
            body: this.body,
        }, () => this.passBodyArray_titleToProps());
    }

    addContentAfter(id: string) {
        let Obj = this.searchTree(this.body, id);
        if (Obj === null) return;
        let index: number = this.body.indexOf(Obj)
        const newId: string = AppGuid.generate();
        let newContent: { type: string, text: string, front_id: string } = { type: 'text', text: '', front_id: newId };
        this.body.splice((index + 1), 0, newContent);
        this.setState({
            ...this.state,
            body: this.body,
        }, () => this.passBodyArray_titleToProps());
    }

    onContentChange(value: Book_body, isValid: boolean, id: string) {
        let Obj = this.searchTree(this.body, id);
        if (Obj === null) return;
        let index: number = this.body.indexOf(Obj)
        this.body[index] = value;
        this.setState({
            ...this.state,
            body: this.body,
        }, () => this.passBodyArray_titleToProps());
    }

    epub_body_contents_render() {
        return <>
            {
                (this.state.body).map((item: Book_body, i: number) => (
                    <Fragment key={i}>
                        {
                            item.type === 'text'
                                ?
                                <EpubContentGenerator
                                    id={item.front_id}
                                    type={item.type}
                                    text={(item as Book_body_text).text}
                                    onContentChange={(value: Book_body, isValid: boolean, id: string) => this.onContentChange(value, isValid, id)}
                                    addContentBefore={(id: string) => this.addContentBefore(id)}
                                    addContentAfter={(id: string) => this.addContentAfter(id)}
                                />
                                :
                                <EpubContentGenerator
                                    id={item.front_id}
                                    type={item.type}
                                    control={(item as book_body_control).control}
                                    onContentChange={(value: Book_body, isValid: boolean, id: string) => this.onContentChange(value, isValid, id)}
                                    addContentBefore={(id: string) => this.addContentBefore(id)}
                                    addContentAfter={(id: string) => this.addContentAfter(id)}
                                />
                        }
                    </Fragment>
                ))
            }
        </>
    }

    audio_body_contents_render() {
        return <>
            {
                (this.state.body).map((item: Book_body, i: number) => (
                    <Fragment key={i}>
                        {
                            item.type === 'text'
                                ?
                                <AudioContentGenerator
                                    id={item.front_id}
                                    type={item.type}
                                    text={(item as Book_body_text).text}
                                    onContentChange={(value: Book_body, isValid: boolean, id: string) => this.onContentChange(value, isValid, id)}
                                    addContentBefore={(id: string) => this.addContentBefore(id)}
                                    addContentAfter={(id: string) => this.addContentAfter(id)}
                                />
                                :
                                item.type === 'control'
                                    ?
                                    <AudioContentGenerator
                                        id={item.front_id}
                                        type={item.type}
                                        control={(item as book_body_control).control}
                                        onContentChange={(value: Book_body, isValid: boolean, id: string) => this.onContentChange(value, isValid, id)}
                                        addContentBefore={(id: string) => this.addContentBefore(id)}
                                        addContentAfter={(id: string) => this.addContentAfter(id)}
                                    />
                                    :
                                    <AudioContentGenerator
                                        id={item.front_id}
                                        type={item.type}
                                        voice={(item as book_body_voice).voice}
                                        onContentChange={(value: Book_body, isValid: boolean, id: string) => this.onContentChange(value, isValid, id)}
                                        addContentBefore={(id: string) => this.addContentBefore(id)}
                                        addContentAfter={(id: string) => this.addContentAfter(id)}
                                    />
                        }
                    </Fragment>
                ))
            }
        </>
    }

    returner_body_by_book_type() {
        if (this.props.bookType === 'Epub') {
            return this.epub_body_contents_render()
        }
        if (this.props.bookType === 'Audio') {
            return this.audio_body_contents_render()
        }
    }

    render() {
        return (
            <>
                <div className="row">
                    <div className="col-10">
                        <Input
                            label={'chapter'}
                            defaultValue={this.state.title ? this.state.title : ''}
                            onChange={(value: any, isValid: boolean) => this.onChapterTitleChange(value, isValid)}
                        />
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
                                <i title={Localization.more} className="fa fa-ellipsis-v dropdown-icon"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu-right action-dropdown-menu">
                                <Dropdown.Item className="text-center" onClick={() => this.addContent()}>
                                    <span className="action-name">
                                        <i className="fa fa-pencil text-dark mx-1" onClick={() => this.addContent()}></i>
                                    </span>
                                    <span className="action-name">
                                        {Localization.book_generator.addContent}
                                    </span>
                                </Dropdown.Item>
                                <Dropdown.Item className="text-center" onClick={() => this.addSubChapter()}>
                                    <span className="action-name">
                                        <i className="fa fa-arrow-circle-left text-primary mx-1" onClick={() => this.addSubChapter()}></i>
                                    </span>
                                    <span className="action-name">
                                        {Localization.book_generator.addSubChapter}
                                    </span>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="col-12">
                        {
                            this.state.body.length === 0
                                ?
                                undefined
                                :
                                this.returner_body_by_book_type()
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

export const BodyGenerator = connect(
    state2props,
    dispatch2props
)(BodyGeneratorComponent);