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
import { GroupService } from '../../../service/service.group';

enum SAVE_MODE {
    CREATE = 'CREATE',
    EDIT = 'EDIT',
    DELETE = "DELETE"
}

interface IState {

    group: {
        groupname: {
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

class GroupSaveComponent extends BaseComponent<IProps, IState> {

    state = {
        group: {
            groupname: {
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

    private _groupService = new GroupService();

    private group_id: string | undefined;

    componentDidMount() {
        this._groupService.setToken(this.props.token);

        if (this.props.match.path.includes('/group/:group_id/edit')) {
            this.setState({ ...this.state, saveMode: SAVE_MODE.EDIT });
            this.group_id = this.props.match.params.group_id;
            this.fetchGroupById(this.props.match.params.group_id);
        }
    }

    backTO() {
        this.gotoGroupManage();
    }

    gotoGroupManage() {
        this.props.history.push('/group/manage');
    }

    async create() {
        this.setState({ ...this.state, createLoader: true });

        const groupobj = {
            group: this.state.group.groupname.value,
        }

        let res = await this._groupService.create(groupobj).catch(error => {
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

        const groupobj = {
            group: this.state.group.groupname.value,
        }

        let res = await this._groupService.update(groupobj, this.group_id!).catch(e => {
            this.handleError({ error: e.response });
        });

        this.setState({ ...this.state, updateLoader: false });

        if (res) {
            this.props.history.push('/group/manage');
            this.apiSuccessNotify();
        }
    }

    async fetchGroupById(group_id: string) {

        let res = await this._groupService.byId(group_id).catch(error => {
            this.handleError({ error: error.response });
        });

        if (res) {
            this.setState({
                ...this.state,
                group: {
                    ...this.state.group,
                    groupname: { ...this.state.group.groupname, value: res.data.group, isValid: true },
                },
                saveBtnVisibility: true
            })
        }

    }

    handleInputChange(value: any, isValid: boolean, inputType: any) {
        this.setState({
            ...this.state,
            group: {
                ...this.state.group, [inputType]: { value, isValid }
            }
            , isFormValid: this.checkFormValidate(isValid, inputType)
        })
    }

    checkFormValidate(isValid: boolean, inputType: any): boolean {
        let valid = true;
        let groupObj: any = { ...this.state.group };

        for (let i = 0; i < Object.keys(this.state.group).length; i++) {
            let IT = Object.keys(this.state.group)[i];
            if (IT !== inputType) {
                valid = valid && groupObj[IT].isValid;
                if (!groupObj[IT].isValid) {
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
            group: {
                groupname: { value: undefined, isValid: false },
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
                                            <h2 className="text-bold text-dark">{Localization.create_group}</h2>
                                            :
                                            <h2 className="text-bold text-dark">{Localization.group_update}</h2>
                                    }
                                </div>
                                {/* start give data by inputs */}
                                <div className="row">
                                    <div className="col-md-3 col-sm-6">
                                        <Input
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid, "groupname")}
                                            label={Localization.group}
                                            placeholder={Localization.group}
                                            defaultValue={this.state.group.groupname.value}
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

export const GroupSave = connect(
    state2props,
    dispatch2props
)(GroupSaveComponent);