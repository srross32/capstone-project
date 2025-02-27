
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const { EsbuildPlugin } = require('esbuild-loader');
module.exports = (env) => {
  let mode = env.env || 'development';
  const plugins = [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[fullhash][contenthash].css'
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ];
  return {
    entry: path.resolve(__dirname, 'src/index.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename:
        mode === 'production'
          ? 'bundle.[fullhash][contenthash].js'
          : '[name].js',
      publicPath: '/',
      clean: true
    },
    optimization: {
      minimize: mode === 'production',
      minimizer: [
        new EsbuildPlugin({
          target: 'es2015',
          css: true,
          minify: mode === 'production'
        })
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      symlinks: false
    },
    mode: mode,
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'esbuild-loader',
          include: path.resolve(__dirname, 'src'),
          options: {
            loader: 'jsx',
            target: 'es2015'
          }
        },
        {
          test: /\.tsx?$/,
          loader: mode === 'production' ? 'esbuild-loader' : 'ts-loader',
          include: path.resolve(__dirname, 'src'),
          options:
            mode === 'production'
              ? {
                  loader: 'tsx',
                  target: 'es2015'
                }
              : {}
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            mode === 'production'
              ? MiniCssExtractPlugin.loader
              : 'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  quietDeps: true
                }
              }
            }
          ],
          generator: {
            filename: '[contenthash].css'
          },
          include: path.resolve(__dirname, 'src')
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          type: 'asset/resource',
          generator: {
            filename: '[contenthash][ext]'
          },
          include: path.resolve(__dirname, 'src')
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: '[contenthash][ext]'
          },
          include: path.resolve(__dirname, 'src')
        }
      ]
    },
    plugins: plugins,
    devServer: {
      server: {
        options: {
          contentBase: path.resolve(__dirname, 'dist'),
          publicPath: '/'
        }
      },
      compress: true,
      historyApiFallback: true
    },
    devtool: mode === 'development' ? 'eval-cheap-module-source-map' : false,
  };
};