import React, { useContext } from "react";
import { PageContext } from "../Page";
import { Input } from "./Input";
import { Output } from "./Output";

export const InputsOutputs = ({
  direction,
  count,
}: {
  direction: "input" | "output";
  count: number;
}) => {
  const { psbt } = useContext(PageContext);

  let children = [];
  for (let i = 0; i < count; i++) {
    children.push(
      direction === "input" ? (
        <Input key={i} index={i} />
      ) : (
        <Output key={i} index={i} />
      ),
    );
  }

  return (
    <>
      <h3>{direction === "input" ? "Inputs" : "Outputs"}</h3>
      {children}
    </>
  );
};
