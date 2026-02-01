import { ExtendedPublicKey } from "@caravan/bitcoin";
import { FieldDefinition, MultiFieldForm } from "../Fields";
import { xpubToHex } from "../functions";
import { usePsbt, useUpdatePsbt } from "../Page";
import { useCallback, useMemo, useState } from "react";
import { Button, Card } from "react-bootstrap";

const ADD_XPUB_FIELDS: FieldDefinition[] = [
  {
    name: "xpub",
    label: "Extended Public Key (base58)",
    type: "text",
    required: true,
    placeholder: "xpub..., tpub..., etc.",
  },
  {
    name: "fingerprint",
    label: "Master Fingerprint (hex)",
    type: "hex",
    required: true,
    hexBytes: 4,
    placeholder: "e.g. d34db33f",
  },
  {
    name: "path",
    label: "Derivation Path",
    type: "bip32path",
    required: true,
    placeholder: "e.g. m/48'/0'/0'/2'",
  },
];

/**
 * Hook for adding xpubs to the PSBT.
 * Returns the add handler and canAdd state.
 */
const useAddXpub = () => {
  const psbt = usePsbt();
  const updatePsbt = useUpdatePsbt();

  const canAdd = useMemo(
    () => psbt.isReadyForConstructor || psbt.isReadyForUpdater,
    [psbt.isReadyForUpdater]
  );

  const handleAddXpub = useCallback(
    (values: Record<string, string>) => {
      try {
        try {
          ExtendedPublicKey.fromBase58(values.xpub);
        } catch (e) {
          alert(`Invalid xpub: ${e}`);
          return false;
        }

        psbt.addGlobalXpub(
          Buffer.from(xpubToHex(values.xpub), "hex"),
          Buffer.from(values.fingerprint, "hex"),
          values.path
        );

        updatePsbt(psbt);
        return true;
      } catch (e) {
        alert(`Error adding xpub: ${e}`);
        return false;
      }
    },
    [psbt, updatePsbt]
  );

  return { canAdd, handleAddXpub };
};

/**
 * Inline add xpub form component.
 * Can be used standalone (e.g., in MovableItems when no xpubs exist).
 * Just shows the button and form - no header or wrapper.
 */
export const AddXpubInline = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { canAdd, handleAddXpub } = useAddXpub();

  const onSubmit = useCallback(
    (values: Record<string, string>) => {
      if (handleAddXpub(values)) {
        setShowAddForm(false);
      }
    },
    [handleAddXpub]
  );

  if (!canAdd) {
    return null;
  }

  return (
    <>
      {canAdd && !showAddForm && (
        <Button
          variant="outline-primary"
          style={{ width: "100%" }}
          size="sm"
          onClick={() => setShowAddForm(true)}
        >
          Add Global Xpub
        </Button>
      )}
      {showAddForm && (
        <Card>
          <Card.Body>
            <MultiFieldForm
              fields={ADD_XPUB_FIELDS}
              onSubmit={onSubmit}
              onCancel={() => setShowAddForm(false)}
              submitLabel="Add global xpub"
            />
          </Card.Body>
        </Card>
      )}
    </>
  );
};