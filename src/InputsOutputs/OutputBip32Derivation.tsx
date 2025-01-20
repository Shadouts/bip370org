import React, { useContext } from "react";
import { GlobalItem } from "../Globals/GlobalItem";
import { PageContext } from "../Page";

export const OutputBip32Derivation = ({ index: i }: { index: number }) => {
  const context = useContext(PageContext);
  const derivations = context.psbt.PSBT_OUT_BIP32_DERIVATION[i] as any[];
  console.log(derivations);
  return derivations.map((derivation) => (
    <GlobalItem label="BIP32 Derivation" value={derivation.key} />
  ));
};
