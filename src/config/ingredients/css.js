const path = require("path");

module.exports = function(
    filename,
    {
        name = this.withoutExtension(filename),
        outputDirectory = "includes/css/",
        entryDirectory = "resources/assets/css/"
    } = {}
) {
    this.dependencies(["css-loader", "postcss-loader"]);
    const chunkName = path.join(this.prefix, outputDirectory, name);
    const srcName = Array.isArray(filename)
        ? filename.map(
              file => "./" + path.join(this.prefix, entryDirectory, file)
          )
        : "./" + path.join(this.prefix, entryDirectory, filename);
    return this.mergeConfig({
        entry: {
            [chunkName]: srcName
        }
    });
};
