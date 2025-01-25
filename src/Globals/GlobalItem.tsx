import { Col, ListGroup, Row } from "react-bootstrap";

export const GlobalItem = ({
  label,
  value,
  style = {},
}: {
  label: string;
  value: string | number | bigint | null;
  style?: any;
}) => (
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
      <div
        style={{
          paddingTop: 4,
          flexGrow: 1,
          textAlign: "right",
          fontFamily: "monospace",
          fontSize: 12,
          wordBreak: "break-all",
          ...style,
        }}
      >
        {value?.toString()}
      </div>
    </div>
  </ListGroup.Item>
);
