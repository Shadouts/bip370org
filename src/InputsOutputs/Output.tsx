import React, { useContext } from "react";
import { PageContext } from "../Page";
import { Card, Col, ListGroup, Row } from "react-bootstrap";
import { GlobalItem } from "../Globals/GlobalItem";
import { OutputAddress } from "./OutputAddress";
import { OutputBip32Derivation } from "./OutputBip32Derivation";

export const Output = ({ index: i }: { index: number }) => {
  const { psbt } = useContext(PageContext);

  return (
    <Card>
      <Card.Header>
        <Row>
          <Col>{`#${i}`}</Col>
          <Col>
            <OutputAddress index={i} />
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <ListGroup>
          <GlobalItem label="Amount" value={psbt.PSBT_OUT_AMOUNT[i]} />
          {psbt.PSBT_OUT_BIP32_DERIVATION[i] && (
            <OutputBip32Derivation index={i} />
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
