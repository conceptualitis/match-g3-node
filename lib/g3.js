var request = require('request'),
    q = require('q');

var key = null, url;

module.exports = {
    init: function (options) {
        if (key === null) {
            key = options.key;
            url = options.url || "http://g3.match.com/rest/";
        }
        return this;
    },
    
    authorize: function (data) {
        var def = q.defer();

        request.post(url + 'login', {
            headers: {
                matchAuthorize: '0,' + key + ',11,255'
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

        request.get(url + endpoint, {
            headers: {
                matchAuthorize: authkey + ',' + key + ',7,24'
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
    },

    utilities: {
        seekingCode: function (searchingGender, seekingGender) {
            return {
                'male-male': 1,
                'male-female': 2,
                'female-female': 3,
                'female-male': 4
            }[[searchingGender, seekingGender].join('-').toLowerCase()];
        },

        genderCode: function (gender) {
            return (gender.toLowerCase() === 'male') ? 1 : 2;
        }
    }
};
