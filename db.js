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

mongoose.model('ExchangeBalance', ExchangeBalanceSchema);

var exchange = db.model('ExchangeBalance');

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
    }
};