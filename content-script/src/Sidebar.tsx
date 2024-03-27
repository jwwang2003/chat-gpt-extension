/// <reference types="chrome" />

import React, { useState, useEffect } from "react";
import "./Sidebar.css";

const Sidebar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cookieList, setCookieList] = useState([]);

  useEffect(() => {
    chrome.runtime.sendMessage({ action: "getCookies" }, (response) => {
      // Handle the response containing cookies
      console.log("Cookies from the background script:", response.cookies);
      setCookieList(response.cookies);
    });

    chrome.runtime.sendMessage(
      {
        action: "fetchData",
        apiUrl:
          "https://chat.openai.com/backend-api/conversations?offset=28&limit=28&order=updated", // This should be dynamic as needed
      },
      (response) => {
        console.log(response.status, response.data);
      }
    );

    const handleMessageFromBackground = (request, sender, sendResponse) => {
      if (request.action === "toggle-sidebar") {
        setIsVisible(!isVisible);
      }
    };

    // Add message listener
    chrome.runtime.onMessage.addListener(handleMessageFromBackground);

    // Clean up the listener when the component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessageFromBackground);
    };
  }, [isVisible]);

  return (
    <div className={`sidebar ${isVisible ? "visible" : ""}`}>
      {/* <button className="toggle-button" onClick={() => {
        setIsVisible(!isVisible);
        }}>
        {isVisible ? 'Hide' : 'Show'}
      </button> */}
      <div className="content">
        {/* Sidebar content here */}
        <div className="overflow-hidden [&:has(textarea:focus)]:border-token-border-xheavy [&:has(textarea:focus)]:shadow-[0_2px_6px_rgba(0,0,0,.05)] flex flex-col w-full flex-grow relative border dark:text-white rounded-2xl bg-token-main-surface-primary border-token-border-medium">
          <textarea
            id="prompt-textarea"
            tabIndex="0"
            data-id="516e4d0f-f794-4b55-acd2-c9e038c3847d"
            rows={1}
            placeholder="Search your ChatGPT"
            className="m-0 w-full resize-none border-0 bg-transparent focus:ring-0 focus-visible:ring-0 dark:bg-transparent py-[10px] pr-10 md:py-3.5 md:pr-12 max-h-[25dvh] max-h-52 placeholder-black/50 dark:placeholder-white/50 pl-10 md:pl-[55px]"
          ></textarea>
        </div>

        <div className="min-h-[20px] text-message flex flex-col items-start gap-3 whitespace-pre-wrap break-words [.text-message+&]:mt-5 overflow-x-auto">
        <div className="inside markdown prose w-full break-words dark:prose-invert dark">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
                <th>Domain</th>
                <th>Path</th>
                <th>Secure</th>
              </tr>
            </thead>
            <tbody>
              {cookieList.map((cookie, index) => (
                <tr key={index}>
                  <td>{cookie.name}</td>
                  <td>{cookie.value}</td>
                  <td>{cookie.domain}</td>
                  <td>{cookie.path}</td>
                  <td>{cookie.secure ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
