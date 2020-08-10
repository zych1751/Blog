const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = (env, options) => {
  return {
    entry: [
      'babel-polyfill',
      './src/index.js',
    ],

    output: {
      publicPath: '/',
      filename: './main.js',
    },

    resolve: {
      extensions: ['.js', '.jsx'],
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },

        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: {
            loader: 'file-loader',
            options: {
              name: 'public/img/[name].[ext]',
              outputPath: 'dist/img/',
            },
          },
        },

        {
          test: /\.(scss)$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.html$/,
          use: {
            loader: 'html-loader',
            options: {
              minimize: true,
            },
          },
        },
        {
          test: /\.(otf|ttf|eot|woff|woff2)$/,
          loader: 'file-loader',
          options: {
            name: 'public/fonts/[name].[ext]',
            outputPath: 'dist/fonts',
          },
        },
      ],
    },

    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: './resources/index.html',
        filename: './index.html',
        hash: true,
      }),
      new webpack.DefinePlugin({
        API_SERVER_URL:
          ((options.mode === 'development')
            ? JSON.stringify('http://localhost:1234')
            : JSON.stringify('https://zychspace.com'))
      })
    ],
    devServer: {
      historyApiFallback: true,
      publicPath: '/',
      contentBase: './dist',
    }
  };
};
