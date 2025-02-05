import React, { useMemo } from "react";
import { ListGroup } from "react-bootstrap";
import { GlobalItem } from "../Globals/GlobalItem";
import { bip32StringSlicer, getBip32Path } from "../functions";

export const Bip32Derivation = ({
  derivations,
}: {
  derivations: { key: string; value: string | null }[];
}) => {
  return derivations.map((derivation, index) => {
    const [fingerprint, sequence] = bip32StringSlicer(derivation.value || "");

    const path = useMemo(() => {
      let path = getBip32Path(sequence);
      return path.replace(/^m\//, `${fingerprint}/`);
    }, [sequence, fingerprint]);

    return (
      <React.Fragment key={derivation.key}>
        <GlobalItem label={`BIP32 derivation #${index}`} value={path} />
        <ListGroup.Item>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              wordBreak: "break-all",
            }}
          >
            {derivation.key.slice(2)}
          </span>
        </ListGroup.Item>
      </React.Fragment>
    );
  });
};
