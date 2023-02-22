const path = require("path");

module.exports = function(
    filename,
    {
        name = this.withoutExtension(filename),
        outputDirectory = "includes/css/",
        entryDirectory = "resources/assets/sass/"
    } = {}
) {
    this.dependencies( [ "sass", "sass-loader" ] );
    return this.css(filename, { name, outputDirectory, entryDirectory });
};
