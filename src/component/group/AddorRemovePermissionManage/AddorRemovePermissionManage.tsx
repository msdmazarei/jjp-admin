import React from "react";
import { History } from 'history';
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { redux_state } from "../../../redux/app_state";
import { BaseComponent } from "../../_base/BaseComponent";
import { TInternationalization } from "../../../config/setup";
import { GroupService } from "../../../service/service.group";
import { PermissionService } from "../../../service/service.permission";
import { Modal } from "react-bootstrap";
import { Localization } from "../../../config/localization/localization";
import { BtnLoader } from "../../form/btn-loader/BtnLoader";
import Select from 'react-select';
import { TPERMISSIONS } from "../../../enum/Permission";

//// start define IProps ///

export interface IProps {
    history?: History;
    internationalization: TInternationalization;
    onShow: boolean;
    onHide: () => void;
    group_title: string;
    group_id: string;
}

//// end define IProps ///

interface optionObj { label: string, value: string };

//// start define IState ///

interface IState {
    permissions_options: optionObj[];
    value: optionObj[] | null;
    beforeValue: optionObj[];
    request_group_permissions_has_error : boolean;
    request_permission_full_list_has_error : boolean;
    setAddPermissionLoader: boolean;
    retryLoader: boolean;
}

//// end define IState ///


/// start class define ///

class AddorRemovePermissionManageComponent extends BaseComponent<IProps, IState>{

    state = {
        permissions_options: [],
        value: null,
        beforeValue: [],
        request_group_permissions_has_error : false,
        request_permission_full_list_has_error : false,
        setAddPermissionLoader: false,
        retryLoader: false,
    }

    private _groupService = new GroupService();
    private _permissionService = new PermissionService();

    componentDidMount() {
        this.fetchGroupPermissions();
        this.permission_full_list();
    }

