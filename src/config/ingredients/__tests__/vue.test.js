const elixir = require("../../../index");
const cssLoaders = require("../../../utils/cssLoaders");

beforeEach(() => {
    elixir.config.reset();
});

test("it ensures the required dependencies are installed", () => {
    elixir.config.installMissingDependencies = () => {};
    const actual = elixir(mix => {
        mix.vue("app.js");
    });
    expect(elixir.config.missingDependencies).toEqual([
        "babel-plugin-syntax-jsx",
        "babel-plugin-transform-vue-jsx",
        "babel-helper-vue-jsx-merge-props",
        "vue-loader",
        "vue-template-compiler"
    ]);
});

test("it configures vue correctly in the config", () => {
    elixir.config.installMissingDependencies = () => {};
    const actual = elixir(mix => {
        mix.vue("app.js");
    });
    expect(actual.module.rules).toContainEqual({
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
            loaders: cssLoaders(
                // Add an entry point for each style sheet
                {
                    sourceMap: true,
                    extract: global.elixir.isProduction
                }
            )
        }
    });
});
