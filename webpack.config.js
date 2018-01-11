var webpack = require('webpack')

module.exports = function () {
    var setting = {
        entry: {
            "value-animator.min": "./src/index.ts"
        },
        output: {
            filename: "[name].js",
            path: __dirname + "/dist",
            libraryTarget: 'umd',
            library: 'ValueAnimator',
        },
        resolve: {
            extensions: [".ts"]
        },
        module: {
            rules: [
                { test: /\.ts?$/, loader: "awesome-typescript-loader" },
            ],
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                include: /\.min\.js$/,
                minimize: true,
                output: { comments: false },
            }),
        ],
    }
    return setting
}