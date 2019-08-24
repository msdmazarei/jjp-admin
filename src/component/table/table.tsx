import React, { Fragment } from 'react';
import { Localization } from '../../config/localization/localization';
// define props of table

export interface IProps_table {
    list: any[];
    colHeaders: {
        title: string;
        field: string;
        templateFunc?: () => JSX.Element | string;
        cellTemplateFunc?: (row: any) => JSX.Element | string;
    }[],
    actions?: {
        text: any;
        ac_func: (row: any) => void
    }[]
}
// define class of table
export class Table<T extends IProps_table> extends React.Component<T>{

    render() {
        return (
            <>
                <div className="table-responsive table-responsive-sm table-responsive-md table-responsive-lg table-responsive-xl template-box ps mb-3">
                    <table className="table table-striped table-bordered table-hover table-sm table-bordered bg-white mb-0">
                        <thead className="thead-light">
                            <tr className="table-light">
                                {(this.props.colHeaders).map((h, index) => (
                                    <Fragment key={index}>
                                        {
                                            h.templateFunc ?
                                                <th scope="font-weight-bold" >{h.templateFunc()}</th>
                                                :
                                                <th scope="font-weight-bold" >{h.title}</th>
                                        }
                                    </Fragment>
                                ))}
                                {
                                    this.props.actions ? <th className="text-center">#</th> : ''
                                }

                            </tr>
                        </thead>
                        <tbody>

                            {
                                (this.props.list && this.props.list.length) ?
                                    this.props.list.map((row, index) => (
                                        <tr className="table-light" key={index}>
                                            {this.props.colHeaders.map((ch, index) => (
                                                <td key={index}>
                                                    {
                                                        ch.cellTemplateFunc
                                                            ?
                                                            ch.cellTemplateFunc(row)
                                                            :
                                                            row[ch.field]
                                                    }
                                                </td>
                                            ))}
                                            {this.props.actions ?
                                                <td className="py-0 px-1 text-center">
                                                    {
                                                        this.props.actions ?
                                                            this.props.actions.map((ac, index) => (
                                                                <div className="text-center" key={index} onClick={() => ac.ac_func(row)}>{ac.text}</div>
                                                            ))
                                                            : ''
                                                    }
                                                </td>
                                                : ''
                                            }
                                        </tr>
                                    ))
                                    :
                                    <tr>
                                        <td colSpan={this.props.colHeaders.length+1} className="p-5 text-center">
                                            <span className="text-warning ">{Localization.no_item_found}</span>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </>)
    }
}

