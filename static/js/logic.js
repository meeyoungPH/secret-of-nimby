// path to data files
var crime_path = 'data/cobra_summary.geojson'
var neighborhood_path = 'data/City_of_Atlanta_Neighborhood_Statistical_Areas.geojson'
var station_path = 'data/Transit_Rail_Stations.csv'

// save data to variables
var crime_data = d3.csv(crime_path).then(d => d);
// put neighborhood data into CSV - add median age and income and overall value for metro atlanta
// also include population numbers by race/ethnicity
var neighborhood_data = d3.json(neighborhood_path).then(d => d);
var station_data = d3.csv(station_path).then(d => d);

// initialize webpage
function init(){
    populateDropdowns()
}

// TODO: select dropdown menu format that displays the selected value
// TODO: sort values in dropdown menus - sort in pandas

// populate dropdown menus
function populateDropdowns() {
    
    // neighborhood dropdown menu
    neighborhood_data.then((d) => {
        let results = d.features
        // console.log(results);

        // create dropdown elements
        results.forEach(row => {
            d3.select('#neighborhood')
                .append('option')
                .text(row.properties.A)
                .attr('class','dd_options')
                .property('value', row.properties.A)
        });
    });

    // crime dropdown menu
    crime_data.then((data) => {
        console.log(data);

        // capture unique crime_type values
        let options = [...new Set(data.map(d => d.crime_type))];

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
        // console.log(d);

        // create dropdown elements
        d.forEach(row => {
            d3.select('#martaStation')
                .append('option')
                .text(row.STATION)
                .attr('class','dd_options')
                .property('value', row.STATION)
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

// var grey = L.tileLayer('https://maps.geoapify.com/v1/tile/toner-grey/{z}/{x}/{y}.png?apiKey={api_key}', {
//     attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
//     maxZoom: 20, id: 'osm-bright', api_key: api_key
// });

// create baseMap object
var baseMap = {
    "Street Map": street
};

// // create overlay object
var overlayMaps = {
//     "MARTA Stations": stations,
//     "Neighborhoods": neighborhoods,
//     "Larceny (non-vehicle)": larcencyNonVehicle,
//     "Larceny (from vehicle)": larcenyVehicle,
//     "Homicide": homicide,
//     "Aggravated Assault": assault,
//     "Burglary": burglary,
//     "Auto-theft": autoTheft,
//     "Robbery": robbery
};

var myMap = L.map("myMap", {
    center: [33.74993616961645, -84.39095005719047],
    zoom: 5,
    layers: [street]
});

// myMap.invalidateSize();

L.control.layers(baseMap, overlayMaps, {
    collapsed: false
}).addTo(myMap);

function crimeMap(neighborhood, crime, station) {
    

}


init()

