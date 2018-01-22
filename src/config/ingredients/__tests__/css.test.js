const elixir = require("../../../index");

beforeEach(() => {
    elixir.config.reset();
});

test("it can add javascript entries to a webpack config", () => {
    const actual = elixir(mix => {
        mix.css("app.css");
    });
    expect(actual).toMatchObject({
        entry: { "includes/css/app": "./resources/assets/css/app.css" }
    });
});

test("it can override the output name for the entry", () => {
    const actual = elixir(mix => {
        mix.css("app.css", { name: "foo" });
    });
    expect(actual).toMatchObject({
        entry: { "includes/css/foo": "./resources/assets/css/app.css" }
    });
    expect(actual).not.toMatchObject({
        entry: { "includes/css/app": "./resources/assets/css/app.css" }
    });
});

test("it can override the output directory for the entry", () => {
    const actual = elixir(mix => {
        mix.css("app.css", { outputDirectory: "includes/scripts" });
    });
    expect(actual).toMatchObject({
        entry: { "includes/scripts/app": "./resources/assets/css/app.css" }
    });
});

test("it can override the source directory for the entry", () => {
    const actual = elixir(mix => {
        mix.css("app.css", { entryDirectory: "resources/assets/stylesheets" });
    });
    expect(actual).toMatchObject({
        entry: { "includes/css/app": "./resources/assets/stylesheets/app.css" }
    });
});
