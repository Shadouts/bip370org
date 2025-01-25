import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Bootstrapbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useContext } from "react";
import { PageContext } from "../Page";
import { Network } from "@caravan/bitcoin";

export const Navbar = () => {
  const { network, setState } = useContext(PageContext);

  return (
    <Bootstrapbar expand="lg" className="bg-body-secondary">
      <Container>
        <Bootstrapbar.Brand>BIP 370</Bootstrapbar.Brand>
        <Bootstrapbar.Toggle aria-controls="basic-navbar-nav" />
        <Bootstrapbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Github" id="basic-nav-dropdown">
              <NavDropdown.Item
                href="https://github.com/caravan-bitcoin/caravan"
                target="_blank"
              >
                Caravan
              </NavDropdown.Item>
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
            </NavDropdown>
          </Nav>
          <Nav>
            <DropdownButton title={`Network: ${network}`}>
              <Dropdown.Item
                onClick={() => setState({ network: Network.TESTNET })}
              >
                Testnet
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => setState({ network: Network.REGTEST })}
              >
                Regtest
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => setState({ network: Network.MAINNET })}
              >
                Mainnet
              </Dropdown.Item>
            </DropdownButton>
          </Nav>
        </Bootstrapbar.Collapse>
      </Container>
    </Bootstrapbar>
  );
};
