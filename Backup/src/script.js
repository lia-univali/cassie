// Wrap our code in a self-executing anonymous function to isolate scope.
(function() {

  // The client ID from the Google Developers Console.
  var CLIENT_ID = '1084163887653-k8eaa79dehj1if3i1r7o6843ejkgorth.apps.googleusercontent.com';

  // Our Google map.
  var map;

  // Runs a simple EE analysis and output the results to the web page.
  var runAnalysis = function() {
    ee.initialize();    

    var geometry = ee.Geometry.Polygon(
        [[[-48.61175537109375, -27.358351545806755],
          [-48.624114990234375, -27.465632021850677],
          [-48.794403076171875, -27.891280573912386],
          [-48.297271728515625, -27.902203909304404],
          [-48.198394775390625, -27.360790894864397],
          [-48.41949462890625, -27.352252938063835]]]);

    var paramsMed = {"opacity":1,"bands":["B4_median","B3_median","B2_median"],"min":128,"max":3000,"gamma":1};
    var sentinel = ee.ImageCollection("COPERNICUS/S2");
    var image = sentinel
	.filterBounds(geometry)
	.sort("CLOUDY_PIXEL_PERCENTAGE")
	.limit(30)
	.sort("MEAN_SOLAR_ZENITH_ANGLE", true)
	.reduce(ee.Reducer.median());

    sentinel.filterBounds(geometry).evaluate(console.log);
    image.evaluate(console.log);

    var mapId = image.getMap(paramsMed);

    var overlay = new ee.MapLayerOverlay(
        'https://earthengine.googleapis.com/map',
        mapId.mapid, mapId.token, {});

    // Show a count of the number of map tiles remaining.
    overlay.addTileCallback(function(event) {
      $('.tiles-loading').text(event.count + ' tiles remaining.');
      if (event.count === 0) {
        $('.tiles-loading').empty();
      }
    });

    // Show the EE map on the Google Map.
    map.overlayMapTypes.push(overlay);

    geometry.centroid().coordinates().evaluate(function(c) {
        map.setCenter({lat: c[1], lng: c[0]});
    });
  };



  $(document).ready(function() {
    // Create the base Google Map.
    map = new google.maps.Map($('.map').get(0), {
      center: { lat: -34.397, lng: 150.644},
      zoom: 10
    });

    // Shows a button prompting the user to log in.
    var onImmediateFailed = function() {
      $('.g-sign-in').removeClass('hidden');
      $('.output').text('(Log in to see the result.)');
      $('.g-sign-in .button').click(function() {
        ee.data.authenticateViaPopup(function() {
          // If the login succeeds, hide the login button and run the analysis.
          $('.g-sign-in').addClass('hidden');
          runAnalysis();
        });
      });
    };

    // Attempt to authenticate using existing credentials.
    ee.data.authenticate(CLIENT_ID, runAnalysis, null, null, onImmediateFailed);
  });
})();
