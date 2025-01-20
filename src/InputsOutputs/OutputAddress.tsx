import React, { useContext, useMemo } from "react";
import { PageContext } from "../Page";
import { address } from "bitcoinjs-lib";

export const OutputAddress = ({ index: i }: { index: number }) => {
  const { psbt } = useContext(PageContext);
  const outScript = psbt.PSBT_OUT_SCRIPT[i];

  const scriptPubKeyBuf = useMemo(
    () => Buffer.from(outScript, "hex"),
    [outScript],
  );

  try {
    return address.fromOutputScript(scriptPubKeyBuf);
  } catch (err) {
    console.error(err);
    return "Invalid PSBT_OUT_SCRIPT";
  }
};
