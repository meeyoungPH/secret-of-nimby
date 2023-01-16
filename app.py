# dependencies
##############################
from flask import Flask, render_template, jsonify
import pandas as pd
from sqlalchemy import create_engine
from config import username, password

# Connect to postgres database
##############################
protocol = 'postgresql'
host = 'localhost'
port = 5432
database_name = 'secret_of_nimby'
rds_connection_string = f'{protocol}://{username}:{password}@{host}:{port}/{database_name}'
engine = create_engine(rds_connection_string)

# create app
##############################
app = Flask(__name__, template_folder='templates')

# web route
##############################
@app.route('/')
def home():
    return render_template('index.html')

# routes for dropdown menus
##############################

## neighborhood
@app.route('/api/neighborhoods')
def neighborhood():
    # create DB session
    conn = engine.connect()
    
    # import data from postgres
    query = "select geoid, neighborhood from neighborhood_data order by neighborhood"
    neighborhood_df = pd.read_sql(query, conn)
    
    print(neighborhood_df.head())
    
    # send json data to webpage
    neighborhood_json = neighborhood_df.to_json(orient='records', index=True)
    return neighborhood_json

## crime
@app.route('/api/crime-types')
def crime_types():
    # create DB session
    conn = engine.connect()
    
    # import data from postgres
    query = "select distinct crime_type from cobra_merged order by crime_type"
    crime_type_df = pd.read_sql(query, conn)
    crime_list = crime_type_df.crime_type.tolist()
    
    # send json data to webpage
    return jsonify(crime_list)

# routes for geojson formatted data
##############################

## station geojson
@app.route('/api/stations.geojson')
def stationgeojson():
    filepath = 'static/data/Transit_Rail_Stations.geojson'
    with open(filepath, 'r', encoding='utf-8') as f:
        data = f.read()
    return data

## crime geojson
@app.route('/api/crime.geojson')
def crimegeojson():
    filepath = 'static/data/cobra_merged.geojson'
    with open(filepath, 'r', encoding='utf-8') as f:
        data = f.read()
    return data

## neighborhood geojson
@app.route('/api/neighborhood.geojson')
def neighborhoodgeojson():
    filepath = 'static/data/City_of_Atlanta_Neighborhood_Statistical_Areas.geojson'
    with open(filepath, 'r', encoding='utf-8') as f:
        data = f.read()
    return data

# routes for visualizations
##############################

## route for neighborhood info box
@app.route('/api/neighborhood-info/<nCode>')
def neighborhoodinfo(nCode):
    # format neighborhood code to uppercase
    nCode = nCode.upper()
    
    # create session to the DB
    conn = engine.connect()
    
    # retrieve data from postgres
    query = "select * from neighborhood_data where geoid = '" + nCode + "'"
    neighborhood_df = pd.read_sql(query, conn)
    
    # send json data to webpage
    neighborhood_json = neighborhood_df.to_json(orient='records', index=True)
    return neighborhood_json    

## route for bar chart
@app.route('/api/crime-type-count/<nCode>')
def crime_count(nCode):
    # format neighborhood code to uppercase
    nCode = nCode.upper()
    
    # create DB session
    conn = engine.connect()
    
    # retrieve data from postgres
    query = "select geoid, crime_type from cobra_merged where geoid = '" + nCode + "'"
    crime_df = pd.read_sql(query, conn)
    
    # count number of each crime by neighborhood
    crime_count = crime_df.groupby('geoid')['crime_type'].value_counts()
    crime_count = crime_count.unstack()
    
    # include this code to pass geoid in json
    # crime_count = crime_count.reset_index()
    
    # send json data to webpage
    crime_json = crime_count.to_json(orient='records', index=True)
    return crime_json    

## route for radar chart
@app.route('/api/crime-avg-distance/<nCode>')
def avg_distance(nCode):
    
    # change neighborhood code to all caps
    nCode = nCode.upper()
    
    # create DB session
    conn = engine.connect()
    
    # retrieve data from postgres
    query = "select geoid, distance_away, crime_type from cobra_merged where geoid = '" + nCode + "'"
    distance_df = pd.read_sql(query, conn)
    
    # calculate avg distance per crime type
    avg_distance = distance_df.groupby('crime_type')['distance_away'].mean()
    
    # send json data to webpage
    dict = {
        'crime_type': avg_distance.index.tolist(),
        'avg_distance': avg_distance.tolist()
    }
        
    return jsonify(dict)

# run app
##############################
if __name__ == '__main__':
    app.run(debug=True)
    