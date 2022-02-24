const elixir = require("../../../index");
const cssLoaders = require("../../../utils/cssLoaders");

beforeEach(() => {
    elixir.config.reset();
});

test("it ensures the required dependencies are installed", () => {
    elixir.config.installMissingDependencies = () => {};
    const actual = elixir(mix => {
        mix.sass("app.css");
    });
    expect(elixir.config.missingDependencies).toEqual([
        "sass",
        "sass-loader"
    ]);
});

test("it configures sass correctly in the config", () => {
    elixir.config.installMissingDependencies = () => {};
    const actual = elixir(mix => {
        mix.sass("app.scss");
    });
    expect(
        actual.module.rules.filter(rule => rule.test === /\.sass$/)
    ).toBeTruthy();
    expect(
        actual.module.rules.filter(rule => rule.test === /\.scss$/)
    ).toBeTruthy();
});
