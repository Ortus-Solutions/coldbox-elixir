const elixir = require("./index");
const defaultConfig = require("./defaultConfig.js");
const path = require("path");

test("it returns the base configuration object when no methods are called inside the function", () => {
    const actual = elixir();
    const expected = defaultConfig();

    // we delete plugins here since they generate new
    // instances on the fly and will never be equal.
    delete actual["plugins"];
    delete expected["plugins"];

    expect( JSON.stringify( actual ) ).toEqual( JSON.stringify( expected ) );
});

test("it can accept an override for the base configuration object", () => {
    const overrideConfig = {
        entry: "src/index.js",
        output: {
            path: path.join(__dirname, "dist"),
            filename: "bundle.js"
        }
    };
    expect(elixir(() => {}, overrideConfig)).toEqual(overrideConfig);
});

