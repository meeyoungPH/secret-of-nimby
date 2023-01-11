// path to data files
var crime_path = 'data/cobra_summary.geojson'
var neighborhood_path = 'data/City_of_Atlanta_Neighborhood_Statistical_Areas.geojson'
var station_path = 'data/Transit_Rail_stations.geojson'

// save data to variables
var crime_data = d3.json(crime_path).then(d => d);
// put neighborhood data into CSV - add median age and income and overall value for metro atlanta
// also include population numbers by race/ethnicity
var neighborhood_data = d3.json(neighborhood_path).then(d => d);
var station_data = d3.json(station_path).then(d => d);

// initialize webpage
function init(){
    populateDropdowns()
    stationPoints()
}

// TODO: select dropdown menu format that displays the selected value
// TODO: sort values in dropdown menus - sort in pandas

// populate dropdown menus
function populateDropdowns() {
    
    // neighborhood dropdown menu
    neighborhood_data.then((d) => {
        let results = d.features
        console.log(results);

        // sort neighborhood names
        let options = [...new Set(results.map(d => d.properties.A))];
        options.sort(d3.ascending);

        // create dropdown elements
        d3.select('#neighborhood')
            .selectAll('option')
                .data(options)
            .enter()
                .append('option')
                .text(d => d)
                .attr('class','dd_options')
                .attr('value', d => d);
    });

    // crime dropdown menu
    crime_data.then((d) => {
        let results = d.features;
        console.log(results);

        // capture unique crime_type values
        let options = [...new Set(results.map(d => d.properties.crime_type))];

        // sort values
        options.sort(d3.ascending)

        // create dropdown elements
        d3.select('#crimeType')
            .selectAll('option')
                .data(options)
            .enter()
                .append('option')
                .text(d => d)
                .attr('class','dd_options')
                .attr('value', d => d);
    });

    // station dropdown menu
    station_data.then((d) => {
        let results = d.features;
        // console.log(results);

        // create dropdown elements
        results.forEach(row => {
            d3.select('#martaStation')
                .append('option')
                .text(row.properties.STATION)
                .attr('class','dd_options')
                .property('value', row.properties.STATION)
        });
    });
};

// FUNCTIONS TODO - change in HTML
function neighborhoodChanged(value){

}

function crimeChanged(value){

}

function stationChanged(value){

}

// code for info box below


// code for plots below


// code for map below

// base layers
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// create layerGroups
var neighborhoodLayer = L.layerGroup();
var stationLayer = L.layerGroup();
var crimeLayer = L.layerGroup();

// create baseMap object
var baseMap = {
    // "Street Map": street
};

// create overlay object
var overlayMaps = {
    "MARTA Stations": stationLayer,
    "Neighborhoods": neighborhoodLayer,
    "Crimes": crimeLayer
//     "Larceny (non-vehicle)": larcencyNonVehicle,
//     "Larceny (from vehicle)": larcenyVehicle,
//     "Homicide": homicide,
//     "Aggravated Assault": assault,
//     "Burglary": burglary,
//     "Auto-theft": autoTheft,
//     "Robbery": robbery
};

var myMap = L.map("myMap", {
    center: [33.76299464274702, -84.42307142385204],
    zoom: 11.5,
    layers: [street, neighborhoodLayer, stationLayer]
});

L.control.layers(baseMap, overlayMaps, {
    collapsed: false
}).addTo(myMap);

function stationPoints(station) {
    d3.json(station_path).then(d => {
        let results = d.features
        console.log(results);
        
        // function to population popup foe each feature
        function onEachFeature(feature, layer) {
            layer.bindPopup(
                `<h3>${feature.properties.STATION} (${feature.properties.Stn_Code})</h3>
                <hr>
                <p>latitude: ${feature.geometry.coordinates[0].toFixed(6)}, longitude: ${feature.geometry.coordinates[1].toFixed(6)}</p>`);
        };

        L.geoJSON(d, {
            onEachFeature: onEachFeature
        }).addTo(stationLayer);

        // show layer on load
        stationLayer.addTo(myMap);
    })
}

function neighborhoodBoundaries(neighborhood) {


}


init()

