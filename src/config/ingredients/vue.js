const { DefinePlugin } = require( "webpack" );

function detectVersion() {
    try{
        return parseInt( require( "vue" ).version );
    } catch( ex ){
        return null;
    }
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
    var deps = [
        "@vue/babel-plugin-jsx",
        "vue-loader@^17"
    ];
    if( !version ){
        deps.push( "vue" );
    }
    if (
        this.dependencies( deps )
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
                    vue$: version === 3 ? "vue/dist/vue.esm-bundler.js" : "vue/dist/vue.esm.js"
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
                    __VUE_OPTIONS_API__: global.elixir.enableOptionsApi || "true",
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
