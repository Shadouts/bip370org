import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Bootstrapbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useCallback, useContext } from "react";
import { PageContext } from "../Page";
import { Network } from "@caravan/bitcoin";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { usePopHistory, useUpdatePsbt } from "../Page/context";

const EXAMPLE_PSBTS = [
  "cHNidP8BAJ0BAAAAAnEOp2q0XFy2Q45gflnMA3YmmBgFrp4N/ZCJASq7C+U1AQAAAAD/////GQmU1qizyMgsy8+y+6QQaqBmObhyqNRHRlwNQliNbWcAAAAAAP////8CAOH1BQAAAAAZdqkUtrwsDuVlWoQ9ea/t0MzD991kNAmIrGBa9AUAAAAAFgAUEYjvjkzgRJ6qyPsUHL9aEXbmoIgAAAAATwEEiLIeA55TDKyAAAAAPbyKXJdp8DGxfnf+oVGGAyIaGP0Y8rmlTGyMGsdcvDUC8jBYSxVdHH8c1FEgplPEjWULQxtnxbLBPyfXFCA3wWkQJ1acUDEAAIAAAACAAAAAgAABAR8A4fUFAAAAABYAFDO5gvkbKPFgySC0q5XljOUN2jpKIgIDMJaA8zx9446mpHzU7NZvH1pJdHxv+4gI7QkDkkPjrVxHMEQCIC1wTO2DDFapCTRL10K2hS3M0QPpY7rpLTjnUlTSu0JFAiAthsQ3GV30bAztoITyopHD2i1kBw92v5uQsZXn7yj3cgEiBgMwloDzPH3jjqakfNTs1m8fWkl0fG/7iAjtCQOSQ+OtXBgnVpxQMQAAgAAAAIAAAACAAAAAAAEAAAAAAQEfAOH1BQAAAAAWABQ4j7lEMH63fvRRl9CwskXgefAR3iICAsd3Fh9z0LfHK57nveZQKT0T8JW8dlatH1Jdpf0uELEQRzBEAiBMsftfhpyULg4mEAV2ElQ5F5rojcqKncO6CPeVOYj6pgIgUh9JynkcJ9cOJzybFGFphZCTYeJb4nTqIA1+CIJ+UU0BIgYCx3cWH3PQt8crnue95lApPRPwlbx2Vq0fUl2l/S4QsRAYJ1acUDEAAIAAAACAAAAAgAAAAAAAAAAAAAAiAgLSDKUC7iiWhtIYFb1DqAY3sGmOH7zb5MrtRF9sGgqQ7xgnVpxQMQAAgAAAAIAAAACAAAAAAAQAAAAA",
  "cHNidP8BAgQCAAAAAQMEAAAAAAEEAQEBBQECAQYBBwH7BAIAAAAAAQBSAgAAAAHBqiVuIUuWoYIvk95Cv/O18/+NBRkwbjUV11FaXoBbEgAAAAAA/////wEYxpo7AAAAABYAFLCjrxRCCEEmk8p9FmhStS2wrvBuAAAAAAEBHxjGmjsAAAAAFgAUsKOvFEIIQSaTyn0WaFK1LbCu8G4BDiALCtkhQZwchxlzXXLcc5+eqeBjjR/kwe7w+ZRAhIFfyAEPBAAAAAABEAT+////AREEjI3EYgESBBAnAAAAIgIC1gH4SEamdV93a+AOPZ3o+xCsyTX7g8RfsBYtTK1at5IY9p2HPlQAAIABAACAAAAAgAAAAAAqAAAAAQMIAAivLwAAAAABBBYAFMQw9kxHVtoxDb0aCFVy7ymZJicsACICAuNvv/U91TQHDPj9OWYUaA81epuF23NAvxz6dF0q17NAGPadhz5UAACAAQAAgAAAAIABAAAAZAAAAAEDCIu96wsAAAAAAQQWABRN0ZOslkpWrBueHMqEVP4vR0+FEwA=",
];

export const Navbar = () => {
  const { network, history, setState } = useContext(PageContext);
  const updatePsbt = useUpdatePsbt();
  const goBack = usePopHistory();

  const setExample = useCallback(
    (example: number) => {
      updatePsbt(EXAMPLE_PSBTS[example]);
      setState({
        network: Network.TESTNET,
        serializeAsV0: "false",
      });
    },
    [updatePsbt, setState],
  );

  return (
    <Bootstrapbar expand="lg" className="bg-body-secondary">
      <Container>
        <Bootstrapbar.Brand>BIP 370</Bootstrapbar.Brand>
        <Bootstrapbar.Toggle aria-controls="basic-navbar-nav" />
        <Bootstrapbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Github" id="basic-nav-dropdown">
              <NavDropdown.Item
                href="https://github.com/Shadouts/bip370org"
                target="_blank"
              >
                bip370org (this site)
              </NavDropdown.Item>
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
                BIP 370
              </NavDropdown.Item>
              <NavDropdown.Item
                href="https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki"
                target="_blank"
              >
                BIP 174
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <OverlayTrigger
              overlay={<Tooltip>Undo previous change</Tooltip>}
              placement="bottom"
            >
              <Button
                variant="outline-secondary"
                onClick={goBack}
                disabled={history.length < 2}
              >
                <b>⎌</b>
              </Button>
            </OverlayTrigger>
            <NavDropdown
              title="Examples"
              id="basic-nav-dropdown"
              style={{ marginRight: "2rem" }}
            >
              <NavDropdown.Item onClick={() => setExample(0)}>
                PSBTv0
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setExample(1)}>
                PSBTv2
              </NavDropdown.Item>
            </NavDropdown>
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
