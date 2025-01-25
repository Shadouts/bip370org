import { useContext } from "react";
import { PageContext } from "../Page";
import { Card, Col, ListGroup, Row } from "react-bootstrap";
import { GlobalItem } from "../Globals/GlobalItem";
import { Bip32Derivation } from "./Bip32Derivation";
import { InputPartialSigs } from "./InputPartialSigs";
import { InputSighashType } from "./InputSighashType";
import { InputHashes } from "./InputHashes";

export const Input = ({ index: i }: { index: number }) => {
  const { psbt } = useContext(PageContext);

  return (
    <Card style={{ marginBottom: "1rem" }}>
      <Card.Header>
        <Row>
          <Col>{`#${i}`}</Col>
          <Col>{`${psbt.PSBT_IN_PREVIOUS_TXID[i]}:${psbt.PSBT_IN_OUTPUT_INDEX[i]}`}</Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <ListGroup>
          {psbt.PSBT_IN_NON_WITNESS_UTXO[i] && (
            <GlobalItem
              label="Non-witness UTXO"
              value={psbt.PSBT_IN_NON_WITNESS_UTXO[i]}
            />
          )}
          {psbt.PSBT_IN_WITNESS_UTXO[i] && (
            <GlobalItem
              label="Witness UTXO"
              value={psbt.PSBT_IN_WITNESS_UTXO[i]}
            />
          )}
          {psbt.PSBT_IN_PARTIAL_SIG[i].length > 0 && (
            <InputPartialSigs inputIndex={i} />
          )}
          {psbt.PSBT_IN_SIGHASH_TYPE[i] && <InputSighashType inputIndex={i} />}
          {psbt.PSBT_IN_REDEEM_SCRIPT[i] && (
            <GlobalItem
              label="Redeem script"
              value={psbt.PSBT_IN_REDEEM_SCRIPT[i]}
            />
          )}
          {psbt.PSBT_IN_WITNESS_SCRIPT[i] && (
            <GlobalItem
              label="Witness script"
              value={psbt.PSBT_IN_WITNESS_SCRIPT[i]}
            />
          )}
          {psbt.PSBT_IN_BIP32_DERIVATION[i].length > 0 && (
            <Bip32Derivation derivations={psbt.PSBT_IN_BIP32_DERIVATION[i]} />
          )}
          {psbt.PSBT_IN_FINAL_SCRIPTSIG[i] && (
            <GlobalItem
              label="Final scriptSig"
              value={psbt.PSBT_IN_FINAL_SCRIPTSIG[i]}
            />
          )}
          {psbt.PSBT_IN_FINAL_SCRIPTWITNESS[i] && (
            <GlobalItem
              label="Final scriptWitness"
              value={psbt.PSBT_IN_FINAL_SCRIPTWITNESS[i]}
            />
          )}
          {psbt.PSBT_IN_POR_COMMITMENT[i] && (
            <GlobalItem
              label="POR commitment"
              value={psbt.PSBT_IN_POR_COMMITMENT[i]}
            />
          )}
          {psbt.PSBT_IN_RIPEMD160[i] && (
            <InputHashes inputIndex={i} type="RIPEMD160" />
          )}
          {psbt.PSBT_IN_SHA256[i] && (
            <InputHashes inputIndex={i} type="SHA256" />
          )}
          {psbt.PSBT_IN_HASH160[i] && (
            <InputHashes inputIndex={i} type="HASH160" />
          )}
          {psbt.PSBT_IN_HASH256[i] && (
            <InputHashes inputIndex={i} type="HASH256" />
          )}
          {psbt.PSBT_IN_SEQUENCE[i] && (
            <GlobalItem label="Sequence" value={psbt.PSBT_IN_SEQUENCE[i]} />
          )}
          {psbt.PSBT_IN_REQUIRED_TIME_LOCKTIME[i] && (
            <GlobalItem
              label="Required time locktime"
              value={psbt.PSBT_IN_REQUIRED_TIME_LOCKTIME[i]}
            />
          )}
          {psbt.PSBT_IN_REQUIRED_HEIGHT_LOCKTIME[i] && (
            <GlobalItem
              label="Required height locktime"
              value={psbt.PSBT_IN_REQUIRED_HEIGHT_LOCKTIME[i]}
            />
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
