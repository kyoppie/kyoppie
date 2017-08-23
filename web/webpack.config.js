var webpack = require("webpack")

module.exports = {
    entry: "./src/static/tags/index",
    output: {
        path: __dirname+"/dist",
        filename: "bundle.js"
    },
    plugins:[
        new webpack.ProvidePlugin({
            riot: 'riot'
        })
    ],
    module: {
        loaders: [
            {
                test: /\.tag$/,
                exclude: /node_modules/,
                loader: 'riot-tag-loader',
                query: {
                    type: "none",
                    template: "pug"
                }
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.tag']
    },
}
