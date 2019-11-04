import React from 'react';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { Book_children } from '../BookGenerator/BookGenerator';
import { ChapterGenerator } from '../ChapterGenerator/ChapterGenerator';

interface IProps {
    // match: any;
    // history: History;
    internationalization: TInternationalization;
    booktitle: string;
    bookContent: Book_children[];
    onChange:(bookContent : Book_children[]) => void;
}

interface IState {
    bookTitle: string;
    bookContent: Book_children[];
}

class EpubBookGeneratorComponent extends BaseComponent<IProps, IState> {
    state={
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

    onChange(bookContent: Book_children[]){
        this.setState({
            ...this.state,
            bookContent : bookContent,
        }, () => this.props.onChange(this.state.bookContent))
    }

    render() {
        return (
            <>
                <div className='row'>
                    <div className="col-12">
                        <ChapterGenerator
                            booktitle={this.state.bookTitle}
                            bookContent={this.state.bookContent}
                            onChangeBook={(bookContent: Book_children[]) => this.onChange(bookContent)}
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