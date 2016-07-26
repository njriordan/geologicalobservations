/* 
	Name: WMSInfoWindow
	Purpose: Constructs and displays popups for a BGS WMS service.
*/

define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"esri/request"
], function(
	declare, 
	lang, 
	esriRequest
) {
	return declare(null, {
		
		wmsLayer: null,
		map: null,
		evt: null,

		constructor: function(options) {
			this.wmsLayer = options.wmsLayer;
			this.map = options.map;
			this.requestSucceeded = lang.hitch(this, this.requestSucceeded);
		},
	 
		showInfoWindow: function(evt) {

			// evt: the 'click' event.
			this.evt = evt;

			// Construct the GetFeatureInfo request using map properties.
			var getFeatureInfoRequest = esri.request({
				url: this.wmsLayer.url,
				content: {
					"REQUEST": "GetFeatureInfo",
					"VERSION": this.wmsLayer.version,
					"QUERY_LAYERS": this.wmsLayer.visibleLayers.toString(),
					"CRS": "EPSG:" + this.map.spatialReference.wkid,
					"BBOX": this.map.extent.xmin + "," + this.map.extent.ymin + "," + this.map.extent.xmax + "," + this.map.extent.ymax,
					"WIDTH": this.map.width,
					"HEIGHT": this.map.height,
					"INFO_FORMAT": 'text/xml',
					"X": evt.layerX,
					"Y": evt.layerY
				},
				handleAs: "xml"
			});
			return getFeatureInfoRequest.then(this.requestSucceeded, this.requestFailed);
		},

		requestSucceeded: function(response, io) {
		
			// Retrieve feature info from response.
			var fields = response.getElementsByTagName("FIELDS")[0];
			var name = fields.getAttribute("LEX_RCS_D");
			var maxAge = fields.getAttribute("MAX_TIME_D");
			var minAge = fields.getAttribute("MIN_TIME_D");
			var settingDesc = fields.getAttribute("SETTING_D").toUpperCase();
			var environDesc = fields.getAttribute("ENVIRONMENT_D");
			
			// Construct infoWindow content.
			var content = '<b>' + name + '</b><br /><br />' +
						  '<b>Max Age: </b>' + maxAge + '<br />' +
						  '<b>Min Age: </b>' + minAge + '<br /><br />' +
						  '<b>Depositional Setting: </b>' + settingDesc + '<br /><br />' +
						  environDesc;

			// Set content and display infoWindow.
			this.map.infoWindow.setContent(content);
			this.map.infoWindow.show(this.evt.screenPoint);
		},

		requestFailed: function(error, io) {
			// If request fails write errors to console.
			console.log(error);
		}
	});
    }
);