const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

const plugins = [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
        template: "./src/index.html",
    }),
    new CopyPlugin({
        patterns: [{ from: './src/assets', to: 'assets' }]
    })
];

let mode = "development";
let sourceMap = "source-map";
if (process.env.NODE_ENV === "production") {
    mode = "production";
    sourceMap = 'source-map';
}


module.exports = {
    mode: mode,
    entry: "./src/index.ts",

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].[contenthash].js',
        // this places all images processed in an image folder
        assetModuleFilename: "images/[hash][ext][query]"
    },

    plugins: plugins,

    resolve: {
        extensions: [".ts", ".js"]
    },

    target: "web",
    devtool: sourceMap,

    module: {
        rules: [
            {
                test: /\.(scss|css)$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        // This is required for asset imports in CSS, such as url()
                        options: { publicPath: "" },
                    },
                    "css-loader",
                    "postcss-loader",
                    // according to the docs, sass-loader should be at the bottom, which
                    // loads it first to avoid prefixes in your sourcemaps and other issues.
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                /**
                 * The `type` setting replaces the need for "url-loader"
                 * and "file-loader" in Webpack 5.
                 *
                 * setting `type` to "asset" will automatically pick between
                 * outputing images to a file, or inlining them in the bundle as base64
                 * with a default max inline size of 8kb
                 */
                type: "asset"

                /**
                 * If you want to inline larger images, you can set
                 * a custom `maxSize` for inline like so:
                 */
                // parser: {
                //   dataUrlCondition: {
                //     maxSize: 30 * 1024,
                //   },
                // },
            },
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader"
                }
            }
        ]
    },

    devServer: {
        contentBase: "./dist",
        hot: true
    }
};

