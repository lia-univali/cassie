module.exports = {
    friendlyName: 'Test ee',

    description: '',

    inputs: {},

    exits: {},

    fn: async function(inputs, exits) {
        const ee = require('@google/earthengine');

        const r = await Satellite.find();
        sails.log(r);

        sails.log('Itworks!');
        const collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_TA').limit(1);
        const r2 = await sails.helpers.ee.evaluate(collection);
        sails.log(r2);
        //collection.evaluate(sails.log);

        return exits.success();
    },
};
