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
import SortableTree, { toggleExpandedForAll } from 'react-sortable-tree';
import { BodyGenerator } from '../BodyGenerator/BodyGenerator';

interface Body_children_converted {
    id: string;
    title: JSX.Element;
    type: string;
    text: string;
    control: string;
}

interface IProps {
    // match: any;
    // history: History;
    internationalization: TInternationalization;
    title?: string;
    id: string;
    onTitleChange: (value: any, isValid: boolean, id: string) => void;
    addChildAfter: (id: string) => void;
    addChildBefore: (id: string) => void;
    body: Book_body[];
    treeDataChange: (treeData : any) => void;
}

interface IState {

}

class ChapterGeneratorComponent extends BaseComponent<IProps, IState> {

    addChildToBefore(id: string) {
        debugger;
    }

    addChildToAfter(id: string) {
        debugger;
    }

    bodyChanged(value: any, isValid: boolean, id: string) {
        if(isValid === false) return;
        let data = this._convertedData;
        data.forEach(element => {
            if(element.id === id){
                return element.text === value;
            }
        });
        this._convertedData = data;
    }

    convert_bodyChildren(list: any[]): void {
        for (let i = 0; i < list.length; i++) {
            let body = list[i];
            body.title = <>
                <BodyGenerator
                    id={body.id}
                    type={body.type}
                    text={body.text ? body.text : undefined}
                    control={body.control ? body.control : undefined}
                    addChildAfter={(id) => this.addChildToAfter(id)}
                    addChildBefore={(id) => this.addChildToBefore(id)}
                    onbodyChange={(value, isValid, id) => this.bodyChanged(value, isValid, id)}
                />
            </>;
            body.expanded = true; // todo _DELETE_ME
        }
    }
    _convertedData: Body_children_converted[] = []
    getConvertedData() {
        // debugger;
        let val: any = [...this.props.body];
        this.convert_bodyChildren(val)
        return this._convertedData = [...val];
    }

    onTitleChange(value: any, isValid: boolean) {
        this.props.onTitleChange(value, isValid, this.props.id);
    }

    render() {
        return (
            <>
                <i className="fa fa-plus fa-2x" onClick={() => this.props.addChildBefore(this.props.id)}></i>
                <Input
                    required
                    label={Localization.title}
                    placeholder={Localization.title}
                    defaultValue={this.props.title}
                    onChange={(value: any, isValid: boolean) => this.onTitleChange(value, isValid)}
                ></Input>
                <i className="fa fa-plus fa-2x" onClick={() => this.props.addChildAfter(this.props.id)}></i>
                {/* <SortableTree
                    treeData={this.getConvertedData()}
                    onChange={(treeData : any) => this.props.treeDataChange(treeData)}
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
                /> */}
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

export const ChapterGenerator = connect(
    state2props,
    dispatch2props
)(ChapterGeneratorComponent);