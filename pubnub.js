var PubNub = require('pubnub');
//var jsonfile = require('jsonfile');

var pubnub = new PubNub({
    ssl: true,
    //subscribe_key: 'sub-c-5f1b7c8e-fbee-11e3-aa40-02ee2ddab7fe'
    subscribe_key: 'sub-c-4377ab04-f100-11e3-bffd-02ee2ddab7fe'
});

pubnub.addListener({
    message: function(message) {
        console.log(message.message); 
        //jsonfile.writeFileSync(`test.json`, data);
    }
});

pubnub.subscribe({
    //channels: ['pubnub-sensor-network']
    channels: ['pubnub-market-orders']
});