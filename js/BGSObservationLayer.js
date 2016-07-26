/* 
	Name: BGSObservationLayer
	Purpose: Extends esri/layers/FeatureLayers and creates appropriate popups depending on observation type.
*/

define([
	"dojo/_base/declare",
	"esri/request",
	"esri/InfoTemplate",
	"esri/layers/FeatureLayer"
], function(
	declare, 
	esriRequest,
	InfoTemplate,
	FeatureLayer
) { 
	return declare(FeatureLayer, {

		// Valid values for observationType are: 'measurement', 'rock', 'borehole', 'fossil'.
		observationType: null,

		constructor: function(url, options) {
			this.observationType = options.observationType;
			this.infoTemplate = this.setInfoTemplate();
		},

		setInfoTemplate: function() {

			// Create an infoTemplate
			var infoTemplate = new InfoTemplate();

			// Common infoTemplate content
			infoTemplate.setTitle('Observation ${Name}');

			var content = '<b>Type: </b>${Type_}<br/>' +
						  '<b>Recorded By: </b>${Recorded_by}<br/>' +
						  '<b>Date/Time: </b>${Date_:DateFormat(selector: "date")}  ${Time_}<br/>';

			// infoTemplate content for each observation type.
			switch (this.observationType) {
				case 'borehole':
					content += '<b>Drill Depth: </b>${Drilled_depth__m_}m<br/>' +
							   '<b>Easting: </b>${X}<b> Northing: </b>${Y}';
					break;
				case 'measurement':
					content += '<b>Porosity: </b>${Porosity}<br/>' +
							   '<b>Lat: </b>${Latitude__WGS84_:NumberFormat(places:4)}<b> ' +
							   'Lon: </b>${Longitude__WGS84_:NumberFormat(places:4)}';
					break;
				case 'fossil':
					content += '<b>Species: </b>${Species}<br/>' +
							   '<b>Lat: </b>${Latitude__WGS84_:NumberFormat(places:4)}<b> ' +
							   'Lon: </b>${Longitude__WGS84_:NumberFormat(places:4)}<br/>' +
							   '<br /><img src="images/${Image_}" class="popup-image">';
					break;
				case 'rock':
					content += '<b>Rock Name: </b>${Rock_name}<br/>' +
							   '<b>Easting: </b>${X}<b> Northing: </b>${Y}<br/>' +
							   '<br /><img src="images/${Image_}" class="popup-image">';
			};
			
			// Set infoTemplate content
			infoTemplate.setContent(content);
			return infoTemplate;
		},

	});

    }
);