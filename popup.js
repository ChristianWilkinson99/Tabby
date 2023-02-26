//Tabby Functions

	document.getElementById("ToSaveID").onclick = function() {
		document.getElementById("toLoadListID").style.display = "none";
		document.getElementById("toSaveListID").style.display = "block";
		document.getElementById("ToSaveID").disabled = true;
		document.getElementById("ToLoadID").disabled = false;
	}
	
	document.getElementById("ToLoadID").onclick = function() {
		document.getElementById("toSaveListID").style.display = "none";
		document.getElementById("toLoadListID").style.display = "block";
		document.getElementById("ToLoadID").disabled = true;
		document.getElementById("ToSaveID").disabled = false;
	}
