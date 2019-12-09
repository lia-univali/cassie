/**
 * Satellite.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
        collectionName: {
            type: 'string',
            description: 'The name of the collection in Google Earth Engine.',
            required: true,
        },
        opticalResolution: {
            type: 'string',
            description: 'The spatial resolution of the satellite in the optical bands (red, green and blue), in metres.',
            required: true,
        },
        revisitDays: {
            type: 'number',
            description: 'Days needed for the satellite to complete an entire orbit and capture the same location again.',
            required: true,
        },
        availabilityStart: {
            type: 'number',
            description: 'The UNIX timestamp of the date when the satellite began to acquire images.',
            required: true,
        },
        availabilityEnd: {
            type: 'number',
            description: "The UNIX timestamp of the date when the satellite stopped acquiring images, or null if it's still active.",
            allowNull: true,
            required: false,
        },
        red: {
            type: 'string',
            required: true,
        },
        green: {
            type: 'string',
            required: true,
        },
        blue: {
            type: 'string',
            required: true,
        },
        nir: {
            type: 'string',
            required: true,
        },
        swir: {
            type: 'string',
            required: true,
        },
    },
};
