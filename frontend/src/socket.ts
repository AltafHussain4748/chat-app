import { webSocket } from "rxjs/webSocket";
import {Message} from "./components/Chat"
export const subject = webSocket("ws://localhost:8080/");

export const subscribe = (callback: any) => {
  subject.subscribe(
    (msg) => callback(msg), // Called whenever there is a message from the server.
    (err) => callback(err), // Called if at any point WebSocket API signals some kind of error.
  );
};
