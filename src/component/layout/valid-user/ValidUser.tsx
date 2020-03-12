import React from 'react';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { IUser } from '../../../model/model.user';
import { History } from "history";
import { BrowserRouter as Router, Route, Switch, Redirect, HashRouter } from 'react-router-dom';
import { RouteLayoutMain } from './main/Main';
import { LayoutNoWrapNotFound } from './no-wrap/not-found/NotFound';
import { RouteLayoutNoWrap } from './no-wrap/NoWrap';
import { Dashboard } from '../../dashboard/Dashboard';
import { BookManage } from '../../book/BookManage/BookManage';
import { BookSave } from '../../book/BookSave/BookSave';
import { BookGeneratorManage } from '../../BookGenerator/BookGeneratorManage/BookGeneratorManage';
import { BookGenerator } from '../../BookGenerator/BookGenerator/BookGenerator';
import { PersonManage } from '../../person/PersonManage/PersonManage';
import { PersonSave } from '../../person/PeronSave/PersonSave';
import { UserManage } from '../../user/UserManage/UserManage';
import { UserSave } from '../../user/UserSave/UserSave';
import { CommentManage } from '../../comment/CommentManage/CommentManage';
import { OrderManage } from '../../order/OrderManage/OrderManage';
import { OrderSave } from '../../order/OrderSave/OrderSave';
import { GroupManage } from '../../group/GroupManage/GroupManage';
import { GroupSave } from '../../group/GroupSave/GroupSave';
import { TransactionManage } from '../../transaction/TransactionManage/TransactionManage';
import { PressAccountingManage } from '../../PressAccounting/PressAccountingManage/PressAccountingManage';
import { PressAccountList } from '../../PressAccounting/PressAccountList/PressAccountList';
import { RecordNewPayment } from '../../PressAccounting/RecordNewPayment/RecordNewPayment';
// import { PermissionManage } from '../../permission/PermissionManage/PermissionManage';
// import { PermissionSave } from '../../permission/PermissionSave/PermissionSave';
import { Profile } from '../../profile/Profile';

const appValidUserRoutes = (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={() => <Redirect to="/dashboard" />} />
            <RouteLayoutMain exact path="/dashboard" component={Dashboard} />
            <RouteLayoutMain path="/book/manage" component={BookManage} />
            <RouteLayoutMain path="/book/create" component={BookSave} />
            <RouteLayoutMain path="/book/:book_id/edit" component={BookSave} />
            <RouteLayoutMain path="/book_generator/manage" component={BookGeneratorManage} />
            <RouteLayoutMain path="/book_generator/create" component={BookGenerator} />
            <RouteLayoutMain path="/book_generator/:book_generator_id/edit" component={BookGenerator} />
            <RouteLayoutMain path="/book_generator/:book_id/wizard" component={BookGenerator} />
            <RouteLayoutMain path="/person/manage" component={PersonManage} />
            <RouteLayoutMain path="/person/create" component={PersonSave} />
            <RouteLayoutMain path="/person/:person_id/edit" component={PersonSave} />
            <RouteLayoutMain path="/user/manage" component={UserManage} />
            <RouteLayoutMain path="/user/create" component={UserSave} />
            <RouteLayoutMain path="/user/:user_id/edit" component={UserSave} />
            <RouteLayoutMain path="/user/:person_id/wizard" component={UserSave} />
            <RouteLayoutMain path="/comment/manage" component={CommentManage} />
            <RouteLayoutMain path="/comment/:book_id/wizard" component={CommentManage} />
            <RouteLayoutMain path="/order/manage" component={OrderManage} />
            <RouteLayoutMain path="/order/create" component={OrderSave} />
            <RouteLayoutMain path="/order/:order_id/edit" component={OrderSave} />
            <RouteLayoutMain path="/group/manage" component={GroupManage} />
            <RouteLayoutMain path="/group/create" component={GroupSave} />
            <RouteLayoutMain path="/group/:group_id/edit" component={GroupSave} />
            <RouteLayoutMain path="/transaction/manage" component={TransactionManage} />
            <RouteLayoutMain path="/press_accounts/manage" component={PressAccountingManage} />
            <RouteLayoutMain path="/press_account_list/:press_id/manage" component={PressAccountList} />
            <RouteLayoutMain path="/record_new_payment" component={RecordNewPayment} />
            <RouteLayoutMain path="/update_recorded_payment/:payment_id" component={RecordNewPayment} />
            <RouteLayoutMain path="/update_recorded_payment_manage_wizard/:payment_id/:press_id" component={RecordNewPayment} />
            <RouteLayoutMain path="/record_new_payment_manage_wizard/:press_id" component={RecordNewPayment} />
            <RouteLayoutMain path="/record_new_payment_press_list_wizard/:press_id" component={RecordNewPayment} />
            {/* <RouteLayoutMain path="/permission/manage" component={PermissionManage} />
            <RouteLayoutMain path="/permission/create" component={PermissionSave} />
            <RouteLayoutMain path="/permission/:permission_id/edit" component={PermissionSave} /> */}
            <RouteLayoutMain path="/profile" component={Profile} />
            {/* keep "cmp LayoutNoWrapNotFound" last */}
            <RouteLayoutNoWrap component={LayoutNoWrapNotFound} />
        </Switch>
    </HashRouter>
);

export const RouteLayoutValidUser = ({ ...rest }: { [key: string]: any }) => {
    return (
        <Route {...rest} render={matchProps => (
            <LayoutValidUser {...matchProps} />
        )} />
    )
};

interface IProps {
    logged_in_user: IUser | null;
    history: History;
    match: any;
}

class LayoutValidUserComponent extends React.Component<IProps> {

    componentDidMount() {
        if (!this.props.logged_in_user) {
            this.props.history.push("/login");
        } else {
        }
    }

    componentWillUnmount() {
    }

    shouldComponentUpdate() {
        // debugger;
        if (!this.props.logged_in_user) {
            this.props.history.push("/login");
            return false;
        }
        return true;
    }

    render() {
        if (!this.props.logged_in_user) {
            return (
                <div></div>
            );
        }
        return (
            <>
                <Router>{appValidUserRoutes}</Router>
            </>
        )
    }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
    return {
    }
}

const state2props = (state: redux_state) => {
    return {
        logged_in_user: state.logged_in_user,
    }
}

export const LayoutValidUser = connect(state2props, dispatch2props)(LayoutValidUserComponent);
