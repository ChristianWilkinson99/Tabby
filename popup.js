//Tabby Functions

    const ToSaveID = document.querySelector('#ToSaveID');
    const ToLoadID = document.querySelector('#ToLoadID');
	    ToSaveID.addEventListener('click', ToSave);
		ToLoadID.addEventListener('click', ToLoad);


	function ToSave(){
		document.getElementById(toLoadListID).style.display = 'none';
		document.getElementById(toSaveListID).style.display = 'block';
		}
	
		function ToLoad(save, load) {
		document.getElementById(toSaveListID).style.display = 'none';
		document.getElementById(toLoadListID).style.display = 'block';
		}
	
