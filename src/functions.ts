import {
  ExtendedPublicKey,
  bip32PathToSequence,
  bip32SequenceToPath,
  validBase64,
  validateBIP32Path,
  validateHex,
} from "@caravan/bitcoin";
// @ts-ignore
import { BufferReader, BufferWriter } from "bufio";

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

export const formatBip32Path = (fingerprint: string, sequence: string) => {
  let path = getBip32Path(sequence);
  return path.replace(/^m\//, `${fingerprint}/`);
};

export const reverseHexStringEndianness = (hexString: string) => {
  if (validateHex(hexString) !== "") {
    throw new Error("Input string is not valid hex");
  }
  return hexString
    .match(/.{2}/g)!
    .reverse()
    .join("");
};

/**
 * Converts a BIP32 path string to bytes (uint32LE sequence).
 * Used for encoding BIP32 derivation values in PSBT.
 */
const bip32PathToBytes = (path: string): Buffer => {
  const validationError = validateBIP32Path(path);
  if (validationError !== "") {
    throw new Error(validationError);
  }

  const sequence = bip32PathToSequence(path);
  const bw = new BufferWriter();

  for (const node of sequence) {
    bw.writeU32(node);
  }

  return bw.render();
};

/**
 * Encodes a BIP32 derivation value (fingerprint + path bytes).
 * Used when adding BIP32 derivations to PSBT inputs/outputs.
 */
export const encodeBip32DerivationValue = (
  fingerprint: string,
  path: string
): Buffer => {
  const bw = new BufferWriter();
  bw.writeBytes(Buffer.from(fingerprint, "hex"));
  bw.writeBytes(bip32PathToBytes(path));
  return bw.render();
};

export const xpubToHex = (xpubBase58: string): string => {
  const xpub = ExtendedPublicKey.fromBase58(xpubBase58);
  const bw = new BufferWriter();
  xpub.write(bw);
  return bw.render().toString("hex");
};
