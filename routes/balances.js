var $ = require('jquery'),
    mongoose ;

exports.balances = function(req, res){
    if (req.xhr) {
        $.when(utils.searchRecipes(params)).done(function (response) {
            res.send(response.matches);
        });
    } else {
        res.end();
    }
};