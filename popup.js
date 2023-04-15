// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//
    // You may obtain a copy of the License at
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

let myTabGroups = [];
let currentTabs = [];

class tabGroup
{
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

function loadGroup(sessionNumber) {
	console.log("group loaded");
	console.log(sessionNumber);
    for (i in myTabGroups[sessionNumber]) {
		console.log("calling loadTabFromGroup");
        loadTabFromGroup(sessionNumber, i);
    }
}

function restore() {
    chrome.storage.sync.get("myTabGroups", values => {
        if (!chrome.runtime.error) {
            console.log("restoring everything:");
            console.log(values);
            // myTabGroups = values;
            console.log(myTabGroups);
        }
    });
}

// Looks at all the checked tabs in list, and saves them in a "tabGroup" object in the "myTabGroups" list
function saveSelectedTabs()
{
  console.log("saveSelectedTabs");
  var ts = new Date();
  var tg = new tabGroup(ts); 
  var ul = document.getElementById('tabsToSaveList');
  var items = ul.getElementsByTagName("li");
  console.log(items);
  for(var i=0; items[i]; ++i)
  {
      if(items[i].childNodes[1].checked == true)
      {
          console.log("saving "+currentTabs[i].title);
          tg.addTab(currentTabs[i]);
      }
  }
    myTabGroups.push(tg);
    console.log(myTabGroups);
    storeUpdatedTabGroups();
	
}

const groupAllBtn = document.getElementById("groupAllbtn");
groupAllbtn.addEventListener("click", saveAllTabs);

function saveAllTabs()
{
  console.log("saveAllTabs");
  var ts = new Date();
  var tg = new tabGroup(ts); 
  for(tab of currentTabs)
  {
          console.log(tab.title);
          tg.addTab(tab);
  }
    myTabGroups.push(tg);
    console.log(myTabGroups);
    storeUpdatedTabGroups();
}


function changeGroupName(sessionNumber, newName) {
    myTabGroups[sessionNumber].setName(newName);
}

function loadTabFromGroup(sessionNumber, tabIndex) {
	console.log("opening tab");
	console.log(myTabGroups[sessionNumber].tabList[tabIndex]);
    window.open(myTabGroups[sessionNumber].tabList[tabIndex]);
}




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

const testButton = document.getElementById("testBtn");
testButton.addEventListener("click", showTabsToLoad);

function showTabsToLoad()
{
  console.log("showTabsToLoad called");
  
  // Get the tabsToLoadList unordered list
  const tabsToLoadList = document.getElementById("tabsToLoadList");
  tabsToLoadList.innerText = "";

  // Loop through each list item in the tabsToLoadList
  for (group of myTabGroups) 
  {
    //put in group title
    //add an onclick listener to the group title
    const groupLi = document.createElement("li");
    groupLi.innerText = group.name;
    groupLi.addEventListener("click", loadGroup); //LoadSelectedGroup is not yet a created function
    /* groupLi.addEventListener("click", function()
    {
        console.log("group clicked");
		for(tabs of group.tab)
		{
			window.open(tabs, "_blank");
		}
    }
    ) */
    
	
    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.addEventListener("click", changeGroupName); 
    tabsToLoadList.appendChild(editBtn);
    
    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    //editBtn.addEventListener("click", DeleteGroup); //DeleteGroup is not yet an existing function
    tabsToLoadList.appendChild(deleteBtn);
	
	let showBtn = document.createElement("button");
    showBtn.innerText = "Show Tabs";
    showBtn.addEventListener("click", function()
	{
		let x = document.getElementById("tabLi");
			if (x.style.display === "none") {
			  x.style.display = "block";
			} else {
			  x.style.display = "none";
			}
		/*
		let x = document.getElementsByClassName("loadList");
		  Array.from(x).forEach((x) => {
			if (x.style.display === "none") {
			  x.style.display = "block";
			} else {
			  x.style.display = "none";
			}
		  })
		 */
	});
    tabsToLoadList.appendChild(showBtn);
	

    tabsToLoadList.appendChild(groupLi);
    let groupUl = document.createElement("ul");

    for(tab of group.tabList)
    {
        console.log(tab);
        // go inside of the group list, and add titles for tab
        // add a checkbox
        let tabLi = document.createElement("li");
        let tabInp = document.createElement("input");
        tabInp.type = 'checkbox';
        tabLi.innerText = tab.title;
		tabLi.classList.add("loadList");
        tabLi.appendChild(tabInp);
        groupUl.appendChild(tabLi);
        
    }

    // Finally add the group
    groupLi.appendChild(groupUl)
  }
    
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

