const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = function(from, to) {
    if (this.dependencies(["copy-webpack-plugin"])) {
        return;
    }
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
