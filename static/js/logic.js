// save data to variables
var crime_data = d3.json('api/crime.geojson').then(d => d);
var neighborhood_data = d3.json('/api/neighborhood.geojson').then(d => d);
var station_data = d3.json('/api/stations.geojson').then(d => d);

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
        .remove()

    // clear info box
    d3.selectAll('#neighborhoodName, #crimeInfo, #neighborhoodInfo')
        .selectAll('p')
        .remove()
    
        // display neighborhood data
    d3.json(`/api/neighborhood-info/${nCode}`).then(d => {
        // console.log(d)
        let results = d[0];

        // add name of neighborhood as title
        d3.select('#neighborhoodName')
            .append('h6')
            .text(results.neighborhood)
            .attr('class', 'text-center panel-title')

        // data for info box
        var totalPop = results.total_population
        
        // add crime stats
        crime_data.then(d => {
            let results = d.features.filter(row => row.properties.geoid == nCode);
            let crimeCount = results.length;
            console.log(crimeCount)

            // data for info box
            crime_dict = {
                'Crimes Reported (2022)': addCommas(crimeCount),
                'Crime per 100,000 Pop.': addCommas(Math.round(crimeCount / totalPop * 100000))
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

        info_dict = {
            'Total Population (2020)': addCommas(totalPop),
            'Median Age (years)': Math.round(results.median_age*10)/10,
            'Median Household Income': formatter.format(results.median_household_income),
            '% Hispanic, All Races': results.percent_hispanic +'%',
            '% Asian or Pacific Islander, NH': results.percent_asian_or_pacific_islander +'%',
            '% Black, NH': results.percent_black +'%',
            '% White, NH': results.percent_white +'%',
            '% Other Races, NH': results.percent_other_races +'%'
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
function createBarChart(crime_type {
    crime_json.then(d => {

            let results = d.features;

            let y = []

            let x = []

            const crime_json = {};
            
            for (const [key,value] of Object.entries(object1)) {
                console.log('${key}: ${value}');
                }

        array = [...new Set(results.filter(d => d.properties.neighborhood == neighborhood))]
            xArray = [...new Set(array.map(d => [d.properties.lat, d.properties.long]))];
        
        let trace1= {
            x:[],
            y: [],
            type: "bar"
        };

        let data =[trace1];

        let layout = {
            title: "Total Crimes by Crime Type"
        };

        Plotly.newPlot("plot", data, layout)

    });

})

// Radar chart


// Leaflet map

// base layers
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// create layerGroups
var neighborhoodLayer = L.layerGroup();
var stationLayer = L.layerGroup();
// var crimeLayer = L.layerGroup();
var crimeHeatLayer = L.layerGroup();

// create baseMap object
// TODO add dark mode/map
var baseMap = {
    // "Street Map": street
};

// create overlay object
var overlayMaps = {
    "MARTA Stations": stationLayer,
    "Neighborhoods": neighborhoodLayer,
    "Crime Heat Map": crimeHeatLayer
};

// settings for map on load
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

        // TODO: custom marta station markers
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

        // title for map - WIP
        // if(!nCode) {
        //     console.log("Atlanta")
        // } else {
        //     console.log(d.features.filter(d => d.properties.STATISTICA == nCode))
        //     let subset = d.features.filter(d => d.properties.STATISTICA == nCode)
        //     let name = subset[0].properties.A
        //     console.log(name)

        //     d3.select('#myMap')
        //         .append('h2')
        //         .text(name)
        // }

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
    });
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

        // heatmap
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
    // update bar chart
    // update scatter plot
}

// controls for crime type dropdown
function crimeTypeChanged(crimeType){
    
    crimeheatMap(crimeType); // update heatmap layer
    // update bar chart
    // update scatter plot
}

// TODO - remove all extraneous datasets

