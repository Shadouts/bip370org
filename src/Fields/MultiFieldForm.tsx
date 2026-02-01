import { validateHex, validateBIP32Path } from "@caravan/bitcoin";
import { useCallback, useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";

export interface FieldDefinition {
  name: string;
  label: string;
  type: "number" | "hex" | "text" | "bip32path";
  required?: boolean;
  placeholder?: string;
  hexBytes?: number; // Expected byte length for hex fields
}

export interface MultiFieldFormProps {
  fields: FieldDefinition[];
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
  submitLabel?: string;
}

/**
 * Normalizes a BIP32 path to include m/ prefix if not present.
 */
const normalizeBip32Path = (path: string): string => {
  return path.startsWith("m/") ? path : `m/${path}`;
};

const validateField = (
  value: string,
  field: FieldDefinition
): string | null => {
  // Check required
  if (field.required && value.trim() === "") {
    return `${field.label} is required`;
  }

  // Skip validation for empty optional fields
  if (value.trim() === "") {
    return null;
  }

  switch (field.type) {
    case "number": {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        return "Must be a valid non-negative number";
      }
      break;
    }
    case "hex": {
      if (validateHex(value) !== "") {
        return "Must be valid hex";
      }
      if (field.hexBytes && value.length !== field.hexBytes * 2) {
        return `Must be exactly ${field.hexBytes} bytes (${field.hexBytes * 2} hex characters)`;
      }
      break;
    }
    case "bip32path": {
      // Normalize path to start with m/ for validation
      const normalizedPath = normalizeBip32Path(value);
      const pathError = validateBIP32Path(normalizedPath);
      if (pathError !== "") {
        return pathError;
      }
      break;
    }
    // text type has no validation beyond required check
  }

  return null;
};

const FormFields = ({
  fields,
  values,
  errors,
  onChange,
}: {
  fields: FieldDefinition[];
  values: Record<string, string>;
  errors: Record<string, string | null>;
  onChange: (name: string, value: string) => void;
}) => {
  return (
    <>
      {fields.map((field) => (
        <Form.Group key={field.name} className="mb-3">
          <Form.Label>
            {field.label}
            {field.required && <span style={{ color: "red" }}> *</span>}
          </Form.Label>
          <Form.Control
            type={field.type === "number" ? "text" : "text"}
            placeholder={field.placeholder}
            value={values[field.name] || ""}
            onChange={(e) => onChange(field.name, e.target.value.trim())}
            isInvalid={!!errors[field.name]}
            style={{ fontFamily: "monospace", fontSize: 12 }}
          />
          <Form.Control.Feedback type="invalid">
            {errors[field.name]}
          </Form.Control.Feedback>
        </Form.Group>
      ))}
    </>
  );
};

export const MultiFieldForm = ({
  fields,
  onSubmit,
  onCancel,
  submitLabel = "Submit",
}: MultiFieldFormProps) => {
  const initialValues = useMemo(() => {
    const vals: Record<string, string> = {};
    fields.forEach((f) => (vals[f.name] = ""));
    return vals;
  }, [fields]);

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback(
    (name: string, value: string) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Validate on change
      const field = fields.find((f) => f.name === name);
      if (field) {
        const error = validateField(value, field);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [fields]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Validate all fields
      const newErrors: Record<string, string | null> = {};
      let hasErrors = false;

      fields.forEach((field) => {
        const error = validateField(values[field.name] || "", field);
        newErrors[field.name] = error;
        if (error) hasErrors = true;
      });

      setErrors(newErrors);
      setTouched(
        fields.reduce(
          (acc, f) => ({ ...acc, [f.name]: true }),
          {} as Record<string, boolean>
        )
      );

      if (!hasErrors) {
        // Normalize values before submitting (e.g., bip32path normalization)
        const normalizedValues = { ...values };
        fields.forEach((field) => {
          if (field.type === "bip32path" && normalizedValues[field.name]) {
            normalizedValues[field.name] = normalizeBip32Path(normalizedValues[field.name]);
          }
        });
        onSubmit(normalizedValues);
      }
    },
    [fields, values, onSubmit]
  );

  const handleCancel = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    onCancel();
  }, [initialValues, onCancel]);

  // Only show errors for touched fields
  const displayErrors = useMemo(() => {
    const result: Record<string, string | null> = {};
    Object.keys(errors).forEach((key) => {
      result[key] = touched[key] ? errors[key] : null;
    });
    return result;
  }, [errors, touched]);

  return (
    <Form onSubmit={handleSubmit}>
      <FormFields
        fields={fields}
        values={values}
        errors={displayErrors}
        onChange={handleChange}
      />
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
        <Button variant="secondary" size="sm" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" type="submit">
          {submitLabel}
        </Button>
      </div>
    </Form>
  );
};
