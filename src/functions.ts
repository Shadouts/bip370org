import {
  ExtendedPublicKey,
  bip32SequenceToPath,
  validBase64,
  validateHex,
} from "@caravan/bitcoin";
// @ts-ignore
import { BufferReader } from "bufio";

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

export const getBip32Path = (sequence: string) => {
  const br = new BufferReader(Buffer.from(sequence, "hex"));

  const sequenceNumbers: number[] = [];
  while (true) {
    try {
      sequenceNumbers.push(br.readU32());
    } catch {
      break;
    }
  }

  return bip32SequenceToPath(sequenceNumbers);
};

export const bip32StringSlicer = (derivation: string) => {
  return [derivation.slice(0, 8), derivation.slice(8)];
};

export const getXpub = (hexString: string) => {
  const xpub = new ExtendedPublicKey({});
  const br = new BufferReader(Buffer.from(hexString, "hex"));
  xpub.read(br);
  return xpub.toBase58();
};
