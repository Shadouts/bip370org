import { ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ReactNode } from "react";
import { RemoveIcon } from "../Icons";

interface KeyValueRow {
  label: string;
  value: ReactNode;
}

interface KeyValueListItemProps {
  rows: KeyValueRow[];
  onRemove?: () => void; // Optional remove action shown on first row
}

/**
 * A reusable component for displaying multiple key-value pairs
 * in a ListGroup.Item with monospace styling.
 * Optionally includes a remove button on the first row.
 */
export const KeyValueListItem = ({ rows, onRemove }: KeyValueListItemProps) => {
  return (
    <ListGroup.Item
      style={{
        padding: "0.5rem",
        fontSize: 12,
        fontFamily: "monospace",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {rows.map((row, index) => (
          <div
            key={row.label}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <span style={{ fontWeight: "bold", flexShrink: 0 }}>
              {row.label}:
            </span>
            <span style={{ flexGrow: 1, wordBreak: "break-all" }}>
              {row.value}
            </span>
            {index === 0 && onRemove && (
              <OverlayTrigger overlay={<Tooltip>Remove</Tooltip>}>
                <span onClick={onRemove} style={{ cursor: "pointer" }}>
                  <RemoveIcon />
                </span>
              </OverlayTrigger>
            )}
          </div>
        ))}
      </div>
    </ListGroup.Item>
  );
};
