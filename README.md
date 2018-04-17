# stream-sequelize-node
Ingest sample Market Orders Data feed from PubNub to Postgres with TimescaleDB extension installed and enabled for time series analysis.
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
Next you need to execute the following SQL code snippets in your Postgres environment in order to create the database, TimescaleDB extension, schema definition, and hypertable.

```sql

create database market_orders;
```

```sql
\c market_orders
```

```sql
create extension if not exists timescaledb cascade;
```

```sql
create table orders (
	order_time          bigint not null, 
	trade_type          text not null,
	symbol              text not null, 
	order_quantity      double precision not null, 
	bid_price           double precision not null
);
```

```sql
create index on orders(order_time desc);
create index on orders(trade_type, order_time desc);
create index on orders(symbol, order_time desc);
create index on orders(order_time desc, order_quantity);
create index on orders(order_time desc, bid_price);
-- 86400000000 is in usecs and is equal to 1 day
select create_hypertable('orders', 'order_time', chunk_time_interval => 86400000000);
```

Once completed, you can now run the application to start ingesting data in your database.
### Sample queries
Assuming that you have been ingesting data for a while (you can modify the time interval), run some queries to test and validate how Timescale performs nicely in fetching results while data is also being ingested in the database. 
```sql
-- Average bid price by 5 minute intervals for Google and day trade type 
select 	time_bucket('5 minutes', to_timestamp(order_time)) as five_min,
        avg(bid_price) as avg_bid_price
from 	orders
where	symbol = 'Google' and trade_type = 'day'
group by five_min
order by five_min limit 20;
```

```sql
-- Min and Max bid price by 2 minute intervals for all symbols 
select 	time_bucket('2 minutes', to_timestamp(order_time)) as two_min,
        symbol, 
        min(bid_price) as min_bid_price,
        max(bid_price) as max_bid_price 
from 	orders
group by two_min, symbol
order by two_min desc limit 20;
```

```sql 
-- Orders with order quantity greater than 975...
select 	order_time,
        trade_type, 
        order_quantity, 
        bid_price
from 	orders
where	order_quantity > 975 and 
        symbol = 'Bespin Gas' and 
        trade_type = 'market';
```

### Links
**TimescaleDB**     
https://www.timescale.com/

**Data feed**   
Market Orders - artificial data stream that provides the latest market orders for a fictitious marketplace  
https://www.pubnub.com/developers/realtime-data-streams/financial-securities-market-orders/