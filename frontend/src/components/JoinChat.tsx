import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Input } from "antd";
import styled from "styled-components";
import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { subject, subscribe } from "./../socket";
import { SAVE_USERNAME } from "./../utiliy/constants";

function JoinChat() {
  const history = useHistory();

  const [userName, setuserName] = useState("");
  const inputHandler = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setuserName(e.target.value);
  };

  useEffect(() => {
    sessionStorage.setItem("id", "");
    subscribe(() => {
      if (sessionStorage.getItem("id")) {
        history.push(`chat`);
      }
    });
  }, []);

  function sendMessage() {
    const id = uuidv4();
    sessionStorage.setItem("id", id);
    sessionStorage.setItem("userName", userName);
    subject.next({ action: SAVE_USERNAME, userName, id });
  }
  return (
    <FormContainer>
      <Input
        placeholder="Enter Your Username To Start Chat"
        onChange={inputHandler}
      />
      <Button
        type="primary"
        icon={<ArrowRightOutlined />}
        onClick={sendMessage}
      />
    </FormContainer>
  );
}

export default JoinChat;
const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 200px;
  margin: auto;
`;
