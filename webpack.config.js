const webpack = require('webpack');
const path = require('path');

module.exports = (env, argv) => {
    return {
        entry: './src/index.js',
        mode: env.production ? 'development' : 'production',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js'
        },
        resolve: {
            extensions: ['.js'],
        },
        performance: {
            maxEntrypointSize: 4096000,
            maxAssetSize: 4096000
        },
        devtool: (argv.env == 'production' ? 'hidden-nosources-source-map' : 'inline-source-map'),
        devServer: {
            static: {
              directory: path.join(__dirname, 'dist'),
            },
            compress: true,
            port: 9000,
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'ENV': {}//JSON.stringify(getRuntimeParameters(argv.env, argv.platform, argv))
                }
            })
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.(jpg|png|gif|svg|pdf|ico)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[path][name].[ext]',
                                publicPath: function (url) {
                                    return url.replace(/assets/, 'dist/assets')
                                },
                            },
                        }
                    ]
                }
            ]
        },
        optimization: {
            // splitChunks: {
            //     chunks: 'async',
            //     minSize: 30000,
            //     maxSize: 0,
            //     minChunks: 1,
            //     maxAsyncRequests: 5,
            //     maxInitialRequests: 3,
            //     automaticNameDelimiter: '~',
            //     name: true,
            //     cacheGroups: {
            //         vendors: {
            //             test: /[\\/]node_modules[\\/]/,
            //             priority: -10
            //         },
            //         default: {
            //             minChunks: 2,
            //             priority: -20,
            //             reuseExistingChunk: true
            //         }
            //     }
            // }
        }
    }
};