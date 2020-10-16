const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = function(from, to) {
    if (this.dependencies(["copy-webpack-plugin@6"])) {
        return;
    }
    const CopyWebpackPlugin = require("copy-webpack-plugin");
    return this.mergeConfig({
        plugins: [
            new CopyWebpackPlugin({ patterns: [ { from: from, to: to } ] }),
            new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [to] })
        ]
    });
};
