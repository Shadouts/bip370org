import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Bootstrapbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

export const Navbar = () => (
  <Bootstrapbar expand="lg" className="bg-body-secondary">
    <Container>
      <Bootstrapbar.Brand>BIP 370</Bootstrapbar.Brand>
      <Bootstrapbar.Toggle aria-controls="basic-Bootstrapbar-nav" />
      <Bootstrapbar.Collapse id="basic-Bootstrapbar-nav">
        <Nav className="me-auto">
          <NavDropdown title="Github" id="basic-nav-dropdown">
            <NavDropdown.Item
              href="https://github.com/bitcoin/bips/blob/master/bip-0370.mediawiki"
              target="_blank"
            >
              Bip 370
            </NavDropdown.Item>
            <NavDropdown.Item
              href="https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki"
              target="_blank"
            >
              Bip 174
            </NavDropdown.Item>
            <NavDropdown.Item
              href="https://github.com/caravan-bitcoin/caravan"
              target="_blank"
            >
              Caravan
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Bootstrapbar.Collapse>
    </Container>
  </Bootstrapbar>
);
