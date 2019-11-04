import React, { Fragment } from 'react';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { Book_body, Book_children } from '../BookGenerator/BookGenerator';
import { AppGuid } from '../../../asset/script/guid';
import { BodyGenerator } from '../BodyGenerator/BodyGenerator';


interface IProps {
    match?: any;
    history?: History;
    internationalization: TInternationalization;
    booktitle: string;
    bookContent: Book_children[];
    onChangeBook: (bookContent: Book_children[]) => void;
}

interface IState {
    bookTitle: string;
    bookContent: Book_children[];
}

class ChapterGeneratorComponent extends BaseComponent<IProps, IState> {
    state = {
        bookTitle: '',
        bookContent: [],
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            bookTitle: this.props.booktitle,
            bookContent: this.props.bookContent,
        });
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps === this.props) return;
        this.setState({
            ...this.state,
            bookTitle: nextProps.booktitle,
            bookContent: nextProps.bookContent,
        });
    }

    passNewBookContentToProps(){
        this.props.onChangeBook(this.state.bookContent)
    }

    addChapter() {
        let newBookContent: Book_children[] = this.state.bookContent.length === 0 ? [] : this.state.bookContent;
        const newId: string = AppGuid.generate();
        let newChild: Book_children = { id: newId, title: '', body: [], children: [] };
        newBookContent.push(newChild);
        this.setState({
            ...this.state,
            bookContent: newBookContent,
        },() => this.passNewBookContentToProps())
    }

    addChapterBefore(id: string) {
        let newBookContent: Book_children[] = this.state.bookContent.length === 0 ? [] : this.state.bookContent;
        let Obj: Book_children | undefined = newBookContent.find(newBookContent => newBookContent.id === id);
        if (Obj === undefined) return;
        let index: number = newBookContent.indexOf(Obj);
        const newId: string = AppGuid.generate();
        let newChild: Book_children = { id: newId, title: '', body: [], children: [] };
        newBookContent.splice(index, 0, newChild);
        this.setState({
            ...this.state,
            bookContent: newBookContent,
        },() => this.passNewBookContentToProps())
    }

    addChapterAfter(id: string) {
        let newBookContent: Book_children[] = this.state.bookContent.length === 0 ? [] : this.state.bookContent;
        let Obj: Book_children | undefined = newBookContent.find(newBookContent => newBookContent.id === id);
        if (Obj === undefined) return;
        let index: number = newBookContent.indexOf(Obj);
        const newId: string = AppGuid.generate();
        let newChild: Book_children = { id: newId, title: '', body: [], children: [] };
        newBookContent.splice((index + 1), 0, newChild);
        this.setState({
            ...this.state,
            bookContent: newBookContent,
        },() => this.passNewBookContentToProps())
    }

    addNewSubChapterFromBodyGeneratorComponent(id: string) {
        let newBookContent: Book_children[] = this.state.bookContent.length === 0 ? [] : this.state.bookContent;
        let Obj: Book_children | undefined = newBookContent.find(newBookContent => newBookContent.id === id);
        if (Obj === undefined) return;
        let index: number = newBookContent.indexOf(Obj);
        const newId: string = AppGuid.generate();
        let newChild: Book_children = { id: newId, title: '', body: [], children: [] };
        newBookContent[index].children.push(newChild);
        this.setState({
            ...this.state,
            bookContent: newBookContent,
        },() => this.passNewBookContentToProps());
    }

    updateChapterBody(newbody: Book_body[], title: string, id: string) {
        let newBookContent: Book_children[] = this.state.bookContent.length === 0 ? [] : this.state.bookContent;
        if(newBookContent.length === 0 ) return;
        let Obj: Book_children | undefined = newBookContent.find(newBookContent => newBookContent.id === id);
        if (Obj === undefined) return;
        let index: number = newBookContent.indexOf(Obj);
        newBookContent[index].title = title;
        newBookContent[index].body = newbody;
        this.setState({
            ...this.state,
            bookContent: newBookContent,
        },() => this.passNewBookContentToProps());
    }

    chapters_render(array: Book_children[]) {
        return <>
            {
                array.map((item: Book_children, i: number) => (
                    <Fragment key={i}>
                        <div className="col-12">
                            <i className="fa fa-pencil" onClick={() => this.addChapterBefore(item.id)}></i>
                            <BodyGenerator
                                id={item.id}
                                title={item.title ? item.title : ''}
                                body={(item.body === undefined || item.body.length === 0) ? [] : item.body}
                                onBodyChange={(newbody: Book_body[], title: string, id: string) => this.updateChapterBody(newbody, title, id)}
                                addSubChapter={(id: string) => this.addNewSubChapterFromBodyGeneratorComponent(id)}
                            />
                            {
                                item.children
                                    ?
                                    item.children.length > 0
                                        ?
                                        <div>
                                            {
                                                this.chapters_render(item.children)
                                            }
                                        </div>
                                        :
                                        undefined
                                    :
                                    undefined
                            }
                            <i className="fa fa-pencil" onClick={() => this.addChapterAfter(item.id)}></i>
                        </div>
                    </Fragment>
                ))
            }
        </>
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            {this.state.bookTitle}
                        </div>
                        <div>
                            <i className="fa fa-indent" onClick={() => this.addChapter()}></i>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {
                        this.state.bookContent.length === 0
                            ?
                            undefined
                            :
                            this.chapters_render(this.state.bookContent)
                    }
                </div>
            </div>
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

export const ChapterGenerator = connect(
    state2props,
    dispatch2props
)(ChapterGeneratorComponent);