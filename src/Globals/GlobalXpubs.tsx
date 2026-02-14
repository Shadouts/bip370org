import { useMemo } from "react";
import { Col, ListGroup } from "react-bootstrap";
import { usePsbt } from "../Page";
import { bip32StringSlicer, formatBip32Path, getXpub, xpubToHex } from "../functions";
import { KeyValueListItem } from "../Fields";
import { AddXpubInline } from "./AddXpubInline";

interface XpubEntryProps {
  path: string;
  xpub: string;
}

export const GlobalXpubs = () => {
  const psbt = usePsbt();

  // Parse existing xpubs into display-friendly format
  const xpubs: XpubEntryProps[] = useMemo(() => {
    return (psbt.PSBT_GLOBAL_XPUB as { key: string; value: string }[]).map(
      (el) => {
        const [fingerprint, sequence] = bip32StringSlicer(el.value);
        const xpub = getXpub(el.key.slice(2));
        const path = formatBip32Path(fingerprint, sequence);
        return { path, xpub };
      }
    );
  }, [psbt.PSBT_GLOBAL_XPUB]);


  return (
    <Col>
      <h6 style={{ marginBottom: "0.5rem" }}>Global Xpubs</h6>
      {xpubs.length > 0 && (
        <ListGroup style={{ marginBottom: "0.5rem" }}>
          {xpubs.map((entry, i) => (
            <KeyValueListItem
              key={i}
              rows={[
                { label: "Path", value: entry.path },
                { label: "Xpub", value: entry.xpub },
              ]}
            />
          ))}
        </ListGroup>
      )}
      <AddXpubInline />
    </Col>
  );
};
