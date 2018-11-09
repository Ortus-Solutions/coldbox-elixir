const WebpackDeleteAfterEmit = require("webpack-delete-after-emit");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const path = require("path");

module.exports = function(
    filename,
    {
        name = this.withoutExtension(filename),
        outputDirectory = "includes/css/",
        entryDirectory = "resources/assets/css/"
    } = {}
) {
    this.dependencies([
        "css-loader",
        "postcss-loader",
        "url-loader",
        "file-loader"
    ]);
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
            new WebpackDeleteAfterEmit({
                globs: [
                    `${expandedOutputDirectory}/*.js`,
                    `${expandedOutputDirectory}/*.js.map`
                ]
            }),
            new CleanWebpackPlugin([expandedOutputDirectory], {
                root: global.elixir.rootPath,
                verbose: false
            })
        ]
    });
};
