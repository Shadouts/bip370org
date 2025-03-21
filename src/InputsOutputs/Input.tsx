import { usePsbt, useUpdatePsbt } from "../Page";
import {
  Card,
  Col,
  ListGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { GlobalItem } from "../Globals/GlobalItem";
import { Bip32Derivation } from "./Bip32Derivation";
import { InputPartialSigs } from "./InputPartialSigs";
import { InputSighashType } from "./InputSighashType";
import { InputHashes } from "./InputHashes";
import { useCallback, useMemo } from "react";

const InputHeader = ({ index: i }: { index: number }) => {
  const psbt = usePsbt();
  const updatePsbt = useUpdatePsbt();

  const canDelete = useMemo(() => {
    if (
      psbt.PSBT_GLOBAL_TX_MODIFIABLE.includes(
        "INPUTS" as (typeof psbt.PSBT_GLOBAL_TX_MODIFIABLE)[0],
      ) &&
      (psbt.isReadyForConstructor || psbt.isReadyForUpdater)
    ) {
      return true;
    }
    return false;
  }, [
    psbt.PSBT_GLOBAL_TX_MODIFIABLE,
    psbt.isReadyForConstructor,
    psbt.isReadyForUpdater,
  ]);

  const onDelete = useCallback(() => {
    if (
      psbt.PSBT_GLOBAL_TX_MODIFIABLE.includes(
        "SIGHASH_SINGLE" as (typeof psbt.PSBT_GLOBAL_TX_MODIFIABLE)[0],
      )
    ) {
      psbt.deleteOutput(i);
    }

    psbt.deleteInput(i);
    if (
      psbt.PSBT_GLOBAL_INPUT_COUNT === 0 &&
      psbt.PSBT_GLOBAL_TX_MODIFIABLE.includes(
        "SIGHASH_SINGLE" as (typeof psbt.PSBT_GLOBAL_TX_MODIFIABLE)[0],
      )
    ) {
      psbt.PSBT_GLOBAL_TX_MODIFIABLE = psbt.PSBT_GLOBAL_TX_MODIFIABLE.filter(
        (el) =>
          el !==
          ("SIGHASH_SINGLE" as (typeof psbt.PSBT_GLOBAL_TX_MODIFIABLE)[0]),
      );
    }

    updatePsbt(psbt);
  }, [updatePsbt, psbt]);

  return (
    <Card.Header>
      <Row>
        <Col x={2}>{`#${i}`}</Col>
        <Col style={{ textAlign: "right" }}>
          <Row>
            <Col xs={canDelete ? 11 : 12}>
              {`${psbt.PSBT_IN_PREVIOUS_TXID[i]}:${psbt.PSBT_IN_OUTPUT_INDEX[i]}`}
            </Col>
            {canDelete && (
              <Col>
                <OverlayTrigger overlay={<Tooltip>Delete input</Tooltip>}>
                  <b onClick={onDelete} style={{ cursor: "pointer" }}>
                    ✕
                  </b>
                </OverlayTrigger>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Card.Header>
  );
};

export const Input = ({ index: i }: { index: number }) => {
  const psbt = usePsbt();
  const updatePsbt = useUpdatePsbt();

  const setSequence = useCallback(
    (sequence: string) => {
      psbt.setInputSequence(i, Number(sequence));
      updatePsbt(psbt);
    },
    [psbt, updatePsbt],
  );

  const canEditSequence = useMemo(
    () =>
      psbt.isReadyForUpdater &&
      psbt.PSBT_GLOBAL_TX_MODIFIABLE.includes(
        "INPUTS" as (typeof psbt.PSBT_GLOBAL_TX_MODIFIABLE)[0],
      ),
    [psbt],
  );

  return (
    <Card style={{ marginBottom: "1rem" }}>
      <InputHeader index={i} />
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
          <GlobalItem
            editable={canEditSequence}
            editingType="number"
            label="Sequence"
            value={psbt.PSBT_IN_SEQUENCE[i]}
            onChange={setSequence}
          />
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
