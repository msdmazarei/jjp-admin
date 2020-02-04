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
import { PressAccountingManage } from "./component/PressAccounting/PressAccountingManage/PressAccountingManage"
import { PressAccountList } from "./component/PressAccounting/PressAccountList/PressAccountList"
import { Localization } from "./config/localization/localization";
import { TPERMISSIONS } from "./enum/Permission";
import { RecordNewPayment } from "./component/PressAccounting/RecordNewPayment/RecordNewPayment";

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
    PERMISSIONS: []
  },
  {
    path: "/book/create",
    name: Localization.create_book,
    icon: "fa fa-plus",
    component: BookSave,
    layout: "/admin",
    sidebarIconVisibility: true,
    PERMISSIONS: [TPERMISSIONS.BOOK_ADD_PREMIUM, TPERMISSIONS.BOOK_ADD_PRESS]
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
    PERMISSIONS: [TPERMISSIONS.BOOK_CONTENT_ADD_PREMIUM,TPERMISSIONS.BOOK_CONTENT_ADD_PRESS,TPERMISSIONS.BOOK_CONTENT_GET_PREMIUM,TPERMISSIONS.BOOK_CONTENT_GET_PRESS]
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
    PERMISSIONS: [TPERMISSIONS.PERSON_ADD_PREMIUM, TPERMISSIONS.PERSON_GET_PREMIUM]
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
    PERMISSIONS: [TPERMISSIONS.USER_GET_PREMIUM]
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
    PERMISSIONS: [TPERMISSIONS.COMMENT_GET_PREMIUM]
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
    PERMISSIONS: [TPERMISSIONS.ORDER_ADD_PREMIUM, TPERMISSIONS.ORDER_ADD_PRESS, TPERMISSIONS.ORDER_GET_PREMIUM]
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
    PERMISSIONS: [TPERMISSIONS.PERMISSION_GROUP_ADD_PREMIUM,TPERMISSIONS.PERMISSION_GROUP_ADD_PRESS,TPERMISSIONS.PERMISSION_GROUP_GET_PREMIUM,TPERMISSIONS.PERMISSION_GROUP_GET_PRESS]
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
    PERMISSIONS: [TPERMISSIONS.TRANSACTION_GET_PREMIUM]
  },
  // transaction end
  // pressAccounting start
  {
    path: "/press_accounts/manage",
    name: Localization.Publishers_bills,
    icon: "fa fa-money",
    component: PressAccountingManage,
    layout: "/admin",
    sidebarIconVisibility: true,
    PERMISSIONS: []
  },
  {
    path: "/press_account_list/:press_id/manage",
    name: Localization.receipts_list,
    component: PressAccountList,
    layout: "/admin",
    sidebarIconVisibility: false,
    brandName: ['press_account_list', 'manage'],
    PERMISSIONS: []
  },
  {
    path: "/record_new_payment",
    name: Localization.record_pay,
    component: RecordNewPayment,
    layout: "/admin",
    sidebarIconVisibility: false,
    brandName: ['record_new_payment', 'manage'],
    PERMISSIONS: []
  },
  {
    path: "/record_new_payment_manage_wizard/:press_id",
    name: Localization.record_pay,
    component: RecordNewPayment,
    layout: "/admin",
    sidebarIconVisibility: false,
    brandName: ['record_new_payment_manage_wizard', 'manage'],
    PERMISSIONS: []
  },
  {
    path: "/record_new_payment_press_list_wizard/:press_id",
    name: Localization.record_pay,
    component: RecordNewPayment,
    layout: "/admin",
    sidebarIconVisibility: false,
    brandName: ['record_new_payment_press_list_wizard', 'manage'],
    PERMISSIONS: []
  },
  // pressAccounting end
  // example icon & path start 
  // {
  //   path: "/example",
  //   name: 'example',
  //   icon: "fa fa-coffee",
  //   component: TagSelect,
  //   layout: "/admin",
  //   sidebarIconVisibility: true,
  //   brandName: ['example'],
  //   PERMISSIONS: []
  // },
  // example icon & path end 
];
export default routes;

















