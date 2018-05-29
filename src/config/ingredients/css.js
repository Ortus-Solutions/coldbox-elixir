const path = require("path");
const WebpackDeleteAfterEmit = require("webpack-delete-after-emit");

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
            })
        ]
    });
};
