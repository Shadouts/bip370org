import React from "react";
import { usePsbt } from "../Page";
import { GlobalItem } from "../Globals/GlobalItem";

export const InputHashes = ({
  inputIndex,
  type,
}: {
  inputIndex: number;
  type: "RIPEMD160" | "SHA256" | "HASH160" | "HASH256";
}) => {
  const psbt = usePsbt();
  let hashes: { key: string; value: string | null }[] = [];
  if (type === "RIPEMD160") {
    hashes = psbt.PSBT_IN_RIPEMD160[inputIndex];
  } else if (type === "SHA256") {
    hashes = psbt.PSBT_IN_SHA256[inputIndex];
  } else if (type === "HASH160") {
    hashes = psbt.PSBT_IN_HASH160[inputIndex];
  } else if (type === "HASH256") {
    hashes = psbt.PSBT_IN_HASH256[inputIndex];
  } else {
    return null;
  }

  return hashes.map((entry, index) => (
    <React.Fragment key={index}>
      <GlobalItem label={`${type} preimage #${index}`} value={entry.value} />
      <GlobalItem label={`${type} hash #${index}`} value={entry.key.slice(2)} />
    </React.Fragment>
  ));
};
