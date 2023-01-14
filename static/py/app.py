# dependencies
from flask import Flask
import pandas as pd
# import datetime as dt
import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from config import username, password
import numpy

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
        f'Hello - testing'
    )

## routes for geojson files
## crime geojson

## neighborhood geojson

## station geojson

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
    