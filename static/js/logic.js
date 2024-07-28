// Define the url for the GeoJSON earthquake data
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Create the map
var myMap = L.map("map", {
    center: [37, -95],
    zoom: 6
});

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//colors for depth
function getColor(depth){
    if (depth > 90){
        return 'red';
    }
    else if (depth > 70){
        return 'orangered';
    }
    else if (depth > 50){
        return 'orange';
    }
    else if (depth > 30){
        return 'gold';
    }
    else if (depth > 10){
        return 'yellowgreen';
    }
    else if (depth <= 10){
        return 'limegreen';
    }
}


// Establish magnitude size
function getRadius(magn) {
    return magn * 2;
}


// Retrieve and add the earthquake data to the map
d3.json(url).then(data => {

    for (let i=0; i < data.features.length; i++){
        let coord = data.features[i].geometry.coordinates;

        let lon = coord[0];
        let lat = coord[1];
        let depth = coord[2];

        let prop = data.features[i].properties;
        let magn = prop.mag;
        let place = prop.place;

        L.circleMarker([lat, lon],{
            radius: getRadius(magn),
            fillColor: getColor(depth),
            weight: 0.5,
            opacity: 1,
            fillOpacity: 0.7 
        }).bindPopup(`<b>Location:</b> ${place}<br><b>Magnitude:</b> ${magn}<br><b>Depth:</b> ${depth} km`).addTo(myMap);
    }
});


// Add the legend with colors to corrolate with depth
let legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var depth = [-10, 10, 30, 50, 70, 90];
    var color = ['limegreen', 'yellowgreen', 'gold', 'orange', 'orangered', 'red'];

    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
        '<i style="background:' + color[i]+ '"></i> ' + depth[i] + 
        (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap)
