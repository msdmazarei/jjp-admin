import React, { Fragment } from 'react';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { Book_body, Book_children } from '../BookGenerator/BookGenerator';
import { AppGuid } from '../../../asset/script/guid';
import { BodyGenerator } from '../BodyGenerator/BodyGenerator';
import { Dropdown } from 'react-bootstrap';
import { Localization } from '../../../config/localization/localization';
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
    current_id: string;
}

class ChapterGeneratorComponent extends BaseComponent<IProps, IState> {
    state = {
        bookTitle: '',
        bookContent: [],
        current_id: '',
    }

    book: Book_children[] = [];

    componentDidMount() {
        this.setState({
            ...this.state,
            bookTitle: this.props.booktitle,
            bookContent: this.props.bookContent,
        });
        this.book = this.props.bookContent;
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps === this.props) return;
        this.setState({
            ...this.state,
            bookTitle: nextProps.booktitle,
            bookContent: nextProps.bookContent,
        });
    }

    passNewBookContentToProps() {
        console.log(this.state.bookContent);
        this.props.onChangeBook(this.state.bookContent);
    }

    // start parent of node search in tree

    searchTree_parent(id: string): Book_children | null {
        let inMainTree: boolean = false;
        if (!this.book.length) return null;
        for (let i = 0; i < this.book.length; i++) {
            if (this.book[i].id === id) {
                inMainTree = true;
                return this.book[i];
            }
        }
        if (inMainTree === false) {
            return this.searchTree_parent_childs(this.book, id)
        }
        return null;
    }

    searchTree_parent_childs(tree: Book_children[], id: string): Book_children | null {
        let i;
        let temp;
        for (i = 0; i < tree.length; i++) {
            if (tree[i].children.length) {
                for (let j = 0; j < tree[i].children.length; j++) {
                    if (tree[i].children[j].id === id) {
                        return tree[i];
                    }
                }
                if (tree[i].children.length && tree[i].children.length > 0) {
                    temp = this.searchTree_parent_childs(tree[i].children, id);
                    if (temp) {
                        return temp;
                    }
                }
            }
        }
        return null
    }

    // end parent of node search in tree

    // start search node in tree

    searchTree(tree: Book_children[], current_id: string): Book_children | null {
        let i;
        let temp;
        for (i = 0; i < tree.length; i++) {
            if (tree[i].id === current_id) {
                return tree[i];
            }
            if (tree[i].children.length > 0) {
                temp = this.searchTree(tree[i].children, current_id);
                if (temp) {
                    return temp;
                }
            }
        }
        return null;
    }

    // end search node in tree

    // start calculate the coming id is in main childs

    id_is_main_child(id: string): boolean {
        let inMainTree: boolean = false;
        if (!this.book.length) return inMainTree;
        for (let i = 0; i < this.book.length; i++) {
            if (this.book[i].id === id) {
                inMainTree = true;
            }
        }
        return inMainTree;
    }

    // end calculate the coming id is in main childs

    // start add main chapter

    addChapter() {
        const newId: string = AppGuid.generate();
        let newChild: Book_children = { id: newId, title: '', body: [], children: [] };
        this.book.push(newChild);
        this.setState({
            ...this.state,
            bookContent: this.book,
        }, () => this.passNewBookContentToProps());
    }

    // end add main chapter

    // start add chapter before coming id if id is main child

    addChapterBefore_inMain(current_id: string) {
        const newId: string = AppGuid.generate();
        let newChild: Book_children = { id: newId, title: '', body: [], children: [] };
        if (!this.book.length) return
        let obj = this.searchTree(this.book, current_id);
        if (obj === null) return;
        let index: number = this.book.indexOf(obj);
        this.book.splice(index, 0, newChild);
        this.setState({
            ...this.state,
            bookContent: this.book,
        }, () => this.passNewBookContentToProps());
    }

    // end add chapter before coming id if id is main child

    // start add chapter after coming id if id is main child

    addChapterAfter_inMain(current_id: string) {
        const newId: string = AppGuid.generate();
        let newChild: Book_children = { id: newId, title: '', body: [], children: [] };
        if (!this.book.length) return
        let obj = this.searchTree(this.book, current_id);
        if (obj === null) return;
        let index: number = this.book.indexOf(obj);
        this.book.splice((index + 1), 0, newChild);
        this.setState({
            ...this.state,
            bookContent: this.book,
        }, () => this.passNewBookContentToProps());
    }

    // end add chapter after coming id if id is main child

    // start add chapter before coming id

    addChapterBefore(current_id: string) {
        if (this.id_is_main_child(current_id)) {
            this.addChapterBefore_inMain(current_id);
            return;
        }
        const newId: string = AppGuid.generate();
        let newChild: Book_children = { id: newId, title: '', body: [], children: [] };
        let result = this.searchTree_parent(current_id);
        if (result === null) return;
        let array: Book_children[] = result!.children;
        let obj = this.searchTree(result!.children, current_id);
        if (obj === null) return;
        let index: number = array.indexOf(obj);
        result.children.splice(index, 0, newChild);
        this.setState({
            ...this.state,
            bookContent: this.book,
        }, () => this.passNewBookContentToProps());
    }

    // end add chapter before coming id

    // start add chapter after coming id

    addChapterAfter(current_id: string) {
        if (this.id_is_main_child(current_id)) {
            this.addChapterAfter_inMain(current_id);
            return;
        }
        const newId: string = AppGuid.generate();
        let newChild: Book_children = { id: newId, title: '', body: [], children: [] };
        let result = this.searchTree_parent(current_id);
        if (result === null) return;
        let array: Book_children[] = result!.children;
        let obj = this.searchTree(result!.children, current_id);
        if (obj === null) return;
        let index: number = array.indexOf(obj);
        result.children.splice((index + 1), 0, newChild);
        this.setState({
            ...this.state,
            bookContent: this.book,
        }, () => this.passNewBookContentToProps());
    }

    // end add chapter after coming id

    // start add subchapter to sibling coming id

    addNewSubChapterFromBodyGeneratorComponent(current_id: string) {
        const newId: string = AppGuid.generate();
        let newChild: Book_children = { id: newId, title: '', body: [], children: [] };
        let result = this.searchTree(this.book, current_id);
        if (result === null) return;
        result!.children.push(newChild);
        this.setState({
            ...this.state,
            bookContent: this.book,
        }, () => this.passNewBookContentToProps());
    }

    // end add subchapter to sibling coming id

    updateChapterBody(newbody: Book_body[], title: string, current_id: string) {
        let result = this.searchTree(this.book, current_id);
        if (result === null) return;
        result.title = title;
        result.body = newbody;
        this.setState({
            ...this.state,
            bookContent: this.book,
        }, () => this.passNewBookContentToProps());
    }

    itemIdSetter(id: string) {
        if (this.state.current_id !== id) {
            this.setState({
                ...this.state,
                current_id: '',
            }, () => this.setNewId(id))
        }
        if (this.state.current_id === id) {
            this.setState({
                ...this.state,
                current_id: '',
            })
        }
    }

    setNewId(id: string) {
        this.setState({
            ...this.state,
            current_id: id,
        })
    }

    chapters_render(id: string) {
        let result = this.searchTree(this.book, id);
        if (result === null) return;
        return <>
            <BodyGenerator
                id={result.id}
                title={result.title ? result.title : ''}
                body={(result.body === undefined || result.body.length === 0) ? [] : result.body}
                onBodyChange={(newbody: Book_body[], title: string, id: string) => this.updateChapterBody(newbody, title, id)}
                addSubChapter={(id: string) => this.addNewSubChapterFromBodyGeneratorComponent(id)}
            />
        </>
    }

    dropDown_tree_render(array: Book_children[]) {
        return <>
            <ol>
                {
                    array.map((item: Book_children, i: number) => (
                        <Fragment key={i}>
                            <li>
                                <div>
                                    {
                                        item.id === this.state.current_id
                                            ?
                                            <i className="fa fa-check text-success"></i>
                                            :
                                            undefined
                                    }
                                    <i className="fa fa-folder text-warning mx-1"></i>
                                    {item.title}
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
                                            <Dropdown.Item className="text-center" onClick={() => this.addChapterBefore(item.id)}>
                                                <span className="action-name">
                                                    <i className="fa fa-arrow-circle-o-up text-info mx-1" onClick={() => this.addChapterBefore(item.id)}></i>
                                                </span>
                                                <span className="action-name">
                                                    {Localization.book_generator.addChapterBefore}
                                                </span>
                                            </Dropdown.Item>
                                            <Dropdown.Item className="text-center" onClick={() => this.addChapterAfter(item.id)}>
                                                <span className="action-name">
                                                    <i className="fa fa-arrow-circle-o-down text-info mx-1" onClick={() => this.addChapterAfter(item.id)}></i>
                                                </span>
                                                <span className="action-name">
                                                    {Localization.book_generator.addChapterAfter}
                                                </span>
                                            </Dropdown.Item>
                                            <Dropdown.Item className="text-center" onClick={() => this.itemIdSetter(item.id)}>
                                                <span className="action-name">
                                                    <i className="fa fa-pencil text-dark" onClick={() => this.itemIdSetter(item.id)}></i>
                                                </span>
                                                <span className="action-name">
                                                    {Localization.book_generator.addTitleAndContentToChapter}
                                                </span>
                                            </Dropdown.Item>
                                            <Dropdown.Item className="text-center" onClick={() => this.addNewSubChapterFromBodyGeneratorComponent(item.id)}>
                                                <span className="action-name">
                                                    <i className="fa fa-arrow-circle-left text-primary mx-1" onClick={() => this.addNewSubChapterFromBodyGeneratorComponent(item.id)}></i>
                                                </span>
                                                <span className="action-name">
                                                    {Localization.book_generator.addSubChapter}
                                                </span>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                {item.children && item.children.length > 0
                                    ?
                                    this.dropDown_tree_render(item.children)
                                    :
                                    undefined
                                }
                            </li>
                        </Fragment>
                    ))
                }
            </ol>
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
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <i className="fa fa-plus text-success" onClick={() => this.addChapter()}></i>
                        {
                            this.state.bookContent.length === 0
                                ?
                                undefined
                                :
                                this.dropDown_tree_render(this.state.bookContent)
                        }
                    </div>
                    <div className="col-9">
                        {
                            (this.state.bookContent.length === 0 || this.state.current_id === '')
                                ?
                                undefined
                                :
                                this.chapters_render(this.state.current_id)
                        }
                    </div>
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