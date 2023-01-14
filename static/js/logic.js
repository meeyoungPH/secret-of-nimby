// path to data files
var crime_path = 'data/cobra_merged.geojson'
var neighborhood_path = 'data/City_of_Atlanta_Neighborhood_Statistical_Areas.geojson'
var station_path = 'data/Transit_Rail_stations.geojson'
var neighborhood_stats_path = 'data/Atlanta_Neighborhood_Data_raw.csv'

// save data to variables
var crime_data = d3.json(crime_path).then(d => d);
var neighborhood_data = d3.json(neighborhood_path).then(d => d);
var station_data = d3.json(station_path).then(d => d);
// TODO - create record for overall stats for metro Atlanta (Ryan)
var neighborhood_stats = d3.csv(neighborhood_stats_path).then(d => d)

// initialize webpage
function init(){
    var nCode = "T02"
    var crimeType = "AGG ASSAULT"
    
    populateDropdowns()
    stationPoints()
    neighborhoodBoundaries()
    crimeheatMap(crimeType)
    crimeInfo(nCode)
}
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
        console.log(results)

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

// code for info box below
function crimeInfo(nCode) {
    
    // clear neighborhood name title
    d3.selectAll('#neighborhoodName')
        .selectAll('h6')
        .remove()

    // clear info box
    d3.selectAll('#neighborhoodName, #crimeInfo, #neighborhoodInfo')
        .selectAll('p')
        .remove()
    
        // display neighborhood data
    neighborhood_stats.then(d => {
        let results = d.filter(row => row.GEOID == nCode)[0];

        // add name of neighborhood as title
        d3.select('#neighborhoodName')
            .append('h6')
            .text(results.Details)
            .attr('class', 'text-center panel-title')

        // add crime stats
        crime_data.then(d => {
            let results = d.features.filter(row => row.properties.geoid == nCode);
            let crimeCount = results.length;
            console.log(crimeCount)

            // data for info box
            crime_dict = {
                'Crimes Reported (2022)': crimeCount,
                'Crime per 100,000 Pop.': Math.round(crimeCount / totalPop * 100000)
            }
 
            // add crime stats to DOM
            for (const [key, value] of Object.entries(crime_dict)) {
                // console.log(key, value)
                d3.select('#crimeInfo')
                    .append('p')
                    .text(`${key}: ${value}`)
                    .attr('class', 'info-text')
            };
        });
        
        // currency format settings
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        // data for info box
        var totalPop = results['# Total population 2020']

        info_dict = {
            'Total Population (2020)': totalPop,
            'Median Age (years)': Math.round(results['Median age (years) 2020']*10)/10,
            'Median Household Income': formatter.format(results['Median household income 2020']),
            '% Hispanic, All Races': results['% Hispanic all races 2020']+'%',
            '% Asian or Pacific Islander, NH': results['% Non-Hispanic Asian or Pacific Islander 2020']+'%',
            '% Black, NH': results['% Non-Hispanic Black 2020']+'%',
            '% White, NH': results['% Non-Hispanic White 2020']+'%',
            '% Other Races, NH': results['% Non-Hispanic other race adults 2020']+'%'
        }

        // add neighborhood stats to DOM
        for (const [key, value] of Object.entries(info_dict)) {
            // console.log(key, value)
            d3.select('#neighborhoodInfo')
                .append('p')
                .text(`${key}: ${value}`)
                .attr('class', 'info-text')
        };
    });
};

// code for plots below

//Bar chart
function createBarChart(crimeType) {
    crime_data.then(d => {

            let results = d.features;

            let xArray = ['AGG ASSAULT', 'AUTO THEFT', 'BURGLARY', 'HOMICIDE', 'LARCENY-FROM VEHICLE', 'LARCNEY-NON VEHICLE','ROBBERY'];

            let yArray = [];

        array = [...new Set(results.filter(d => d.properties.neighborhood == neighborhood))]
            xArray = [...new Set(array.map(d => [d.properties.lat, d.properties.long]))];
        
            //for loop through crimes 
        
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

});

};

// Scatterplot
function createScatterPlot(crime, maratastation) {
    crime_data.then(d => {

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
    station_data.then(d => {
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
function neighborhoodBoundaries(nCode) {

    // clear existing data from layer
    neighborhoodLayer.clearLayers();

    // access neighborhood data
    neighborhood_data.then(d => {

        function onEachFeature(feature, layer) {
            layer.bindPopup(`<h5>${feature.properties.A}</h5>`);

            var statistica = feature.properties.STATISTICA;

            statistica == nCode ?   layer.setStyle({color: "yellow"}).bringToFront() :
                                    layer.setStyle({color: "purple"});

                        if (statistica == nCode) {
                myMap.fitBounds(layer.getBounds())
             }                                
        }
        
        L.geoJSON(d, {
            onEachFeature: onEachFeature,
            opacity: 1,
            weight: 2
        }).addTo(neighborhoodLayer);
    })

}
// function to add crime heat map
function crimeheatMap(crimeType){

    // clear existing data from heatmap layer
    crimeHeatLayer.clearLayers();

    crime_data.then(d => {
        
        let results = d.features;
       
        // save data to an array and filter by crime type
        filteredArray = [...new Set(results.filter(d => d.properties.crime_type == crimeType))]
        heatArray = [...new Set(filteredArray.map(d => [d.properties.lat, d.properties.long]))];

        // heatmap
        var heat = L.heatLayer(heatArray, {
            radius: 25, 
            blur: 4,
            minOpacity: 0.1
        }).addTo(crimeHeatLayer);
    });
};

init()

function neighborhoodChanged(nCode){
    // add functions for:
    neighborhoodBoundaries(nCode) // update neighborhood boundaries in map
    crimeInfo(nCode) // update info box
    // update bar chart
    // update scatter plot
}

function crimeTypeChanged(crimeType){
    
    crimeheatMap(crimeType); // update heatmap layer
    // update bar chart
    // update scatter plot
}

// TODO - remove all extraneous datasets

