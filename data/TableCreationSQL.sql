CREATE TABLE cobra_complete (
	offense_id BIGINT NOT NULL,
	rpt_date VARCHAR,
	occur_date VARCHAR,
	occur_day TEXT,
	occur_day_num VARCHAR,
	occur_time VARCHAR,
	poss_date VARCHAR,
	poss_time VARCHAR,
	beat VARCHAR,
	zone VARCHAR,
	location VARCHAR,
	ibr_code VARCHAR,
	UC2_Literal VARCHAR,
	neighborhood TEXT,
	npu VARCHAR,
	lat DOUBLE PRECISION,
	long DOUBLE PRECISION
);

CREATE TABLE cobra_summary (
	offense_id BIGINT NOT NULL,
	occur_date DATE,
	crime_type VARCHAR,
	neighborhood VARCHAR,
	lat DOUBLE PRECISION,
	long DOUBLE PRECISION,
	closest_station VARCHAR,
	difference_in_lat DOUBLE PRECISION,
	difference_in_long DOUBLE PRECISION,
	distance_away DOUBLE PRECISION
);

CREATE TABLE transit_rail_station (
	STATION VARCHAR,
	latitude DOUBLE PRECISION,
	longitude DOUBLE PRECISION
);
