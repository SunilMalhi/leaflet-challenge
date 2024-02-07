// get the url for all earthquakes in the past 30 days
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
    // send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeJson) {

  // function to display place and time for each feature in the features array
  function onEachFeature(features, layer){
    layer.bindPopup(`<h3>${features.properties.place}</h3><hr><p>${new Date(features.properties.time)}</p>`);};

    // Create a GeoJSON layer that contains the features array and pointToLayer
    let earthquakes = L.geoJSON(earthquakeJson, {
        onEachFeature: onEachFeature,
        pointToLayer: function(features, coordinates) {
        let magnitude = features.properties.mag;
        let geoMarkers = {
            radius: magnitude * 5,
            fillColor: colors(magnitude),
            fillOpacity: 0.5,
            weight: 0.3
        };
        return L.circleMarker(coordinates, geoMarkers);
    }
    });

  // Send to create maps function
  createMap(earthquakes);
};

// function to color based on magnitude
function colors(magnitude) {

    // variable to hold the color and conditions for magnitude
    let color = "";

    if (magnitude <= 1) {
        return color = "#58cc41";
    }
    else if (magnitude <= 2) {
        return color = "#ede84c";
    }
    else if (magnitude <= 3) {
        return color = "#d6af45";
    }
    else if (magnitude <= 4) {
        return color = "#c47e21";
    }
    else if (magnitude <= 5) {
        return color = "#b34920";
    }
    else {
        return color = "#f50d05";
    }

};

function createMap(earthquakes) {
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

    // Create a baseMaps object.
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers.
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
};