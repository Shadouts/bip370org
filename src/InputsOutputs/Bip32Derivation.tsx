import { useMemo } from "react";
import { ListGroup } from "react-bootstrap";
import { GlobalItem } from "../Globals/GlobalItem";
import { bip32StringSlicer, formatBip32Path, getBip32Path } from "../functions";

interface IDerivation {
  key: string;
  value: string | null;
}

const Derivation = ({
  index,
  derivation,
}: {
  index: number;
  derivation: IDerivation;
}) => {
  const [fingerprint, sequence] = bip32StringSlicer(derivation.value || "");

  const path = useMemo(
    () => formatBip32Path(fingerprint, sequence),
    [sequence, fingerprint],
  );

  return (
    <>
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
    </>
  );
};

export const Bip32Derivation = ({
  derivations,
}: {
  derivations: IDerivation[];
}) => {
  return derivations.map((derivation, index) => (
    <Derivation key={derivation.key} index={index} derivation={derivation} />
  ));
};
