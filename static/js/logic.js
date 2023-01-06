// save data to variables
var crime_data = d3.csv('data/cobra_summary.csv').then(d => d);
// put neighborhood data into CSV - add median age and income and overall value for metro atlanta
// also include population numbers by race/ethnicity
var neighborhood_data = d3.json('data/City_of_Atlanta_Neighborhood_Statistical_Areas.geojson').then(d => d);
var station_data = d3.csv('data/transit_rail_station.csv').then(d => d);

// initialize webpage
function init(){
    populateDropdowns()
}

// TODO: select dropdown menu format that displays the selected value
// TODO: sort values in dropdown menus - below does not work
// var sorted_stations = station_data.sort((a,b) => d3.ascending(a.station, b.station))

// populate dropdown menus
function populateDropdowns() {
    
    // neighborhood dropdown menu
    // TODO: create common neighborhood name columns in each table
    neighborhood_data.then((d) => {
        let results = d.features
        console.log(results);

        // create dropdown elements
        results.forEach(row => {
            d3.select('#neighborhood')
                .append('option')
                .text(row.properties.A)
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
                .attr('value', d => d);
    });

    // station dropdown menu
    station_data.then((d) => {
        console.log(d);

        // create dropdown elements
        d.forEach(row => {
            d3.select('#martaStation')
                .append('option')
                .text(row.station)
                .property('value', row.station)
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

init()

