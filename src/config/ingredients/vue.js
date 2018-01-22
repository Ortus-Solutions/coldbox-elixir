const path = require("path");
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
        "vue-loader",
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
                    options: {
                        loaders: cssLoaders(
                            // Add an entry point for each style sheet
                            {
                                sourceMap: true,
                                extract: global.elixir.isProduction
                            }
                        )
                    }
                }
            ]
        }
    });
    return this.js(filename, { name, outputDirectory, sourceDirectory });
};
