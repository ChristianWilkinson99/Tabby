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

var myTabGroups = [];
var currentTabs = [];

class tabGroup
{
  name = "unsorted";
  timestamp = 0;
  tabList = [];

  constructor(timestamp)
  {
    this.timestamp = timestamp;
  }

  setName(name) 
  {
    this.name = name;
  }

  addTab(tab)
  {
    this.tabList.push(tab);
  }

}

// Saves all the tabs in the current window
async function getCurrentTabs() 
{
  chrome.tabs.query({}).then((tabs) =>
  {
    // console.log(tabs);
    for ( var tab of tabs) 
    {
      currentTabs.push(tab);
    }
  });
}

// Looks at all the checked tabs in ist, and saves them in a "tabGroup" object in the "myTabGroups" list
function saveSelectedTabs()
{
  console.log("Saving selected tabs");
  var ts = new Date();
  var tg = new tabGroup(ts);
  var ul = document.getElementsByClassName('tabsToSaveList');
  for(var i=0; ul[i]; ++i)
  {
      if(ul[i].checked)
      {
            // Todo: try/catch error if not a tab.
        
          console.log("checked");
          tg.addTab(ul[i].value);
      }
      myTabGroups.push(tg);
  }
}

// // This stores all the tab groups (both named and timestamped) locally
// function storeUpdatedTabGroups() 
// {
//   console.log("Storing everything for next time")
// }

// // This brings all your old saved groups of tabs from all of history
function restoreGroups()
{
  console.log("Get all od stored groups of tabs");
}


// function changeGroupName(sessionNumber, newName)
// {
//   myTabGroups[sessionNumber].setName(newName);
// }

// function loadGroup(sessionNumber)
// {
//   for (tab in myTabGroups[sessionNumber])
//   {
//     window.open(tab.url);
//   }
// }


async function showTabsToSave()
{
  console.log("creating list of potential tabs to save");
  await getCurrentTabs();
  let list = document.getElementById("tabsToSaveList");
  console.log(currentTabs);
  currentTabs.forEach((i.) =>{
    console.log(i);
    let li = document.createElement("li");
    li.innerText = i.title;
    list.appendChild(li);
  });
  // for ( i of currentTabs)
  // {
  //   console.log(i);
  //   let li = document.createElement("li");
  //   li.innerText = i.title;
  //   list.appendChild(li);
  // }
}

function showTabsToLoad()
{
  var ttl = document.getElementById("tabsToLoadList");
  for (var tg in myTabGroups)
  {
    // TODO: generate div for group, and appen
   ttl.appendChild() 
    for ( var t in tg)
    {
      // TODO: generate tab element
      // append child to whatever inside of tg
    }
  }
}



// Reports errors to the console
function onError(error) {
  console.error(`Error: ${error}`);
}

// Extension Starts here 

// Add event listeners
// On exit (when browser is closed)
var background = chrome.extension.getBackgroundPage();
// we cn set an event listener to do this, since we don't know when the browser will close
// background.addEventListener("unload", storeUpdatedTabGroups(), true);

const groupSelectedButton = document.getElementById("groupSelectedbtn");
groupSelectedButton.addEventListener("click", saveSelectedTabs);

document.addEventListener('DOMContentLoaded',showTabsToSave);

// On start we want to load all old tabs
// restoreTabGroups();

// chrome.tabs.query({}).then(getTabs, onError);





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