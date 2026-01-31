import { validateHex } from "@caravan/bitcoin";
import { useCallback, useMemo, useState } from "react";
import { Form } from "react-bootstrap";

export const SimpleInput = ({
  value,
  type,
  onSubmit,
}: {
  value: string;
  type: "number" | "hex";
  onSubmit: (value: string) => void;
}) => {
  const [editingValue, setEditingValue] = useState<string>(value);

  const isInvalid = useMemo(() => {
    if (editingValue === "") {
      return false;
    } else if (editingValue !== "" && type === "number") {
      const number = parseFloat(editingValue);
      return isNaN(number) || number < 0;
    } else {
      return validateHex(editingValue) === "";
    }
  }, [editingValue]);

  const submit = useCallback(() => {
    if (isInvalid) {
      return;
    }
    onSubmit(editingValue);
  }, [isInvalid, editingValue]);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      style={{ width: "100%" }}
    >
      <Form.Group>
        <Form.Control
          size="sm"
          autoFocus
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value.trim())}
          onBlur={submit}
          isInvalid={isInvalid}
        />
        <Form.Control.Feedback type="invalid">
          {type === "number"
            ? "Must be a valid number greater than zero"
            : "Must be valid hex"}
        </Form.Control.Feedback>
      </Form.Group>
    </Form>
  );
};
