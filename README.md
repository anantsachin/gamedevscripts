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
 
 
process_assets.jsx
----------

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

* there are two bogus exported layers -- root_width and root_height, which describe the document size
* Layers starting with "guide" are ignored
* I assume we're working at retina scale and want to also export at half size (and use coordinates from the half-sized version)
* Layers are exported using their layer name
* If any groups are hidden, the whole thing goes bananas. (TODO: toggle all groups to visible before starting the rest of the processing)
* Images are exported with X and Y coordinates in metadata.txt
* Any spaces in the layer names are converted to underscores.
* On the import side, I assume that layers prefixed with btn are assumed to be paired in the format: "btn buttonname up" and "btn buttonname down" and convert them into buttons automagically. The export script doesn't care about this feature, though (it sees them as normal images)
* By default, text layers are exported as PNGs just like any other layer... if you name the layer "text layername", the metadata will also contain the font, font-size, and font-color. your importer can use this to set up text fields automagically.

This script can be further customized by creating a text layer named "options" which has a key:value pair on each line. Supported options are:

* coordinates:half|full
* export_full_size:true|false
* export_half_size:true
* full_size_postfix:(any string, i.e. @2x or _retina or _large)
* half_size_postfix:(any string, i.e. empty string or _small or _nonretina)
* origin:center|top_left|bottom_left
* anchor:center|top_left|bottom_left
* delimeter:(any string, i.e. | or || or + or !-!)
* item_delimeter:(any string, i.e. | or || or + or !-!)
* integers:true|false
* size_to_layer:true|false


Sample Configs
-----------------
For iPhone (y-negative, origin top left, effective resolution of half the retina size)

* coordinates:half
* export_full_size:true
* export_half_size:true
* full_size_postfix:@2x
* half_size_postfix:
* origin:top_left
* anchor:top_left
* delimeter:|
* item_delimeter:||
* integers:false
* size_to_layer:false

For Unity/Futile desktop app (only one resolution, full-size coordinates, y-positive, origin center, anchors center). The C# string split expects a char, so we also switch to a single-character item delimeter.

* coordinates:full
* export_full_size:true
* export_half_size:false
* full_size_postfix:
* half_size_postfix:
* origin:center
* anchor:center
* delimeter:|
* item_delimeter:+
* integers:true
* size_to_layer:true

To export a set of overlapping sprites that all need to maintain their resolution (i.e. a character with helmets/armor pieces that line up perfectly):

* coordinates:full
* export_full_size:true
* export_half_size:false
* full_size_postfix:
* half_size_postfix:
* origin:center
* anchor:center
* delimeter:|
* item_delimeter:+
* integers:true
* size_to_layer:false


NOTE: my system is pretty similar to what Photoshop just unveiled in CC (Generator), only mine is more cumbersome (you have to manually export). They also do a lot of clever stuff with layer names (only layers named *.png or *.jpg or whatever get exported) that might be worth following.
