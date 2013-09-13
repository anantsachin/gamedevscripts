Game Dev Scripts
===========
this is a small collection of useful photoshop scripts that I use when developing games (currently using RubyMotion and native iOS views, but they could be adapted to other display trees)

to "install them", check this repo out into /Applications/Adobe Photoshop(your_version)/Presets/Scripts.  You can change any of the built-in scripts' file names to start with a tilde (~) to hide them. You should be able to restart Photoshop and see them in your File->Scripts options.


export\_icons.jsx
----------
given a starting file (presumed to be square, larger than 1024x124), emit a folder called icons and fill it with icons in the format of FILENAME-SQUARESIZE.png
  
    //edit this line to change which icons you want
    var icon_sizes = [1024,512,256,152,144,128,120,114,76,72,57];
    
presuming Icon.psd (or even Icon.png) you get a folder full of files like:

 * Icon-1024.png
 * Icon-512.png
 * Icon-256.png
 * etc...

export\_layers\_no\_resize.jsx
------------
I often use this to export fixed-size assets (like elements or icons or ability icons) that may or may not fill up the bounds, but need to all be the same size in the in-game UI

given a PSD named filename, create a folder ("filename") and export every layer as layername.png into that folder
layers named guide will be ignored

process\_assets.jsx
--------------------
This script is basically a Flash-style (swc) library generator for Photoshop. It exports every layer (except guide layers) and any available metadata for that layer to make it easier to display that graphic in my games. The basic flow is:

* make a giant list of every layer (recursing through groups)
* go through them one by one and
  * record the layer bounds
  * hide all other layers
  * trim all transparent pixels
  * export this layer as filename/layername@2x.png
  * shrink the layer by 50%
  * export again as filename/layername.png

Other considerations:

* Layers named "guide" are ignored
* I assume we're working at retina scale
* Layers are exported using their layer name
* If any groups are hidden, the whole thing goes bananas. (TODO: toggle all groups to visible before starting the rest of the processing)
* Images are exported with X and Y coordinates in metadata.txt
* Any spaces in the layer names are converted to underscores.
* On the import side, I assume that layers prefixed with btn are assumed to be paired in the format: "btn buttonname up" and "btn buttonname down" and convert them into buttons automagically. The export script doesn't care about this feature, though (it sees them as normal images)
* By default, text layers are exported as PNGs just like any other layer... if you name the layer "text layername", the metadata will also contain the font, font-size, and font-color. your importer can use this to set up text fields automagically.