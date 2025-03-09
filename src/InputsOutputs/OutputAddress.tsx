import { useContext, useMemo } from "react";
import { PageContext, usePsbt } from "../Page";
import { address, networks } from "bitcoinjs-lib";
import { Network } from "@caravan/bitcoin";

export const OutputAddress = ({ index: i }: { index: number }) => {
  const { network } = useContext(PageContext);
  const psbt = usePsbt();
  const outScript = psbt.PSBT_OUT_SCRIPT[i];

  const scriptPubKeyBuf = useMemo(() => {
    const buf = Buffer.from(outScript, "hex");
    const arrayBuffer = new ArrayBuffer(buf.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buf.length; ++i) {
      view[i] = buf[i];
    }
    return view;
  }, [outScript]);

  try {
    return address.fromOutputScript(
      scriptPubKeyBuf,
      network === Network.MAINNET ? networks.bitcoin : networks[network],
    );
  } catch (err) {
    console.error(err);
    return "Invalid PSBT_OUT_SCRIPT";
  }
};
