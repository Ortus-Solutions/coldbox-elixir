const ElixirConfig = require("./config");

ElixirConfig.addIngredient("js", require("./ingredients/js"));
ElixirConfig.addIngredient("vue", require("./ingredients/vue"));

ElixirConfig.addIngredient("css", require("./ingredients/css"));
ElixirConfig.addIngredient("sass", require("./ingredients/sass"));

module.exports = ElixirConfig;
