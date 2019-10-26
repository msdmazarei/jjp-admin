import React from 'react';
import { Input } from '../../form/input/Input';
import { History } from 'history';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { Localization } from '../../../config/localization/localization';
// import { IToken } from '../../../model/model.token';
import { ToastContainer } from 'react-toastify';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { GroupService } from '../../../service/service.group';
import { IPerson } from '../../../model/model.person';
import { PersonService } from '../../../service/service.person';
import AsyncSelect from 'react-select/async';

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
        person_id: {
            value: string | undefined | undefined;
            isValid: boolean;
        };
    };

    person: {
        value: { label: string, value: IPerson } | undefined | null; // IPerson | any,
        // isValid: boolean
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
    // token: IToken;
}

class GroupSaveComponent extends BaseComponent<IProps, IState> {

    state = {
        group: {
            groupname: {
                value: undefined,
                isValid: false,
            },
            person_id: {
                value: undefined,
                isValid: true,
            },
        },

        person: {
            value: undefined,
            isValid: true,
        },

        isFormValid: false,
        saveMode: SAVE_MODE.CREATE,
        createLoader: false,
        updateLoader: false,
        saveBtnVisibility: false,
    }

    private _groupService = new GroupService();
    private _personService = new PersonService();

    private group_id: string | undefined;

    componentDidMount() {
        // this._groupService.setToken(this.props.token);
        // this._personService.setToken(this.props.token);

        if (this.props.match.path.includes('/group/:group_id/edit')) {
            console.log('fired')
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
        if (!this.state.isFormValid) return;
        this.setState({ ...this.state, createLoader: true });

        let groupobj: {};

        this.state.person.value === undefined
            ?
            groupobj = {
                title: this.state.group.groupname.value,
            }
            :
            groupobj = {
                title: this.state.group.groupname.value,
                person_id: this.state.group.person_id.value
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
        if (!this.state.isFormValid) return;
        this.setState({ ...this.state, updateLoader: true });

        let groupobj: {};

        this.state.person.value === undefined
            ?
            groupobj = {
                title: this.state.group.groupname.value,
            }
            :
            groupobj = {
                title: this.state.group.groupname.value,
                person_id: this.state.group.person_id.value
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
                    groupname: { ...this.state.group.groupname, value: res.data.title, isValid: true },
                },
                saveBtnVisibility: true
            })
        }

    }

    handleInputChange(value: any, isValid: boolean) {
        this.setState({
            ...this.state,
            group: {
                ...this.state.group,
                groupname:{
                    value:value,
                    isValid:isValid,
                },
                person_id:{
                    ...this.state.group.person_id,
                    isValid:true,
                }
            }
            , isFormValid: this.checkFormValidate(isValid, "groupname")
        })
    }

    handlePersonChange = (selectedPerson: { label: string, value: IPerson }) => {
        let newperson = { ...selectedPerson };
        let isValid = true;      // newperson = selectedPerson;
        this.setState({
            ...this.state, group: {
                ...this.state.group, person_id: {
                    value: newperson.value.id,
                    isValid: isValid,
                }
            },
            person: {
                ...this.state.person,
                value: newperson,
                // isValid:true,
            },
            isFormValid: this.checkFormValidate(isValid, 'person_id')
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
                person_id: { value: undefined, isValid: false },
            },
            person: { value: null },
            isFormValid: false,
        })
    }

    ////// request for person ////////

    private personRequstError_txt: string = Localization.no_item_found;

    async promiseOptions2(inputValue: any, callBack: any) {
        let filter = undefined;
        if (inputValue) {
            filter = { person: inputValue };
        }
        let res: any = await this._personService.search(10, 0, filter).catch(err => {
            let err_msg = this.handleError({ error: err.response, notify: false });
            this.personRequstError_txt = err_msg.body;
        });

        if (res) {
            let persons = res.data.result.map((ps: any) => {
                return { label: this.getPersonFullName(ps), value: ps }
            });
            this.personRequstError_txt = Localization.no_item_found;
            callBack(persons);
        } else {
            callBack();
        }
    }

    private setTimeout_person_val: any;
    debounce_300(inputValue: any, callBack: any) {
        if (this.setTimeout_person_val) {
            clearTimeout(this.setTimeout_person_val);
        }
        this.setTimeout_person_val = setTimeout(() => {
            this.promiseOptions2(inputValue, callBack);
        }, 1000);
    }

    select_noOptionsMessage(obj: { inputValue: string }) {
        return this.personRequstError_txt;
    }


    /////////////////////////////////////

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
                                            onChange={(value, isValid) => this.handleInputChange(value, isValid)}
                                            label={Localization.title}
                                            placeholder={Localization.title}
                                            defaultValue={this.state.group.groupname.value}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        {/* <label >{Localization.person}{<span className="text-danger">*</span>}</label> */}
                                        <label >{Localization.person}</label>
                                        <AsyncSelect
                                            placeholder={Localization.person}
                                            cacheOptions
                                            defaultOptions
                                            value={this.state.person.value}
                                            loadOptions={(inputValue, callback) => this.debounce_300(inputValue, callback)}
                                            noOptionsMessage={(obj) => this.select_noOptionsMessage(obj)}
                                            onChange={(selectedPerson: any) => this.handlePersonChange(selectedPerson)}
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
        // token: state.token,
    };
};

export const GroupSave = connect(
    state2props,
    dispatch2props
)(GroupSaveComponent);