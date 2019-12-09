import React from 'react';
import { Navbar, Nav, Form } from 'react-bootstrap';
import Logo from '../../assets/Flagship-horizontal-product-white.png';

const Header: React.FC = () => (
  <>
    <Navbar className="fsNavbar" fixed="top">
      <Navbar.Brand href="#" className="flex item-center">
        <img
          alt="Logo Flagship"
          src={Logo}
          className="d-inline-block align-top logoAdjust"
        />
        React SDK
      </Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="#initialization">Initialization</Nav.Link>
        <Nav.Link href="#modifications">Modifications</Nav.Link>
        <Nav.Link href="#hits">Hits</Nav.Link>
        <Nav.Link href="#unit-tests">Unit tests</Nav.Link>
        <Nav.Link href="#other">Other</Nav.Link>
      </Nav>

      <Form inline>
        <Nav.Link href="#">Github</Nav.Link>
        <Nav.Link href="https://www.abtasty.com/solutions-product-teams/">What is Flagship ?</Nav.Link>
      </Form>
    </Navbar>
  </>
);
export default Header;
