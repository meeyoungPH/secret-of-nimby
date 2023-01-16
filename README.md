# The Secret of NIMBY
This is an analysis of crime in relation to MARTA rail stations in Atlanta, to determine if there is correlation.

### Description
NIMBY, Not In My Back Yard, is a movement that opposes the placement of something preceived as unpleasant or hazardous near their home. In the context of Atlanta, GA, the NIMBY movement is opposed to the MARTA Rail stations and lines being expanded near their homes believing crime will follow. This dashboard was built to determine where crimes occur in Atlanta in realtion to MARTA Rail stations. 

### Installation/Run/How to use
-Does this need to be included?

### Data and Delivery
Three data components were used to complete this dashboard.

1. Atlanta Neighborhood Demographics (geojson): https://gisdata.fultoncountyga.gov/datasets/d6298dee8938464294d3f49d473bcf15/explore?location=33.767212%2C-84.420550%2C12.00 

2. MARTA Transit Rail Stations (geojson): https://arc-garc.opendata.arcgis.com/datasets/GARC::transit-rail-stations/explore?location=33.766815%2C-84.384652%2C11.00

3. Atlanta Police Department Crime Database (2022): https://www.atlantapd.org/home/showpublisheddocument/5257

The Altanta Neighborhood Demographics contains ?? unique records, The MARTA Transit Rail Station file contains 33? unique records, and the Atlanta Police Department Crime Database contains 21,000? unique records. Postgres is used to house all the data. The data is then funneled through a Python Flask API to the dashboard. The following API routes were used:
- @app.route('/api/neighborhoods')
- @app.route('/api/crime-types')
- @app.route('/api/stations.geojson')
- @app.route('/api/crime.geojson')
- @app.route('/api/neighborhood.geojson')
- @app.route('/api/neighborhood-info/<nCode>')
- @app.route('/api/crime-type-count/<nCode>')
- @app.route('/api/crime-avg-distance/<nCode>')

### Back End

### Visualizations

### Authors
Annalyse Bergman, Lakshmi Bhimavarapu, Yi Lu, Ryan Marshall, and Meeyoung Park

