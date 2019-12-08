import React from 'react';
import { History } from 'history';
import { BaseComponent } from '../../../_base/BaseComponent';
import { TInternationalization } from '../../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../../redux/app_state';
import { Localization } from '../../../../config/localization/localization';
import { book_body_pdf } from '../../BookGenerator/BookGenerator';
import Dropzone from "react-dropzone";
import { toast } from 'react-toastify';
import { AppGuid } from '../../../../asset/script/guid';

interface IProps {
    match?: any;
    history?: History;
    internationalization: TInternationalization;
    body: book_body_pdf[];
    onFileChange: (value: book_body_pdf[]) => void;
}

interface IState {
    pdf?: any;
    name?: string;
}

class PdfGeneratorComponent extends BaseComponent<IProps, IState> {

    state = {
        pdf: [],
        name: '',
    }

    pdf: any = [];
    name: string = '';

    componentDidMount() {
        this.setState({
            pdf: (this.props.body.length && this.props.body[0].pdf && this.props.body[0].pdf !== '') ? this.props.body[0].pdf : [],
            name: (this.props.body.length && this.props.body[0].name && typeof this.props.body[0].name === 'string') ? this.props.body[0].name : '',
        });
        this.pdf = (this.props.body.length && this.props.body[0].pdf && this.props.body[0].pdf !== '') ? this.props.body[0].pdf : [];
        this.name = (this.props.body.length && this.props.body[0].name && typeof this.props.body[0].name === 'string') ? this.props.body[0].name : '';
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps === this.props) return;
        this.setState({
            pdf: (nextProps.body.length && nextProps.body[0].pdf && nextProps.body[0].pdf !== '') ? nextProps.body[0].pdf : [],
            name: (nextProps.body.length && nextProps.body[0].name && typeof nextProps.body[0].name === 'string') ? nextProps.body[0].name : '',
        });
    }

    passBodyObjToProps() {
        let newBody: book_body_pdf[] = [
            {
                front_id: (this.props.body.length && this.props.body[0].front_id) ? this.props.body[0].front_id : AppGuid.generate(),
                name: this.state.name,
                pdf: this.state.pdf,
                type: (this.props.body.length && this.props.body[0].type) ? this.props.body[0].type : 'pdf',
            }
        ];
        this.props.onFileChange(newBody)
    }

    removePreviousPdfNotify() {
        toast.warn(Localization.msg.ui.admin_book_content_generate.just_one_Pdf_file_can_upload, this.getNotifyConfig());
    }

    onDropRejected(files: any[], event: any) {
        this.onDropRejectedNotify(files);
    }

    onDropRejectedNotify(files: any[]) {
        toast.warn(Localization.validation_msg.file_can_not_added, this.getNotifyConfig());
    }

    removeItemFromDZ() {
        this.pdf = [];
        this.setState({
            ...this.state,
            pdf: this.pdf,
        }, () => this.passBodyObjToProps())
    }

    onDropPdf(file: any[]) {
        if (!file || !file.length) return;
        if (this.state.pdf && this.state.pdf!.length) {
            this.removePreviousPdfNotify();
            return;
        }
        this.pdf = file;
        this.name = this.pdf[0].name ? this.pdf[0].name : '';
        this.setState({
            ...this.state,
            pdf: this.pdf,
            name: this.name,
        }, () => this.passBodyObjToProps())
    }

    returner_pdf_render() {
        if (typeof this.state.pdf === 'string') {
            return <div className="img-item m-2">
                <a rel="noopener noreferrer" target='_blank' href={"/api/serve-files/" + this.state.pdf}>
                    <span className="">
                        <i className="fa fa fa-file-pdf-o text-info"></i>
                    </span>
                    <span className="text-info mx-3">{this.state.name}</span>
                </a>
                <button title={Localization.remove} className="img-remover btn btn-danger btn-sm ml-2" onClick={() => this.removeItemFromDZ()}>&times;</button>
            </div>
        }
        return <div className="role-img-container">
            <Dropzone
                multiple={false}
                onDrop={(files) => this.onDropPdf(files)}
                // maxSize={5000000}
                accept=".pdf"
                onDropRejected={(files, event) => this.onDropRejected(files, event)}
            >
                {
                    (({ getRootProps, getInputProps }) => (
                        <section className="container">
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />
                    <p className="img-container text-center text-muted p-3">{<i className="fa fa fa-file-pdf-o text-info mx-3"></i>}{Localization.DRAG_AND_DROP}</p>
                            </div>
                            <aside>
                                <h5 className="m-2">{Localization.preview}:</h5>
                                <div className="image-wrapper mb-2">
                                {
                                    this.state.pdf.length === 0
                                        ?
                                        undefined
                                        :
                                        <>
                                                <div className="img-item m-2">
                                                    {
                                                        (this.state.pdf)
                                                            ?
                                                            <span className="">
                                                                <i className="fa fa fa-file-pdf-o text-info"></i>
                                                            </span>
                                                            :
                                                            <span className="">
                                                                <i className="fa fa fa-file-pdf-o text-info"></i>
                                                            </span>
                                                    }
                                                    {
                                                        this.state.pdf.length === 0
                                                            ?
                                                            undefined
                                                            :
                                                            <span className="mx-2 text-dark">{this.state.name ? this.state.name : ""} {(this.pdf[0].size && typeof this.pdf[0].size === "number") ? '- ' + parseFloat((this.pdf[0].size / 1024).toFixed(2)) + ' KB' : 'Unknown size'}</span>
                                                    }
                                                    <button title={Localization.remove} className="img-remover btn btn-danger btn-sm ml-4" onClick={() => this.removeItemFromDZ()}>&times;</button>
                                                </div>
                                        </>
                                }
                                </div>
                            </aside>
                        </section>
                    ))
                }
            </Dropzone>
        </div >
    }

    render() {
        return (
            <>
                {
                    <div className="col-12">
                        {
                            this.returner_pdf_render()
                        }
                    </div>
                }
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

export const PdfGenerator = connect(
    state2props,
    dispatch2props
)(PdfGeneratorComponent);