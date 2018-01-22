const cssLoaders = require("./cssLoaders");

// Generate loaders for standalone style files (outside of .vue)
module.exports = function styleLoaders(options) {
    const output = [];
    const loaders = cssLoaders(options);

    for (const extension in loaders) {
        const loader = loaders[extension];
        output.push({
            test: new RegExp("\\." + extension + "$"),
            use: loader
        });
    }

    return output;
};
