const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");
const fs = require("fs");

module.exports = function cssLoaders(options = {}) {
    const cssLoader = {
        loader: "css-loader",
        options: {
            sourceMap: options.sourceMap
        }
    };

    const resolveUrlLoader = {
        loader: "resolve-url-loader"
    };

    const postcssLoader = {
        loader: "postcss-loader",
        options: {
            sourceMap: options.sourceMap
        }
    };

    const shouldUsePostCSSLoader = fs.existsSync(
        path.join(global.elixir.rootPath, "postcss.config.js")
    );

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        const loaders = [cssLoader, resolveUrlLoader];

        if (shouldUsePostCSSLoader) {
            loaders.push(postcssLoader);
        }

        if (loader) {
            loaders.push({
                loader: loader + "-loader",
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            });
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: "vue-style-loader",
                publicPath: "/"
            });
        } else {
            return ["vue-style-loader"].concat(loaders);
        }
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders("less"),
        sass: generateLoaders("sass", { indentedSyntax: true }),
        scss: generateLoaders("sass"),
        stylus: generateLoaders("stylus"),
        styl: generateLoaders("stylus")
    };
};
