var request = require('request'),
    q = require('q');

module.exports = {
    init: function (options) {
        this.key = options.key;
        this.url = options.url || "http://g3.match.com/rest/";
        return this;
    },
    
    authorize: function (data) {
        var def = q.defer();

        request.post(this.url + 'login', {
            headers: {
                matchAuthorize: '0,' + this.key + ',7,24'
            },
            form: data
        }, function (err, res, body) {
            var user = JSON.parse(body).Payload;
            if (err) {
                def.reject(err);
            } else {
                def.resolve(user);
            }
        });

        return def.promise;
    },

    request: function (authkey, endpoint, data) {
        var def = q.defer();

        request.get(this.url + endpoint, {
            headers: {
                matchAuthorize: authkey + ',' + this.key + ',7,24'
            },
            qs: data
        }, function (err, res, body) {
            var response = JSON.parse(body);

            if (response.Error) {
                def.reject(response.Error);
            } else {
                def.resolve(response.Payload);
            }
        });

        return def.promise;
    }
};
