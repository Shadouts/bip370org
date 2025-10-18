import { useMemo } from "react";
import { usePsbt } from "../Page";
import { reverseHexStringEndianness } from "../functions";

export const InputOutpoint = ({inputIndex}: {inputIndex: number}) => {
  const psbt = usePsbt();

  const txid = useMemo(() => {
    return reverseHexStringEndianness(psbt.PSBT_IN_PREVIOUS_TXID[inputIndex]);
  }, [psbt.PSBT_IN_PREVIOUS_TXID, inputIndex]);

  return (
    <div>
      {`${txid}:${psbt.PSBT_IN_OUTPUT_INDEX[inputIndex]}`}
    </div>
  );
}
