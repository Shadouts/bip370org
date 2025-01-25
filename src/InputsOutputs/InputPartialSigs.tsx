import React, { useContext } from "react";
import { GlobalItem } from "../Globals/GlobalItem";
import { PageContext } from "../Page";

export const InputPartialSigs = ({ inputIndex }: { inputIndex: number }) => {
  const { psbt } = useContext(PageContext);
  const partialSigs: { key: string; value: string | null }[] =
    psbt.PSBT_IN_PARTIAL_SIG[inputIndex];

  return partialSigs.map((partialSig, index) => {
    return (
      <React.Fragment key={partialSig.key}>
        <GlobalItem label={`Partial sig #${index}`} value={partialSig.value} />
        <GlobalItem
          label={`Partial sig #${index} pubkey`}
          value={partialSig.key.slice(2)}
        />
      </React.Fragment>
    );
  });
};
