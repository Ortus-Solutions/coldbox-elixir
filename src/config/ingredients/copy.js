const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const path = require("path");

module.exports = function(from, to) {
    if (this.dependencies(["copy-webpack-plugin@10.2.4"])) {
        return;
    }
    const CopyWebpackPlugin = require("copy-webpack-plugin");
    let fromPath = from.substring( 0, 1 ) == "/"
                    ? from
                    : path.resolve(
                        global.elixir.rootPath,
                        this.prefix,
                        from
                    );
    let toPath = to.substring( 0, 1 ) == "/"
                    ? to
                    : path.resolve(
                        global.elixir.rootPath,
                        this.prefix,
                        to
                    );;
    return this.mergeConfig({
        plugins: [
            new CopyWebpackPlugin({ patterns: [ { from: fromPath, to: toPath } ] }),
            new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [to] })
        ]
    });
};
