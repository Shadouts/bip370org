import { OverlayTrigger, Tooltip } from "react-bootstrap";

export const EditIcon = () => {
  return (
    <OverlayTrigger overlay={<Tooltip>Add value</Tooltip>}>
      <span style={{ textDecoration: "none", display: "inline-block" }}>✎</span>
    </OverlayTrigger>
  );
};
