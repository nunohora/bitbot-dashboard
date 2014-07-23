var $           = require('jquery'),
    _           = require('underscore'),
    mongoose    = require('mongoose'),
    connection  = mongoose.connect('***REMOVED***'),
    db          = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () { console.log('connection open'); });

module.exports = {
    getExchangeBalances: function (param) {
        var dfd = new $.Deferred(),
            collection = db.collection('exchangebalances'),
            response = [],
            counter = 0,
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
                }, this)
            });
        }
        else {
            collection.findOne({ name: param}, function (err, result) {
                dfd.resolve({
                    name: result.name,
                    balances: result.balances
                });
            });
        }
        return dfd.promise();
    }
}