import { useMemo, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { SimpleInput } from "../Editing/SimpleInput";

export const GlobalItem = ({
  label,
  value,
  style = {},
  editable,
  editingType = "number",
  onChange,
}: {
  label: string;
  value: string | number | bigint | null;
  style?: any;
  editable?: boolean;
  editingType?: "number" | "hex";
  onChange?: (value: string) => void;
}) => {
  const [editingState, setEditingState] = useState(false);
  const stringVal = useMemo(() => value?.toString() || "", [value]);

  const innerStyle = useMemo(() => {
    let inner = {
      paddingTop: 4,
      flexGrow: 1,
      textAlign: "right",
      fontFamily: "monospace",
      fontSize: 12,
      wordBreak: "break-all",
      ...style,
    };
    if (editable) {
      inner = {
        ...inner,
        textDecoration: "underline",
        cursor: "pointer",
      };
    }
    return inner;
  }, [style]);

  return (
    <ListGroup.Item>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <b>{label}</b>
        </div>
        {editingState ? (
          <SimpleInput
            value={stringVal}
            type={editingType}
            onSubmit={(value) => {
              if (onChange) {
                onChange(value);
              }
              setEditingState(false);
            }}
          />
        ) : (
          <div
            style={innerStyle}
            onClick={() =>
              editable && onChange ? setEditingState(true) : null
            }
          >
            {stringVal || "_"}
          </div>
        )}
      </div>
    </ListGroup.Item>
  );
};
