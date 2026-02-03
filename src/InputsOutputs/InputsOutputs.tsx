import { useCallback, useMemo, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { usePsbt, useUpdatePsbt } from "../Page";
import { Input } from "./Input";
import { Output } from "./Output";
import { FieldDefinition, MultiFieldForm } from "../Fields";

/**
 * Field definitions for the Add Output form.
 * Only requires amount and script (minimum requirements).
 * BIP32 derivation can be added via the inline editor after creation.
 */
const OUTPUT_FIELDS: FieldDefinition[] = [
  {
    name: "amount",
    label: "Amount (satoshis)",
    type: "number",
    required: true,
    placeholder: "e.g. 100000",
  },
  {
    name: "script",
    label: "Output Script (hex)",
    type: "hex",
    required: true,
    placeholder: "e.g. 0014...",
  },
];

/**
 * Field definitions for the Add Input form.
 * Only requires previousTxid and outputIndex (minimum requirements).
 * Sequence can be edited inline after creation.
 * BIP32 derivation can be added via the inline editor after creation.
 */
const INPUT_FIELDS: FieldDefinition[] = [
  {
    name: "previousTxid",
    label: "Previous TXID (hex)",
    type: "hex",
    required: true,
    hexBytes: 32,
    placeholder: "32 bytes",
  },
  {
    name: "outputIndex",
    label: "Output Index",
    type: "number",
    required: true,
    placeholder: "e.g. 0",
  },
];

/**
 * Determines if the user can add inputs/outputs
 */
const useCanAdd = (direction: "input" | "output") => {
  const psbt = usePsbt();
  return useMemo(() => {
    const flag = direction === "input" ? "INPUTS" : "OUTPUTS";
    const hasFlag = psbt.PSBT_GLOBAL_TX_MODIFIABLE.includes(
      flag as (typeof psbt.PSBT_GLOBAL_TX_MODIFIABLE)[0]
    );

    // Constructor/Updater roles: must check the TX_MODIFIABLE flags.
    // If a Signer has already signed (clearing flags), adding is not allowed.
    const inEditableRole =
      psbt.isReadyForConstructor || psbt.isReadyForUpdater;

    return hasFlag && inEditableRole;
  }, [psbt.PSBT_GLOBAL_TX_MODIFIABLE, psbt.isReadyForConstructor, psbt.isReadyForUpdater]);
};

/**
 * Handles adding a new output to the PSBT.
 */
const useHandleAddOutput = (setShowAddForm: (show: boolean) => void) => {
  const psbt = usePsbt();
  const updatePsbt = useUpdatePsbt();
  return useCallback(
    (values: Record<string, string>) => {
      // Ensure OUTPUTS flag is set to allow further modifications.
      // This is necessary when adding the first output (Creator role),
      // as the flag won't exist yet.
      if (
        !psbt.PSBT_GLOBAL_TX_MODIFIABLE.includes(
          "OUTPUTS" as (typeof psbt.PSBT_GLOBAL_TX_MODIFIABLE)[0]
        )
      ) {
        psbt.PSBT_GLOBAL_TX_MODIFIABLE = [
          ...psbt.PSBT_GLOBAL_TX_MODIFIABLE,
          "OUTPUTS" as (typeof psbt.PSBT_GLOBAL_TX_MODIFIABLE)[0],
        ];
      }

      psbt.addOutput({
        amount: parseInt(values.amount, 10),
        script: Buffer.from(values.script, "hex"),
      });
      updatePsbt(psbt);
      setShowAddForm(false);
    },
    [psbt, updatePsbt, setShowAddForm]
  );
}

/**
 * Handles adding a new input to the PSBT.
 */
const useHandleAddInput = (setShowAddForm: (show: boolean) => void) => {
  const psbt = usePsbt();
  const updatePsbt = useUpdatePsbt();
  return useCallback(
    (values: Record<string, string>) => {
      // Ensure INPUTS flag is set to allow further modifications.
      // This is necessary when adding the first input (Creator role),
      // as the flag won't exist yet.
      if (
        !psbt.PSBT_GLOBAL_TX_MODIFIABLE.includes(
          "INPUTS" as (typeof psbt.PSBT_GLOBAL_TX_MODIFIABLE)[0]
        )
      ) {
        psbt.PSBT_GLOBAL_TX_MODIFIABLE = [
          ...psbt.PSBT_GLOBAL_TX_MODIFIABLE,
          "INPUTS" as (typeof psbt.PSBT_GLOBAL_TX_MODIFIABLE)[0],
        ];
      }

      // Add input with minimum required fields.
      psbt.addInput({
        previousTxId: values.previousTxid,
        outputIndex: parseInt(values.outputIndex, 10),
        sequence: 0xfffffffe,
      });
      updatePsbt(psbt);
      setShowAddForm(false);
    },
    [psbt, updatePsbt]
  );
}

export const InputsOutputs = ({
  direction,
  count,
}: {
  direction: "input" | "output";
  count: number;
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const canAdd = useCanAdd(direction);
  const handleAddOutput = useHandleAddOutput(setShowAddForm);
  const handleAddInput = useHandleAddInput(setShowAddForm);

  const children = [];
  for (let i = 0; i < count; i++) {
    children.push(
      direction === "input" ? (
        <Input key={i} index={i} />
      ) : (
        <Output key={i} index={i} />
      )
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        <h3 style={{ margin: 0 }}>
          {direction === "input" ? "Inputs" : "Outputs"}
        </h3>
      </div>
      {children}
      {canAdd && !showAddForm && (
        <OverlayTrigger
          overlay={
            <Tooltip>
              Add {direction}
            </Tooltip>
          }
        >
          <Button
            variant="outline-primary"
            style={{ width: "100%" }}
            onClick={() => setShowAddForm(true)}
          >
            Add {direction}
          </Button>
        </OverlayTrigger>
      )}
      {showAddForm && (
        <div style={{ marginBottom: "1rem", padding: "0.5rem", border: "1px solid #dee2e6", borderRadius: "0.25rem" }}>
          <MultiFieldForm
            fields={direction === "input" ? INPUT_FIELDS : OUTPUT_FIELDS}
            onSubmit={direction === "input" ? handleAddInput : handleAddOutput}
            onCancel={() => setShowAddForm(false)}
            submitLabel={direction === "input" ? "Add Input" : "Add Output"}
          />
        </div>
      )}
    </>
  );
};
