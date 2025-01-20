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
    <Row>
      <Col>
        <b>{label}</b>
      </Col>
      <Col
        style={{
          textAlign: "right",
          fontFamily: "monospace",
          fontSize: 12,
          wordBreak: "break-all",
          ...style,
        }}
      >
        {value?.toString()}
      </Col>
    </Row>
  </ListGroup.Item>
);
