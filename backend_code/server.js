const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const constants = require("./constants");
const wss = new WebSocket.Server({ port: 8080 });
wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(payload) {
    handleAction(ws, payload, wss);
  });
});

function handleAction(client, payload, wss) {
  payload = JSON.parse(payload);
  switch (payload.action) {
    case constants.SAVE_USERNAME:
      client.userName = payload.userName;
      client.id = payload.id;
      wss.clients.forEach(function each(singleClient) {
        if (singleClient.readyState === WebSocket.OPEN) {
          singleClient.send(
            buildMessage(`User "${payload.userName}"  has joined chat.`, null)
          );
        }
      });
      break;
    case constants.MESSAGE_HANDLER:
      const msgObj = buildMessage(payload.message, payload.userName);
      wss.clients.forEach(function each(singleClient) {
        if (singleClient.readyState === WebSocket.OPEN) {
          singleClient.send(msgObj);
        }
      });
    default:
      break;
  }
}

function buildMessage(message, userName) {
  return JSON.stringify({
    message,
    userName,
    id: uuidv4(),
  });
}
