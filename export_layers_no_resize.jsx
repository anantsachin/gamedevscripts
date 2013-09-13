function processAll()
{
	var artLayers = app.activeDocument.artLayers.length;
	for(var i = artLayers-1; i >= 0; i--)  //go in inverse depth order
	{
		processLayer(app.activeDocument.artLayers[i]);
	}
	
	groups = app.activeDocument.layerSets.length;
	for(var i = groups - 1; i >= 0; i--)
	{
		artLayers = app.activeDocument.layerSets[i].artLayers.length;
		for(var j = artLayers-1; j >= 0; j--)
		{
			processLayer(app.activeDocument.layerSets[i].artLayers[j]);
		}
	}
}

function processLayer(layer)
{
    var layerName = layer.name;
	
	if(layerName == "guide") return;
	
	var x = 0;
	var y = 0;
	var n = layer.name.split(" ").join("_");
		
	layer.visible = true;
	
	//SAVE OUT TWO VERSIONS (@2x and Regular)	
	metadata.push(n + "|" + parseInt(x)/2 + "|" + parseInt(y)/2);

	var docRef = app.activeDocument

	var safe_name = layerName.split(" ").join("_");
    saveImage(safe_name + "@2x");

	app.preferences.rulerUnits = Units.PERCENT
    var resize = app.activeDocument.resizeImage( 50,50 );
	saveImage(safe_name);

	//back two steps (resize, trim)
	docRef.activeHistoryState = docRef.historyStates[docRef.historyStates.length-2];

    layer.visible = false;
	app.preferences.rulerUnits = Units.PIXELS;	
}

function saveImage(layerName)
{
	var Name = app.activeDocument.name.replace(/\.[^\.]+$/, ''); 
	var Ext = decodeURI(app.activeDocument.name).replace(/^.*\./,''); 
	if(Ext.toLowerCase() != 'psd') return; 
	var Path = app.activeDocument.path; 
	var short_name = app.activeDocument.name.split(".")[0];
	var saveFile = File(Path + "/" + short_name + "/" + layerName); 
	if(saveFile.exists) saveFile.remove(); 
	SavePNG(saveFile); 
}

function SavePNG(saveFile){ 
    pngSaveOptions = new PNGSaveOptions(); 
	activeDocument.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE); 
}

function setAllVisible(visibility)
{
	var artLayers = app.activeDocument.artLayers.length;
	for(var i = 0; i < artLayers; i++)
	{
		app.activeDocument.artLayers[i].visible = visibility;
	}
	
	groups = app.activeDocument.layerSets.length;
	for(var i = 0; i < groups; i++)
	{
		artLayers = app.activeDocument.layerSets[i].artLayers.length;
		for(var j = 0; j < artLayers; j++)
		{
			app.activeDocument.layerSets[i].artLayers[j].visible = visibility;
		}
	}
}

function setupExportDirectory()
{
	var short_name = app.activeDocument.name.split(".")[0];
	var path = app.activeDocument.path;
	
	var export_folder = new Folder(path + "/" + short_name);
	
	if(export_folder.exists)
	{
		folderDelete(path + "/" + short_name);
	}
	   
	export_folder.create();
}

function folderDelete(topLevel){
	
	var folder = Folder(topLevel);
	var files = folder.getFiles();
	for(var f in files)
	{
		files[f].remove();
	}
	
	folder.remove();
}

var metadata;
function writeMetadata()
{
	var path = app.activeDocument.path; 
	var short_name = app.activeDocument.name.split(".")[0];

	var out = new File(path + "/" + short_name + "/metadata.txt");

	out.open('w');
	for(var i=0; i < metadata.length; i++)
	{
		out.write(metadata[i]);
		if(i < metadata.length - 1)
		{
			out.write("||");
		}
	}
	out.close();	
}


function main()
{
	app.preferences.rulerUnits = Units.PIXELS;
	
	metadata = [];

	setupExportDirectory();
	setAllVisible(false);
	processAll();
	writeMetadata();
	setAllVisible(true);		
	alert("Process complete");
}

main();