var $           = require('jquery'),
    _           = require('underscore'),
    mongoose    = require('mongoose'),
    connection  = mongoose.connect('***REMOVED***'),
    db          = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () { console.log('connection open'); });

var ExchangeBalanceSchema = new mongoose.Schema({
    name: String,
    balances: Array,
    when: Date
});

var TotalBalanceSchema = new mongoose.Schema({
    balances: Array,
    when: Date
});

var TradeSchema = new mongoose.Schema({
    exchange1: {
        name: String,
        buyPrice: Number,
        amount: Number
    },
    exchange2: {
        name: String,
        sellPrice: Number,
        amount: Number
    },
    profit: Number,
    when: Date,
    market: String
});

mongoose.model('ExchangeBalance', ExchangeBalanceSchema);
mongoose.model('TotalBalance', TotalBalanceSchema);
mongoose.model('Trade', TradeSchema);

var exchange = db.model('ExchangeBalance');
var totalBalance = db.model('TotalBalance');
var trade = db.model('Trade');

module.exports = {
    getExchangeBalances: function (param) {
        var dfd = new $.Deferred(),
            collection = db.collection('exchangebalances'),
            response = [],
            counter = 0;

        if (param === 'all') {
            collection.distinct('name', function (err, results) {
                _.each(results, function (exName) {
                    exchange.find({ name: exName }).sort('-when').exec(function (err, resp) {
                            response.push({
                                name: _.first(resp).name,
                                balances: _.first(resp).balances
                            });

                            counter++;

                            if (counter === results.length) {
                                dfd.resolve(JSON.stringify(response));
                            }
                    });
                }, this);
            });
        }
        else {
            exchange.find({'name': param}, function (err, response) {
                var currencies = {};

                _.each(response, function (result) {
                    _.each(result.balances, function (balance) {
                        if (!currencies[balance.currency]) {
                            currencies[balance.currency] = [];
                        }

                        currencies[balance.currency].push(balance.amount);
                    }, this);
                }, this);

                dfd.resolve(currencies);
            });
        }

        return dfd.promise();
    },

    getTotalBalances: function () {
        var dfd = new $.Deferred(),
            collection = db.collection('totalbalance'),
            currencies = {};

        totalBalance.find().exec(function (err, resp) {
            _.each(resp, function (result) {
                _.each(result.balances, function (balance) {
                    if (!currencies[balance.currency]) {
                        currencies[balance.currency] = [];
                    }

                    currencies[balance.currency].push(balance.amount);
                }, this);
            }, this);

            dfd.resolve(currencies);
        });

        return dfd.promise();
    },

    getLatestTrades: function () {
        var dfd = new $.Deferred(),
            collection = db.collection('trade'),
            result = [];

        trade.find().limit(20).sort('-when').exec(function (err, resp) {
            _.each(resp, function (newTrade) {
                result.push({
                    profit: newTrade.profit,
                    when: newTrade.when,
                    exchange1: newTrade.exchange1,
                    exchange2: newTrade.exchange2,
                    market: newTrade.market
                })
            }, this);

            dfd.resolve(result);
        });

        return dfd.promise();
    }
};