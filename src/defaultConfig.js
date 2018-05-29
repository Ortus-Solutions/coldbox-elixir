const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanObsoleteChunks = require("webpack-clean-obsolete-chunks");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const NpmInstallPlugin = require("npm-install-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const styleLoaders = require("./utils/styleLoaders");
const webpackMerge = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");
const fs = require("fs");

const dotEnvFile = path.resolve(process.cwd(), ".env");
if (fs.existsSync(dotEnvFile)) {
    require("dotenv").config({
        path: dotEnvFile
    });
}

module.exports = () => ({
    mode: global.elixir.isProduction ? "production" : "development",
    output: {
        path: global.elixir.rootPath,
        publicPath: "/",
        filename: global.elixir.versioning
            ? "[name].[chunkhash].js"
            : "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: webpackMerge.smart(global.elixir.config.babelOptions, {
                    presets: [
                        [
                            "env",
                            {
                                modules: false,
                                targets: {
                                    browsers: ["> 2%"],
                                    uglify: true
                                }
                            }
                        ]
                    ],
                    plugins: ["transform-object-rest-spread"]
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: global.elixir.versioning
                        ? "includes/images/[name].[hash:7].[ext]"
                        : "includes/images/[name].[ext]"
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: global.elixir.versioning
                        ? "includes/media/[name].[hash:7].[ext]"
                        : "includes/media/[name].[ext]"
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: global.elixir.versioning
                        ? "includes/fonts/[name].[hash:7].[ext]"
                        : "includes/fonts/[name].[ext]"
                }
            }
        ].concat(
            styleLoaders({
                sourceMap: true,
                extract: true,
                usePostCSS: fs.existsSync(
                    path.join(global.elixir.rootPath, "postcss.config.js")
                )
            })
        )
    },
    devtool: global.elixir.isProduction
        ? "#source-map"
        : "cheap-module-eval-source-map",
    resolve: {
        extensions: [".js", ".vue", ".json"],
        alias: {
            vue$: "vue/dist/vue.esm.js",
            "@": path.join(global.elixir.rootPath, "resources/assets/js")
        }
    },
    plugins: [
        new ProgressBarPlugin(),
        // add these based on what features are enabled
        new CleanWebpackPlugin(
            [
                "includes/js",
                "includes/css",
                "includes/fonts",
                "includes/media",
                "includes/images"
            ],
            {
                root: global.elixir.rootPath,
                verbose: false
            }
        ),
        new CleanObsoleteChunks({
            verbose: false
        }),
        new ManifestPlugin({
            fileName: "includes/manifest.json"
        }),
        new MiniCssExtractPlugin({
            filename: global.elixir.versioning
                ? "[name].[contenthash].css"
                : "[name].css"
        }),
        new webpack.DefinePlugin({
            // stringify each value so webpack doesn't insert variables instead of strings
            "process.env": Object.keys(process.env).reduce((obj, key) => {
                obj[key] = JSON.stringify(process.env[key]);
                return obj;
            }, {})
        })
    ],
    stats: {
        children: false
    },
    optimization: {
        splitChunks: {
            cacheGroups: {}
        },
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty"
    }
});
