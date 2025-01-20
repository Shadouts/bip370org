import React, { useContext } from "react";
import { PageContext } from "../Page";
import {
  Badge,
  Card,
  Col,
  ListGroup,
  Row,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { GlobalItem } from "../Globals/GlobalItem";

export const Psbt = () => {
  const { psbt, encoding, setState } = useContext(PageContext);

  return (
    <Col>
      <Card>
        <Card.Header>PSBT</Card.Header>
        <Card.Body>
          <Row>
            <Col sm={3}>
              <Row content="center">
                <ToggleButtonGroup
                  type="radio"
                  name="encoding-toggle"
                  value={encoding}
                  onChange={(value) => setState({ encoding: value })}
                >
                  <ToggleButton
                    id="base64-encoding-button"
                    size="sm"
                    value="base64"
                    variant={
                      encoding === "base64" ? "primary" : "outline-primary"
                    }
                  >
                    Base64
                  </ToggleButton>
                  <ToggleButton
                    id="hex-encoding-button"
                    size="sm"
                    value="hex"
                    variant={encoding === "hex" ? "primary" : "outline-primary"}
                  >
                    Hex
                  </ToggleButton>
                </ToggleButtonGroup>
              </Row>
              <br />
              <Stack direction="vertical" gap={1}>
                <Badge
                  pill
                  bg={psbt.isReadyForConstructor ? "primary" : "secondary"}
                >
                  Ready for Constructor
                </Badge>
                <Badge
                  pill
                  bg={psbt.isReadyForUpdater ? "primary" : "secondary"}
                >
                  Ready for Updater
                </Badge>
                <Badge
                  pill
                  bg={psbt.isReadyForSigner ? "primary" : "secondary"}
                >
                  Ready for Signer
                </Badge>
                <Badge
                  pill
                  bg={psbt.isReadyForCombiner ? "primary" : "secondary"}
                >
                  Ready for Combiner
                </Badge>
                <Badge pill bg="dark">
                  Ready for Input Finalizer (NA)
                </Badge>
                <Badge
                  pill
                  bg={
                    psbt.isReadyForTransactionExtractor
                      ? "primary"
                      : "secondary"
                  }
                >
                  Ready for Transaction Extractor
                </Badge>
              </Stack>
            </Col>
            <Col>
              <ListGroup>
                <ListGroup.Item>
                  <Row>
                    <Col md={3}>
                      <b>Serialized PSBT</b>
                    </Col>
                    <Col
                      style={{
                        textAlign: "left",
                        fontFamily: "monospace",
                        fontSize: 12,
                        wordBreak: "break-all",
                      }}
                    >
                      {psbt.serialize(encoding || undefined)}
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};
