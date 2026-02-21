import { useCallback, useState } from "react";

import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { Button, InputGroup } from "react-bootstrap";
import { useUpdatePsbt, usePsbt } from "../Page";
import { getPsbtVersionNumber, PsbtV2 } from "@caravan/psbt";

export const SerializedInput = () => {
  const [rawPsbtField, setRawPsbtField] = useState("");
  const [error, setError] = useState("");
  const updatePsbt = useUpdatePsbt();
  const psbt = usePsbt();

  const handleSubmit = useCallback(() => {
    setError("");

    try {
      updatePsbt(rawPsbtField);
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setRawPsbtField("");
    }
  }, [rawPsbtField]);

  const handleCombine = useCallback(() => {
    setError("");

    try {
      // Parse the input as a PsbtV2
      const version = getPsbtVersionNumber(rawPsbtField);
      const otherPsbt =
        version === 2
          ? new PsbtV2(rawPsbtField, true)
          : PsbtV2.FromV0(rawPsbtField, true);

      // Combine into the current PSBT
      psbt.combine([otherPsbt]);

      // Update the app state with the combined result
      updatePsbt(psbt);
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setRawPsbtField("");
    }
  }, [rawPsbtField, psbt, updatePsbt]);

  return (
    <Row>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Form.Group>
          <Form.Label>
            Paste a hex or base64 encoded PSBT. PSBTv0 will be converted to v2.
          </Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              style={{ fontFamily: "monospace", fontSize: 12 }}
              placeholder="PSBT"
              onChange={(e: React.SyntheticEvent) =>
                setRawPsbtField((e.target as HTMLInputElement).value.trim())
              }
              value={rawPsbtField}
              isInvalid={!!error}
            />
            <Button type="submit" variant="outline-primary">
              Set
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleCombine}
              disabled={!psbt.isReadyForCombiner}
            >
              Combine
            </Button>
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Form>
    </Row>
  );
};
