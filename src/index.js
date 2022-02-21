const defaultConfig = require("./defaultConfig");
const ElixirConfig = require("./config/index");
const path = require("path");

function elixir(recipe = () => {}, baseConfig) {
    recipe(elixir.config);
    elixir.config.installMissingDependencies();
    baseConfig = baseConfig || defaultConfig();
    return elixir.config.generateFrom(baseConfig);
}

elixir.isProduction = global.process.argv.includes( "production" );
elixir.rootPath = path.resolve(__dirname, "../../../");
elixir.config = new ElixirConfig();
elixir.versioning = elixir.isProduction;
elixir.manifestFileName = "includes/rev-manifest.json";
elixir.runtimeFileNameWithoutExtension = "includes/js/runtime";
elixir.vendorChunkFileNameWithoutExtension = "includes/js/vendor";

module.exports = global.elixir = elixir;
