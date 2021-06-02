import Chat from "./../components/Chat";
import { render, screen, fireEvent } from "@testing-library/react";

//Mock socket so no call is made to server
jest.mock("./../socket");
let wrapper: any;

beforeEach(() => {
  const { container } = render(<Chat />);
  wrapper = container;
});

it("Check Welcome Message", () => {
  const paragraph = screen.getByText(
    "Welcome to the chat. Your messages will appear here."
  );
  expect(paragraph.textContent).toBe(
    "Welcome to the chat. Your messages will appear here."
  );
});

it("Check Welcome Message", () => {
  const input = wrapper.querySelector("textarea");
  const button = wrapper.querySelector(".anticon-send");
  if (input && button) {
    fireEvent.change(input, { target: { value: "test message" } });
    //check value in textarea
    expect(input.value).toBe("test message");
    // Now we will click send button
    fireEvent.click(button);
  }
});

it("Set emoji icone", () => {
  const input = wrapper.querySelector("textarea");
  const button = wrapper.querySelector(".anticon-smile");
  if (input && button) {
    // Click on the emoji button
    fireEvent.click(button);
    // Select smiling emjoi
    const emojiSelector = wrapper.querySelector(".emoji-img");
    //Set text in text area
    fireEvent.change(input, { target: { value: "test message" } });
    //Select emoji icone
    fireEvent.click(emojiSelector);
    //Compare emoji text
    expect(input.value).toBe("test message 😀");
  }
});
