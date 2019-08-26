import Dashboard from "./component/dashboard/Dashboard";
import { BookManage } from "./component/book/BookManage/BookManage";
import { BookSave } from "./component/book/BookSave/BookSave";
import { PersonManage } from "./component/person/PersonManage/PersonManage";
import { PersonSave } from "./component/person/PeronSave/PersonSave";
import { Localization } from "./config/localization/localization";
// import User from "./component/user/User";
// import { Login } from "./component/login/Login";
// import { any } from "prop-types";
// import { TInternationalization } from "./config/setup";
// import { Redirect } from "@reach/router";
// import TableList from "../src/views/TableList.tsx";
// import UserProfile from "../src/views/UserProfile";

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
  // book
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
    component: BookSave,
    layout: "/admin",
    isitem: false
  },
  {
    path: "/book/:book_id/edit",
    name: Localization.book_update,
    component: BookSave,
    layout: "/admin",
    isitem: false,
    brandName: ['book', 'edit']
  },
  // person
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
];
export default routes;
