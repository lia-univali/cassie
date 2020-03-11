# cassie

> A tool for coastal regions mapping and analysis, using Google Earth Engine.

Cassie is an open source web tool that performs analysis and mapping of coastal regions, focusing on the variation of the coastline. To perform these procedures cassie uses the tools and images provided by the Google Earth Engine platform.

## Satellites
* landsat 5 (1984-2011)
* landsat 7 (since 1999)
* landsat 8 (since 2013)
* sentinel-2 (since 2013)

## Usage

First Choose the satelite

![](docs/sats.png)

Then the region to be mapped

![](docs/costa.png)

## Running
You must creacte an .env file with de following params:
```
API_KEY = xxxxxxxxxxxxxxx
REACT_APP_CLIENT_ID = xxxxxxxxxxxxxxx
REACT_APP_MAPS_KEY = xxxxxxxxxxxxxxxxxxxx
```

## Dependencies

- [@material-ui/core](https://ghub.io/@material-ui/core): React components that implement Google&#39;s Material Design.
- [@material-ui/icons](https://ghub.io/@material-ui/icons): Material Design Svg Icons converted to Material-UI React components.
- [async](https://ghub.io/async): Higher-order functions and common patterns for asynchronous code
- [autoprefixer](https://ghub.io/autoprefixer): Parse CSS and add vendor prefixes to CSS rules using values from the Can I Use website
- [axios](https://ghub.io/axios): Promise based HTTP client for the browser and node.js
- [babel-core](https://ghub.io/babel-core): Babel compiler core.
- [babel-eslint](https://ghub.io/babel-eslint): Custom parser for ESLint
- [babel-jest](https://ghub.io/babel-jest): Jest plugin to use babel for transformation.
- [babel-loader](https://ghub.io/babel-loader): babel module loader for webpack
- [babel-preset-react-app](https://ghub.io/babel-preset-react-app): Babel preset used by Create React App
- [babel-runtime](https://ghub.io/babel-runtime): babel selfContained runtime
- [bootstrap](https://ghub.io/bootstrap): The most popular front-end framework for developing responsive, mobile first projects on the web.
- [case-sensitive-paths-webpack-plugin](https://ghub.io/case-sensitive-paths-webpack-plugin): Enforces module path case sensitivity in Webpack
- [chalk](https://ghub.io/chalk): Terminal string styling done right. Much color.
- [chart.js](https://ghub.io/chart.js): Simple HTML5 charts using the canvas element.
- [color-convert](https://ghub.io/color-convert): Plain color conversion functions
- [css-loader](https://ghub.io/css-loader): css loader module for webpack
- [dotenv](https://ghub.io/dotenv): Loads environment variables from .env file
- [eslint](https://ghub.io/eslint): An AST-based pattern checker for JavaScript.
- [eslint-config-react-app](https://ghub.io/eslint-config-react-app): ESLint configuration used by Create React App
- [eslint-loader](https://ghub.io/eslint-loader): eslint loader (for webpack)
- [eslint-plugin-flowtype](https://ghub.io/eslint-plugin-flowtype): Flowtype linting rules for ESLint.
- [eslint-plugin-import](https://ghub.io/eslint-plugin-import): Import with sanity.
- [eslint-plugin-jsx-a11y](https://ghub.io/eslint-plugin-jsx-a11y): Static AST checker for accessibility rules on JSX elements.
- [eslint-plugin-react](https://ghub.io/eslint-plugin-react): React specific linting rules for ESLint
- [extract-text-webpack-plugin](https://ghub.io/extract-text-webpack-plugin): Extract text from bundle into a file.
- [file-loader](https://ghub.io/file-loader): file loader module for webpack
- [fs-extra](https://ghub.io/fs-extra): fs-extra contains methods that aren&#39;t included in the vanilla Node.js fs package. Such as mkdir -p, cp -r, and rm -rf.
- [history](https://ghub.io/history): Manage session history with JavaScript
- [html-webpack-plugin](https://ghub.io/html-webpack-plugin): Simplifies creation of HTML files to serve your webpack bundles
- [immutability-helper](https://ghub.io/immutability-helper): mutate a copy of data without changing the original source
- [jest](https://ghub.io/jest): Delightful JavaScript Testing.
- [jszip](https://ghub.io/jszip): Create, read and edit .zip files with JavaScript http://stuartk.com/jszip
- [lodash](https://ghub.io/lodash): Lodash modular utilities.
- [mathjs](https://ghub.io/mathjs): Math.js is an extensive math library for JavaScript and Node.js. It features a flexible expression parser with support for symbolic computation, comes with a large set of built-in functions and constants, and offers an integrated solution to work with different data types like numbers, big numbers, complex numbers, fractions, units, and matrices.
- [moment](https://ghub.io/moment): Parse, validate, manipulate, and display dates
- [node-sass](https://ghub.io/node-sass): Wrapper around libsass
- [node-sass-chokidar](https://ghub.io/node-sass-chokidar): A thin wrapper around node-sass to replicate the --watch --recursive but with chokidar instead of Gaze
- [npm-run-all](https://ghub.io/npm-run-all): A CLI tool to run multiple npm-scripts in parallel or sequential.
- [object-assign](https://ghub.io/object-assign): ES2015 `Object.assign()` ponyfill
- [postcss-flexbugs-fixes](https://ghub.io/postcss-flexbugs-fixes): PostCSS plugin This project tries to fix all of flexbug&#39;s issues
- [postcss-loader](https://ghub.io/postcss-loader): PostCSS loader for webpack
- [promise](https://ghub.io/promise): Bare bones Promises/A+ implementation
- [rc-slider](https://ghub.io/rc-slider): Slider UI component for React
- [react](https://ghub.io/react): React is a JavaScript library for building user interfaces.
- [react-bootstrap](https://ghub.io/react-bootstrap): Bootstrap 3 components built with React
- [react-chartjs-2](https://ghub.io/react-chartjs-2): react-chartjs-2
- [react-collapse](https://ghub.io/react-collapse): Component-wrapper for collapse animation with react-motion for elements with variable (and dynamic) height
- [react-custom-scrollbars](https://ghub.io/react-custom-scrollbars): React scrollbars component
- [react-dev-utils](https://ghub.io/react-dev-utils): Webpack utilities used by Create React App
- [react-dom](https://ghub.io/react-dom): React package for working with the DOM.
- [react-hot-loader](https://ghub.io/react-hot-loader): Tweak React components in real time.
- [react-json-view](https://ghub.io/react-json-view): Interactive react component for displaying javascript arrays and JSON objects.
- [react-motion](https://ghub.io/react-motion): A spring that solves your animation problems.
- [react-rangeslider](https://ghub.io/react-rangeslider): A lightweight react component that acts as a HTML5 input range slider polyfill
- [react-redux](https://ghub.io/react-redux): Official React bindings for Redux
- [react-resize-detector](https://ghub.io/react-resize-detector): React resize detector
- [react-router](https://ghub.io/react-router): Declarative routing for React
- [react-router-dom](https://ghub.io/react-router-dom): DOM bindings for React Router
- [react-router-redux](https://ghub.io/react-router-redux): Redux bindings for React Router
- [react-select](https://ghub.io/react-select): A Select control built with and for ReactJS
- [react-smooth](https://ghub.io/react-smooth): react animation library
- [react-spinkit](https://ghub.io/react-spinkit): A collection of loading indicators animated with CSS for React
- [react-transition-group](https://ghub.io/react-transition-group): A react component toolset for managing animations
- [recharts](https://ghub.io/recharts): React charts
- [redux](https://ghub.io/redux): Predictable state container for JavaScript apps
- [redux-devtools-extension](https://ghub.io/redux-devtools-extension): Wrappers for Redux DevTools Extension.
- [redux-logger](https://ghub.io/redux-logger): Logger for Redux
- [redux-saga](https://ghub.io/redux-saga): Saga middleware for Redux to handle Side Effects
- [redux-thunk](https://ghub.io/redux-thunk): Thunk middleware for Redux.
- [shapefile](https://ghub.io/shapefile): An implementation of the shapefile (.shp) spatial data format.
- [shortid](https://ghub.io/shortid): Amazingly short non-sequential url-friendly unique id generator.
- [shp-write](https://ghub.io/shp-write): write shapefiles from pure javascript
- [style-loader](https://ghub.io/style-loader): style loader module for webpack
- [sw-precache-webpack-plugin](https://ghub.io/sw-precache-webpack-plugin): Webpack plugin for using service workers
- [terraformer](https://ghub.io/terraformer): A Geo-toolkit built in Javascript.
- [terraformer-arcgis-parser](https://ghub.io/terraformer-arcgis-parser): ArcGIS JSON format parser and converter
- [url-loader](https://ghub.io/url-loader): url loader module for webpack
- [webpack](https://ghub.io/webpack): Packs CommonJs/AMD modules for the browser. Allows to split your codebase into multiple bundles, which can be loaded on demand. Support loaders to preprocess files, i.e. json, jsx, es7, css, less, ... and your custom stuff.
- [webpack-dev-server](https://ghub.io/webpack-dev-server): Serves a webpack app. Updates the browser on changes.
- [webpack-manifest-plugin](https://ghub.io/webpack-manifest-plugin): webpack plugin for generating asset manifests
- [whatwg-fetch](https://ghub.io/whatwg-fetch): A window.fetch polyfill.

## Dev Dependencies

None

