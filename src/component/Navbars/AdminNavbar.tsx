import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import { History } from 'history';

// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal
} from "reactstrap";
import { IUser } from "../../model/model.user";
import { TInternationalization } from "../../config/setup";
import { redux_state } from "../../redux/app_state";
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { action_user_logged_out } from "../../redux/action/user";
// import { action_change_app_flag } from "../../redux/action/internationalization";
import { action_remove_token } from "../../redux/action/token";
import { action_remove_authentication } from "../../redux/action/authentication";
import { Localization } from '../../config/localization/localization';
import { BaseComponent } from "../_base/BaseComponent";
// import { any } from "prop-types";



interface IProps {
  logged_in_user?: IUser | null;
  internationalization: TInternationalization;
  history: History;
  do_logout?: () => void;
  // change_app_flag: (internationalization: TInternationalization) => void;
  remove_token?: () => void;
  remove_authentication?: () => void;
  sidebarOpened: any;
  brandText: any;
  toggleSidebar: any;
}

// class AdminNavbarComponent extends React.Component<IProps, any> {
class AdminNavbarComponent extends BaseComponent<IProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      collapseOpen: false,
      modalSearch: false,
      color: "navbar-transparent"
    };
  }
  log_out() {
    this.props.do_logout && this.props.do_logout();
    this.props.remove_token && this.props.remove_token();
    this.props.remove_authentication && this.props.remove_authentication();
    this.props.history.push('/login');
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateColor);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColor);
  }
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  updateColor = () => {
    if (window.innerWidth < 993 && this.state.collapseOpen) {
      this.setState({
        color: "bg-white"
      });
    } else {
      this.setState({
        color: "navbar-transparent"
      });
    }
  };
  // this function opens and closes the collapse on small devices
  toggleCollapse = () => {
    if (this.state.collapseOpen) {
      this.setState({
        color: "navbar-transparent"
      });
    } else {
      this.setState({
        color: "bg-white"
      });
    }
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };
  // this function is to open the Search modal
  toggleModalSearch = () => {
    this.setState({
      modalSearch: !this.state.modalSearch
    });
  };

  getUserAvatar(): string {
    let avatar = this.props.logged_in_user
      // && this.props.logged_in_user.person
      && this.props.logged_in_user.person.image;

    let imgUrl = '/static/media/img/icon/avatar.png';
    if (avatar) {
      imgUrl = this.getImageUrl(avatar)
    }
    return imgUrl;
  }

  render() {
    return (
      <>
        <Navbar
          className={classNames("navbar-absolute ", this.state.color)}
          expand="lg"
        >
          <Container fluid>
            <div className="navbar-wrapper">
              <div
                className={classNames("navbar-toggle d-inline", {
                  toggled: this.props.sidebarOpened
                })}
              >
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={this.props.toggleSidebar}
                >
                  <span className="navbar-toggler-bar bar1" />
                  <span className="navbar-toggler-bar bar2" />
                  <span className="navbar-toggler-bar bar3" />
                </button>
              </div>
              <NavbarBrand  onClick={e => e.preventDefault()}>
                {this.props.brandText}
              </NavbarBrand>
            </div>
            <button
              aria-expanded={false}
              aria-label="Toggle navigation"
              className="navbar-toggler"
              data-target="#navigation"
              data-toggle="collapse"
              id="navigation"
              type="button"
              onClick={this.toggleCollapse}
            >
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
            </button>
            <Collapse navbar isOpen={this.state.collapseOpen}>
              <Nav className="ml-auto" navbar>
                <InputGroup className="search-bar">
                  <Button
                    color="link"
                    data-target="#searchModal"
                    data-toggle="modal"
                    id="search-button"
                    onClick={this.toggleModalSearch}
                  >
                    <i className="fa fa-search text-white" />
                    <span className="d-lg-none d-md-block">Search</span>
                  </Button>
                </InputGroup>
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    data-toggle="dropdown"
                    nav
                    onClick={e => e.preventDefault()}
                  >
                    <div className="photo">
                      {/* <img alt="..." src={require("../../asset/style/app/_src/z-template/_admin-panel/custom/img/anime3.png")} /> */}
                      <img alt="..." src={this.getUserAvatar()} />
                    </div>
                    <b className="caret d-none d-lg-block d-xl-block" />
                    <p className="d-lg-none">{Localization.log_out}</p>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-navbar" right tag="ul">
                    <NavLink tag="li">
                      <DropdownItem className="nav-item d-none">{Localization.profile}</DropdownItem>
                    </NavLink>
                    {/* setting item commented in jame-jam project */}
                    {/* <NavLink tag="li">
                      <DropdownItem className="nav-item">Settings</DropdownItem>
                    </NavLink> */}
                    {/* <DropdownItem divider tag="li" /> */}
                    <NavLink tag="li">
                      <DropdownItem
                        className="nav-item"
                        onClick={() => this.log_out()}
                      >
                        {Localization.log_out}
                      </DropdownItem>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <li className="separator d-lg-none" />
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        <Modal
          modalClassName="modal-search"
          isOpen={this.state.modalSearch}
          toggle={this.toggleModalSearch}
        >
          <div className="modal-header">
            <Input id="inlineFormInputGroup" placeholder="SEARCH" type="text" />
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={this.toggleModalSearch}
            >
              <i className="tim-icons icon-simple-remove" />
            </button>
          </div>
        </Modal>
      </>
    );
  }
}





// export default AdminNavbar;


const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
  return {
    do_logout: () => dispatch(action_user_logged_out()),
    // change_app_flag: (internationalization: TInternationalization) => dispatch(action_change_app_flag(internationalization)),
    remove_token: () => dispatch(action_remove_token()),
    remove_authentication: () => dispatch(action_remove_authentication()),
  }
}

const state2props = (state: redux_state) => {
  return {
    logged_in_user: state.logged_in_user,
    internationalization: state.internationalization,
    // cart: state.cart
  }
}

export const AdminNavbar = connect(state2props, dispatch2props)(AdminNavbarComponent);