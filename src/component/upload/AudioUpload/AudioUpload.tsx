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


interface IState {
    book_children : Book_children[];
}

interface IProps {
    // match: any;
    // history: History;
    internationalization: TInternationalization;
    onChange? : (children : any[]) => void;
}


class AudioUploadComponent extends BaseComponent<IProps, IState> {
    state = {
        book_children : [],
    }

    id_generator(){
        let id ="body_id__"+Math.floor(Math.random()*1000000000)+"_"+Math.floor(Math.random()*1000000000);
        return id;
    }

    render() {
        return (
            <>
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

export const AudioUpload = connect(
    state2props,
    dispatch2props
)(AudioUploadComponent);