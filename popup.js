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

let myTabGroups = [];
let currentTabs = [];

class tabGroup {
    name = "unsorted";
    timestamp = 0;
    tabList = [];

    constructor(timestamp) {
        this.timestamp = timestamp;
    }

    setName(name) {
        this.name = name;
    }

    addTab(tab) {
        this.tabList.push(tab);
    }

}

// Saves all the tabs in the current window
async function getCurrentTabs() {
    await chrome.tabs.query({}).then((tabs) => {
        for (const tab of tabs) {
            currentTabs.push(tab);
        }
    });
}

function storeUpdatedTabGroups() {
    chrome.storage.sync.set({ "myTabGroups": myTabGroups }, function () {
        console.log("Storing everything for next time");
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        }
    });
}

function restore() {
    chrome.storage.sync.get("myTabGroups", values => {
        if (!chrome.runtime.error) {
            console.log("restoring everything:");
            console.log(values);
            myTabGroups = values;
            console.log(myTabGroups);
        }
    });
}

// Looks at all the checked tabs in ist, and saves them in a "tabGroup" object in the "myTabGroups" list
function saveSelectedTabs() {
    console.log("Saving selected tabs");
    var ts = new Date();
    var tg = new tabGroup(ts);
    var ul = document.getElementById('tabsToSaveList');
    var items = ul.getElementsByTagName("li");
    console.log(items);
    for (var i = 0; items[i]; ++i) {
        if (items[i].childNodes[1].checked == true) {
            console.log("saving " + currentTabs[i].title);
            tg.addTab(currentTabs[i]);

        }
    }
    myTabGroups.push(tg);
    console.log(myTabGroups);
    storeUpdatedTabGroups();
}


function changeGroupName(sessionNumber, newName) {
    myTabGroups[sessionNumber].setName(newName);
}

function loadTabFromGroup(sessionNumber, tabIndex) {
    window.open(myTabGroups[sessionNumber].tabList[tabIndex]);
}

function loadGroup(sessionNumber) {
    for (i in myTabGroups[sessionNumber]) {
        loadTabFromGroup(sessionNumber, i);
    }
}

//

async function showTabsToSave() {
    console.log("creating list of potential tabs to save");
    await getCurrentTabs();
    let list = document.getElementById("tabsToSaveList");

    currentTabs.forEach((i) => {
        console.log(i);
        let li = document.createElement("li");
        let inp = document.createElement("input");
        inp.type = 'checkbox';
        li.innerText = i.title;
        li.classList.add("saveList");
        li.appendChild(inp);
        list.appendChild(li);
    })

}

// function showTabsToLoad()
// {
//   var ttl = document.getElementById("tabsToLoadList");
//   for (var tg in myTabGroups)
//   {
//     // TODO: generate div for group, and appen
//    ttl.appendChild() 
//     for ( var t in tg)
//     {
//       // TODO: generate tab element
//       // append child to whatever inside of tg
//     }
//   }
// }



// Reports errors to the console
function onError(error) {
    console.error(`Error: ${error}`);
}

// Extension Starts here 


const groupSelectedButton = document.getElementById("groupSelectedbtn");
groupSelectedButton.addEventListener("click", saveSelectedTabs);

document.addEventListener('DOMContentLoaded', function () {

    restore();
    showTabsToSave();

});

window.addEventListener('unload', function () {

    // unregisterEvents();

});