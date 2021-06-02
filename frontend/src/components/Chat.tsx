import { useEffect, useState, createRef, useContext } from "react";
import { subject, subscribe } from "./../socket";
import { MESSAGE_HANDLER } from "./../utiliy/constants";
import Picker from "emoji-picker-react";
import "antd/dist/antd.css";
import { Input, Switch } from "antd";
import styled, { ThemeProvider } from "styled-components";
import {
  SendOutlined,
  SmileTwoTone,
  BgColorsOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import useThemeToggle from "./../hooks/useThemeToggle";
import "./../App.css";
import { ThemeContext } from "./../App";
import { SketchPicker } from "react-color";

const { TextArea } = Input;

export interface Message {
  id: string;
  message: string;
  userName: string | null;
}

interface Emoji {
  activeSkinTone: string | undefined;
  emoji: string;
  names: string[];
  originalUnified: string;
  unified: string;
}

function Chat() {
  const [msg, msgHandler] = useState("");
  const [showEmojiPicker, setEmojiPickerVisibility] = useState(false);
  const [showColorPicker, setColorPickerVisibility] = useState(false);
  const [isDark, themeToggler] = useThemeToggle();
  const [color, setColor] = useState("");
  const themeValue = useContext(ThemeContext);

  const [messages, pushMessage] = useState<Message[]>([
    {
      userName: null,
      message: "Welcome to the chat. Your messages will appear here.",
      id: uuidv4(),
    },
  ]);

  const messagesEndRef = createRef<HTMLDivElement>();

  function scrollToBottom() {
    //Scrolls user to end of chat message window
    if (messagesEndRef && messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    subscribe((msg: Message) => {
      pushMessage((prevState: Message[]) => [...prevState, msg]);
    });
  }, []);

  const onEmojiClick = (_event: any, emojiObject: Emoji) => {
    msgHandler((prevState) => `${prevState} ${emojiObject.emoji}`);
    setEmojiPickerVisibility((prevState) => !prevState);
  };

  const onChangeHandler = (e: any) => {
    msgHandler(e.target.value);
  };

  const sendMessage = () => {
    subject.next({
      action: MESSAGE_HANDLER,
      message: msg,
      userName: sessionStorage.getItem("userName"),
    });
    msgHandler((_msg) => "");
  };

  const handleEmojiPicker = () => {
    setEmojiPickerVisibility((prevState) => !prevState);
  };

  const handleColorPicker = () => {
    setColorPickerVisibility((prevState) => !prevState);
  };

  const handleChangeComplete = (color: any) => {
    setColor(color.hex);
    handleColorPicker();
  };

  const messagesJsx = () =>
    messages.map((msg) => {
      if (!msg.userName) {
        return (
          <GeneralMessage key={msg.id}>
            <MessageContainer theme={{ isDark, themeValue, color }}>
              <MessageContent>{msg.message}</MessageContent>
            </MessageContainer>
          </GeneralMessage>
        );
      } else if (msg.userName === sessionStorage.getItem("userName")) {
        return (
          <SenderMessage key={msg.id}>
            <MessageContainer theme={{ isDark, themeValue, color }}>
              <MessageContent>{msg.message}</MessageContent>
              <Sender>{msg.userName}</Sender>
            </MessageContainer>
          </SenderMessage>
        );
      } else {
        return (
          <RecieverMessage key={msg.id}>
            <MessageContainer theme={{ isDark, themeValue, color }}>
              <MessageContent>{msg.message}</MessageContent>
              <Sender>{msg.userName}</Sender>
            </MessageContainer>
          </RecieverMessage>
        );
      }
    });

  return (
    <div>
      <Container>
        <ThemeToggler>
          <SpanText>Select Mode: </SpanText>
          <Switch onChange={themeToggler} style={{ marginLeft: 30 }} />
        </ThemeToggler>
        <ChatArea ref={messagesEndRef}>{messagesJsx()}</ChatArea>
        <TextArea
          rows={4}
          onChange={onChangeHandler}
          value={msg}
          style={{ borderBottom: 0 }}
        />
        <ActionContainer>
          <SmileTwoTone onClick={handleEmojiPicker} style={{ padding: 10 }} />
          <BgColorsOutlined
            onClick={handleColorPicker}
            style={{
              padding: 10,
              fontSize: 20,
            }}
          />
          <SendOutlined onClick={sendMessage} style={{ padding: 10 }} />
        </ActionContainer>
        {showEmojiPicker && <Picker onEmojiClick={onEmojiClick} />}
        {showColorPicker && (
          <SketchPicker onChangeComplete={handleChangeComplete} />
        )}
      </Container>
    </div>
  );
}

export default Chat;

const ActionContainer = styled.div`
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
`;

const Container = styled.div`
  box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.15);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
`;

const ChatArea = styled.div`
  border-top: 1px solid gray;
  border-left: 1px solid gray;
  border-right: 1px solid gray;
  font: 16px/1.3 sans-serif;
  height: 300px;
  margin: 0 auto;
  padding: 8px;
  overflow: auto;
`;

const SenderMessage = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 20px;
`;
const RecieverMessage = styled.div`
  display: flex;
  justify-content: flex-start;
  margin: 20px;
`;
const GeneralMessage = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px;
`;
const MessageContainer = styled.div`
  box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.15);
  background: #eee;
  border-radius: 8px;
  background-color: ${({ theme: { isDark, themeValue, color } }) => {
    if (isDark) {
      return themeValue.dark.background;
    } else if (color) {
      return color;
    }
  }};
  color: ${({ theme: { isDark, themeValue } }) =>
    isDark ? themeValue.dark.foreground : null};
  padding: 8px;
  margin: 2px 8px 2px 0;
`;

const MessageContent = styled.p`
  font-weight: 25px;
  padding: 0px 7px;
`;

const Sender = styled.span`
  padding: 0px 7px;
  font-size: 12px;
`;

const ThemeToggler = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 10px 40px;
`;

const SpanText = styled.span`
  font-size: 17px;
`;
