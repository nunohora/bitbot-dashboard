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

module.exports = {
    getExchangeBalances: function (param) {
        var dfd = new $.Deferred(),
            collection = db.collection('exchangebalances'),
            response = [],
            counter = 0,
            exchange,
            item;

        if (param === 'all') {
            collection.distinct('name', function (err, results) {
                _.each(results, function (exName) {
                    collection.findOne({ name: exName }, function (err, result) {
                        item = { name: result.name, balances: result.balances };
                        response.push(item);
                        counter++;

                        if (counter === results.length) {
                            dfd.resolve(JSON.stringify(response));
                        }
                    });
                }, this);
            });
        }
        else {
            exchange = db.model('ExchangeBalance');

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