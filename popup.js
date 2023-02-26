// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// const elements        = new Set();


let timestampedTabMap = new Map();
let namedTabMap       = new Map();

// Saves all the tabs in the current window
function getTabs(tabs) {
  let timestamp = new Date().getTime();
  let session = [];
  for (const tab of tabs) {
    session.push(tab.url);
    console.log(tab.url);
    console.log(timestamp);
  }
  map.set(timestamp, session);
}

// This stores all the tab groups (both named and timestamped) locally
storeUpdatedTabGroups() 
{
  console.log("Storingin everything for next time")
}

// This brings all your old saved groups of tabs from all of history
loadOldTabGroups()
{
  console.log("Get all od stored groups of tabs");
}


// Reports errors to the console
function onError(error) {
  console.error(`Error: ${error}`);
}



// Extension Starts here 

// On start we want to load all old tabs
loadOldTabGroups();

chrome.tabs.query({}).then(getTabs, onError);

// On exit (when browser is closed)
// we cn set an event listener to do this, since we don't know when the browser will close
var background = chrome.extension.getBackgroundPage();

addEventListener("unload", storeUpdatedTabGroups(), true);









// // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator
// const collator = new Intl.Collator();
// _tabs.sort((a, b) => collator.compare(a.title, b.title));

// const template = document.getElementById("li_template");



// for (const tab of tabs) {
//   const element = template.content.firstElementChild.cloneNode(true);

//   const title = tab.title.split("-")[0].trim();
//   const pathname = new URL(tab.url).pathname.slice("/docs".length);

//   element.querySelector(".title").textContent = title;
//   element.querySelector(".pathname").textContent = pathname;
//   element.querySelector("a").addEventListener("click", async () => {
//     // need to focus window as well as the active tab
//     await chrome.tabs.update(tab.id, { active: true });
//     await chrome.windows.update(tab.windowId, { focused: true });
//   });

//   elements.add(element);
// }
// document.querySelector("ul").append(...elements);

// const button = document.querySelector("button");
// button.addEventListener("click", async () => {
//   const tabIds = tabs.map(({ id }) => id);
//   const group = await chrome.tabs.group({ tabIds });
//   await chrome.tabGroups.update(group, { title: "DOCS" });
// });