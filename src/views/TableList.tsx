import React from "react";
import { Fragment } from 'react';
// import{Localization} from '../config/localization/localization';
// import { TInternationalization } from "../config/setup";

// reactstrap components
// import {
//   Card,
//   CardHeader,
//   CardBody,
//   CardTitle,
//   Table,
//   Row,
//   Col
// } from "reactstrap";

// define props of table
interface IProps_table {
    list: any[];
    colHeaders: {
        title: string;
        field: string;
        templateFunc?: () => any;
    }[],
    actions?: {
        text: any;
        ac_func: (row: any) => void
    }[]
}


export class Tables22<T extends IProps_table> extends React.Component<T>{

    constructor(props: any) {
        super(props);
        this.state = this.props.list;
    }

    render() {
        return (
            <>
                <div className="table-responsive-sm">
                    <table className="table table-light table-bordered table-hover table-striped m-4 w-50">
                        <thead className="thead-light">
                            <tr>
                                {this.props.colHeaders.map((h, index) => (
                                    <Fragment key={index}>
                                        {
                                            h.templateFunc ?
                                                <th>{h.templateFunc()}</th>
                                                :
                                                <th>{h.title}</th>
                                        }
                                    </Fragment>
                                ))}
                                {
                                    this.props.actions ? <th>#</th> : ''
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.list.map((row, index) => (
                                <tr key={index}>
                                    {this.props.colHeaders.map((ch, index) => (
                                        <td key={index}>{row[ch.field]}</td>
                                    ))}
                                    {this.props.actions ?
                                        <td>
                                            {
                                                this.props.actions ?
                                                    this.props.actions.map((ac, index) => (
                                                        <div key={index} onClick={() => ac.ac_func(row)}>{ac.text}</div>
                                                    ))
                                                    : ''
                                            }
                                        </td>
                                        : ''
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>)
    }
}

export default Tables22;