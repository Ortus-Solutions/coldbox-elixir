module.exports = function(
    filename,
    {
        name = this.withoutExtension(filename),
        outputDirectory = "includes/js/",
        sourceDirectory = "resources/assets/js/"
    } = {}
) {
    if (
        this.dependencies([
            "@babel/plugin-syntax-jsx@^7",
            "@vue/babel-plugin-transform-vue-jsx@^1",
            "@vue/babel-helper-vue-jsx-merge-props@^1",
            "vue-loader@^15",
            "vue-template-compiler"
        ])
    ) {
        return;
    }

    let VueLoaderPlugin = class EmptyVueLoaderPlugin {};
    try {
        VueLoaderPlugin = require("vue-loader/lib/plugin");
    } catch (e) {
        try {
            require("vue-loader");
            console.error(`vue-loader 15+ is required for use with this library
but we weren't able to load it.
You probably have an old version of vue-loader installed.
Make sure all old versions are uninstalled and then try again.`);
        } catch (e) {}
    }

    this.once("vue", () => {
        this.mergeBabelOptions({
            plugins: ["@vue/babel-plugin-transform-vue-jsx"]
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
        sourceDirectory
    });
};
