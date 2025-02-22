import React, { useContext, useState } from "react";

import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { IPageContext, PageContext } from "../Page";
import { Button, InputGroup } from "react-bootstrap";
import { handleSetNewPsbt } from "../functions";

const handleSubmit = (
  value: string,
  setState: IPageContext["setState"],
  setError: (err: string) => void,
  unsetTextField: () => void,
) => {
  setError("");

  try {
    handleSetNewPsbt(value, setState);
  } catch (err) {
    console.error(err);
    setError(String(err));
  } finally {
    unsetTextField();
  }
};

export const SerializedInput = () => {
  const [rawPsbtField, setRawPsbtField] = useState("");
  const [error, setError] = useState("");
  const { setState } = useContext(PageContext);

  return (
    <Row>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(rawPsbtField, setState, setError, () =>
            setRawPsbtField(""),
          );
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