    async fetchGroupPermissions() {
        const groupData: object = {
            groups: [this.props.group_id],
        };
        let res = await this._groupService.fetchGroupPermissions(groupData).catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'fetchGroupPermissions_error' } });
            this.setState({ ...this.state, request_group_permissions_has_error: true, retryLoader : false });
        });

        if(res){
            this.setState({...this.state, request_group_permissions_has_error : false, retryLoader : false})
            if(res.data.result.length > 0){
                let newRes = res.data.result.map(item => { return { label: Localization.permissions_list[item.permission.permission as TPERMISSIONS], value: item.permission_id }});
                let old_id = res.data.result.map(item => { return item.permission_id });
                this.setState({
                    ...this.state,
                    value : newRes,
                    beforeValue : old_id,
                })
            }
        }
    }

    async permission_full_list() {
        let res: any = await this._permissionService.search(1000, 0).catch(err => {
            this.handleError({ error: err.response, notify: false, toastOptions: { toastId: 'promiseOptions2fetchGroupPermissions_error' } });
            this.setState({ ...this.state, request_permission_full_list_has_error: true, retryLoader : false });
        });

        if(res){
            this.setState({...this.state, request_permission_full_list_has_error : false, retryLoader : false})
            if(res.data.result.length > 0){
                let newRes = res.data.result.map((item : any)  => { return { label: Localization.permissions_list[item.permission as TPERMISSIONS] , value: item.id }});
                this.setState({
                    ...this.state,
                    permissions_options : newRes,
                })
            }
        }
    }

    retry_func() {
        this.setState({...this.state, retryLoader : true})
        this.fetchGroupPermissions();
        this.permission_full_list()
    }

    handleSelectInputChange(newValue: any[]) {
        this.setState({
            ...this.state,
            value: newValue,
        })
    }

    handle_on_update_permissions_btn(group_id: string) {
        if (this.state.beforeValue.length > 0 && this.state.value !== null) {
            let updated: string[] = [];
            for (let i = 0; i < (this.state.value! as optionObj[]).length; i++) {
                updated.push((this.state.value! as optionObj[])[i].value)
            }
            let before_id_array: string[] = this.state.beforeValue;
            let updated_id_array: string[] = updated;
            let toRemovedItems = before_id_array.filter(x => !updated_id_array.includes(x));
            let toAddedItems = updated_id_array.filter(x => !before_id_array.includes(x));
            this.onRemovePermissionFromGroup(toRemovedItems, group_id);
            this.onAddPermissionToGroup(toAddedItems, group_id);
            updated = [];
            before_id_array = [];
            updated_id_array = [];
        };
        if (this.state.beforeValue.length > 0 && this.state.value === null) {
            let toRemovedItems = this.state.beforeValue;
            this.onRemovePermissionFromGroup(toRemovedItems, group_id);
            toRemovedItems = [];
        };
        if (this.state.beforeValue.length === 0 && this.state.value !== null) {
            let updated: string[] = [];
            for (let i = 0; i < (this.state.value! as optionObj[]).length; i++) {
                updated.push((this.state.value! as optionObj[])[i].value)
            }
            let toAddedItems = updated;
            this.onAddPermissionToGroup(toAddedItems, group_id);
            updated = [];
            toAddedItems = [];
        };
        if (this.state.beforeValue.length === 0 && this.state.value === null) {
            return;
        }
    }

    async onRemovePermissionFromGroup(newValue: any[], group_id: string) {

        if (newValue.length === 0) {
            return;
        }

        const removedPermission: object = {
            groups: [group_id],
            permissions: newValue,
        };

        let res = await this._groupService.removePermissionFromGroup(removedPermission).catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'onRemovePermissionFromGroup_error' } });
            this.fetchGroupPermissions();
        });

        if (res) {
            this.fetchGroupPermissions();
            this.apiSuccessNotify();
            return;
        }
    }

    async onAddPermissionToGroup(newValue: any[], group_id: string) {

        if (newValue.length === 0) {
            return;
        }

        const addedPermission: object = {
            groups: [group_id],
            permissions: newValue,
        };

        let res = await this._groupService.addPermissionToGroup(addedPermission).catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'onAddPermissionToGroup_error' } });
            this.fetchGroupPermissions();
        });

        if (res) {
            this.fetchGroupPermissions();
            this.apiSuccessNotify();
            return;
        }
    }

    modal_content_returner() {
        if (this.state.request_permission_full_list_has_error === false && this.state.request_group_permissions_has_error === false) {
            return <>
                <Modal size='xl' show={this.props.onShow} onHide={() => this.props.onHide()}>
                    <Modal.Header>
                        <h2 className='text-bold text-dark text-center w-100'>افزودن دسترسی</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="delete-modal-content">
                            <span className="text-muted">{Localization.name}{" "}{Localization.group}:&nbsp;</span>
                            {this.props.group_title}
                        </p>
                        <div className="row">
                            <div className="col-12">
                                <label >{Localization.permission}</label>
                                <Select
                                    isMulti
                                    onChange={(value: any) => this.handleSelectInputChange(value)}
                                    options={this.state.permissions_options}
                                    value={this.state.value}
                                    placeholder={Localization.permission}
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.props.onHide()}>{Localization.close}</button>
                        <BtnLoader
                            btnClassName="btn btn-success shadow-default shadow-hover"
                            onClick={() => this.handle_on_update_permissions_btn(this.props.group_id)}
                            loading={this.state.setAddPermissionLoader}
                        >
                            {Localization.update}
                        </BtnLoader>
                    </Modal.Footer>
                </Modal>
            </>
        } else {
            return <>
                <Modal size='xl' show={this.props.onShow} onHide={() => this.props.onHide()}>
                    <Modal.Header>
                        <h2 className='text-bold text-dark text-center w-100'>افزودن دسترسی</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="delete-modal-content">
                            <span className="text-muted">{Localization.name}{" "}{Localization.group}:&nbsp;</span>
                            {this.props.group_title}
                        </p>
                        <p className="delete-modal-content">
                            خطا رخ داد لطفا مجددا تلاش کنید!
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.props.onHide()}>{Localization.close}</button>
                        <BtnLoader
                            btnClassName="btn btn-success shadow-default shadow-hover"
                            onClick={() => this.retry_func()}
                            loading={this.state.setAddPermissionLoader}
                        >
                            {Localization.retry}
                        </BtnLoader>
                    </Modal.Footer>
                </Modal>
            </>
        }
    }

    render() {
        return (
            <>
                {this.modal_content_returner()}
            </>
        );
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

export const AddorRemovePermissionManage = connect(
    state2props,
    dispatch2props
)(AddorRemovePermissionManageComponent);