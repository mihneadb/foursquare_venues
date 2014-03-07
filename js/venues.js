var map = null;
var geocoder = null;
var markers = [];

var API_URL = "http://localhost:5000/search_fs";

var infoWindowTemplate = Handlebars.compile($("#infowindow-template").html());

function processInput() {
    $('#map-canvas').hide();
    $('#spinner').show();
    $infoDiv.hide();
    hideMarkers();

    var near = $near.val().trim();
    var query = $query.val().trim();

    if (near === '' && query === '') {
        near = $near.attr('placeholder');
        query = $query.attr('placeholder');
    }

    var data = {
        near: near,
        query: query
    };

    $.getJSON(API_URL, data)
        .done(function(data) {
            var venues = data.data;
            var latSum = 0;
            var lngSum = 0;
            venues.forEach(function (v) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(v.location.lat, v.location.lng),
                    title: v.name,
                    map: map
                });
                latSum += v.location.lat;
                lngSum += v.location.lng;
                markers.push(marker);

                var infoWindow = new google.maps.InfoWindow({
                    content: infoWindowTemplate(v)
                });
                google.maps.event.addListener(marker, 'click', function() {
                    infoWindow.open(map, marker);
                });
            });
            var lat = latSum / venues.length;
            var lng = lngSum / venues.length;
            $('#info-msg').text("Click the markers for more info.");
            if (!venues || venues.length === 0) {
                $('#info-msg').text("No data found. Please try a different query.");
            } else {
                centerMap(lat, lng);
            }
            $infoDiv.show();
            $('#spinner').hide();
            $('#map-canvas').show();
        });
}

function hideMarkers() {
    for (var i = 0; i < markers.length; ++i) {
        markers[i].setMap(null);
    }
}

function centerMap(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    map.setCenter(latlng);
}

function initialize() {
    var mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(52.37766, 4.91419)
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
                              mapOptions);

}

function submitOnEnter(e) {
    if (e.which == 13) { // enter
        processInput();
    }
}

google.maps.event.addDomListener(window, 'load', initialize);

var $near = $('#near');
var $query = $('#query');
var $submit = $('#submit');
var $infoDiv = $('#info-div');

$submit.click(processInput);
$near.on('keydown', submitOnEnter);
$query.on('keydown', submitOnEnter);

