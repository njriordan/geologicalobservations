/* 
	Name: Geological Observations Map
	
	Purpose: Constructs a map with various geological observations, displayed using Feature 
			 Services hosted on ArcGIS Online. The addition of a WMS layer from the BGS allows 
			 the observations to be shown within their geological context. The 'GetFeatureInfo'
			 capability of the WMS service is exploited the construct popups with useful 
			 information.
*/

require([
	"esri/map",	
	"esri/config",	
	"esri/layers/WMSLayer",	
	"esri/dijit/LayerList",
	"esri/dijit/Search",
	"esri/dijit/Scalebar",	
	"bgs/BGSObservationLayer",	
	"bgs/WMSInfoWindow",	
	"dojo/parser",
	"dojo/_base/array",			
	"dojo/domReady!"
], function(
	Map, 
	esriConfig,	
	WMSLayer,	
	LayerList,
	Search,
	Scalebar,
	BGSObservationLayer,
	WMSInfoWindow,	
	parser
) {
	parser.parse();
	
	// A proxy is used to allow cross-origin requests.
	esriConfig.defaults.io.proxyUrl = "/proxy/proxy.ashx"
	esriConfig.defaults.io.alwaysUseProxy = false;			
	
	// The map is instantiated. 
	var map = new Map("map", {
		center: [-1.076, 52.874],
		zoom: 15,
		basemap: "osm",
		logo: false
	});
	
	// The observation layers are created. The BGSObservationLayer class extends the FeatureLayer class and takes care of formatting infoWindows
	// differently for each observation type.
	var bgsRocks = new BGSObservationLayer("https://services6.arcgis.com/C0AyqIrekYLazy67/arcgis/rest/services/Observation_Data_OSGB/FeatureServer/0", {
		outFields: ['*'], observationType: 'rock'});
							
	var bgsMeasurements = new BGSObservationLayer("https://services6.arcgis.com/C0AyqIrekYLazy67/arcgis/rest/services/Observation_Data_OSGB/FeatureServer/1", {
		outFields: ['*'], observationType: 'measurement'});
	
	var bgsFossils = new BGSObservationLayer("https://services6.arcgis.com/C0AyqIrekYLazy67/arcgis/rest/services/Observation_Data_OSGB/FeatureServer/2", {
		outFields: ['*'], observationType: 'fossil'});			
	
	var bgsBoreholes = new BGSObservationLayer("https://services6.arcgis.com/C0AyqIrekYLazy67/arcgis/rest/services/Observation_Data_OSGB/FeatureServer/3", {
		outFields: ['*'], observationType: 'borehole'});
	
	// Add a WMS layer from the BGS.
	var wmsLayer = new WMSLayer("https://map.bgs.ac.uk/arcgis/services/BGS_Detailed_Geology/MapServer/WMSServer", {
		id: "WMS Geological Data",
		opacity: 0.7,
		visible: false});
	
	// Popups are added to the WMS layer. The WMSInfoWindow class exploits the WMS GetFeatureInfo capability.
	var wmsPopup = new WMSInfoWindow({map: map, wmsLayer: wmsLayer});
	
	// Show the WMS popup on map click - if no observation popups are open and >0 WMS sublayers are active.
	map.on('click', function(evt){
		if(!map.infoWindow.isShowing && wmsLayer.visibleLayers.length > 0){	
		wmsPopup.showInfoWindow(evt);
		}});		

	// Add layers to the layer list.  
	map.on("layers-add-result", function (evt) {
		var layerList = new LayerList ({
			map: map,
			layers: evt.layers,
			showSubLayers: true,
			showLegend: true
			}, "layerlist");
		layerList.startup();    
		}  							
	);

	// Add the layers to the map.
	map.addLayers([wmsLayer, bgsRocks, bgsMeasurements, bgsFossils, bgsBoreholes]);
	
	// Start a search widget.
	var search = new Search({
		map: map}, 
		"search");
	search.startup();
	
	// Add a scalebar
	var scalebar = new Scalebar({
		map: map,
		scalebarStyle: "ruler",
		scalebarUnit: "metric",
	});
});