import React, { Fragment } from 'react';
// import { History } from 'history';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
// import { IToken } from '../../../model/model.token';
// import { ToastContainer } from 'react-toastify';
// import { Book_children } from '../BookGenerator/BookGenerator';
// import { BtnLoader } from '../../form/btn-loader/BtnLoader';
// import { Localization } from '../../../config/localization/localization';
// import { Input } from '../../form/input/Input';
// import ReactJson from 'react-json-view'
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { AppGuid } from '../../../asset/script/guid';
// import { Localization } from '../../../config/localization/localization';
// import Select from 'react-select';
import SortableTree, { toggleExpandedForAll } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { Input } from '../../form/input/Input';
import { ChapterGenerator } from '../ChapterGenerator/ChapterGenerator';
import { Book_children } from '../BookGenerator/BookGenerator';


interface IState {
    book_children: Book_children_converted[];
}

interface IProps {
    // match: any;
    // history: History;
    internationalization: TInternationalization;
    onChange?: (children: any[]) => void;
    // bookName: string;
    defaultValue: Book_children[];
    treeDataChange: (treeData : any) => void;
}

interface book_tree {
    title?: string;
    id: string;
    children: book_tree[]
}

interface Book_children_converted {
    id: string;
    title: JSX.Element;
    body: any[];
    children: Book_children_converted[];
}


class EpubBookGeneratorComponent extends BaseComponent<IProps, IState> {
    state = {
        book_children: this.getConvertedData(),
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

    addChildToBefore(id: string) {
        debugger;
    }

    addChildToAfter(id: string) {
        debugger;
    }

    chapterTitleChanged(value: any, isValid: boolean, id: string) {
        if(isValid === false) return;
        let data = this._convertedData;
        data.forEach(element => {
            if(element.id === id){
                return element.title === value;
            }else{
                return element.title === element.title;
            }
        });
        this._convertedData = data;
    }

    convert_bookChildren_to_Parent_type(list : Book_children_converted[]){
        for (let i = 0; i < list.length; i++) {
            let book = list[i];
            book.title = <>
                <ChapterGenerator
                    id={book.id}
                    addChildAfter={(id) => this.addChildToAfter(id)}
                    addChildBefore={(id) => this.addChildToBefore(id)}
                    onTitleChange={(value, isValid, id) => this.chapterTitleChanged(value, isValid, id)}
                    body={book.body}
                    treeDataChange={(treeData : any) => this.updateTree(treeData)}
                />
            </>;
            this.convert_bookChildren_to_Parent_type(book.children);
        }
    }
    _convertedDataToParentType : Book_children[]=[]
    getConvertToParentType(array : Book_children_converted[]) {
        let val: any = array
        this.convert_bookChildren_to_Parent_type(val)
        this._convertedDataToParentType = [...val];
        if(this.props.onChange){
            this.props.onChange(this._convertedDataToParentType);
            return;
        }
    }

    updateTree(treeData : any){
        this._convertedData = treeData;
        this.getConvertToParentType(this._convertedData)
    }

    convert_bookChildren(list: any[]): void {
        for (let i = 0; i < list.length; i++) {
            let book = list[i];
            book.title = <>
                <ChapterGenerator
                    id={book.id}
                    title={book.title}
                    addChildAfter={(id) => this.addChildToAfter(id)}
                    addChildBefore={(id) => this.addChildToBefore(id)}
                    onTitleChange={(value, isValid, id) => this.chapterTitleChanged(value, isValid, id)}
                    body={book.body}
                    treeDataChange={(treeData : any) => this.updateTree(treeData)}
                />
            </>;
            book.expanded = true; // todo _DELETE_ME
            this.convert_bookChildren(book.children);
        }
    }
    _convertedData: Book_children_converted[] = []
    getConvertedData() {
        let val: any = [...this.props.defaultValue];
        this.convert_bookChildren(val)
        return this._convertedData = [...val];
    }

    onChangeTree(treeData : Book_children_converted[]){
        this.setState({
            ...this.state,
            book_children : treeData
        })
    }

    render() {
        return (
            <>
                <div className='row'>
                    <div className="col-12">
                        <SortableTree
                            treeData={this.state.book_children}
                            onChange={(treeData : any) =>this.onChangeTree(treeData)}
                            rowDirection='rtl'
                            onMoveNode={(node: any, treeIndex: any, path: any) =>
                                global.console.debug(
                                    'node:',
                                    node,
                                    'treeIndex:',
                                    treeIndex,
                                    'path:',
                                    path
                                )
                            }
                            canDrag={(node: any) => !node.noDragging}
                            canDrop={(nextParent: any) => !nextParent || !nextParent.noChildren}
                            isVirtualized={true}
                        />
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

export const EpubBookGenerator = connect(
    state2props,
    dispatch2props
)(EpubBookGeneratorComponent);