const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const fs = require("fs");

module.exports = function(
    filename,
    {
        name = this.withoutExtension(filename),
        outputDirectory = "includes/css/",
        entryDirectory = "resources/assets/css/"
    } = {}
) {

    let dependencies = [ "css-loader" ];
    if( fs.existsSync( path.join(global.elixir.rootPath, "postcss.config.js") ) ){
        dependencies.push( "postcss-loader" );
    }
    this.dependencies( dependencies );
    
    const expandedOutputDirectory = path.join(this.prefix, outputDirectory);
    const chunkName = path.join(expandedOutputDirectory, name);
    const srcName = Array.isArray(filename)
        ? filename.map(
              file => "./" + path.join(this.prefix, entryDirectory, file)
          )
        : "./" + path.join(this.prefix, entryDirectory, filename);
    return this.mergeConfig({
        entry: {
            [chunkName]: srcName
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    [name]: {
                        name,
                        test: (m, c, entry = name) =>
                            m.constructor.name === "CssModule" &&
                            this.recursiveIssuer(m) === entry,
                        chunks: "all",
                        enforce: true
                    }
                }
            }
        },
        plugins: [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [expandedOutputDirectory]
            })
        ]
    });
};
