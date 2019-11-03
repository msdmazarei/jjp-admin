import React, { Fragment } from 'react';
// import { History } from 'history';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
// import { IToken } from '../../../model/model.token';
// import { ToastContainer } from 'react-toastify';
import { Book_children } from '../BookGenerator/BookGenerator';
// import { BtnLoader } from '../../form/btn-loader/BtnLoader';
// import { Localization } from '../../../config/localization/localization';
// import { Input } from '../../form/input/Input';
// import ReactJson from 'react-json-view'
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { AppGuid } from '../../../asset/script/guid';
// import { Localization } from '../../../config/localization/localization';
// import Select from 'react-select';


interface IState {
    book_children: Book_children[];
}

interface IProps {
    // match: any;
    // history: History;
    internationalization: TInternationalization;
    onChange?: (children: any[]) => void;
    bookName: string;
}

interface book_tree {
    title?: string;
    id: string;
    children: book_tree[]
}


class EpubBookGeneratorComponent extends BaseComponent<IProps, IState> {
    state = {
        book_children: [],
    }

    private book_tree: book_tree = {
        title: 'sample1',
        id: '1',
        children: [
            {
                title: 'sample1-1',
                id: '11',
                children: [

                ]
            },
            {
                title: 'sample1-2',
                id: '12',
                children: [

                ]
            }
        ]
    };

    private tree_render(book_tree: book_tree) {
        return (
            <>
                <li>
                    <i className="fa fa-plus" onClick={() => this.addChild_byParentNodeId(book_tree.id, false)}></i>
                    <span>{book_tree.title}</span>
                    <i className="fa fa-plus" onClick={() => this.addChild_byParentNodeId(book_tree.id, true)}></i>

                    <i className="fa fa-home" onClick={() => this.addChild_byNodeId(book_tree.id)}></i>
                    <i className="fa fa-times"></i>
                </li>
                {book_tree.children.length ? <ul>
                    {book_tree.children.map(b => (
                        <Fragment key={b.id}>{this.tree_render(b)}</Fragment>
                    ))}
                </ul> : ''}
            </>
        )
    }
    private book_tree_render() {
        return <div>
            {this.tree_render(this.book_tree)}
        </div>
    }

    addChild_byNodeId(id: string) {
        debugger;
        const node = this.findNode_byId(id);
        if (!node) return;
        node.children.push({
            id: AppGuid.generate(),
            title: '',
            children: []
        })
    }

    addChild_byParentNodeId(id: string, after: boolean) {
        debugger;
        const parentNode = this.findParentNode_byId(id);
        if (!parentNode) return;
        const myNode = parentNode.children.find(b => b.id === id);
        const myIndex = myNode && parentNode.children.indexOf(myNode);
        if (myIndex || myIndex === 0) {
            if (after)
                parentNode.children.splice(myIndex + 1, 0, { id: AppGuid.generate(), title: '', children: [] });
            else
                parentNode.children.splice(myIndex, 0, { id: AppGuid.generate(), title: '', children: [] });
        }
    }

    searchTree(ch: book_tree, id: string): book_tree | null {
        if (ch.id === id) {
            return ch;
        } else if (ch.children.length) {
            let i;
            let result = null;
            for (i = 0; result === null && i < ch.children.length; i++) {
                result = this.searchTree(ch.children[i], id);
            }
            return result;
        }
        return null;
    }

    searchTree_parent(ch: book_tree, id: string): book_tree | null {
        if (ch.id === id) {
            return ch;
        } else if (ch.children.length) {
            let i;
            let result = null;
            for (i = 0; result === null && i < ch.children.length; i++) {
                result = this.searchTree_parent(ch.children[i], id);
            }
            return result ? ch : null;
        }
        return null;
    }

    findNode_byId(id: string): book_tree | null {
        return this.searchTree(this.book_tree, id);
    }
    findParentNode_byId(id: string): book_tree | null {
        return this.searchTree_parent(this.book_tree, id);
    }

    bookBodyTypeOptions = [
        { value: 'text', label: 'text' },
        { value: 'control', label: 'control' }
    ];

    child_id_generator() {
        let id = "child_id__" + Math.floor(Math.random() * 1000000000);
        return id;
    }

    body_id_generator() {
        let id = "body_id__" + Math.floor(Math.random() * 1000000000);
        return id;
    }

    addChild(ch: Book_children[], id: string) {
        let tree = this.state.book_children;
        let newChild = { id: this.child_id_generator(), title: '', body: [], children: [] };
        if (tree.length === 0 || id === '') {
            (tree as any[]).push(newChild);
            this.setState({
                ...this.state,
                book_children: tree,
            }, () => console.log(this.state.book_children))
            return
        } else if (tree.length > 0) {
            for (let i = 0; i < ch.length; i++) {
                if (ch[i].id === id) {
                    (ch[i].children as any[]).push(newChild);
                    this.setState({
                        ...this.state,
                        book_children: tree,
                    }, () => console.log(this.state.book_children))
                    return
                }
                if (ch[i].children!.length > 0) {
                    let i = 0;
                    for (i = 0; i < ch[i].children!.length; i++) {
                        this.addChild(ch[i].children!, id);
                    }
                }
            }
        }
        console.log(this.state.book_children)
    }


    addChildToBefore() {

    }

    addChildToAfter() {

    }

    render() {
        return (
            <div>
                {
                    this.state.book_children.length === 0
                        ?
                        <BtnLoader
                            onClick={() => this.addChild(this.state.book_children, '')}
                            loading={false}
                            btnClassName='btn btn-success'
                        >create a new chapter</BtnLoader>
                        :
                        <>
                            {this.state.book_children.map((item: { id: string, title: string, body: any[], children: [] }, i: number) => {
                                return <Fragment key={item.id}>
                                    rthyujkilhjghgfd
                                <div>
                                        <BtnLoader
                                            onClick={() => this.addChild(this.state.book_children, item.id)}
                                            loading={false}
                                            btnClassName='btn btn-success pull-left my-2'
                                            disabled={false}
                                        >add chapter</BtnLoader>
                                    </div>
                                </Fragment>
                            })}
                            <BtnLoader
                                onClick={() => this.addChild(this.state.book_children, '')}
                                loading={false}
                                btnClassName='btn btn-success'
                            >create a new chapter</BtnLoader>
                                                <div className="row">
                        <div className="col-12">
                            <br />
                            {this.book_tree_render()}
                            <br />
                        </div>
                    </div>
                        </>
                }
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

export const EpubBookGenerator = connect(
    state2props,
    dispatch2props
)(EpubBookGeneratorComponent);