import { useCallback, useMemo } from "react";
import { Col, Card, Row, ListGroup } from "react-bootstrap";
import { GlobalItem } from "./GlobalItem";
import { TxModifiableFlags } from "./TxModifiableFlags";
import { GlobalXpubs } from "./GlobalXpubs";
import { usePsbt, useUpdatePsbt } from "../Page/context";

const MovableItems = () => {
  const psbt = usePsbt();

  return (
    <>
      <GlobalItem label="Input count" value={psbt.PSBT_GLOBAL_INPUT_COUNT} />
      <GlobalItem label="Output count" value={psbt.PSBT_GLOBAL_OUTPUT_COUNT} />
      <TxModifiableFlags />
    </>
  );
};

export const Globals = () => {
  const psbt = usePsbt();
  const updatePsbt = useUpdatePsbt();

  const editableFallbackLocktime = useMemo(
    () =>
      psbt.isReadyForConstructor ||
      // it's is in Creator role (but not ready for constructor). There is no
      // isInCreatorRole or such method, so checking that it's not ready for
      // these other stages is sufficient.
      (!psbt.isReadyForUpdater &&
        !psbt.isReadyForSigner &&
        !psbt.isReadyForInputFinalizer),
    [psbt],
  );

  const fallbackLocktimeOnChange = useCallback(
    (locktime: string) => {
      if (locktime === "") {
        psbt.PSBT_GLOBAL_FALLBACK_LOCKTIME = null;
      } else if (!isNaN(parseInt(locktime))) {
        psbt.PSBT_GLOBAL_FALLBACK_LOCKTIME = parseInt(locktime);
      }
      updatePsbt(psbt);
    },
    [updatePsbt, psbt],
  );

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
                  editable={editableFallbackLocktime}
                  editingType="number"
                  onChange={fallbackLocktimeOnChange}
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
