const path = require('path');

process.env.NODE_ENV = 'development';

module.exports = {
    entry: {
	index: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, './lib'),
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['react']
            }
        }, {
	    test: /\.css$/,
	    loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[local]'
	}],
    },
    devServer: {
	historyApiFallback: true
    }
}
