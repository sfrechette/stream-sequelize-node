var pubnub = require('pubnub');
var sequelize = require('sequelize');
var dotenv = require('dotenv');
dotenv.load();

// Initialize connection to database (using environment variables)
var connection = new sequelize('market_orders', process.env.DB_SERVER_USER_NAME, process.env.DB_SERVER_USER_PASSWORD, {
    host: process.env.DB_SERVER_HOST,
    port: process.env.DB_SERVER_PORT,
    dialect: 'postgres',
    //operatorsAliases: false,
    logging:()=>{}
});

// Define model 
var order = connection.define('orders', {
    order_time: {
        type: sequelize.BIGINT,
        allowNull: false, 
        primaryKey: true
    },
    trade_type: {
        type: sequelize.STRING,
        allowNull: false
    },
    symbol: {
        type: sequelize.STRING,
        allowNull: false
    },
    order_quantity: {
        type: sequelize.DOUBLE,
        allowNull: false
    },
    bid_price: {
        type: sequelize.DOUBLE,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

// Initialize PubNub client
var pubnub = new pubnub({
    ssl: true,
    subscribe_key: 'sub-c-4377ab04-f100-11e3-bffd-02ee2ddab7fe'
});

// Subscribe (listen on) to channel 
pubnub.subscribe({
    channels: ['pubnub-market-orders']
});

// Handle message payload
pubnub.addListener({
    message: function (message) {
        console.log(message.message);
        connection.sync({
            //logging: ()=>{} 
        })
        .then(function () {
            // Build and Save message stream to database 
            var orderInstance = order.build({
                order_time: message.message.timestamp,
                trade_type: message.message.trade_type,
                symbol: message.message.symbol,
                order_quantity: message.message.order_quantity,
                bid_price: message.message.bid_price
            })
            //orderInstance.save()
                //if (Math.random() > .9) {
                    //throw new Error('Something unusual'+new Date().toISOString())
                //}
        })
        .catch(function (err) {
            console.log(err);          
        });
    }
});

