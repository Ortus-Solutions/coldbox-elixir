const { VueLoaderPlugin } = require( "vue-loader" );
import webpack from "webpack";

module.exports = function(
    filename,
    {
        name = this.withoutExtension(filename),
        outputDirectory = "includes/js/",
        entryDirectory = "resources/assets/js/"
    } = {}
) {
    if (
        this.dependencies([
            "@vue/babel-plugin-jsx",
            "vue-loader@^17"
        ])
    ) {
        return;
    }

    this.once("vue", () => {
        this.mergeBabelOptions({
            plugins: ["@vue/babel-plugin-jsx"]
        });
        this.mergeConfig({
            resolve: {
                extensions: [".vue"],
                alias: {
                    vue$: "vue/dist/vue.esm.js"
                }
            },
            module: {
                rules: [
                    {
                        test: /\.vue$/,
                        loader: "vue-loader",
                        options: {
                            sourceMap: true,
                            reactivityTransform: true

                        },
                        exclude: file =>
                            /node_modules/.test(file) && !/\.vue\.js/.test(file)
                    }
                ]
            },
            plugins: [
                new webpack.DefinePlugin({
                    __VUE_OPTIONS_API__: global.elixir.isProduction,
                    __VUE_PROD_DEVTOOLS__: !global.elixir.isProduction,
                }),
                new VueLoaderPlugin( { options: { sourceMap: true } } )
            ]
        });
    });
    return this.js(filename, {
        name,
        outputDirectory,
        entryDirectory
    });
};
