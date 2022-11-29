const { DefinePlugin } = require( "webpack" );

function detectVersion() {
    return parseInt(require( "vue" ).version);
}

module.exports = function(
    filename,
    {
        name = this.withoutExtension(filename),
        outputDirectory = "includes/js/",
        entryDirectory = "resources/assets/js/",
        version = detectVersion()
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
    const { VueLoaderPlugin } = require( "vue-loader" );

    this.once("vue", () => {
        this.mergeBabelOptions({
            plugins: ["@vue/babel-plugin-jsx"]
        });
        this.mergeConfig({
            resolve: {
                extensions: [".vue"],
                alias: {
                    vue$: version === 3 ? "vue/dist/vue.esm-browser.js" : "vue/dist/vue.esm.js"
                }
            },
            module: {
                rules: [
                    {
                        test: /\.vue$/,
                        loader: "vue-loader",
                        options: {
                            sourceMap: true
                        },
                        exclude: file =>
                            /node_modules/.test(file) && !/\.vue\.js/.test(file)
                    }
                ]
            },
            plugins: [
                new DefinePlugin({
                    __VUE_PROD_DEVTOOLS__: global.elixir.enableDevtools || !global.elixir.isProduction,
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
