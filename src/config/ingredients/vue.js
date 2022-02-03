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
            "vue-loader@^17",
            "@vue/compiler-sfc"
        ])
    ) {
        return;
    }

    let VueLoaderPlugin = class EmptyVueLoaderPlugin {};
    try {
        VueLoaderPlugin = require("vue-loader/lib/plugin");
    } catch (e) {
        try {
            require( "vue-loader" );
        } catch (e) {
            console.error(`vue-loader 17+ is required for use with this library
but we weren't able to load it.
You probably have an old version of vue-loader installed.
Make sure all old versions are uninstalled and then try again.`);
        }
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
                        exclude: file =>
                            /node_modules/.test(file) && !/\.vue\.js/.test(file)
                    }
                ]
            },
            plugins: [new VueLoaderPlugin()]
        });
    });
    return this.js(filename, {
        name,
        outputDirectory,
        entryDirectory
    });
};
