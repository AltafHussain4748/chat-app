import { createContext } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Chat from "./components/Chat";
import JoinChat from "./components/JoinChat";

const themes = {
  dark: {
    foreground: "white",
    background: "#141414",
  },
};

export const ThemeContext = createContext(themes);

function App() {
  return (
    <ThemeContext.Provider value={themes}>
      <div className="App">
        <Router>
          <div>
            <Switch>
              <Route exact path="/">
                <JoinChat />
              </Route>
              <Route exact path="/chat">
                <Chat />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
