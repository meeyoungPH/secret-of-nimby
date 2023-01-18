-- Drop if tables exist
drop table if exists cobra_complete;
drop table if exists cobra_summary;
drop table if exists transit_rail_station;
drop table if exists cobra_merged;
drop table if exists neighborhood_data;


CREATE TABLE transit_rail_station (
	STATION VARCHAR primary key,
	latitude DOUBLE PRECISION,
	longitude DOUBLE PRECISION
);

CREATE TABLE cobra_merged (
	offense_id BIGINT primary key NOT NULL,
	occur_date DATE,
	crime_type VARCHAR,
	neighborhood VARCHAR,
	lat DOUBLE PRECISION,
	long DOUBLE PRECISION,
	closest_station VARCHAR,
	difference_in_lat DOUBLE PRECISION,
	difference_in_long DOUBLE PRECISION,
	distance_away DOUBLE PRECISION,
	geoid VARCHAR
);

CREATE TABLE neighborhood_data (
	geoid VARCHAR primary key,
	neighborhood VARCHAR,
	total_population VARCHAR,
	median_age VARCHAR,
	median_household_income VARCHAR,
	percent_white VARCHAR,
	percent_black VARCHAR,
	percent_hispanic VARCHAR,
	percent_asian_or_pacific_islander VARCHAR,
	percent_other_races VARCHAR
);
