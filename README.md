# stream-sequelize-node
Ingest sample PubNub stream using Sequelize to Postgres with TimescaleDB extension installed and enabled for time series analysis 

Work in Progres...

## Create Postgres database, schema definition, TimescaleDB extension and hypertable

```
create database sensor_network;
```

```
\c sensor_network
```

```
create extension if not exists timescaledb cascade;
```

```
create table sensor (
	time                bigint not null, 
	sensor_uuid         text not null,
	humidity            double precision not null, 
	photosensor         double precision not null, 
	radiation_level     double precision not null, 
	ambient_temperature double precision not null
);
```

```
select create_hypertable('sensor', 'time', chunk_time_interval => 86400000000);
```