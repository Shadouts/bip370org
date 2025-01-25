import { useContext } from "react";
import { GlobalItem } from "../Globals/GlobalItem";
import { SighashType as SighashTypeEnum } from "../types";
import { PageContext } from "../Page";

export const InputSighashType = ({ inputIndex }: { inputIndex: number }) => {
  const { psbt } = useContext(PageContext);
  const sighashType = psbt.PSBT_IN_SIGHASH_TYPE[inputIndex];
  if (sighashType === null) {
    return null;
  }
  let sighashTypeString = "";
  if (sighashType & SighashTypeEnum.SIGHASH_ANYONECANPAY) {
    sighashTypeString += SighashTypeEnum[SighashTypeEnum.SIGHASH_ANYONECANPAY];
  }
  if (sighashType & SighashTypeEnum.SIGHASH_ALL) {
    sighashTypeString += SighashTypeEnum[SighashTypeEnum.SIGHASH_ALL];
  } else if (sighashType & SighashTypeEnum.SIGHASH_NONE) {
    sighashTypeString += SighashTypeEnum[SighashTypeEnum.SIGHASH_NONE];
  } else if (sighashType & SighashTypeEnum.SIGHASH_SINGLE) {
    sighashTypeString += SighashTypeEnum[SighashTypeEnum.SIGHASH_SINGLE];
  } else {
    sighashTypeString += "Unknown";
  }

  return <GlobalItem label="Sighash type" value={sighashTypeString} />;
};
