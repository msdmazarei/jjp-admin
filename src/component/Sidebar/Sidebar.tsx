/*eslint-disable*/
import React from "react";
import { NavLink, Link } from "react-router-dom";
// nodejs library to set properties for components
// import { PropTypes} from "prop-types";      //commented for error and see line 154

// javascript plugin used to create scrollbars on windows
// import PerfectScrollbar from "perfect-scrollbar";

// reactstrap components
import { Nav } from "reactstrap";

var ps:any;

class Sidebar extends React.Component<any,any> {
  static propTypes: {
    // if true, then instead of the routes[i].name, routes[i].rtlName will be rendered
    // insde the links of this component
    rtlActive: any; bgColor: any; routes: any; logo: any;
  };
  static defaultProps: { rtlActive: boolean; bgColor: string; routes: {}[]; };
  constructor(props:any) {
    super(props);
    this.activeRoute.bind(this);
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName:any) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  componentDidMount() {
    // if (navigator.platform.indexOf("Win") > -1) {
    //   let sidebar:any=this.refs.sidebar;
    //   ps = new PerfectScrollbar(sidebar, {
    //     suppressScrollX: true,
    //     suppressScrollY: false
    //   });
    // }
  }
  componentWillUnmount() {
    // if (navigator.platform.indexOf("Win") > -1) {
    //   ps.destroy();
    // }
  }
  linkOnClick = () => {
    document.documentElement.classList.remove("nav-open");
  };
  render() {
    const { bgColor, routes, rtlActive, logo } = this.props;
    let logoImg = null;
    let logoText = null;

    // sidebar logo inavtive by commenting
    // if (logo !== undefined) {
    //   if (logo.outterLink !== undefined) {
    //     logoImg = (
    //       <a
    //         href={logo.outterLink}
    //         className="simple-text logo-mini"
    //         target="_blank"
    //         onClick={this.props.toggleSidebar}
    //       >
    //         <div className="logo-img">
    //           {/* <img src={logo.imgSrc} alt="react-logo" /> */}
    //           <i className="fa fa-cog fa-2x" aria-hidden="true"></i>
    //         </div>
    //       </a>
    //     );
    //     logoText = (
    //       <a
    //         href={logo.outterLink}
    //         className="simple-text logo-normal"
    //         target="_blank"
    //         onClick={this.props.toggleSidebar}
    //       >
    //         {logo.text}
    //       </a>
    //     );
    //   } else {
    //     logoImg = (
    //       <Link
    //         to={logo.innerLink}
    //         className="simple-text logo-mini"
    //         onClick={this.props.toggleSidebar}
    //       >
    //         <div className="logo-img">
    //           <img src={logo.imgSrc} alt="react-logo" />
    //         </div>
    //       </Link>
    //     );
    //     logoText = (
    //       <Link
    //         to={logo.innerLink}
    //         className="simple-text logo-normal"
    //         onClick={this.props.toggleSidebar}
    //       >
    //         {logo.text}
    //       </Link>
    //     );
    //   }
    // }
    return (
      <div className="sidebar">
        <div className="sidebar-wrapper" ref="sidebar">
          {logoImg !== null || logoText !== null ? (
            <div className="logo">
              {logoImg}
              {logoText}
            </div>
          ) : null}
          <Nav>
            {routes.map((prop:any, key:number) => {
              if (prop.redirect) return null;
              if (!prop.isitem) return null;
              return ( 
                <li
                  className={
                    this.activeRoute(prop.path) +
                    (prop.pro ? " active-pro" : "")
                  }
                  key={key}
                >
                  <NavLink
                    // to={prop.layout + prop.path}
                    to={prop.path}
                    className="nav-link"
                    activeClassName="active"
                    onClick={this.props.toggleSidebar}
                  >
                  <i className={prop.icon} />
                  {/* <p>{rtlActive ? prop.rtlName : prop.name}</p> */}
                  <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            })}
          </Nav>
        </div>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  rtlActive: false,
  bgColor: "primary",
  routes: [{}]
};



//commented for error and commenting import { PropTypes} from "prop-types" inline 5

// Sidebar.propTypes = {
//   // if true, then instead of the routes[i].name, routes[i].rtlName will be rendered
//   // insde the links of this component
//   rtlActive: PropTypes.bool,
//   bgColor: PropTypes.oneOf(["primary", "blue", "green"]),
//   routes: PropTypes.arrayOf(PropTypes.object),
//   logo: PropTypes.shape({
//     // innerLink is for links that will direct the user within the app
//     // it will be rendered as <Link to="...">...</Link> tag
//     innerLink: PropTypes.string,
//     // outterLink is for links that will direct the user outside the app
//     // it will be rendered as simple <a href="...">...</a> tag
//     outterLink: PropTypes.string,
//     // the text of the logo
//     text: PropTypes.node,
//     // the image src of the logo
//     imgSrc: PropTypes.string
//   })
// };

export default Sidebar;
