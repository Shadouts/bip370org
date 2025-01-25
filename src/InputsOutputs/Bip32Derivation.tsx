import { ListGroup } from "react-bootstrap";
import { GlobalItem } from "../Globals/GlobalItem";
import { bip32StringSlicer, getBip32Path } from "../functions";
import React from "react";

export const Bip32Derivation = ({
  derivations,
}: {
  derivations: { key: string; value: string | null }[];
}) => {
  return derivations.map((derivation, index) => {
    const [fingerprint, sequence] = bip32StringSlicer(derivation.value || "");

    return (
      <React.Fragment key={derivation.key}>
        <GlobalItem
          label={`BIP32 derivation #${index}`}
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
            {derivation.key.slice(2)}
          </span>
        </ListGroup.Item>
      </React.Fragment>
    );
  });
};
