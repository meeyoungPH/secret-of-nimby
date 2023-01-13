// path to data files
var crime_path = 'data/cobra_summary_200.geojson'
var neighborhood_path = 'data/City_of_Atlanta_Neighborhood_Statistical_Areas.geojson'
var station_path = 'data/Transit_Rail_stations.geojson'

// save data to variables
var crime_data = d3.json(crime_path).then(d => d);
var neighborhood_data = d3.json(neighborhood_path).then(d => d);
var station_data = d3.json(station_path).then(d => d);

// initialize webpage
function init(){
    populateDropdowns()
    stationPoints()
    neighborhoodBoundaries()
    crimeheatMap("ASSAULT")
}

// TODO: select dropdown menu format that displays the selected value

// populate dropdown menus
function populateDropdowns() {
    
    // neighborhood dropdown menu
    neighborhood_data.then((d) => {
        let results = d.features

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

//Bar chart
function createBarChart(neighborhood, crimeType) {
    crime_data.then((data) => {

        d3.json(crime_path).then(d => {
            let results = d.features;

        console.log(barchart);
        
        let trace1= {
            x:data(row => row.crime),
            y: data(count),
            type: "bar"
        };

        let tracedata =[trace1];

        let layout = {
            title: "Total Crimes by Crime Type"
        };

        Plotly.newPlot("plot", traceData, layout)
    })
});

};

//Scatterplot
function createScatterPlot(crime, maratastation) {
    crime_data.then((data) => {

        d3.json(crime_path).then (d => {
            let results = d.features;

            console.log(ScatterPlot);

            let trace1= {
                x:data(row => row.closest_station),
                y: data(row => row.distance_away),
                type: "scatter"
        };

        let tracedata =[trace1];

        let layout = {
            title: "Distance of Crime to Marta Station"
        };

        Plotly.newPlot("plot", traceData, layout)
    })
    
    });

};

// code for map below
// base layers
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// create layerGroups
var neighborhoodLayer = L.layerGroup();
var stationLayer = L.layerGroup();
var crimeLayer = L.layerGroup();
var crimeHeatLayer = L.layerGroup();

// create baseMap object
var baseMap = {
    // "Street Map": street
};

// create overlay object
var overlayMaps = {
    "MARTA Stations": stationLayer,
    "Neighborhoods": neighborhoodLayer,
    "Crime Heat Map": crimeHeatLayer
};

var myMap = L.map("myMap", {
    center: [33.80642799242456, -84.41307142385204],
    zoom: 11,
    layers: [street, neighborhoodLayer, stationLayer, crimeHeatLayer]
});

// add layer controls to map
L.control.layers(baseMap, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// function to display MARTA rail station points
function stationPoints(station) {
    d3.json(station_path).then(d => {
        let results = d.features
        
        // function to create popup for each feature
        function onEachFeature(feature, layer) {
            layer.bindPopup(
                `<h3>${feature.properties.STATION} (${feature.properties.Stn_Code})</h3>
                <hr>
                <p>latitude: ${feature.geometry.coordinates[0].toFixed(6)}, longitude: ${feature.geometry.coordinates[1].toFixed(6)}</p>`);
        };

        // add station features to stationLayer
        L.geoJSON(d, {
            onEachFeature: onEachFeature
        }).addTo(stationLayer);
    })
}

// function to display neighborhood boundaries
function neighborhoodBoundaries(neighborhood) {
    d3.json(neighborhood_path).then(d => {
        console.log(d.features)

        // TODO: this is not working - add popup to show neighborhood name*************************
        function onEachFeature(feature, layer) {
            layer.bindPopup(
                `<h3>${feature.properties.A}</h3>`);
        }
        
        L.geoJSON(d, {
            color: "grey",
            opacity: 1,
            weight: 2
        }).addTo(neighborhoodLayer);
    })
}
// function to add crime heat map
function crimeheatMap(crimeType){

    d3.json(crime_path).then(d => {
        let results = d.features;

        let heatArray = [...new Set(results.map(d => [d.properties.lat, d.properties.long]))];

        console.log(heatArray)

        // heatmap
        // https://github.com/Leaflet/Leaflet.heat
        var heat = L.heatLayer(heatArray, {
            radius: 25, 
            blur: 4,
            minOpacity: 0.3
        }).addTo(crimeHeatLayer);
    });
};

init()

