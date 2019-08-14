module.exports = {
    friendlyName: 'Evaluate an Earth Engine expression',

    description: 'Evaluates the specified Earth Engine expression asynchronously',

    inputs: {
        expression: {
            type: 'ref',
        },
    },

    exits: {
        success: {
            description: '...',
        },
    },

    fn: async function(inputs, exits) {
        inputs.expression.evaluate((result, err) => {
            if (err) {
                return exits.success(err);
            } else {
                return exits.success(result);
            }
        });
    },
};
