import { Dashboard } from "./component/dashboard/Dashboard";
import { BookManage } from "./component/book/BookManage/BookManage";
import { BookSave } from "./component/book/BookSave/BookSave";
import { PersonManage } from "./component/person/PersonManage/PersonManage";
import { PersonSave } from "./component/person/PeronSave/PersonSave";
import { UserManage } from "./component/user/UserManage/UserManage";
import { UserSave } from "./component/user/UserSave/UserSave";
import { CommentManage } from "./component/comment/CommentManage/CommentManage";
import { OrderManage } from "./component/order/OrderManage/OrderManage";
import { OrderSave } from "./component/order/OrderSave/OrderSave";
import { Localization } from "./config/localization/localization";


var routes = [
  {
    path: "/dashboard",
    name: Localization.dashboard,
    icon: "fa fa-dashboard",
    component: Dashboard,
    layout: "/admin",
    isitem: true,
    brandName: ['dashboard']
  },
  // book start
  {
    path: "/book/manage",
    name: Localization.book,
    icon: "fa fa-book",
    component: BookManage,
    layout: "/admin",
    isitem: true
  },
  {
    path: "/book/create",
    name: Localization.create_book,
    icon: "fa fa-plus",
    component: BookSave,
    layout: "/admin",
    isitem: true,
  },
  {
    path: "/book/:book_id/edit",
    name: Localization.book_update,
    component: BookSave,
    layout: "/admin",
    isitem: false,
    brandName: ['book', 'edit']
  },
  // book end
  // person start
  {
    path: "/person/manage",
    name: Localization.person,
    icon: "fa fa-id-card",
    component: PersonManage,
    layout: "/admin",
    isitem: true
  },
  {
    path: "/person/create",
    name: Localization.create_person,
    component: PersonSave,
    layout: "/admin",
    isitem: false
  },
  {
    path: "/person/:person_id/edit",
    name: Localization.person_update,
    component: PersonSave,
    layout: "/admin",
    isitem: false,
    brandName: ['person', 'edit']
  },
  // person end
  // user start
  {
    path: "/user/manage",
    name: Localization.user,
    icon: "fa fa-user",
    component: UserManage,
    layout: "/admin",
    isitem: true
  },
  {
    path: "/user/create",
    name: Localization.create_user,
    component: UserSave,
    layout: "/admin",
    isitem: false
  },
  {
    path: "/user/:user_id/edit",
    name: Localization.user_update,
    component: UserSave,
    layout: "/admin",
    isitem: false,
    brandName: ['user', 'edit']
  },
  // user end
  // comment start
  {
    path: "/comment/manage",
    name: Localization.comment,
    icon: "fa fa-comment",
    component: CommentManage,
    layout: "/admin",
    isitem: true
  },
  // comment end
  // order start
  {
    path: "/order/manage",
    name: Localization.order,
    icon: "fa fa-shopping-cart",
    component: OrderManage,
    layout: "/admin",
    isitem: true
  },
  {
    path: "/order/create",
    name: Localization.create_order,
    component: OrderSave,
    layout: "/admin",
    isitem: false
  },
  {
    path: "/order/:order_id/edit",
    name: Localization.order_update,
    component: OrderSave,
    layout: "/admin",
    isitem: false,
    brandName: ['order', 'edit']
  },
  // order end
  // group start
  {
    path: "/group/manage",
    name: "گروه ها",//Localization.groups,
    icon: "fa fa-users",
    // component: GroupManage,
    layout: "/admin",
    isitem: true
  },
  // {
  //   path: "/group/create",
  //   name: Localization.group_order,
  //   component: GroupSave,
  //   layout: "/admin",
  //   isitem: false
  // },
  // {
  //   path: "/group/:group_id/edit",
  //   name: Localization.group_update,
  //   component: GroupSave,
  //   layout: "/admin",
  //   isitem: false,
  //   brandName: ['group', 'edit']
  // },
  // group end
  // access start
  {
    path: "/access/manage",
    name: "دسترسی ها",//Localization.access,
    icon: "fa fa-universal-access",
    // component: AccessManage,
    layout: "/admin",
    isitem: true
  },
  // {
  //   path: "/access/create",
  //   name: Localization.access_order,
  //   component: AccessSave,
  //   layout: "/admin",
  //   isitem: false
  // },
  // {
  //   path: "/access/:access_id/edit",
  //   name: Localization.access_update,
  //   component: AccessSave,
  //   layout: "/admin",
  //   isitem: false,
  //   brandName: ['access', 'edit']
  // },
  // access end
];
export default routes;
