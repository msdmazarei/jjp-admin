import React from "react";
import { History } from 'history';
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { redux_state } from "../../../redux/app_state";
import { BaseComponent } from "../../_base/BaseComponent";
import { TInternationalization } from "../../../config/setup";
import { GroupService } from "../../../service/service.group";
import { Modal } from "react-bootstrap";
import { Localization } from "../../../config/localization/localization";
import AsyncSelect from 'react-select/async';
import { BtnLoader } from "../../form/btn-loader/BtnLoader";
import { permissionChecker } from "../../../asset/script/accessControler";
import { T_ITEM_NAME, CHECKTYPE, CONDITION_COMBINE } from "../../../enum/T_ITEM_NAME";
import { toast } from "react-toastify";


//// start define IProps ///

export interface IProps {
    history?: History;
    internationalization: TInternationalization;
    onShow: boolean;
    onHide: () => void;
    userName: string;
    user_id: string;
}

//// end define IProps ///

interface optionObj { label: string, value: string };

//// start define IState ///

interface IState {
    userGroupsFetchRequest_has_error: boolean;
    retryBtnLoader: boolean;
    group: {
        value: { label: string | number, value: object }[] | null;
        isValid: boolean;
    };
}

//// end define IState ///


/// start class define ///

class AddOrRemoveGroupFromUserModalComponent extends BaseComponent<IProps, IState>{

    state = {
        userGroupsFetchRequest_has_error: false,
        retryBtnLoader: false,
        group: {
            value: null,
            isValid: true,
        },
    }

    private _groupService = new GroupService();
    private setTimeout_group_val: any;
    private groupRequstError_txt: string = Localization.no_item_found;

    componentDidMount() {
        this.fetchUserGroups(this.props.user_id);
    }

    async fetchUserGroups(user_id: string) {
        this.setState({ ...this.state, retryBtnLoader: true })
        let res = await this._groupService.fetchUserGroups(user_id).catch(error => {
            this.setState({ ...this.state, userGroupsFetchRequest_has_error: true, retryBtnLoader: false })
            this.handleError({ error: error.response, toastOptions: { toastId: 'fetchUserGroups_error' } });
        });

        if (res) {

            let newRes = res.data.result.map(item => { return { label: item.group.title, value: { id: item.group_id } } });

            this.setState({
                ...this.state,
                userGroupsFetchRequest_has_error: false,
                retryBtnLoader: false,
                group: {
                    ...this.state.group,
                    value: newRes,
                },
            });
        }
    }

    retry_func() {
        this.fetchUserGroups(this.props.user_id);
    }

    debounce_300(inputValue: any, callBack: any) {
        if (this.setTimeout_group_val) {
            clearTimeout(this.setTimeout_group_val);
        }
        this.setTimeout_group_val = setTimeout(() => {
            this.promiseOptions2(inputValue, callBack);
        }, 1000);
    }

    async promiseOptions2(inputValue: any, callBack: any) {
        let filter = undefined;
        if (inputValue) {
            filter = { title: {$prefix : inputValue } };
        }
        let res: any = await this._groupService.search(10, 0, filter).catch(err => {
            let err_msg = this.handleError({ error: err.response, notify: false, toastOptions: { toastId: 'promiseOptions2fetchUserGroups_error' } });
            this.groupRequstError_txt = err_msg.body;
        });

        if (res) {
            let groups = res.data.result.map((group: any) => {
                return { label: group.title, value: group }
            });
            this.groupRequstError_txt = Localization.no_item_found;
            callBack(groups);
        } else {
            callBack();
        }
    }

    select_noOptionsMessage(obj: { inputValue: string }) {
        return this.groupRequstError_txt;
    }

    handleMultiSelectInputChange(newValue: any[]) {
        const user_id: string = this.props.user_id;
        if (this.state.group.value === null) {
            this.onAddGroupToUser(newValue, user_id);
            return;
        }

        if (newValue === null) {
            this.onRemoveGroupFromUser(newValue, user_id);
            return;
        }

        const before: any[] = this.state.group.value!

        if (newValue.length > before.length) {
            this.onAddGroupToUser(newValue, user_id);
            return;
        }

        if (newValue.length < before.length) {
            this.onRemoveGroupFromUser(newValue, user_id);
            return;
        }
    }

