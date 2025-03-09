import { useContext, useMemo } from "react";
import {
  PageContext,
  useCurrentPsbtTransactionVersion,
  usePsbt,
} from "../Page";
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

export const Psbt = () => {
  const { encoding, serializeAsV0, setState } = useContext(PageContext);
  const psbt = usePsbt();
  const version = useCurrentPsbtTransactionVersion();

  const serializedPsbt = useMemo(() => {
    if (serializeAsV0 === "false") {
      return psbt.serialize(encoding || undefined);
    } else {
      return psbt.toV0(encoding || undefined);
    }
  }, [encoding, psbt, serializeAsV0]);

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
              <Row content="center">
                <ToggleButtonGroup
                  type="radio"
                  name="version-toggle"
                  value={serializeAsV0}
                  onChange={(value) => setState({ serializeAsV0: value })}
                >
                  <ToggleButton
                    id="serialize-v2-button"
                    size="sm"
                    value="false"
                    variant={
                      serializeAsV0 === "false" ? "primary" : "outline-primary"
                    }
                  >
                    As v2
                  </ToggleButton>
                  <ToggleButton
                    id="serialize-v0-button"
                    size="sm"
                    value="true"
                    variant={
                      serializeAsV0 === "true" ? "primary" : "outline-primary"
                    }
                  >
                    As v0
                  </ToggleButton>
                </ToggleButtonGroup>
              </Row>
              <br />
              <Stack direction="vertical" gap={1}>
                {version === 0 && (
                  <Badge pill bg="success">
                    Converted from PSBTv0
                  </Badge>
                )}
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
                      <b>{`Serialized PSBT${serializeAsV0 === "true" ? "v0" : ""}`}</b>
                    </Col>
                    <Col
                      style={{
                        textAlign: "left",
                        fontFamily: "monospace",
                        fontSize: 12,
                        wordBreak: "break-all",
                      }}
                    >
                      {serializedPsbt}
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
