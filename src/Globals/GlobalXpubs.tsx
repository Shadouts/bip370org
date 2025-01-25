import { useContext } from "react";
import { Col, ListGroup } from "react-bootstrap";
import { PageContext } from "../Page";
import { GlobalItem } from "./GlobalItem";
import { bip32StringSlicer, getBip32Path, getXpub } from "../functions";

export const GlobalXpubs = () => {
  const { psbt } = useContext(PageContext);

  let components = [];
  for (const [i, el] of (
    psbt.PSBT_GLOBAL_XPUB as { key: string; value: string }[]
  ).entries()) {
    const [fingerprint, sequence] = bip32StringSlicer(el.value);
    const xpub = getXpub(el.key.slice(2));
    components.push(
      <ListGroup key={i} style={{ marginBottom: 12 }}>
        <GlobalItem
          label={`#${i} xpub BIP 32 path`}
          value={`(${fingerprint}) ${getBip32Path(sequence)}`}
        />
        <ListGroup.Item>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              wordBreak: "break-all",
            }}
          >
            {xpub}
          </span>
        </ListGroup.Item>
      </ListGroup>,
    );
  }

  return <Col>{components}</Col>;
};
