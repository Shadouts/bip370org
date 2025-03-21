import { useCallback, useMemo } from "react";
import {
  Card,
  Col,
  ListGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { GlobalItem } from "../Globals/GlobalItem";
import { OutputAddress } from "./OutputAddress";
import { Bip32Derivation } from "./Bip32Derivation";
import { usePsbt, useUpdatePsbt } from "../Page/context";

const OutputHeader = ({ index: i }: { index: number }) => {
  const psbt = usePsbt();
  const updatePsbt = useUpdatePsbt();

  const canDelete = useMemo(() => {
    if (
      psbt.PSBT_GLOBAL_TX_MODIFIABLE.includes(
        "OUTPUTS" as (typeof psbt.PSBT_GLOBAL_TX_MODIFIABLE)[0],
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
    psbt.deleteOutput(i);

    if (
      psbt.PSBT_GLOBAL_TX_MODIFIABLE.includes(
        "SIGHASH_SINGLE" as (typeof psbt.PSBT_GLOBAL_TX_MODIFIABLE)[0],
      ) &&
      psbt.PSBT_IN_PARTIAL_SIG[i].length > 0
    ) {
      psbt.removePartialSig(i);
    }
    if (!psbt.PSBT_IN_PARTIAL_SIG.find((el) => el[1])) {
      // No sigs, remove txmodifiable sighashall
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
        <Col xs={2}>{`#${i}`}</Col>
        <Col style={{ textAlign: "right" }}>
          <Row>
            <Col xs={canDelete ? 11 : 12}>
              <OutputAddress index={i} />
            </Col>
            {canDelete && (
              <Col>
                <OverlayTrigger overlay={<Tooltip>Delete output</Tooltip>}>
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

export const Output = ({ index: i }: { index: number }) => {
  const psbt = usePsbt();

  return (
    <Card style={{ marginBottom: "1rem" }}>
      <OutputHeader index={i} />
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
