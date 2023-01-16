// save data to variables
var crime_data = d3.json('api/crime.geojson').then(d => d);
var neighborhood_data = d3.json('/api/neighborhood.geojson').then(d => d);
var station_data = d3.json('/api/stations.geojson').then(d => d);

// initialize webpage
// TODO - add reset map button
function init(){
    var nCode = "T02"
    var crimeType = "AGG ASSAULT"
    
    populateDropdowns()
    stationPoints()
    neighborhoodBoundaries()
    crimeheatMap(crimeType)
    crimeInfo(nCode)
    createBarChart(nCode)
    createRadarChart(nCode)
}
// populate dropdown menus
// OPTIONAL: add search bar for neighborhood dropdown
function populateDropdowns() {
    
    // neighborhood dropdown menu
    neighborhood_data.then((d) => {
        let results = d.features

        // save neighborhood names and code to array and sort
        let options = [...new Set(results.map(d => [d.properties.A, d.properties.STATISTICA]))];
        options = options.filter(d => d[0] != 'Airport')
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
        // console.log(results)

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

// function to add commas to numbers
function addCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// code for info box below
function crimeInfo(nCode) {

    // TODO - create record for overall stats for metro Atlanta (Ryan) in neighborhood table
    
    // clear neighborhood name title
    d3.selectAll('#neighborhoodName')
        .selectAll('h6')
        .remove();

    // clear info box
    d3.selectAll('#neighborhoodName, #crimeInfo, #neighborhoodInfo')
        .selectAll('p')
        .remove();
    
        // display neighborhood data
    d3.json(`/api/neighborhood-info/${nCode}`).then(d => {
        // console.log(d)
        let results = d[0];

        // add name of neighborhood as title
        d3.select('#neighborhoodName')
            .append('h6')
            .text(results.neighborhood)
            .attr('class', 'text-center panel-title')
            .append('hr')

        // data for info box
        var totalPop = results.total_population;
        
        // add crime stats
        crime_data.then(d => {
            let results = d.features.filter(row => row.properties.geoid == nCode);
            let crimeCount = results.length;

            // data for info box
            let crime_dict = {
                'Total Crimes Reported (2022)': addCommas(crimeCount),
                'Crime per 100,000 Pop.': addCommas(Math.round(crimeCount / totalPop * 100000))
            };
 
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

        let info_dict = {
            'Total Population (2020)': addCommas(totalPop),
            'Median Age (years)': Math.round(results.median_age*10)/10,
            'Median Household Income': formatter.format(results.median_household_income),
            '% Hispanic, All Races': results.percent_hispanic +'%',
            '% Asian or Pacific Islander, NH': results.percent_asian_or_pacific_islander +'%',
            '% Black, NH': results.percent_black +'%',
            '% White, NH': results.percent_white +'%',
            '% Other Races, NH': results.percent_other_races +'%'
        };

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

// create bar chart for total number of crimes by crime type (per neighborhood)
function createBarChart(nCode) {

    // clear div of content
    d3.select('#bar')
        .selectAll('div')
        .remove();
    
    // access bar chart data
    d3.json(`/api/crime-type-count/${nCode}`).then(d => {

        // save results to variable
        let results = d[0];

        // initialize arrays
        let crimeType = [];
        let count = [];
        
        // loop through dictionary values and save to arrays
        for (const [key, value] of Object.entries(results)) {

            crimeType.push(key);
            count.push(value);
        };
        
        // parameters for bar chart
        let data = [{
            type: 'bar',
            x: crimeType,
            y: count,
            text: crimeType
        }];

        let layout = {
            title: "Total Crimes by Type"
        };

        // plot bar chart
        Plotly.newPlot('bar', data, layout)
    });
};

// Radar chart
function createRadarChart(nCode) {
    
    // clear div of content
    d3.select('#radar')
        .selectAll('div')
        .remove();

    // access radar chart data
    d3.json(`/api/crime-avg-distance/${nCode}`).then(d => {
        console.log(d.avg_distance);

        // define data and chart type
        let data = [{
            type: 'scatterpolar',
            r: d.avg_distance,
            theta: d.crime_type,
            fill: 'toself'
        }];

        // radar chart parameters
        let layout = {
            title: 'Avg Distance of Crimes from MARTA Rail Station',
            polar: {
                radialaxis: {
                    visible: true,
                    range: [0, 9]
                }
            }
        };

        // plot chart
        Plotly.newPlot('radar', data, layout);
    });
};

// Leaflet map
// base layers
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// create layerGroups
var neighborhoodLayer = L.layerGroup();
var stationLayer = L.layerGroup();
var crimeHeatLayer = L.layerGroup();

// create baseMap object
// TODO add dark mode/map
var baseMap = {
};

// create overlay object
var overlayMaps = {
    "MARTA Stations": stationLayer,
    "Neighborhoods": neighborhoodLayer,
    "Crime Heat Map": crimeHeatLayer
};

// settings for map on load
var myMap = L.map("myMap", {
    center: [33.80642799242456, -84.39307142385204],
    zoom: 11,
    zoomControl: false,
    layers: [street, neighborhoodLayer, stationLayer, crimeHeatLayer]
});

// add layer controls to map
L.control.layers(baseMap, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// add zoom home control
var zoomHome = L.Control.zoomHome();
zoomHome.addTo(myMap);

// function to display MARTA rail station points
function stationPoints() {
    station_data.then(d => {
        
        // function to create popup for each feature
        function onEachFeature(feature, layer) {
            layer.bindPopup(
                `<h4>${feature.properties.STATION} (${feature.properties.Stn_Code})</h4>
                <hr>
                <h5>latitude: ${feature.geometry.coordinates[0].toFixed(6)}, longitude: ${feature.geometry.coordinates[1].toFixed(6)}</h5>`);                
        };

        // function for custom markers
        function pointToLayer(feature, latlng) {
            
            // icon parameters
            let stationIcon = L.icon({
                iconUrl: 'static/img/icons8-m-67-1.png',
                iconSize: [40, 40], // icon original size is 50x50
                iconAnchor: [20, 40],
                popupAnchor: [0, 0]
            });

            let markerOptions = {
                radius: 20,
                icon: stationIcon
            };

            // return feature with icon settings
            return L.marker(latlng, markerOptions);
        };

        // add station features to stationLayer
        L.geoJSON(d, {
            onEachFeature: onEachFeature,
            pointToLayer: pointToLayer
        }).addTo(stationLayer);
    })
}

// function to display neighborhood boundaries
function neighborhoodBoundaries(nCode) {

    // clear existing data from layer
    neighborhoodLayer.clearLayers();

    // access neighborhood data
    neighborhood_data.then(d => {

        // custom colors for neighborhoods based on selection; zoom feature on selected neighborhood
        function onEachFeature(feature, layer) {
            layer.bindPopup(`<h5>${feature.properties.A}</h5>`);

            var statistica = feature.properties.STATISTICA;

            statistica == nCode ?   layer.setStyle({color: "yellow"}).bringToFront() :
                                    layer.setStyle({color: "purple"});

            if (statistica == nCode) {
               myMap.fitBounds(layer.getBounds())
            };
        };
        
        // render boundaries
        L.geoJSON(d, {
            onEachFeature: onEachFeature,
            opacity: 1,
            weight: 2
        }).addTo(neighborhoodLayer);
    }).then(d =>{
        // code for making map clicks interactive - WIP
        // d3.selectAll('.leaflet-interactive')
        //     .selectAll('path')
            // .attr('onclick',)
    })
};

// function to add crime heat map
function crimeheatMap(crimeType){

    // clear existing data from heatmap layer
    crimeHeatLayer.clearLayers();

    // access crime data
    crime_data.then(d => {
        
        let results = d.features;
       
        // save data to an array and filter by crime type
        filteredArray = [...new Set(results.filter(d => d.properties.crime_type == crimeType))]
        heatArray = [...new Set(filteredArray.map(d => [d.properties.lat, d.properties.long]))];

        // heatmap paramters
        var heat = L.heatLayer(heatArray, {
            radius: 25, 
            blur: 4,
            minOpacity: 0.1
        }).addTo(crimeHeatLayer);
    });
};

// apply settings on webpage load
init()

// control for neighborhood dropdown
function neighborhoodChanged(nCode){

    neighborhoodBoundaries(nCode) // update neighborhood boundaries in map
    crimeInfo(nCode) // update info box
    createBarChart(nCode) // update bar chart
    createRadarChart(nCode) // update radar chart
}

// controls for crime type dropdown
function crimeTypeChanged(crimeType){
    crimeheatMap(crimeType); // update heatmap layer
}

// TODO - remove all extraneous datasets

