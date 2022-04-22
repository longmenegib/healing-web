import { useState } from "react";
import {
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Collapse,
  NavbarToggler,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  NavbarText
} from "reactstrap";

import { NavLink as RRNavLink } from 'react-router-dom';

import logoname from '../../assets/logoname.png'

import './navbar.css'

const Navbars = ({color}) => {

  const [isCollapse, setIsCollapse] = useState(false);
  return (
    <>
  <Navbar
    // color="light"
    expand="md"
    light
    container="sm"
  >
    <NavbarBrand href="/" style={{width: '200px'}}>
      <img src={logoname} width='100%'/>
    </NavbarBrand>
    <NavbarToggler 
      // className="me-2"
      onClick={()=> setIsCollapse(!isCollapse)} 
      // color={color}
      style={{borderColor: color, color: color, backgroundColor: color}}
    />
    <Collapse navbar isOpen={isCollapse} className="w-100 mr-auto">
      <Nav
        className="ml-auto"
        navbar
      >
        <NavItem>
          <NavLink className="" to="/home" className="navitems" activeClassName="active" tag={RRNavLink} style={{color: color}} >
            Home
          </NavLink>
        </NavItem>
        <UncontrolledDropdown
          inNavbar
          nav
          className="navitems"
        >
          <DropdownToggle
            caret
            nav
            className="dropdownn"
            style={{color: color}}
          >
            Services
          </DropdownToggle>
          <DropdownMenu  right>
            <DropdownItem>
              <NavLink to="/services/brand-design" className="navitems" activeClassName="active" tag={RRNavLink}>
              Branding Design
            </NavLink>
            </DropdownItem>
            {/* <DropdownItem divider /> */}
            <DropdownItem>
              <NavLink to="/services/website-design" className="navitems" activeClassName="active" tag={RRNavLink}>
                Website Design
              </NavLink>
            </DropdownItem>
            {/* <DropdownItem divider /> */}
            <DropdownItem>
              <NavLink to="/services/logo-design" className="navitems" activeClassName="active" tag={RRNavLink}>
              Logo Design
              </NavLink>
            </DropdownItem>
            <DropdownItem>
            < NavLink to="/services/social-media-design" className="navitems" activeClassName="active" tag={RRNavLink}>
            Social Media Template Design
              </NavLink>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
        <NavItem>
          <NavLink to="/portfolio" className="navitems" activeClassName="active" tag={RRNavLink} style={{color: color}}>
            Portfolio
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/blogs" className="navitems" activeClassName="active" tag={RRNavLink} style={{color: color}}>
            Blog
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/contact" className="navitems" activeClassName="active" tag={RRNavLink} style={{color: color}}>
            Contact Us
          </NavLink>
        </NavItem>
        {/* <NavItem>
          <NavLink className="btn btn-primary text-white d-flex justify-content-center align-items-center mt-1" style={{borderRadius: '50px', width:'100px', height: '30px'}}>
            Login
          </NavLink>
        </NavItem> */}
      </Nav>
      {/* <NavbarText>
        Simple Text
      </NavbarText> */}
    </Collapse>
  </Navbar>
    </>
  );
};

export default Navbars;
