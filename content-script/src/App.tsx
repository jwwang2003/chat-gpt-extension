/// <reference types="chrome" />

import React from "react";
import "./App.css";
import Sidebar from "./Sidebar";

function App() {
  return (
    <>
      {/* The actual content and logic lays here */}
      <Sidebar />

      {/* Boilerplate */}
      {/* <div className="App">
        <header className="App-header">
          <Logo className="App-logo" id="App-logo" title="React logo" />
          <p>Hello, World!</p>
          <p>I'm a Chrome Extension Content Script and this is a change!</p>
        </header>
      </div> */}
    </>
    
  );
}

export default App;
