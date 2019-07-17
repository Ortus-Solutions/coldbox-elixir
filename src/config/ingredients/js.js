const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = function(
    filename,
    {
        name = this.withoutExtension(filename),
        outputDirectory = "includes/js/",
        entryDirectory = "resources/assets/js/"
    } = {}
) {
    const chunkPath = path.join(this.prefix, outputDirectory);
    const chunkName = path.join(chunkPath, name);
    const srcName = Array.isArray(filename)
        ? filename.map(file =>
              path.resolve(
                  global.elixir.rootPath,
                  this.prefix,
                  entryDirectory,
                  file
              )
          )
        : path.resolve(
              global.elixir.rootPath,
              this.prefix,
              entryDirectory,
              filename
          );

    return this.mergeConfig({
        entry: {
            [chunkName]: srcName
        },
        plugins: [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [chunkPath]
            })
        ]
    });
};
