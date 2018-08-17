const cssLoaders = require("../../utils/cssLoaders");

module.exports = function(
    filename,
    {
        name = this.withoutExtension(filename),
        outputDirectory = "includes/js/",
        sourceDirectory = "resources/assets/js/"
    } = {}
) {
    this.dependencies([
        "babel-plugin-syntax-jsx",
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
                                {
                                    loader: "babel-loader",
                                    options: {
                                        presets: ["env"],
                                        plugins: [
                                            "transform-object-rest-spread"
                                        ]
                                    }
                                }
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
