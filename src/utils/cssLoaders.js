const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const fs = require("fs");

module.exports = function cssLoaders(options = {}) {
    const styleLoader = {
        loader: "style-loader"
    };

    const cssLoader = {
        loader: "css-loader",
        options : {
            sourceMap : true
        }
    };

    const resolveUrlLoader = {
        loader: "resolve-url-loader",
        options: {
            removeCR: true,
            root: global.elixir.rootPath
        }
    };

    const postcssLoader = {
        loader: "postcss-loader",
        options : {
            sourceMap : true
        }
    };

    const shouldUsePostCSSLoader = fs.existsSync(
        path.join(global.elixir.rootPath, "postcss.config.js")
    );

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        let loaders = [ cssLoader, resolveUrlLoader ];

        if (shouldUsePostCSSLoader) {
            loaders.push(postcssLoader);
        }

        if (loader) {
            let def = {
                loader: loader + "-loader",
                options: Object.assign( { sourceMap : true }, loaderOptions )
            };

            if( loader == 'css' ){
                def.type = "asset/source";
            }

            if( loader == 'sass' ){
                def.options[ "implementation" ] = require( "sass" );
            }

            loaders.push( def );
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return [MiniCssExtractPlugin.loader].concat(loaders);
        } else {
            return loaders;
        }
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    let styleLoaders = {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders("less"),
        // The sourceMap option has to be true for resolve-url-loader
        sass: generateLoaders("sass" ),
        scss: generateLoaders("sass" ),
        stylus: generateLoaders("stylus"),
        styl: generateLoaders("stylus")
    };
    
    return styleLoaders;
};
