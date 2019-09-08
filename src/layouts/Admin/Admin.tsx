import React from "react";
import { Route, Switch } from "react-router-dom";
// import PerfectScrollbar from "perfect-scrollbar";

// core components
import { AdminNavbar } from "../../component/Navbars/AdminNavbar";
import Sidebar from "../../component/Sidebar/Sidebar";
import routes from "../.././routes";
// import { Localization } from "../../config/localization/localization";
import { connect, MapDispatchToProps } from "react-redux";
import { redux_state } from "../../redux/app_state.js";
import { Dispatch } from "redux";
// import logo from "../../asset/style/img/react-logo.png";
import { History, Location } from 'history';
// import * as HSTR from 'history';
import { IUser } from "../../model/model.user";
import { TInternationalization } from "../../config/setup";
import { Localization } from "../../config/localization/localization";


interface IProps {
  logged_in_user?: IUser | null;
  internationalization: TInternationalization;
  history: History;
  location: Location; // HSTR.Location;
}

// let ps: any;

class AdminComponent/* <IAdmin_p extends IProps> */ extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      backgroundColor: "blue",
      sidebarOpened:
        document.documentElement.className.indexOf("nav-open") !== -1
    };
  }

  componentWillMount() {
    if (!this.props.logged_in_user) {
      this.props.history.push("/login");
    }
  }

  shouldComponentUpdate() {
    if (!this.props.logged_in_user) {
      this.props.history.push("/login");
      return false;
    }
    return true;
  }

  componentDidMount() {
    // if (navigator.platform.indexOf("Win") > -1) {
    //   document.documentElement.className += " perfect-scrollbar-on";
    //   document.documentElement.classList.remove("perfect-scrollbar-off");
    //   let refsss: any = this.refs;
    //   if (!refsss.mainPanel) { return; }
    //   ps = new PerfectScrollbar(refsss.mainPanel, { suppressScrollX: true });
    //   let tables: any = document.querySelectorAll(".table-responsive");
    //   for (let i = 0; i < tables.length; i++) {
    //     ps = new PerfectScrollbar(tables[i]);
    //   }
    // }
  }
  componentWillUnmount() {
    // if (navigator.platform.indexOf("Win") > -1) {
    //   ps && ps.destroy();
    //   document.documentElement.className += " perfect-scrollbar-off";
    //   document.documentElement.classList.remove("perfect-scrollbar-on");
    // }
  }
  componentDidUpdate(e: any) {
    // if (e.history.action === "PUSH") {
    //   if (navigator.platform.indexOf("Win") > -1) {
    //     let tables: any = document.querySelectorAll(".table-responsive");
    //     for (let i = 0; i < tables.length; i++) {
    //       ps = new PerfectScrollbar(tables[i]);
    //     }
    //   }
    //   document.documentElement.scrollTop = 0;
    //   (document.scrollingElement || { scrollTop: undefined }).scrollTop = 0;
    //   let refsss: any = this.refs;
    //   refsss.mainPanel.scrollTop = 0;
    // }
  }
  // this function opens and closes the sidebar on small devices
  toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    this.setState({ sidebarOpened: !this.state.sidebarOpened });
  };
  getRoutes = (routes: any) => {
    return routes.map((prop: any, key: any) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            // path={prop.layout + prop.path}
            path={prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  handleBgClick = (color: any) => {
    this.setState({ backgroundColor: color });
  };
  getBrandText = (path: any) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        // this.props.location.pathname.indexOf(
        path.indexOf(
          // routes[i].layout + routes[i].path
          routes[i].path
        ) !== -1
      ) {
        return routes[i].name;

      } else if (routes[i].brandName) {
        let txt = '';
        if (Array.isArray(routes[i].brandName)) {
          let arr: string[] = routes[i].brandName || [];
          let match = true;
          arr.forEach(n => {
            if (!path.includes(n)) { match = false; }
          });

          if (match) txt = routes[i].name;
        }

        if (txt) return txt;
      }
    }
    return Localization.app_title; // "Brand";
  };
  render() {
    if (!this.props.logged_in_user) {
      return (
        <div></div>
      );
    }
    return (
      <>
        <div className="wrapper">
          <Sidebar
            {...this.props}
            routes={routes}
            bgColor={this.state.backgroundColor}
            logo={{
              outterLink: "",
              text: "Menu",
              // imgSrc: logo
            }}
            toggleSidebar={this.toggleSidebar}
          />
          <div
            className="main-panel white-content"
            ref="mainPanel"
            html-data={this.state.backgroundColor}
          >
            <AdminNavbar
              {...this.props}
              brandText={this.getBrandText(this.props.location.pathname)}
              toggleSidebar={this.toggleSidebar}
              sidebarOpened={this.state.sidebarOpened}
            />
            <Switch>{this.getRoutes(routes)}</Switch>
          </div>
        </div>
      </>
    );
  }
}

// export default Admin;

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
  return {
  };
};

const state2props = (state: redux_state) => {
  return {
    logged_in_user: state.logged_in_user,
    internationalization: state.internationalization,
    token: state.token,
  };
};

export const AdminLayout = connect(
  state2props,
  dispatch2props
)(AdminComponent);