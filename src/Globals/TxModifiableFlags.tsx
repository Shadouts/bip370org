import { usePsbt } from "../Page";
import { GlobalItem } from "./GlobalItem";

export const TxModifiableFlags = () => {
  const psbt = usePsbt();

  let txModifiable = "";
  for (const flag of psbt.PSBT_GLOBAL_TX_MODIFIABLE) {
    txModifiable += `${flag}, `;
  }
  txModifiable = txModifiable.slice(0, -2);

  return (
    <GlobalItem label="Tx modifiable flags" value={txModifiable || "None"} />
  );
};
