const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');

module.exports = {
    entry: {
        styles: './public/styles/styles.css'
    },
    output: {
        path: path.join(__dirname, './public/build'),
        filename: '[name].trunk.js',
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
                                        require('postcss-import'),
                                        require('postcss-custom-properties')({preserve: 'computed'}),
                                        // require('postcss-cssnext')
                                        require('autoprefixer'),
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
        new ExtractTextPlugin('[name].[hash].css'),
        new StatsPlugin('stats.json', {
            modules: false,
            chunks: false,
            assets: false,
            version: false,
            errorDetails: false,
        })
    ]

};
