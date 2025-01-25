import React, { useContext } from "react";
import { PageContext } from "../Page";
import { Card, Col, ListGroup, Row } from "react-bootstrap";
import { GlobalItem } from "../Globals/GlobalItem";
import { OutputAddress } from "./OutputAddress";
import { Bip32Derivation } from "./Bip32Derivation";

export const Output = ({ index: i }: { index: number }) => {
  const { psbt } = useContext(PageContext);

  return (
    <Card style={{ marginBottom: "1rem" }}>
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
          {psbt.PSBT_OUT_REDEEM_SCRIPT[i] && (
            <GlobalItem
              label="Redeem Script"
              value={psbt.PSBT_OUT_REDEEM_SCRIPT[i]}
            />
          )}
          {psbt.PSBT_OUT_WITNESS_SCRIPT[i] && (
            <GlobalItem
              label="Witness Script"
              value={psbt.PSBT_OUT_WITNESS_SCRIPT[i]}
            />
          )}
          {psbt.PSBT_OUT_BIP32_DERIVATION[i] && (
            <Bip32Derivation
              derivations={
                psbt.PSBT_OUT_BIP32_DERIVATION[i] as {
                  key: string;
                  value: string;
                }[]
              }
            />
          )}
          <GlobalItem label="Amount" value={psbt.PSBT_OUT_AMOUNT[i]} />
          <GlobalItem label="Script" value={psbt.PSBT_OUT_SCRIPT[i]} />
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
