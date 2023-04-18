var myTabGroups = [];
var currentTabs = [];

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
    // chrome.storage.sync.set({ "myTabGroups": myTabGroups }, function ()
    // {
    //     console.log("Storing everything for next time");
    //     if (chrome.runtime.error) {
    //         console.log("Runtime error.");
    //     }
    // });
}

function restore() {
    chrome.storage.sync.get("myTabGroups", (values) => {
        if (!chrome.runtime.error) {
            console.log("restoring everything:");
            console.log(values);
            // myTabGroups = values;
            console.log(myTabGroups);
        }
    });
}

// Looks at all the checked tabs in list, and saves them in a "tabGroup" object in the "myTabGroups" list
function saveSelectedTabs() {
    console.log("saveSelectedTabs");
    let ts = new Date();
    let tg = new tabGroup(ts);
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
    var ts = new Date();
    var tg = new tabGroup(ts);
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
            chrome.tabs.create({ url: u })
        }
    });
}


function loadGroup(group) {
    console.log("LoadGroup");
    for (t of group.tabList) {
        chrome.tabs.create({ url: t.url });
    }
}

function DeleteGroup() { }

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

function showTabsToLoad() {
    console.log("showTabsToLoad called");

    // Get the tabsToLoadList unordered list
    const tabsToLoadList = document.getElementById("tabsToLoadList");
    // remove old list
    tabsToLoadList.innerHTML = "";

    // Loop through each list item in the tabsToLoadList
    for (group of myTabGroups) {
        console.log(group);
        const groupLi = document.createElement("li");

        const groupSpan = document.createElement("span");
        console.log(group.name);
        groupLabel = document.createElement("label");
        groupLabel.innerText = group.name;
        groupLabel.addEventListener("click", function () {
            console.log("group clicked");
            loadGroup(group);
            editBtn.style.display = "block";
            deleteBtn.style.display = "block";
        });
        groupSpan.appendChild(groupLabel);

        let groupDropDownBtn = document.createElement("button");
        groupDropDownBtn.setAttribute("class", "arrow-button");
        groupSpan.appendChild(groupDropDownBtn);

        let editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.id = "editBtn";
        editBtn.addEventListener("click", changeGroupName);
        editBtn.style.display = "none";
        groupSpan.appendChild(editBtn);

        groupLi.appendChild(groupSpan);

        let deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.id = "deleteBtn";
        deleteBtn.style.display = "none";
        deleteBtn.addEventListener("click", DeleteGroup); //DeleteGroup is not yet an existing function
        tabsToLoadList.appendChild(deleteBtn);

        tabsToLoadList.appendChild(groupLi);
        let groupUl = document.createElement("ul");

        // Hide the dropdown list initially
        groupUl.style.display = "none";

        for (tab of group.tabList) {
            console.log(tab);
            console.log("for tabs checklist list is loaded");
            let tabLi = document.createElement("li");
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
            console.log("dropdownclicked");
            // Toggle the visibility of the dropdown list
            if (groupUl.style.display === "none") {
                groupUl.style.display = "block";
            } else {
                groupUl.style.display = "none";
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