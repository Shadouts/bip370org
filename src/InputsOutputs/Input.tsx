import React, { useContext } from "react";
import { PageContext } from "../Page";
import { Card, Col, ListGroup, Row } from "react-bootstrap";
import { GlobalItem } from "../Globals/GlobalItem";

export const Input = ({ index: i }: { index: number }) => {
  const { psbt } = useContext(PageContext);

  return (
    <Card>
      <Card.Header>
        <Row>
          <Col>{`#${i}`}</Col>
          <Col>{`${psbt.PSBT_IN_PREVIOUS_TXID[i]}:${psbt.PSBT_IN_OUTPUT_INDEX[i]}`}</Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <ListGroup>
          <GlobalItem
            label="Witness UTXO"
            value={psbt.PSBT_IN_WITNESS_UTXO[i]}
          />
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
