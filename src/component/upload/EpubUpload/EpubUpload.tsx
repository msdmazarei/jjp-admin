import React from 'react';
// import { History } from 'history';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
// import { IToken } from '../../../model/model.token';
// import { ToastContainer } from 'react-toastify';
import { Book_children } from '../FileUpload/FileUpload';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { Localization } from '../../../config/localization/localization';
import { Input } from '../../form/input/Input';


interface IState {
    book_children: Book_children[];
}

interface IProps {
    // match: any;
    // history: History;
    internationalization: TInternationalization;
    onChange?: (children: any[]) => void;
}


class EpubUploadComponent extends BaseComponent<IProps, IState> {
    state = {
        book_children: [],
    }

    id_generator() {
        let id = "body_id__" + Math.floor(Math.random() * 1000000000) + "_" + Math.floor(Math.random() * 1000000000);
        return id;
    }

    child_adder() {
        let id = this.id_generator();
        let child: Book_children = {
            id: id,
            title: '',
            body: [],
            children: [],
        };
        if (this.state.book_children.length === 0) {
            let newChildren = [];
            newChildren.push(child);
            this.setState({
                ...this.state,
                book_children: newChildren,
            })
        } else {
            let newChildren = this.state.book_children;
            (newChildren! as any[]).push(child)
            this.setState({
                ...this.state,
                book_children: newChildren,
            })
        }
    }

    render() {
        return (
            <div className="">
                <BtnLoader
                    loading={false}
                    btnClassName="btn btn-success shadow-default shadow-hover pull-right"
                    onClick={() => this.child_adder()}
                >
                    {Localization.create}
                </BtnLoader>
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

export const EpubUpload = connect(
    state2props,
    dispatch2props
)(EpubUploadComponent);