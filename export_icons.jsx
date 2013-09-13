function saveImage(size)
{
	var document_name = app.activeDocument.name.replace(/\.[^\.]+$/, ''); 
	var extension = decodeURI(app.activeDocument.name).replace(/^.*\./,''); 
	// if(extension.toLowerCase() != 'psd') return; 
	
	var path = app.activeDocument.path; 
	var short_name = app.activeDocument.name.split(".")[0];
	var saveFile = File(path + "/" + short_name + "_" + size ); 
	if(saveFile.exists) saveFile.remove(); 
	savePNG(saveFile); 
}

function savePNG(saveFile){ 
    pngSaveOptions = new PNGSaveOptions(); 
	activeDocument.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE); 
}

function main()
{
	app.preferences.rulerUnits = Units.PIXELS;
	
	var icon_sizes = [1024,512,256,152,144,128,120,114,76,72,57];
	for(var i=0; i < icon_sizes.length; i++)
	{
	    var resize = app.activeDocument.resizeImage(icon_sizes[i],icon_sizes[i]);
		saveImage(icon_sizes[i]);
	}
	
	//undo a lot
	var docRef = app.activeDocument
	docRef.activeHistoryState = docRef.historyStates[docRef.historyStates.length-icon_sizes.length];
	alert("Process complete");
}

main();