    async onAddGroupToUser(newValue: any[], user_id: string) {

        if(permissionChecker.is_allow_item_render([T_ITEM_NAME.userManageJustAddGroupToUser],CHECKTYPE.ONE_OF_ALL,CONDITION_COMBINE.DOSE_NOT_HAVE) === false){
            toast.warn(Localization.msg.ui.there_is_no_access_for_you , this.getNotifyConfig());
            return;
        }

        if (this.state.group.value === null) {
            if (newValue === null) {
                return;
            }
            const newGroup: object = {
                groups: [newValue[0].value.id],
                users: [user_id],
            };

            let res = await this._groupService.addUserToGroup(newGroup).catch(error => {
                this.handleError({ error: error.response, toastOptions: { toastId: 'onAddGroupToUser_error' } });
            });

            if (res) {
                this.setState({
                    ...this.state,
                    group: {
                        ...this.state.group,
                        value: newValue,
                    }
                })
                this.apiSuccessNotify();
                return;
            }
        } else {
            const before: any[] = this.state.group.value!
            let addDiff = newValue.filter(x => !before.includes(x));
            const newGroup: object = {
                groups: [addDiff[0].value.id],
                users: [user_id],
            };

            let res = await this._groupService.addUserToGroup(newGroup).catch(error => {
                this.handleError({ error: error.response });
            });

            if (res) {
                this.setState({
                    ...this.state,
                    group: {
                        ...this.state.group,
                        value: newValue,
                    }
                })
                this.apiSuccessNotify();
            }
        }
    }

    async onRemoveGroupFromUser(newValue: any[], user_id: string) {

        if(permissionChecker.is_allow_item_render([T_ITEM_NAME.userManageJustDeleteGroupFromUser],CHECKTYPE.ONE_OF_ALL,CONDITION_COMBINE.DOSE_NOT_HAVE) === false){
            toast.warn(Localization.msg.ui.there_is_no_access_for_you , this.getNotifyConfig());
            return;
        }

        if (newValue === null) {

            const oneItemHaveState: any[] = this.state.group.value!;

            if (oneItemHaveState.length === 0) {
                return;
            }

            const removedGroup: object = {
                groups: [oneItemHaveState[0].value.id],
                users: [user_id],
            };

            let res = await this._groupService.removeUserFromGroup(removedGroup).catch(error => {
                this.handleError({ error: error.response, toastOptions: { toastId: 'onRemoveGroupFromUser_error' } });
            });

            if (res) {
                this.setState({
                    ...this.state,
                    group: {
                        ...this.state.group,
                        value: null,
                    }
                })
                this.apiSuccessNotify();
                return;
            }

        } else {
            const before: any[] = this.state.group.value!
            let removeDiff = before.filter(x => !newValue.includes(x));

            const removedGroup: object = {
                groups: [removeDiff[0].value.id],
                users: [user_id],
            };

            let res = await this._groupService.removeUserFromGroup(removedGroup).catch(error => {
                this.handleError({ error: error.response });
            });

            if (res) {
                this.setState({
                    ...this.state,
                    group: {
                        ...this.state.group,
                        value: newValue,
                    }
                })
                this.apiSuccessNotify();
            }
        }
    }

    modal_content_returner() {
        if (this.state.userGroupsFetchRequest_has_error === false) {
            return <>
                <Modal size='xl' show={this.props.onShow} onHide={() => this.props.onHide()}>
                    <Modal.Header>
                        <h2 className='text-bold text-dark text-center w-100'>افزودن گروه</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="delete-modal-content">
                            <span className="text-muted">
                                {Localization.username}:&nbsp;</span>{this.props.userName}
                        </p>
                        <div className="row">
                            <div className="col-12">
                                <label >{Localization.group}{<span className="text-danger">*</span>}</label>
                                <AsyncSelect
                                    isClearable={false}
                                    isMulti
                                    placeholder={Localization.group}
                                    cacheOptions
                                    defaultOptions
                                    value={this.state.group.value}
                                    loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback)}
                                    noOptionsMessage={(obj) => this.select_noOptionsMessage(obj)}
                                    onChange={(selectedGroup: any[]) => this.handleMultiSelectInputChange(selectedGroup)}
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.props.onHide()}>{Localization.close}</button>
                    </Modal.Footer>
                </Modal>
            </>
        } else {
            return <>
                <Modal size='xl' show={this.props.onShow} onHide={() => this.props.onHide()}>
                    <Modal.Header>
                        <h2 className='text-bold text-dark text-center w-100'>افزودن گروه</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="delete-modal-content">
                            <span className="text-muted">
                                {Localization.username}:&nbsp;</span>{this.props.userName}
                        </p>
                        <p className="delete-modal-content">
                            {Localization.msg.ui.msg5}
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-light shadow-default shadow-hover" onClick={() => this.props.onHide()}>{Localization.close}</button>
                        <BtnLoader
                            btnClassName="btn btn-success shadow-default shadow-hover"
                            onClick={() => this.retry_func()}
                            loading={this.state.retryBtnLoader}
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

export const AddOrRemoveGroupFromUserModal = connect(
    state2props,
    dispatch2props
)(AddOrRemoveGroupFromUserModalComponent);