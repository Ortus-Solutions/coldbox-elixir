const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = function(from, to) {
    this.dependencies(["copy-webpack-plugin"]);
    const CopyWebpackPlugin = require("copy-webpack-plugin");
    return this.mergeConfig({
        plugins: [
            new CopyWebpackPlugin([{ from, to }]),
            new CleanWebpackPlugin([to], {
                root: global.elixir.rootPath,
                verbose: false
            })
        ]
    });
};
