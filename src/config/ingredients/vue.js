const cssLoaders = require("../../utils/cssLoaders");
const webpackMerge = require("webpack-merge");

module.exports = function(
    filename,
    {
        name = this.withoutExtension(filename),
        outputDirectory = "includes/js/",
        sourceDirectory = "resources/assets/js/"
    } = {}
) {
    this.dependencies([
        "@babel/plugin-syntax-jsx",
        "babel-plugin-transform-vue-jsx",
        "babel-helper-vue-jsx-merge-props",
        "vue-loader@^14",
        "vue-template-compiler"
    ]);
    this.mergeBabelOptions({
        plugins: ["transform-vue-jsx"]
    });
    this.mergeConfig({
        resolve: {
            extensions: [".vue"]
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: "vue-loader",
                    exclude: /node_modules/,
                    options: {
                        loaders: {
                            js: [
                                webpackMerge.smart(
                                    global.elixir.config.babelOptions,
                                    {
                                        presets: [
                                            [
                                                "@babel/env",
                                                {
                                                    modules: false,
                                                    targets: {
                                                        browsers: ["> 2%"],
                                                        uglify: true
                                                    }
                                                }
                                            ]
                                        ],
                                        plugins: [
                                            "@babel/plugin-proposal-object-rest-spread"
                                        ]
                                    }
                                )
                            ],
                            ...cssLoaders(
                                // Add an entry point for each style sheet
                                {
                                    sourceMap: true,
                                    extract: global.elixir.isProduction
                                }
                            )
                        }
                    }
                }
            ]
        }
    });
    return this.js(filename, {
        name,
        outputDirectory,
        sourceDirectory
    });
};
