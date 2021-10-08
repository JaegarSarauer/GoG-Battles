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
            fallback: { 
                "stream": require.resolve("stream-browserify"),
                "crypto": require.resolve("crypto-browserify"),
                "http": require.resolve("stream-http"),
                "https": require.resolve("https-browserify"),
                "os": require.resolve("os-browserify/browser")
             }
        },
        performance: {
            maxEntrypointSize: 40960000,
            maxAssetSize: 40960000
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
            }),
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
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