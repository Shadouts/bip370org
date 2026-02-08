import { useCallback, useMemo, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { usePsbt, useUpdatePsbt } from "../Page";
import { FieldDefinition, KeyValueListItem, MultiFieldForm } from "../Fields";
import { NoKeyVals } from "../Fields/NoKeyVals";

const ADD_PARTIAL_SIG_FIELDS: FieldDefinition[] = [
  {
    // 33 bytes = compressed ECDSA pubkey (1-byte parity 0x02/0x03 + 32-byte x).
    // That leading 02/03 is the key's parity, not the PSBT key type (see below).
    name: "pubkey",
    label: "Pubkey (33 bytes hex)",
    type: "hex",
    required: true,
    hexBytes: 33,
    placeholder: "e.g. 02...",
  },
  {
    name: "signature",
    label: "Signature (hex)",
    type: "hex",
    required: true,
    placeholder: "DER-encoded signature with sighash byte",
  },
];

interface PartialSigEntry {
  pubkey: string; // 33-byte compressed pubkey
  signature: string;
}

export const InputPartialSigs = ({ inputIndex }: { inputIndex: number }) => {
  const psbt = usePsbt();
  const updatePsbt = useUpdatePsbt();
  const [isAdding, setIsAdding] = useState(false);

  const canEdit = useMemo(
    () => psbt.isReadyForSigner,
    [psbt.isReadyForSigner]
  );

  // Parse existing partial signatures into display-friendly format
  const partialSigs: PartialSigEntry[] = useMemo(() => {
    const raw = psbt.PSBT_IN_PARTIAL_SIG[inputIndex] as {
      key: string;
      value: string | null;
    }[];

    return raw
      .filter((sig) => sig.value !== null)
      .map((sig) => ({
        // Stored key is PSBT key type (1 byte) + 33-byte pubkey. Key type 0x02 means
        // "compressed pubkey" (same value as a parity byte, but different meaning).
        pubkey: sig.key.slice(2), // Remove PSBT key type byte; rest is the pubkey
        signature: sig.value as string,
      }));
  }, [psbt.PSBT_IN_PARTIAL_SIG, inputIndex]);

  const handleAdd = useCallback(
    (values: Record<string, string>) => {
      psbt.addPartialSig(
        inputIndex,
        Buffer.from(values.pubkey, "hex"),
        Buffer.from(values.signature, "hex")
      );
      updatePsbt(psbt);
      setIsAdding(false);
    },
    [psbt, updatePsbt, inputIndex]
  );

  const handleRemove = useCallback(
    (pubkey: string) => {
      psbt.removePartialSig(inputIndex, Buffer.from(pubkey, "hex"));
      updatePsbt(psbt);
    },
    [psbt, updatePsbt, inputIndex]
  );

  return (
    <ListGroup.Item>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.25rem",
        }}
      >
        <b>Partial signatures</b>
        {canEdit && !isAdding && (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            + Add signature
          </Button>
        )}
      </div>
      <div>
        {partialSigs.length > 0 && (
          <ListGroup variant="flush" style={{ marginBottom: "0.5rem" }}>
            {partialSigs.map((entry) => (
              <KeyValueListItem
                key={entry.pubkey}
                rows={[
                  { label: "Pubkey", value: entry.pubkey },
                  { label: "Signature", value: entry.signature },
                ]}
                onRemove={canEdit ? () => handleRemove(entry.pubkey) : undefined}
              />
            ))}
          </ListGroup>
        )}

        {partialSigs.length === 0 && !isAdding && (
          <NoKeyVals type="signatures" />
        )}

        {isAdding && (
          <MultiFieldForm
            fields={ADD_PARTIAL_SIG_FIELDS}
            onSubmit={handleAdd}
            onCancel={() => setIsAdding(false)}
            submitLabel="Add signature"
          />
        )}
      </div>
    </ListGroup.Item>
  );
};
