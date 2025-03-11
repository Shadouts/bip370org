import { useCallback, useMemo } from "react";
import {
  Col,
  Card,
  Row,
  ListGroup,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
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

const VersionItem = ({ txVersion }: { txVersion: number }) => {
  if (txVersion === 1) {
    return (
      <OverlayTrigger
        trigger={["hover", "focus"]}
        overlay={
          <Popover id="popover-basic">
            <Popover.Body>
              This PSBTv2 has a transaction version of 1. This is BIP370
              non-compliant and could be due to a conversion from a PSBTv0.
              Please use caution when handling special cases of locktime.
            </Popover.Body>
          </Popover>
        }
      >
        <div>
          <GlobalItem
            style={{ color: "red" }}
            label="Tx version"
            value={txVersion}
          />
        </div>
      </OverlayTrigger>
    );
  }

  return <GlobalItem label="Tx version" value={txVersion} />;
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
                <VersionItem txVersion={psbt.PSBT_GLOBAL_TX_VERSION} />
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
