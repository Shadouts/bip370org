import { useCallback, useState } from "react";

import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { Button, InputGroup } from "react-bootstrap";
import { useUpdatePsbt } from "../Page";

export const SerializedInput = () => {
  const [rawPsbtField, setRawPsbtField] = useState("");
  const [error, setError] = useState("");
  const updatePsbt = useUpdatePsbt();

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
          <InputGroup>
            <Form.Control
              style={{ fontFamily: "monospace", fontSize: 12 }}
              placeholder="PSBT"
              onChange={(e: React.SyntheticEvent) =>
                setRawPsbtField((e.target as HTMLInputElement).value.trim())
              }
              value={rawPsbtField}
            />
            {error && (
              <Form.Control.Feedback
                style={{ display: "inline" }}
                type="invalid"
              >
                {error}
              </Form.Control.Feedback>
            )}
            <Button type="submit" variant="outline-secondary">
              Set
            </Button>
          </InputGroup>
        </Form.Group>
      </Form>
    </Row>
  );
};
