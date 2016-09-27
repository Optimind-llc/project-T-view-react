// var path = require('path');
// var webpack = require('webpack');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
// var autoprefixer = require('autoprefixer');

// module.exports = {
//   //devtool: 'source-map',
//   devtool: 'cheap-module-source-map',
//   entry: [
//     'bootstrap-loader/extractStyles',
//     './src-teacher/index',
//   ],
//   output: {
//     path: path.join(__dirname, '../../../public/dist/teacher'),
//     filename: 'bundle.js',
//     publicPath: '/dist/teacher/'
//   },
//   plugins: [
//     new webpack.optimize.OccurenceOrderPlugin(),
//     new webpack.DefinePlugin({
//       'process.env': {
//         'NODE_ENV': JSON.stringify('production')
//       }
//     }),
//     new webpack.optimize.UglifyJsPlugin({
//       compress: {
//         warnings: false
//       }
//     }),
//     new ExtractTextPlugin('bundle.css', { allChunks: true })
//   ],
//   module: {
//     loaders: [
//       { test: /\.js$/,
//         loaders: [ 'babel' ],
//         exclude: /node_modules/
//       }, {
//         test: /\.css$/,
//         loader: ExtractTextPlugin.extract(
//           'style', 'css'
//         ),
//       }, {
//         test: /\.scss$/,
//         loader: ExtractTextPlugin.extract(
//           'style',
//           'css?modules&importLoaders=2&localIdentName=[name]__[local]__[hash:base64:5]' +
//           '!postcss' +
//           '!sass'
//         ),
//       }, {
//         test: /glyphicons-halflings-regular\.woff(\?v=\d+\.\d+\.\d+)?$/,
//         loader: "url?limit=10000&mimetype=application/font-woff"
//       }, {
//         test: /glyphicons-halflings-regular\.woff2(\?v=\d+\.\d+\.\d+)?$/,
//         loader: "url?limit=10000&mimetype=application/font-woff"
//       }, {
//         test: /glyphicons-halflings-regular\.ttf(\?v=\d+\.\d+\.\d+)?$/,
//         loader: "url?limit=10000&mimetype=application/octet-stream"
//       }, {
//         test: /glyphicons-halflings-regular\.eot(\?v=\d+\.\d+\.\d+)?$/,
//         loader: "file"
//       }, {
//         test: /glyphicons-halflings-regular\.svg(\?v=\d+\.\d+\.\d+)?$/,
//         loader: "url?limit=10000&mimetype=image/svg+xml"
//       },
//       /* font-awesome */
//       {
//         test: /fontawesome-webfont\.(otf|eot|svg|ttf|woff)\??/,
//         loader: 'url-loader?limit=8192'
//       }, {
//         test: /\.jpg$/,
//         loader: "url-loader?mimetype=image/jpg"
//       }
//     ]
//   },

//   postcss: [ autoprefixer ]
// };





var path = require('path');
var webpack = require('webpack');
var cssModulesValues = require('postcss-modules-values');
var getDotenv = require('../src/client/utils/dotenv');
var HappyPack = require('happypack');

// Import .env and expand variables:
getDotenv();

const root = process.cwd();
// const clientInclude = [path.join(root, 'src', 'client'), path.join(root, 'src', 'universal')];
// const globalCSS = path.join(root, 'src', 'universal', 'styles', 'global');
const clientInclude = [path.join(root, 'src', 'client')];
const globalCSS = path.join(root, 'src', 'client', 'styles');
const srcDir = path.join(root, 'src');

const prefetches = [
  'react-dnd/lib/index.js',
  'joi/lib/index.js',
];

const prefetchPlugins = prefetches.map(specifier => new webpack.PrefetchPlugin(specifier));

const babelQuery = {
  plugins: [
    ['transform-decorators-legacy'],
    ['react-transform', {
      transforms: [{
        transform: 'react-transform-hmr',
        imports: ['react'],
        locals: ['module']
      }, {
        transform: 'react-transform-catch-errors',
        imports: ['react', 'redbox-react']
      }]
    }]
  ]
};

// export default {
module.exports = {
  // devtool: 'source-maps',
  devtool: 'eval',
  context: srcDir,
  entry: {
    app: [
      'babel-polyfill',
      'client/client.js',
    ]
  },
  output: {
    filename: 'app.js',
    chunkFilename: '[name]_[chunkhash].js',
    path: path.join(root, '../public/build'),
    publicPath: '/build/'
  },
  plugins: [
    ...prefetchPlugins,
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      '__CLIENT__': true,
      '__PRODUCTION__': false,
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.EnvironmentPlugin([
      'PROTOCOL',
      'HOST',
      'PORT'
    ]),
    new HappyPack({
      loaders: ['babel'],
      threads: 4
    })
  ],
  resolve: {
    extensions: ['.js'],
    modules: [srcDir, 'node_modules']
  },
  // used for joi validation on client
  node: {
    dns: 'mock',
    net: 'mock'
  },
  postcss: [cssModulesValues],
  module: {
    loaders: [
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.txt$/, loader: 'raw-loader'},
      {test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/, loader: 'url-loader?limit=10000'},
      {test: /\.(eot|ttf|wav|mp3)$/, loader: 'file-loader'},
      {
        test: /\.css$/,
        loader: 'style!css',
        include: globalCSS
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]!postcss',
        exclude: globalCSS,
        include: clientInclude
      },
      {
        test: /\.js$/,
        loader: 'happypack/loader',
        query: babelQuery,
        include: clientInclude
      }
    ]
  }
};