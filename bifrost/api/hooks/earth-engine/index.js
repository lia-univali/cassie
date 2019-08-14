module.exports = function(sails) {
    const key = require('./key.json');
    const ee = require('@google/earthengine');

    const signalFailure = () => {
        throw 'Unable to initialize';
    };

    return {
        initialize(cb) {
            const signalSuccess = () => ee.initialize(null, null, cb, signalFailure);

            sails.log("Authenticating the service account with Earth Engine's servers...");
            ee.data.authenticateViaPrivateKey(key, signalSuccess, signalFailure);
        },
    };
};
