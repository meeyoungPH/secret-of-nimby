# dependencies
from flask import Flask, jsonify
import pandas as pd
import datetime as dt
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
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
Base = automap_base()

# reflect tables
Base.prepare(engine, reflect=True)

# save references to tables
Crime = Base.classes.cobra_merged
Marta = Base.classes.transit_rail_station
Neighborhood = Base.classes.neighborhood_data

# create app
app = Flask(__name__)

## web route
@app.route('/')
def home():
    return (
        f'Hello - testing'
    )

## routes for geojson

## crime geojson

## neighborhood geojson

## station geojson

## route for bar chart
# @app.route('/api/crime-type-bar-chart')
# def crime_type():
    
    # create session from Python to the DB
    # session = Session(engine)
    
    # crime_type = session.query(Crime.crime_type).all()
    
    # session.close()
    
    # crime_list = [{x.crime_type} for x in crime_type]
    # return jsonify(crime_list)

## route for bar chart
@app.route('/api/crime-type-bar-chart')
def crime_type():
    
    # create session from Python to the DB - Seth
    conn = engine.connect()
    crime_df = pd.read_sql("select * from cobra_merged", conn)
    crime_json = crime_df.to_json(path_or_buf=None, orient=None, date_format=None, double_precision=10, force_ascii=True, date_unit='ms', default_handler=None, lines=False, compression='infer', index=True, indent=None, storage_options=None)
    return crime_json
    # crime_count_df = crime_df['crime_type'].value_counts()
    # crime_count_dict = crime_count_df(orient="records")
    # return jsonify(crime_df)

    
    # Alternate method
    # session = Session(engine)
    # crime = session.query(Crime.difference_in_lat).all()
    # crime_list = [{x.difference_in_lat} for x in crime]
    # print(crime_list)
    
    # session.close()
    
    # return jsonify(crime_list)
    

## route for other chart


if __name__ == '__main__':
    app.run(debug=True)
    