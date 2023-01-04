// code for drop down menu
var transit_data = d3.csv('data/transit_rail_station.csv').then(d => d);

// stations = []

function init() {

    transit_data.then(function(d){
        d.forEach(item => {
            d3.select('#martaStation')
                .append('option')
                .text(item.station)
                .property('value', item.station)
        })
    })
}

// init()

// code for plots below

// code for map below