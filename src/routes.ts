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
import { GroupManage } from "./component/group/GroupManage/GroupManage";
import { GroupSave } from "./component/group/GroupSave/GroupSave";
import { PermissionSave } from "./component/permission/PermissionSave/PermissionSave";
import { PermissionManage } from "./component/permission/PermissionManage/PermissionManage";
import { Profile } from './component/profile/Profile';
import { BookGeneratorManage } from './component/BookGenerator/BookGeneratorManage/BookGeneratorManage';
import { BookGenerator } from './component/BookGenerator/BookGenerator/BookGenerator';
import { TransactionManage } from './component/transaction/TransactionManage/TransactionManage';
import { Localization } from "./config/localization/localization";


var routes = [
  {
    path: "/dashboard",
    name: Localization.dashboard,
    icon: "fa fa-dashboard",
    component: Dashboard,
    layout: "/admin",
    sidebarIconVisibility: true,
    brandName: ['dashboard'],
    PERMISSIONS: []
  },
  // book start
  {
    path: "/book/manage",
    name: Localization.book,
    icon: "fa fa-book",
    component: BookManage,
    layout: "/admin",
    sidebarIconVisibility: true,
    PERMISSIONS: ['BOOK_ADD_PREMIUM','BOOK_EDIT_PREMIUM','BOOK_DELETE_PREMIUM','BOOK_ADD_PRESS','BOOK_EDIT_PRESS','BOOK_DELETE_PRESS']
  },
  {
    path: "/book/create",
    name: Localization.create_book,
    icon: "fa fa-plus",
    component: BookSave,
    layout: "/admin",
    sidebarIconVisibility: true,
    PERMISSIONS: ['BOOK_ADD_PREMIUM', 'BOOK_ADD_PRESS']
  },
  {
    path: "/book/:book_id/edit",
    name: Localization.book_update,
    component: BookSave,
    layout: "/admin",
    sidebarIconVisibility: false,
    brandName: ['book', 'edit'],
    PERMISSIONS: []
  },
  // book end
  // generator start
  {
    path: "/book_generator/manage",
    name: Localization.content,
    icon: "fa fa-upload",
    component: BookGeneratorManage,
    layout: "/admin",
    sidebarIconVisibility: true,
    PERMISSIONS: ['BOOK_CONTENT_ADD_PREMIUM','BOOK_CONTENT_ADD_PRESS','BOOK_CONTENT_GET_PREMIUM','BOOK_CONTENT_GET_PRESS',]
  },
  {
    path: "/book_generator/create",
    name: Localization.create,
    icon: "fa fa-plus",
    component: BookGenerator,
    layout: "/admin",
    sidebarIconVisibility: false,
    PERMISSIONS: []
  },
  {
    path: "/book_generator/:book_generator_id/edit",
    name: Localization.update,
    component: BookGenerator,
    layout: "/admin",
    sidebarIconVisibility: false,
    brandName: ['book_generator', 'edit'],
    PERMISSIONS: []
  },
  {
    path: "/book_generator/:book_id/wizard",
    name: Localization.create,
    component: BookGenerator,
    layout: "/admin",
    sidebarIconVisibility: false,
    brandName: ['book_generator', 'wizard'],
    PERMISSIONS: []
  },
  // generator end
  // person start
  {
    path: "/person/manage",
    name: Localization.person,
    icon: "fa fa-id-card",
    component: PersonManage,
    layout: "/admin",
    sidebarIconVisibility: true,
    PERMISSIONS: ['PERSON_ADD_PREMIUM', 'PERSON_GET_PREMIUM']
  },
  {
    path: "/person/create",
    name: Localization.create_person,
    component: PersonSave,
    layout: "/admin",
    sidebarIconVisibility: false,
    PERMISSIONS: []
  },
  {
    path: "/person/:person_id/edit",
    name: Localization.person_update,
    component: PersonSave,
    layout: "/admin",
    sidebarIconVisibility: false,
    brandName: ['person', 'edit'],
    PERMISSIONS: []
  },
  // person end
  // user start
  {
    path: "/user/manage",
    name: Localization.user,
    icon: "fa fa-user",
    component: UserManage,
    layout: "/admin",
    sidebarIconVisibility: true,
    PERMISSIONS: ['USER_GET_PREMIUM']
  },
  {
    path: "/user/create",
    name: Localization.create_user,
    component: UserSave,
    layout: "/admin",
    sidebarIconVisibility: false,
    PERMISSIONS: []
  },
  {
    path: "/user/:user_id/edit",
    name: Localization.user_update,
    component: UserSave,
    layout: "/admin",
    sidebarIconVisibility: false,
    brandName: ['user', 'edit'],
    PERMISSIONS: []
  },
  {
    path: "/user/:person_id/wizard",
    name: Localization.create_user,
    component: UserSave,
    layout: "/admin",
    sidebarIconVisibility: false,
    brandName: ['user', 'wizard'],
    PERMISSIONS: []
  },
  // user end
  // comment start
  {
    path: "/comment/manage",
    name: Localization.comment,
    icon: "fa fa-comment",
    component: CommentManage,
    layout: "/admin",
    sidebarIconVisibility: true,
    PERMISSIONS: ['COMMENT_GET_PREMIUM']
  },
  {
    path: "/comment/:book_id/wizard",
    name: Localization.comment,
    component: CommentManage,
    layout: "/admin",
    sidebarIconVisibility: false,
    brandName: ['comment', 'wizard'],
    PERMISSIONS: []
  },
  // comment end
  // order start
  {
    path: "/order/manage",
    name: Localization.order,
    icon: "fa fa-shopping-cart",
    component: OrderManage,
    layout: "/admin",
    sidebarIconVisibility: true,
    PERMISSIONS: ['ORDER_ADD_PREMIUM', 'ORDER_ADD_PRESS', 'ORDER_GET_PREMIUM']
  },
  {
    path: "/order/create",
    name: Localization.create_order,
    component: OrderSave,
    layout: "/admin",
    sidebarIconVisibility: false,
    PERMISSIONS: []
  },
  {
    path: "/order/:order_id/edit",
    name: Localization.order_update,
    component: OrderSave,
    layout: "/admin",
    sidebarIconVisibility: false,
    brandName: ['order', 'edit'],
    PERMISSIONS: []
  },
  // order end
  // group start
  {
    path: "/group/manage",
    name: Localization.group,
    icon: "fa fa-users",
    component: GroupManage,
    layout: "/admin",
    sidebarIconVisibility: true,
    PERMISSIONS: []
  },
  {
    path: "/group/create",
    name: Localization.create_group,
    component: GroupSave,
    layout: "/admin",
    sidebarIconVisibility: false,
    PERMISSIONS: []
  },
  {
    path: "/group/:group_id/edit",
    name: Localization.group_update,
    component: GroupSave,
    layout: "/admin",
    sidebarIconVisibility: false,
    brandName: ['group', 'edit'],
    PERMISSIONS: []
  },
  // group end
  // permission start
  {
    path: "/permission/manage",
    name: Localization.permission,
    icon: "fa fa-universal-access",
    component: PermissionManage,
    layout: "/admin",
    sidebarIconVisibility: false,
    PERMISSIONS: []
  },
  {
    path: "/permission/create",
    name: Localization.create_permission,
    component: PermissionSave,
    layout: "/admin",
    sidebarIconVisibility: false,
    PERMISSIONS: []
  },
  {
    path: "/permission/:permission_id/edit",
    name: Localization.permission_update,
    component: PermissionSave,
    layout: "/admin",
    sidebarIconVisibility: false,
    brandName: ['permission', 'edit'],
    PERMISSIONS: []
  },
  // permission end
  // profile start
  {
    path: "/profile",
    name: Localization.profile,
    component: Profile,
    layout: "/admin",
    sidebarIconVisibility: false,
    brandName: ['profile', 'edit'],
    PERMISSIONS: []
  },
  // profile end
  // transaction start
  {
    path: "/transaction/manage",
    name: Localization.transaction,
    icon: "fa fa-list-alt",
    component: TransactionManage,
    layout: "/admin",
    sidebarIconVisibility: true,
    brandName: ['transaction', 'edit'],
    PERMISSIONS: ['TRANSACTION_GET_PREMIUM']
  },
  // transaction end
];
export default routes;
