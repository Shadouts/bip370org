import React, { useContext } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { PageContext, withContext } from "./context";
import { SerializedInput } from "../SerializedInput";
import { InputsOutputs } from "../InputsOutputs";
import { Globals } from "../Globals";
import { Col } from "react-bootstrap";
import { Psbt } from "../Psbt";

export const Page = withContext(() => {
  const { psbt } = useContext(PageContext);
  return (
    <Container>
      <Row>
        <h2>Bitcoin PSBTv2 Explorer</h2>
      </Row>
      <SerializedInput />
      <br />
      <Psbt />
      <br />
      <Globals />
      <br />
      <Row>
        <Col>
          <InputsOutputs
            direction="input"
            count={psbt.PSBT_GLOBAL_INPUT_COUNT}
          />
        </Col>
        <Col>
          <InputsOutputs
            direction="output"
            count={psbt.PSBT_GLOBAL_OUTPUT_COUNT}
          />
        </Col>
      </Row>
    </Container>
  );
});
