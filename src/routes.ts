import Dashboard from "./component/dashboard/Dashboard";
import {BookManage} from "./component/book/BookManage/BookManage";
import User from "./component/user/User";
import { BookSave } from "./component/book/BookSave/BookSave";
// import { Login } from "./component/login/Login";
import {Localization} from "./config/localization/localization";
// import { any } from "prop-types";
// import { TInternationalization } from "./config/setup";
// import { Redirect } from "@reach/router";
// import TableList from "../src/views/TableList.tsx";
// import UserProfile from "../src/views/UserProfile";

var routes = [
  {
    path: "/dashboard",
    name: Localization.dashboard,
    // rtlName: "پنل مدیریت",
    icon: "fa fa-dashboard",
    component: Dashboard,
    layout: "/admin",
    isitem: true
  },
  {
    path: "/book/manage",
    name:Localization.book,
    // rtlName: "کتاب ها",
    icon: "fa fa-book",
    component: BookManage,
    layout: "/admin",
    isitem: true
  },
  {
    path: "/user/manage",
    name: "User",
    // rtlName: "کاربران",
    icon: "fa fa-user",
    component: User,
    layout: "/admin",
    isitem: false
  },
  {
    path: "/book/create",
    name: Localization.create_book,
    component: BookSave,
    layout: "/admin",
    isitem: false
  },
  {
    path: "/book/:book_id/edit",
    name: Localization.book_update,
    component: BookSave,
    layout: "/admin",
    isitem: false
  },
  // {
  //   path: "/book/manage",
  //   name:"user",
  //   icon: "fa fa-user",
  //   component: BookManage,
  //   layout: "/admin",
  //   isitem: true
  // },
  // {
  //   path: "/login",
  //   component: Login,
  //   layout: "/admin",
  //   isitem: false
  // },
  // {
  //   path: "/notifications",
  //   name: "dyfghjfddhghutrgfyuftd",
  //   rtlName: "إخطارات",
  //   icon: "tim-icons icon-bell-55",
  //   // component: Notifications,
  //   layout: "/admin",
  // },
  // {
  //   path: "/user-profile",
  //   name: "User Profile",
  //   rtlName: "ملف تعريفي للمستخدم",
  //   icon: "fa fa-user",
  //   component: UserProfile,
  //   layout: "/admin"
  // },
  // {
  //   path: "/tables",
  //   name: "Table List",
  //   rtlName: "قائمة الجدول",
  //   icon: "tim-icons icon-puzzle-10",
  //   component: TableList,
  //   layout: "/admin"
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   rtlName: "طباعة",
  //   icon: "tim-icons icon-align-center",
  //   component: Typography,
  //   layout: "/admin"
  // },
  // {
  //   path: "/rtl-support",
  //   name: "RTL Support",
  //   rtlName: "تغییر زبان",
  //   icon: "tim-icons icon-world",
  //   component: Rtl,
  //   layout: "/rtl"
  // }
];
export default routes;
