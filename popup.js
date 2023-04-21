var myTabGroups = [];
var currentTabs = [];

class tabGroup {
  name = "unsorted";
  timestamp = 0;
  tabList = [];

  constructor(timestamp, name) {
    this.timestamp = timestamp;
    this.name = name;
  }

  setName(name) {
    this.name = name;
  }

  addTab(tab) {
    this.tabList.push(tab);
  }

  deleteTab(tab) {
    consol.log(tab);
    let i = this.tabList.indexOf(tab);
    if(i !== -1){
      this.tabList.splice(i, 1);
    }
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


function restore() {
 chrome.storage.local.get('myTabGroups', function(data) {
  if (data.myTabGroups) {
    console.log('myTabGroups retrieved from Chrome storage:');
	console.log(data.myTabGroups);
	myTabGroups = data.myTabGroups;
	console.log(myTabGroups);
  } else {
    console.log('myTabGroups not found in Chrome storage');
  }
});
}


function storeUpdatedTabGroups() {
  chrome.storage.local.set({ 'myTabGroups': myTabGroups }, function() {
  console.log('myTabGroups saved to Chrome storage');
});
}


// Looks at all the checked tabs in list, and saves them in a "tabGroup" object in the "myTabGroups" list
function saveSelectedTabs() {
  console.log("saveSelectedTabs");
  let ts = new Date().getTime();
  let n = document.getElementById("groupNameInput").value;
  console.log(n);
  let tg = new tabGroup(ts, n);
  let ul = document.getElementById("tabsToSaveList");
  let items = ul.getElementsByTagName("li");
  for (let i = 0; items[i]; ++i) {
    if (items[i].childNodes[1].checked == true) {
      console.log("saving " + currentTabs[i].title);
      tg.addTab(currentTabs[i]);
    }
  }
  myTabGroups.push(tg);
  storeUpdatedTabGroups();
  showTabsToLoad();
}

const groupAllBtn = document.getElementById("groupAllbtn");
groupAllbtn.addEventListener("click", saveAllTabs);

function saveAllTabs() {
  console.log("saveAllTabs");
  var ts = new Date().getTime();
  let n = document.getElementById("groupNameInput").value;
  var tg = new tabGroup(ts, n);
  for (tab of currentTabs) {
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

function loadTabFromGroup() {

  console.log("opening tab");
    const tabCheckboxes = document.querySelectorAll('.tabCheckbox');
    tabCheckboxes.forEach(tabCheckbox => {
      if (tabCheckbox.checked) {
        const u = tabCheckbox.value;
        chrome.tabs.create({url:u})
      }
    });
}

function loadGroup(group) {
  console.log(group);
  for (t of group.tabList) {
    chrome.tabs.create({ url: t.url });
	console.log(t.url);
  }
}

function deleteGroup(group) {
  const index = myTabGroups.indexOf(group);
  if (index !== -1) {
    console.log("deleted group")
    myTabGroups.splice(index, 1);
    storeUpdatedTabGroups();
    showTabsToLoad();
  }
}


function editGroupName(group, input) {
	const newName = input.value;
	group.name = newName;
	storeUpdatedTabGroups();
	showTabsToLoad();
}


async function showTabsToSave() {
  console.log("creating list of potential tabs to save");
  await getCurrentTabs();
  let list = document.getElementById("tabsToSaveList");

  currentTabs.forEach((i) => {
    console.log(i);
    let li = document.createElement("li");
    let inp = document.createElement("input");
    inp.type = "checkbox";
    li.innerText = i.title;
    li.classList.add("saveList");
    li.appendChild(inp);
    list.appendChild(li);
  });
}


var dropdown = document.getElementById("sortSelect");
dropdown.addEventListener("change", handleDropdownSelection);

function handleDropdownSelection() {
  var dropdown = document.getElementById("sortSelect");
  var selectedValue = dropdown.value;
  
  if (selectedValue === "--Sort By--") {
    console.log("--Sort By--");
  } else if (selectedValue === "Alpha") {
    console.log("Alpha");
	sortTabGroupsByName();
	showTabsToLoad();
  } else if (selectedValue === "Newest") {
    console.log("Newest");
	sortTabGroupsByTimestampNewest();
	showTabsToLoad();
  } else if (selectedValue === "Oldest") {
    console.log("Oldest");
	sortTabGroupsByTimestampOldest();
	showTabsToLoad();
  }
}

function sortTabGroupsByName() {
  myTabGroups.sort(function(a, b) {
	var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  });
}

function sortTabGroupsByTimestampNewest() {
  myTabGroups.sort(function(a, b) {
	console.log(b.timestamp);
	
    return (b.timestamp) - (a.timestamp);
	
  });
}

function sortTabGroupsByTimestampOldest() {
  myTabGroups.sort(function(a, b) {
	console.log(b.timestamp);
	
    return (a.timestamp) - (b.timestamp);
	
  });
}

//just an example and not yet expanded
/*
function searchTabGroupsByName() {
  var searchQuery = document.getElementById("searchin").value.toUpperCase();
  var searchResults = [];

  for (var i = 0; i < myTabGroups.name.length; i++) {
    var groupName = myTabGroups.name[i].toUpperCase();
    if (groupName.includes(searchQuery)) {
      searchResults.push(myTabGroups[i]);
    }
  }
   // Display the search results in the popup window
  // For example, you could display them in a table:
  var tableBody = document.getElementById("searchResultsTableBody");
  tableBody.innerHTML = "";
  for (var j = 0; j < searchResults.length; j++) {
    var row = tableBody.insertRow();
    var nameCell = row.insertCell();
    var urlsCell = row.insertCell();
    nameCell.innerHTML = searchResults[j].name;
    urlsCell.innerHTML = searchResults[j].urls.join(", ");
  }
}
*/
	
	let searchBar = document.getElementById("searchin");
	searchBar.addEventListener("keyup", groupSearch);
	
	function groupSearch() {
	var searchValue = searchBar.value.toLowerCase();
	var filteredGroups = myTabGroups.filter(function(myTabGroups) {
	return myTabGroups.name.toLowerCase().includes(searchValue); });
	//console.log(filteredGroups);
	//console.log(searchValue);
	showTabsToLoad(filteredGroups, searchValue);
	};

	
const showGroups = document.getElementById("tabsilver");
showGroups.addEventListener("click", showTabsToLoad);

function showTabsToLoad(filteredGroups, searchValue) {
  console.log(myTabGroups);
  var look = [];
  look = myTabGroups;

  // Get the tabsToLoadList unordered list
  const tabsToLoadList = document.getElementById("tabsToLoadList");
  // remove old list
  tabsToLoadList.innerHTML = "";

	if (searchValue) {
		look = filteredGroups;
		console.log(filteredGroups);
		console.log(searchValue);
	}
	else {
		look = myTabGroups;
		console.log("searchbar is empty");
	}
  
  // Loop through each list item in the tabsToLoadList
  for (const group of look) {
	
    //console.log(group);
	//console.log(group.timestamp);	
	
    const groupLi = document.createElement("li");

    const groupSpan = document.createElement("span");
    //console.log(group.name);
    groupLabel = document.createElement("label");
    groupLabel.innerText = group.name;
    groupLabel.addEventListener("click", function () {
      loadGroup(group);
    });
    groupSpan.appendChild(groupLabel);

    let groupDropDownBtn = document.createElement("button");
    groupDropDownBtn.setAttribute("class", "arrow-button");
    groupSpan.appendChild(groupDropDownBtn);
	
	  let input = document.createElement("input");
    input.setAttribute("type", "text");
	  input.setAttribute("value", group.name);
	  input.style.display = "none";
    groupSpan.appendChild(input);

    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.id = "editBtn";
    editBtn.addEventListener("click", ()=>{
      //editGroupName(group, input);
      toggleTabDeleteButton(groupUl);
    } );
    editBtn.style.display = "none";
    groupSpan.appendChild(editBtn);
	
	let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.class = "deleteBtn";
    deleteBtn.style.display = "none";
    deleteBtn.addEventListener("click", ()=>{deleteGroup(group)});
    tabsToLoadList.appendChild(deleteBtn);

    groupLi.appendChild(groupSpan);
	
    tabsToLoadList.appendChild(groupLi);
    let groupUl = document.createElement("ul");

    // Hide the dropdown list initially
    groupUl.style.display = "none";

    for (tab of group.tabList) {
      //console.log(tab);
      //console.log("for tabs checklist list is loaded");
      let tabLi = document.createElement("li");
      let delBtn = document.createElement("button");
      delBtn.style.display = "none";
      delBtn.setAttribute("class" ,"deleteTabBtn");
      tabLi.appendChild(delBtn);
      delBtn.addEventListener("click", ()=>{
        console.log(group);
        group.deleteTab(tab);
        storeUpdatedTabGroups();
        showTabsToLoad();
      });
      let tabInp = document.createElement("input");
      tabInp.setAttribute("class", "tabCheckbox");
      tabInp.type = "checkbox";
      tabInp.value = tab.url;
      let tabLabel = document.createElement("label");
      tabLabel.textContent = tab.title;
      tabLabel.insertBefore(tabInp, tabLabel.firstChild);
      tabLi.appendChild(tabLabel);
      groupUl.appendChild(tabLi);

    }

    
    groupDropDownBtn.addEventListener("click", function () {
      //console.log("dropdownclicked");
      // Toggle the visibility of the dropdown list
      if (groupUl.style.display === "none") {
        groupUl.style.display = "block";
        editBtn.style.display = "block";
        deleteBtn.style.display = "block";
		    input.style.display = "block";

      } else {
        groupUl.style.display = "none";
        editBtn.style.display = "none";
        deleteBtn.style.display = "none";
		input.style.display = "none";
      }
    });



    // Finally add the group
    groupLi.appendChild(groupUl);
  }
}

// Extension Starts here

// add an event listener to the load tabs button
const loadTabsBtn = document.getElementById("loadtabsbtn");
loadTabsBtn.addEventListener("click", loadTabFromGroup);

const groupSelectedButton = document.getElementById("groupSelectedbtn");
groupSelectedButton.addEventListener("click", saveSelectedTabs);

document.addEventListener("DOMContentLoaded", function () {
  restore();
  showTabsToSave();
  showTabsToLoad();
});

window.addEventListener("unload", function () {
  // unregisterEvents();
});

function toggleTabDeleteButton(ulElement) {
  let items = ulElement.getElementsByClassName("deleteTabBtn");
  console.log(ulElement);
  for (let i = 0; i < items.length; i++) {
    if (items[i].style.display === 'none') {
      items[i].style.display = 'block';
    } else {
      items[i].style.display = 'none';
    }
  }
}
