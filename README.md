# stream-sequelize-node
Ingest sample PubNub realtime data stream using Sequelize to Postgres with TimescaleDB extension installed and enabled for time series analysis. 
### Installation    
Clone repository
```
https://github.com/sfrechette/stream-sequelize-node.git 
cd stream-sequilize-node
```
Install the dependencies with the following command:
```javascript
npm install
```
### Configuration 
Create an .env file and add the following with your configuration values   
```
DB_SERVER_USER_NAME = ""    
DB_SERVER_USER_PASSWORD = ""    
DB_SERVER_HOST = "" 
DB_SERVER_PORT = ""     
```
### Usage   
```javascript
node ingest.js
```
## Prerequesites  
Running this application assumes that you already have an instance of Postgres running and have installed the TimescaleDB extension. 
If not please refer the following documentation:    
Getting started, installing and setting up  
https://docs.timescale.com/v0.9/getting-started

### Database schema 
Next you need to execute the following SQL code snippets in your Postgres environement in order to create the database, create the TimescaleDB extension, schema definition, and hypertable.

```sql

create database sensor_network;
```

```sql
\c sensor_network
```

```sql
create extension if not exists timescaledb cascade;
```

```sql
create table sensor (
	time                bigint not null, 
	sensor_uuid         text not null,
	humidity            double precision not null, 
	photosensor         double precision not null, 
	radiation_level     double precision not null, 
	ambient_temperature double precision not null
);
```

```sql
create index on sensor(time desc);
-- 86400000000 is in usecs and is equal to 1 day
select create_hypertable('sensor', 'time', chunk_time_interval => 86400000000);
```

Once completed, you can now run the application to start ingesting data in your database.

### Sample queries
Assuming that you have been ingesting data for a while (you can modify the time interval), run some queries to test and validate how Timescale performs nicely in fetching results while data is also being ingested in the database. 
```sql
select 	time_bucket('5 minutes', to_timestamp(time)) AS five_min,
    	count(*),
    	avg(radiation_level) AS avg_rad,
    	avg(humidity) AS avg_hum
from 	sensor
group by five_min
order by five_min desc, avg_rad desc;
```

```sql 

```

### Links
**TimescaleDB** 
Getting started, installing and setting up  
https://docs.timescale.com/v0.9/getting-started

**Data feed**   
Sensor Network Realtime Data - feed that provides sensor information from artificial sensors.   
https://www.pubnub.com/developers/realtime-data-streams/sensor-network/