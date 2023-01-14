# dependencies
from flask import Flask, jsonify
import pandas as pd
# import datetime as dt
import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from config import username, password
import numpy
import geopandas as gpd

# engine here
#Connect to database
protocol = 'postgresql'
host = 'localhost'
port = 5432
database_name = 'secret_of_nimby'
rds_connection_string = f'{protocol}://{username}:{password}@{host}:{port}/{database_name}'
engine = create_engine(rds_connection_string)

# reflect database into model
# Base = automap_base()

# reflect tables
# Base.prepare(engine, reflect=True)

# save references to tables
# Crime = Base.classes.cobra_merged
# Marta = Base.classes.transit_rail_station
# Neighborhood = Base.classes.neighborhood_data

# create app
app = Flask(__name__)

## web route
@app.route('/')
def home():
    return (             
        f'Hello! Here is the list of available routes:<br/>'
        f'/api/crimes.geojson<br/>'
        f'/api/neighborhood.geojson<br/>'
        f'/api/station.geojson<br/>'
        f'/api/crime-type-bar-chart/<nCode><br/>'
    )

## routes for geojson files

## station geojson
@app.route('/api/stations.geojson')
def stationgeojson():
    filepath = '../../data/Transit_Rail_Stations.geojson'
    with open(filepath, 'r', encoding='utf-8') as f:
        data = f.read()
    return data

## crime geojson
@app.route('/api/crime.geojson')
def crimegeojson():
    filepath = '../../data/cobra_merged.geojson'
    with open(filepath, 'r', encoding='utf-8') as f:
        data = f.read()
    return data

## neighborhood geojson
@app.route('/api/neighborhood.geojson')
def neighborhoodgeojson():
    filepath = '../../data/City_of_Atlanta_Neighborhood_Statistical_Areas.geojson'
    with open(filepath, 'r', encoding='utf-8') as f:
        data = f.read()
    return data

## route for bar chart
@app.route('/api/crime-type-bar-chart/<nCode>')
def crime_type(nCode):
           
    nCode = nCode.upper()
    
    # create session from Python to the DB
    conn = engine.connect()
    
    # import data from postgres
    # use this query to filter data by geoid passed in the route
    query = "select geoid, crime_type from cobra_merged where geoid = '" + nCode + "'"
    
    # use this query to return all records
    # query = "select geoid, crime_type from cobra_merged"
    
    # retrieve data from postgres
    crime_df = pd.read_sql(query, conn)
    
    # count number of each crime by neighborhood
    crime_count = crime_df.groupby('geoid')['crime_type'].value_counts()
    crime_count = crime_count.unstack()
    
    # include this code to pass geoid in json
    # crime_count = crime_count.reset_index()
        
    crime_json = crime_count.to_json(orient='records', index=True)
    return crime_json    

## route for other chart


if __name__ == '__main__':
    app.run(debug=True)
    