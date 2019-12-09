module.exports = function(sails) {
    return {
        initialize(cb) {
            sails.on('hook:orm:loaded', async function() {
                sails.log(await Satellite.find());
                cb();
            });
        },
    };
};
