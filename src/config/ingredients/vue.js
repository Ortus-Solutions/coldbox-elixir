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

    // paths are declared out here to avoid `this` changing from under us
    const fullOutputPath =
        this.prefix + outputDirectory.replace("/js/", "/css/");
    const fullSourcePath = this.prefix + sourceDirectory;
    this.mergeConfig({
        optimization: {
            splitChunks: {
                cacheGroups: {
                    [fullOutputPath + name]: {
                        name: fullOutputPath + name,
                        test: (m, c, entry = name) => {
                            return (
                                m.constructor.name === "CssModule" &&
                                this.recursiveIssuer(m).includes(
                                    fullSourcePath + filename
                                )
                            );
                        },
                        chunks: "all",
                        enforce: true
                    }
                }
            }
        }
    });
    this.once("vue", () => {
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
    });
    return this.js(filename, {
        name,
        outputDirectory,
        sourceDirectory
    });
};
