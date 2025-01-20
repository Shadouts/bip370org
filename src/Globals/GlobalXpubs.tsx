import { useContext } from "react";
import { Col, ListGroup } from "react-bootstrap";
import { bip32SequenceToPath } from "@caravan/bitcoin";
import { PageContext } from "../Page";
import { GlobalItem } from "./GlobalItem";

export const GlobalXpubs = () => {
  const { psbt } = useContext(PageContext);

  let components = [];
  for (const [i, el] of (
    psbt.PSBT_GLOBAL_XPUB as { key: string; value: string }[]
  ).entries()) {
    console.log(Buffer.from(el.value.slice(8), "hex"));
    components.push(
      <ListGroup key={i} style={{ marginBottom: 12 }}>
        <GlobalItem
          label={`#${i} xpub fingerprint`}
          value={el.value.slice(0, 8)}
        />
        <GlobalItem
          label={`#${i} xpub BIP 32 path`}
          value={bip32SequenceToPath(Buffer.from(el.value.slice(8), "hex"))}
        />
        <ListGroup.Item>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              wordBreak: "break-all",
            }}
          >
            {el.key.slice(2)}
          </span>
        </ListGroup.Item>
      </ListGroup>,
    );
  }

  return <Col>{components}</Col>;
};
