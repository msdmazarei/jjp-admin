import React, { Fragment } from 'react';
import { History } from 'history';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { Input } from '../../form/input/Input';
import { Book_body, Book_body_text, book_body_control } from '../BookGenerator/BookGenerator';
import { AppGuid } from '../../../asset/script/guid';
import { ContentGenerator } from '../ContentGenerator/ContentGenerator';

interface IProps {
    match?: any;
    history?: History;
    internationalization: TInternationalization;
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

    componentDidMount() {
        this.setState({
            ...this.state,
            id: this.props.id,
            title: this.props.title,
            body: this.props.body.length === 0 ? [] : this.props.body,
        })
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps === this.props) return;
        this.setState({
            ...this.state,
            id: nextProps.id,
            title: nextProps.title,
            body: nextProps.body.length === 0 ? [] : nextProps.body,
        })
    }

    passBodyArray_titleToProps() {
        if (this.props.id === '') return;
        this.props.onBodyChange(this.state.body, this.state.title === undefined ? '' : this.state.title!, this.props.id)
    }

    addSubChapter() {
        if (this.props.id === '') return;
        this.props.addSubChapter(this.props.id);
    }

    onChapterTitleChange(value: any, isValid: boolean) {
        this.setState({
            ...this.state,
            title: value,
        }, () => this.passBodyArray_titleToProps());
    }

    addContent() {
        let newBody: Book_body[] = this.state.body.length === 0 ? [] : this.state.body;
        const newId: string = AppGuid.generate();
        let newContent: { type: string, text: string, id: string } = { type: 'text', text: '', id: newId };
        newBody.push(newContent);
        this.setState({
            ...this.state,
            body: newBody,
        }, () => this.passBodyArray_titleToProps());
    }

    addContentBefore(id: string) {
        let newBody: Book_body[] = this.state.body;
        let Obj: Book_body | undefined = newBody.find(newBody => newBody.id === id);
        if (Obj === undefined) return;
        let index: number = newBody.indexOf(Obj);
        const newId: string = AppGuid.generate();
        let newContent: { type: string, text: string, id: string } = { type: 'text', text: '', id: newId };
        newBody.splice(index, 0, newContent);
        this.setState({
            ...this.state,
            body: newBody,
        }, () => this.passBodyArray_titleToProps())
    }

    addContentAfter(id: string) {
        let newBody: Book_body[] = this.state.body;
        let Obj: Book_body | undefined = newBody.find(newBody => newBody.id === id);
        if (Obj === undefined) return;
        let index: number = newBody.indexOf(Obj);
        const newId: string = AppGuid.generate();
        let newContent: { type: string, text: string, id: string } = { type: 'text', text: '', id: newId };
        newBody.splice((index + 1), 0, newContent);
        this.setState({
            ...this.state,
            body: newBody,
        }, () => this.passBodyArray_titleToProps())
    }

    body_contents_render() {
        return<>
            {
                (this.state.body).map((item: Book_body, i: number) => (
                    <Fragment key={i}>
                        {
                            item.type === 'text'
                                ?
                                <ContentGenerator
                                    id={item.id}
                                    type={item.type}
                                    text={(item as Book_body_text).text}
                                    onContentChange={(value: Book_body, isValid: boolean, id: string) => console.log(value, isValid, id)}
                                    addContentBefore={(id: string) => this.addContentBefore(id)}
                                    addContentAfter={(id: string) => this.addContentAfter(id)}
                                />
                                :
                                <ContentGenerator
                                    id={item.id}
                                    type={item.type}
                                    control={(item as book_body_control).control}
                                    onContentChange={(value: Book_body, isValid: boolean, id: string) => console.log(value, isValid, id)}
                                    addContentBefore={(id: string) => this.addContentBefore(id)}
                                    addContentAfter={(id: string) => this.addContentAfter(id)}
                                />
                        }
                    </Fragment>
                ))
            }
        </>
    }

    render() {
        return (
            <>
                <div className="row">
                    <div className="row">
                        <div className="col-6">
                            <Input
                                label={'chapter'}
                                defaultValue={this.state.title ? this.state.title : ''}
                                onChange={(value: any, isValid: boolean) => this.onChapterTitleChange(value, isValid)}
                            />
                        </div>
                        <div className="col-3">
                            <i className="fa fa-pencil" onClick={() => this.addContent()}></i>
                        </div>
                        <div className="col-3">
                            <i className="fa fa-indent" onClick={() => this.addSubChapter()}></i>
                        </div>
                    </div>
                    <div className='row'>
                        {
                            this.state.body.length === 0
                            ?
                            undefined
                            :
                            this.body_contents_render()
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