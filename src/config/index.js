const ElixirConfig = require("./config");

ElixirConfig.addIngredient("js", require("./ingredients/js"));
ElixirConfig.addIngredient("vue", require("./ingredients/vue"));
ElixirConfig.addIngredient("css", require("./ingredients/css"));
ElixirConfig.addIngredient("sass", require("./ingredients/sass"));
ElixirConfig.addIngredient("copy", require("./ingredients/copy"));
ElixirConfig.addIngredient("browserSync", require("./ingredients/browserSync"));
ElixirConfig.addIngredient("env", require("./ingredients/env"));

module.exports = ElixirConfig;
