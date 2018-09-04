const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = function(
    filename,
    {
        name = this.withoutExtension(filename),
        outputDirectory = "includes/js/",
        sourceDirectory = "resources/assets/js/"
    } = {}
) {
    this.dependencies([
        "@babel/plugin-syntax-jsx@^7",
        "babel-plugin-transform-vue-jsx@next",
        "babel-helper-vue-jsx-merge-props@^2",
        "vue-loader@^15",
        "vue-template-compiler"
    ]);
    this.mergeBabelOptions({
        plugins: ["babel-plugin-transform-vue-jsx"]
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
    return this.js(filename, {
        name,
        outputDirectory,
        sourceDirectory
    });
};
