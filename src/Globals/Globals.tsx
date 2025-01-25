import { useContext } from "react";
import { Col, Card, Row, ListGroup } from "react-bootstrap";
import { PageContext } from "../Page";
import { GlobalItem } from "./GlobalItem";
import { TxModifiableFlags } from "./TxModifiableFlags";
import { GlobalXpubs } from "./GlobalXpubs";

const MovableItems = () => {
  const { psbt } = useContext(PageContext);

  return (
    <>
      <GlobalItem label="Input count" value={psbt.PSBT_GLOBAL_INPUT_COUNT} />
      <GlobalItem label="Output count" value={psbt.PSBT_GLOBAL_OUTPUT_COUNT} />
      <TxModifiableFlags />
    </>
  );
};

export const Globals = () => {
  const { psbt } = useContext(PageContext);

  const xpubs = psbt.PSBT_GLOBAL_XPUB.length > 0;

  return (
    <Col>
      <Card>
        <Card.Header>Global</Card.Header>
        <Card.Body>
          <Row>
            <Col sm={5}>
              <ListGroup>
                <GlobalItem
                  label="Psbt version"
                  value={psbt.PSBT_GLOBAL_VERSION}
                />
                <GlobalItem
                  label="Tx version"
                  value={psbt.PSBT_GLOBAL_TX_VERSION}
                />
                <GlobalItem
                  label="Fallback locktime"
                  value={psbt.PSBT_GLOBAL_FALLBACK_LOCKTIME}
                />
                <GlobalItem label="Computed locktime" value={psbt.nLockTime} />
                {xpubs && <MovableItems />}
              </ListGroup>
            </Col>
            {xpubs ? (
              <GlobalXpubs />
            ) : (
              <Col>
                <ListGroup>
                  <MovableItems />
                </ListGroup>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};
