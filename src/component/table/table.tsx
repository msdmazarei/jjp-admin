import React, { Fragment } from 'react';
import { Localization } from '../../config/localization/localization';
import Dropdown from "react-bootstrap/Dropdown";
// define props of table

export interface IProps_table {
    row_offset_number?:number;
    loading?: boolean;
    list: any[];
    colHeaders: {
        title: string;
        field: string;
        templateFunc?: () => JSX.Element | string;
        cellTemplateFunc?: (row: any) => JSX.Element | string;
    }[],
    actions?: {
        name?: string;
        access?: (row: any) => boolean;
        text: any;
        ac_func: (row: any) => void
    }[]
}
// define class of table
export class Table<T extends IProps_table> extends React.Component<T>{

    getAccess_action(row: any, act_acs?: (row: any) => boolean) {
        if (act_acs) {
            return act_acs(row);
        }
        return true;
    }

    render() {
        return (
            <>
                <div className="table-responsive table-custom-scroll-x table-custom-scroll-y template-box mb-3 position-relative">

                    <div className={
                        "lds-roller-wrapper gutter-0 "
                        + (this.props.loading ? '' : 'd-none')
                    }>
                        <div className="lds-roller">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>
                    </div>

                    <table className="table table-striped table-hover table-sm table-bordered bg-white mb-0">
                        <thead className="thead-light">
                            <tr className="table-light">
                                {
                                    typeof this.props.row_offset_number === 'number' ? <th>{Localization.row}</th> : undefined
                                }
                                {(this.props.colHeaders).map((h, index) => (
                                    <Fragment key={index}>
                                        {
                                            h.templateFunc
                                                ?
                                                <th scope="font-weight-bold" >{h.templateFunc()}</th>
                                                :
                                                <th scope="font-weight-bold" >{h.title}</th>
                                        }
                                    </Fragment>
                                ))}
                                {
                                    this.props.actions ? <th className="text-center">#</th> : undefined
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                // (this.props.loading)
                                //     ?
                                //     <tr>
                                //         <td colSpan={this.props.colHeaders.length + 1} className="p-5 text-center">
                                //             <i className="fa fa-spinner fa-3x fa-spin"></i>
                                //         </td>
                                //     </tr>
                                //     :
                                (this.props.list && this.props.list.length)
                                    ?
                                    this.props.list.map((row, index) => (
                                        <tr className="table-light" key={index}>
                                            {
                                                typeof this.props.row_offset_number === 'number' ? <td>{this.props.row_offset_number! + index + 1}</td> : undefined
                                            }
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
                                            {this.props.actions
                                                ?
                                                <td className="py-0 px-1 text-center">
                                                    {
                                                        this.props.actions
                                                            ?
                                                            <Dropdown>
                                                                <Dropdown.Toggle
                                                                    title={Localization.more}
                                                                    split
                                                                    variant="light"
                                                                    className="px-3 bg-light btn"
                                                                    id="dropdown-split-basic"
                                                                >
                                                                    <i title={Localization.more} className="fa fa-ellipsis-v dropdown-icon"></i>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu
                                                                    className="dropdown-menu-right action-dropdown-menu"
                                                                >
                                                                    {
                                                                        this.props.actions.map((ac, index) => (
                                                                            (this.getAccess_action(row, ac.access))
                                                                                ?
                                                                                <Dropdown.Item className="text-center" key={index} onClick={() => ac.ac_func(row)}>
                                                                                    <>
                                                                                        <div className="text-center action-text-wrapper">
                                                                                            {ac.text}
                                                                                        </div>
                                                                                        <span className="action-name">
                                                                                            {ac.name}
                                                                                        </span>
                                                                                    </>
                                                                                </Dropdown.Item>
                                                                                :
                                                                                ''
                                                                        ))
                                                                    }
                                                                </Dropdown.Menu>
                                                            </Dropdown >
                                                            :
                                                            ''
                                                    }
                                                </td>
                                                :
                                                undefined
                                            }
                                        </tr>
                                    ))
                                    :
                                    <tr>
                                        <td colSpan={this.props.colHeaders.length + 1} className="p-5 text-center">
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