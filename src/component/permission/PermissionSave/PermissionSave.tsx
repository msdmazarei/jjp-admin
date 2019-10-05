import React from 'react';
import { Input } from '../../form/input/Input';
import { History } from 'history';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { Localization } from '../../../config/localization/localization';
import { IToken } from '../../../model/model.token';
import { ToastContainer } from 'react-toastify';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { PermissionService } from '../../../service/service.permission';

enum SAVE_MODE {
    CREATE = 'CREATE',
    EDIT = 'EDIT',
    DELETE = "DELETE"
}

interface IState {

    permission: {
        permissionname: {
            value: string | undefined;
            isValid: boolean;
        };
    };

    isFormValid: boolean;
    saveMode: SAVE_MODE;
    createLoader: boolean;
    updateLoader: boolean;
    saveBtnVisibility: boolean;
}

interface IProps {
    match: any;
    history: History;
    internationalization: TInternationalization;
    token: IToken;
}

class PermissionSaveComponent extends BaseComponent<IProps, IState> {

    state = {
        permission: {
            permissionname: {
                value: undefined,
                isValid: false,
            },
        },

        isFormValid: false,
        saveMode: SAVE_MODE.CREATE,
        createLoader: false,
        updateLoader: false,
        saveBtnVisibility: false,
    }

    private _permissionService = new PermissionService();

    private permission_id: string | undefined;

    componentDidMount() {
        this._permissionService.setToken(this.props.token);

        if (this.props.match.path.includes('/permission/:permission_id/edit')) {
            this.setState({ ...this.state, saveMode: SAVE_MODE.EDIT });
            this.permission_id = this.props.match.params.permission_id;
            this.fetchPermissionById(this.props.match.params.permission_id);
        }
    }

    backTO() {
        this.gotoPermissionManage();
    }

    gotoPermissionManage() {
        this.props.history.push('/permission/manage');
    }

    async create() {
        this.setState({ ...this.state, createLoader: true });

        const permissionobj = {
            permission: this.state.permission.permissionname.value,
        }

        let res = await this._permissionService.create(permissionobj).catch(error => {
            this.handleError({ error: error.response });
        });

        this.setState({ ...this.state, createLoader: false });

        if (res) {
            this.apiSuccessNotify();
            this.resetForm();
        }
    }

    async update() {
        this.setState({ ...this.state, updateLoader: true });

        const permissionobj = {
            permission: this.state.permission.permissionname.value,
        }

        let res = await this._permissionService.update(permissionobj, this.permission_id!).catch(e => {
            this.handleError({ error: e.response });
        });

        this.setState({ ...this.state, updateLoader: false });

        if (res) {
            this.props.history.push('/permission/manage');
            this.apiSuccessNotify();
        }
    }

    async fetchPermissionById(permissions_id: string) {

        let res = await this._permissionService.byId(permissions_id).catch(error => {
            this.handleError({ error: error.response });
        });

        if (res) {
            this.setState({
                ...this.state,
                permission: {
                    ...this.state.permission,
                    permissionname: { ...this.state.permission.permissionname, value: res.data.permission, isValid: true },
                },
                saveBtnVisibility: true
            })
        }

    }

    handleInputChange(value: any, isValid: boolean, inputType: any) {
        this.setState({
            ...this.state,
            permission: {
                ...this.state.permission, [inputType]: { value, isValid }
            }
            , isFormValid: this.checkFormValidate(isValid, inputType)
        })
    }

    checkFormValidate(isValid: boolean, inputType: any): boolean {
        let valid = true;
        let permissionObj: any = { ...this.state.permission };

        for (let i = 0; i < Object.keys(this.state.permission).length; i++) {
            let IT = Object.keys(this.state.permission)[i];
            if (IT !== inputType) {
                valid = valid && permissionObj[IT].isValid;
                if (!permissionObj[IT].isValid) {
                    break;
                }
            }
        }
        valid = valid && isValid;
        return valid;
    }

    resetForm() {
        this.setState({
            ...this.state,
            permission: {
                permissionname: { value: undefined, isValid: false },
            },

            isFormValid: false,
        })
    }

    ////// render ////////
    render() {
        return (
            <>
                <div className="content">
                    <div className="row">
                        <div className="col-12">
                            <div className="template-box">
                                <div className="">
                                    {
                                        this.state.saveMode === SAVE_MODE.CREATE
                                            ?
                                            <h2 className="text-bold text-dark">{Localization.create_permission}</h2>
                                            :
                                            <h2 className="text-bold text-dark">{Localization.permission_update}</h2>
                                    }
                                </div>
                                {/* start give data by inputs */}
                                <div className="row">
                                    <div className="col-md-3 col-sm-6">
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "permissionname")}
                                            label={Localization.permission}
                                            placeholder={Localization.permission}
                                            defaultValue={this.state.permission.permissionname.value}
                                            required
                                        />
                                    </div>
                                </div>
                                {/* end of give data by inputs */}
                                <div className="d-flex justify-content-between mt-4">
                                    <div className="mr-0 pr-0">
                                        {
                                            this.state.saveMode === SAVE_MODE.CREATE
                                                ?
                                                <>
                                                    <BtnLoader
                                                        btnClassName="btn btn-success shadow-default shadow-hover"
                                                        loading={this.state.createLoader}
                                                        onClick={() => this.create()}
                                                        disabled={!this.state.isFormValid}
                                                    >
                                                        {Localization.create}
                                                    </BtnLoader>
                                                    <BtnLoader
                                                        btnClassName="btn btn-warning shadow-default shadow-hover ml-3"
                                                        loading={false}
                                                        onClick={() => this.resetForm()}
                                                        disabled={false}
                                                    >
                                                        {Localization.reset}
                                                    </BtnLoader>
                                                </>
                                                :
                                                <>
                                                    {
                                                        this.state.saveBtnVisibility ?
                                                            <BtnLoader
                                                                btnClassName="btn btn-info shadow-default shadow-hover"
                                                                loading={this.state.updateLoader}
                                                                onClick={() => this.update()}
                                                                disabled={!this.state.isFormValid}
                                                            >
                                                                {Localization.update}
                                                            </BtnLoader>
                                                            : ''
                                                    }
                                                </>

                                        }
                                    </div>
                                    <BtnLoader
                                        btnClassName="btn btn-primary shadow-default shadow-hover"
                                        loading={false}
                                        onClick={() => this.backTO()}
                                        disabled={false}
                                    >
                                        {Localization.back}
                                    </BtnLoader>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer {...this.getNotifyContainerConfig()} />
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
        token: state.token,
    };
};

export const PermissionSave = connect(
    state2props,
    dispatch2props
)(PermissionSaveComponent);