import React from 'react';

export class UserManage extends React.Component<any> {

    private gotoCreate() {
        this.props.history.push(`/user/create`);
    }

    render() {
        return (
            <div className="row">
                <div className="col-12">
                    user manage
                </div>
                <div className="col-12">
                    <div className="btn btn-success" onClick={() => this.gotoCreate()}>
                        goto create
                    </div>
                </div>
            </div>
        );
    }
}
