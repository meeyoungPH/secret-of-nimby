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
    neighborhoodBoundaries()
    // crimePoints("ASSAULT")
}

// TODO: select dropdown menu format that displays the selected value
// TODO: sort values in dropdown menus - sort in pandas

// populate dropdown menus
function populateDropdowns() {
    
    // neighborhood dropdown menu
    neighborhood_data.then((d) => {
        let results = d.features
        // console.log(results);

        // save neighborhood names and code to array and sort
        let options = [...new Set(results.map(d => [d.properties.A, d.properties.STATISTICA]))];
        options.sort(d3.ascending);

        // create dropdown elements
        d3.select('#neighborhood')
            .selectAll('option')
                .data(options)
            .enter()
                .append('option')
                .text(d => d[0])
                .attr('class','dd_options')
                .attr('value', d => d[1]);
    });

    // crime dropdown menu
    crime_data.then((d) => {
        let results = d.features;
        // console.log(results);

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
        console.log(results);

        // save station name and neighborhood code to array and sort
        let options = [...new Set(results.map(d => d.properties.STATION))];
        options.sort(d3.ascending);

        // create dropdown elements
        d3.select('#martaStation')
            .selectAll('option')
                .data(options)
            .enter()
                .append('option')
                .text(d => d)
                .attr('class','dd_options')
                .attr('value', d => d);
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
    // center: [33.76299464274702, -84.42307142385204],
    center: [33.80642799242456, -84.41307142385204],
    zoom: 11,
    layers: [street, neighborhoodLayer, stationLayer]
});

L.control.layers(baseMap, overlayMaps, {
    collapsed: false
}).addTo(myMap);

function stationPoints(station) {
    d3.json(station_path).then(d => {
        let results = d.features
        // console.log(results);
        
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
    })
}

function neighborhoodBoundaries(neighborhood) {
    d3.json(neighborhood_path).then(d => {
        L.geoJSON(d, {
            color: "darkgreen",
            opacity: 1,
            weight: 2
        }).addTo(neighborhoodLayer);
    })
}

function crimePoints(crimeType){
    // d3.json(crime_path).then(d => {
    //     console.log(d.features)

    //     // function to population popup for each feature
    //     function onEachFeature(feature, layer) {
    //         let results = feature.properties;

    //         layer.bindPopup(
    //             `<h3>${results.crime_type}</h3>
    //             <hr>
    //             <p>Closet MARTA rail station: ${results.closest_station}</p>
    //             <p>Distance away from closest MARTA rail station: ${results.distance_away} km</p>
    //             <p>latitude: ${feature.geometry.coordinates[0].toFixed(6)}, longitude: ${feature.geometry.coordinates[1].toFixed(6)}</p>`);
    //     };

    //     L.geoJSON(d, {
    //         onEachFeature: onEachFeature
    //     }).addTo(crimeLayer);
    // })
}


init()

