const elixir = require("../../../index");
const path = require("path");

beforeEach(() => {
    elixir.config.reset();
});

test("it can add javascript entries to a webpack config", () => {
    const actual = elixir(mix => {
        mix.js("app.js");
    });
    expect(actual).toMatchObject({
        entry: {
            "includes/js/app": path.resolve(
                global.elixir.rootPath,
                "./resources/assets/js/app.js"
            )
        }
    });
});

test("it can override the output name for the entry", () => {
    const actual = elixir(mix => {
        mix.js("app.js", { name: "foo" });
    });
    expect(actual).toMatchObject({
        entry: {
            "includes/js/foo": path.resolve(
                global.elixir.rootPath,
                "./resources/assets/js/app.js"
            )
        }
    });
    expect(actual).not.toMatchObject({
        entry: {
            "includes/js/app": path.resolve(
                global.elixir.rootPath,
                "resources/assets/js/app.js"
            )
        }
    });
});

test("it can override the output directory for the entry", () => {
    const actual = elixir(mix => {
        mix.js("app.js", { outputDirectory: "includes/scripts" });
    });
    expect(actual).toMatchObject({
        entry: {
            "includes/scripts/app": path.resolve(
                global.elixir.rootPath,
                "./resources/assets/js/app.js"
            )
        }
    });
});

test("it can override the source directory for the entry", () => {
    const actual = elixir(mix => {
        mix.js("app.js", { entryDirectory: "resources/assets/scripts" });
    });
    expect(actual).toMatchObject({
        entry: {
            "includes/js/app": path.resolve(
                global.elixir.rootPath,
                "./resources/assets/scripts/app.js"
            )
        }
    });
});
