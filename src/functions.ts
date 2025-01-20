import { validBase64, validateHex } from "@caravan/bitcoin";

export const getEncoding = (psbt: string) => {
  if (psbt === "") {
    return "base64";
  } else if (validateHex(psbt) === "") {
    return "hex";
  } else if (validBase64(psbt)) {
    return "base64";
  } else {
    throw Error("PSBT is not valid hex or base64 encoding");
  }
};
