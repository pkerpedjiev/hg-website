var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const root    = path.resolve(__dirname);
const src     = path.join(root, 'src');

module.exports = {
  context: __dirname + '/src',
  entry: {
      app: ['./app.js']
  },
  devtool: "cheap-source-map",
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: '[name].js',
    libraryTarget: 'umd',
    library: '[name]'
  },
  resolve: {
    alias: {
      'css': path.join(src, 'styles'),
      'containers': path.join(src, 'containers'),
      'components': path.join(src, 'components'),
      'utils': path.join(src, 'utils'),
      'src': src,
      'styles': path.join(src, 'styles')
    }
  },
  module: {
    loaders: [
      { 
        test: /\.jsx?$/,
        //exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'test')],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['es2015', { modules: false }],
                'react',
                'stage-0'
              ]
            }
          }
        ]
      }
      , 
      {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
              use: [
                  {
                      loader: 'css-loader',
                      options: {
                          modules: true,
                          localIdentName: '[path][name]_[local]--[hash:base64:8]',
                      },
                  }
              ]
          })

      },
          { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }

    ],
    noParse: [
        /node_modules\/sinon\//,
    ]
  },
  externals: {
  },
  plugins: [
    new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('production')
          }
    }),
    new webpack.IgnorePlugin(/react\/addons/),
    new webpack.IgnorePlugin(/react\/lib\/ReactContext/),
    new webpack.IgnorePlugin(/react\/lib\/ExecutionEnvironment/),
    new ExtractTextPlugin("styles.css")
    /*
    ,
    new BundleAnalyzerPlugin({
        analyzerMode: 'static'
    })
    */
  ]
};

