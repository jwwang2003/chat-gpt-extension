/// <reference types="chrome" />
// background.js

// communication between the service-worker (this) and content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // return all the cookies in the current tab
  switch(request.action) {
    case "getCookies":
      {
        // Assuming you already have the current tab's URL or domain
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0].url) {
            const url = new URL(tabs[0].url);
            const domain = url.hostname;

            chrome.cookies.getAll({ domain }, (cookies) => {
              sendResponse({ cookies });
            });
          }
        });

        return true; // Indicates you wish to send a response asynchronously
        // break;
      }
    
    // 
    case "fetchData":
      {
        const apiUrl = request.apiUrl;
        const method = request.method;
        const headers = request.headers;

        handleFetch(apiUrl, method, headers).then(data => {
          sendResponse({status: "success", data: data});
        }).catch(error => {
          sendResponse({status: "error", message: error.message});
        });
        return true; // Indicates an asynchronous response is expected
        // break;
      }
    default:
      break;
  }
});

async function handleFetch(apiUrl: string, method: string, headers: HeadersInit | undefined) {
  try {
    const response = await fetch(apiUrl, {
      method,
      credentials: 'include',
      headers
    });
    const data = await response.json();
    return data;
  } catch(error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
}

// Function to make an API call
async function makeApiCall(apiUrl: string) {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET', // or 'POST', depending on your API
      credentials: 'include', // Ensures cookies are sent with the request
      headers: {
        // Optionally set other headers
        'Content-Type': 'application/json',
        'credentials': "same-origin",
      },
    });
    const data = await response.json();
    console.log(data);
    return data; // Return the data for further processing
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Rethrow the error if you want to handle it in the caller
  }
}

chrome.commands.onCommand.addListener((command) => {
  if(command === "toggle-sidebar") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0]!.id!, {action: "toggle-sidebar"});
    });
  }
  makeApiCall("https://chat.openai.com/backend-api/conversations?offset=28&limit=28&order=updated");
});