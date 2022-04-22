
import { useState, useContext } from "react";
import { NavLink as NavLinkRRD, Link, useNavigate } from "react-router-dom";

import { PropTypes } from "prop-types";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  NavbarToggler,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";
import { deleteStorage } from "../../utils/Storage";
import { AuthContext } from '../../App';
import logoimg from '../../assets/images/logo.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './sidebar.css'

var ps;

const Sidebar = (props) => {
  const {signOut} = useContext(AuthContext);
  const [collapseOpen, setCollapseOpen] = useState(false);
  // toggles collapse between opened and closed (true/false)
  const toggleCollapse = () => {
    console.log("helloooo")
    setCollapseOpen((data) => !data);
    console.log(collapseOpen);
  };
  // closes the collapse
  const closeCollapse = () => {
    console.log("clossseeee")
    setCollapseOpen(false);
  };
  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      return (
        <NavItem key={key}>
          <NavLink
            to={prop.path}
            tag={NavLinkRRD}
            onClick={closeCollapse}
            // activeClassName="active custom-active"
            className={(navData) => (navData.isActive ? "active custom-active" : 'none')}
          >
            {/* <i className={prop.icon} /> */}
            <FontAwesomeIcon className="icons" icon={prop.icon} color={"white"} style={{marginRight: '30px'}}/>
            {prop.name}
          </NavLink>
        </NavItem>
      );
    });
  };

  const { routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  const navigate = useNavigate();

  const logout =async ()=>{
    deleteStorage('userToken');
    signOut()
    navigate("/signup-as");
  }

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-dark bg-dark"
      expand="md"
      // id="sidenav-main"
      // toggleable="true"
      style={{zIndex: 1000}}
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <i className="navbar-toggler-icon"/>
        </button>
        {/* <NavbarToggler onClick={toggleCollapse}/> */}
        {/* Brand */}
        {logo ? (
          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            <img
              // alt={logo.imgAlt}
              className="navbar-brand-img"
              src={logoimg}
            />
          </NavbarBrand>
        ) : null}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt="" src={logoimg} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt="" src={logoimg} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={closeCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          {/* Form */}
          <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <Input
                aria-label="Search"
                className="form-control-rounded form-control-prepended"
                placeholder="Search"
                type="search"
              />
             
            </InputGroup>
          </Form>
          {/* Navigation */}
          <Nav navbar>{createLinks(routes)}</Nav>
          {/* Divider */}
          <hr className="my-3" />
          {/* Heading */}
          {/* <h6 className="navbar-heading text-muted">Documentation</h6> */}
          {/* Navigation */}
          <Nav className="mb-md-3" navbar>
            <NavItem className="active-pro active bg-dark">
              <NavLink onClick={logout}>
                <i className="ni ni-spaceship" />
                Logout
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    // imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    // imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
