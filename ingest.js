var pubnub = require('pubnub');
var sequelize = require('sequelize');

var connection = new sequelize('sensor_network', POSTGRES_USER_NAME, POSTGRES_USER_PASSWORD, {
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    dialect: 'postgres',
    logging:()=>{}
});

var sensor = connection.define('sensor', {
    time: {
        type: sequelize.BIGINT,
        allowNull: false, 
        primaryKey: true
    },
    sensor_uuid: {
        type: sequelize.STRING,
        allowNull: false
    },
    humidity: {
        type: sequelize.DOUBLE,
        allowNull: false
    },
    photosensor: {
        type: sequelize.DOUBLE,
        allowNull: false
    },
    radiation_level: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    ambient_temperature: {
        type: sequelize.DOUBLE,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

var pubnub = new pubnub({
    ssl: true,
    subscribe_key: 'sub-c-5f1b7c8e-fbee-11e3-aa40-02ee2ddab7fe'
});

pubnub.subscribe({
    channels: ['pubnub-sensor-network']
});

pubnub.addListener({
    message: function (message) {
        console.log(message.message);
        connection.sync({
            //logging: ()=>{} 
            
        })
        .then(function () {
            var sensorInstance = sensor.build({
                time: message.message.timestamp,
                sensor_uuid: message.message.sensor_uuid,
                humidity: message.message.humidity,
                photosensor: message.message.photosensor,
                radiation_level: message.message.radiation_level,
                ambient_temperature: message.message.ambient_temperature
            })
            sensorInstance.save()
            //if (Math.random() > .9) {
            //    throw new Error('Something unusual'+new Date().toISOString())
            //}
        })
        .catch(function (err) {
            console.log(err);          
        });
    }
});

