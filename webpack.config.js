const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        styles: './public/styles/styles.css'
    },
    output: {
        path: path.join(__dirname, './public/build'),
        filename: isProduction ? '[name].[hash].js' : '[name].trunk.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: 'inline',
                                plugins: function () {
                                    return [
                                        require('autoprefixer'),
                                        require('postcss-import'),
                                        require('postcss-custom-properties')({preserve: 'computed'})
                                    ];
                                }
                            }
                        }
                    ]
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin(isProduction ? '[name].[hash].css' : '[name].trunk.css'),
    ]

};
