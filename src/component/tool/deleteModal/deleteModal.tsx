import React, { Fragment } from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { redux_state } from '../../../redux/app_state';
import { BaseComponent } from '../../_base/BaseComponent';
import { Dispatch } from 'redux';
import { TInternationalization } from '../../../config/setup';
import { Localization } from '../../../config/localization/localization';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { Modal } from 'react-bootstrap';

interface IProps {
    internationalization: TInternationalization;
    crud_name: string;
    modalShow: boolean;
    deleteBtnLoader: boolean;
    rowData: object;
    rowId: string;
    onHide: () => void;
    onDelete: (rowId: string) => void;
}

interface IState {
    objKeys: string[];
    objData: any[]
}

class DeleteModalComponent extends BaseComponent<IProps, IState> {
    state = {
        objKeys: [],
        objData: [],
    }

    componentDidMount() {
        this.rowData_received_from_props_convert_to_objKeys_and_objData();
    }

    rowData_received_from_props_convert_to_objKeys_and_objData() {
        let obj_Keys: string[] = Object.keys(this.props.rowData);
        let obj_Data: any[] = [];
        for (let i = 0; i < obj_Keys.length; i++) {
            let key: string = obj_Keys[i];
            let propsObject: any = this.props.rowData;
            let data = propsObject[key]
            obj_Data.push(data);
        };
        this.setState({
            ...this.state,
            objKeys: obj_Keys,
            objData: obj_Data,
        });
    }

    returner_delete_modal_content() {
        return (
            <>
                <Modal show={this.props.modalShow} onHide={() => this.props.onHide()}>
                    <Modal.Body>
                        <p className="delete-modal-content text-center text-danger">
                            {Localization.remove + " " + this.props.crud_name}
                        </p>
                        {this.state.objKeys.map((item: string, key: number) => {
                            return <Fragment key={key}>
                                <p className="delete-modal-content">
                                    <span className="text-muted">{item}:&nbsp;</span>{this.state.objData[key]}
                                </p>
                            </Fragment>
                        })}
                        <p className="text-danger">{Localization.msg.ui.item_will_be_removed_continue}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-light shadow-default shadow-hover"
                            onClick={() => this.props.onHide()}>
                            {Localization.close}
                        </button>
                        <BtnLoader
                            loading={this.props.deleteBtnLoader}
                            btnClassName="btn btn-danger shadow-default shadow-hover"
                            onClick={() => this.props.onDelete(this.props.rowId)}
                        >
                            {Localization.remove}
                        </BtnLoader>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }

    ////////   end crate quick person  //////////

    render() {
        return (
            <>
                {this.returner_delete_modal_content()}
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

export const DeleteModal = connect(
    state2props,
    dispatch2props
)(DeleteModalComponent);