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
    expect( Array.from( elixir.config.missingDependencies ) ).toEqual([
        "@vue/babel-plugin-jsx",
        "vue-loader@^17",
        "vue"
    ]);
});

// This equality test no longer works for Vue 3 and should be refactored
xtest("it configures vue correctly in the config", () => {
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
