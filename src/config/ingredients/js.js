const path = require("path");

module.exports = function(
    filename,
    {
        name = this.withoutExtension(filename),
        outputDirectory = "includes/js/",
        entryDirectory = "resources/assets/js/"
    } = {}
) {
    const chunkName = path.join(this.prefix, outputDirectory, name);
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
        }
    });
};
