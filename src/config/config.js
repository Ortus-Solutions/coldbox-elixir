const CleanWebpackPlugin = require("clean-webpack-plugin");
const detectInstalled = require("detect-installed");
const exec = require("child_process").execSync;
const webpackMerge = require("webpack-merge");
const path = require("path");
const fs = require("fs");

class ElixirConfig {
    constructor() {
        this.config = {};
        this.babelOptions = {};
        this.missingDependencies = new Set();
        this.prefix = "";
        this.onces = new Set();
        return this;
    }

    static addIngredient(name, func, force = false) {
        if (ElixirConfig.prototype[name] && !force) {
            throw new Error(
                `There is already a recipe named [${name}]. Pass \`true\` as the third argument to overwrite.`
            );
        }
        ElixirConfig.prototype[name] = func;
        return this;
    }

    module(
        location,
        { folderName = "modules_app", fileName = "elixir-module" } = {}
    ) {
        const oldPrefix = this.prefix;
        this.prefix = path.join(this.prefix, folderName, location, path.sep);
        const moduleRecipe = require(path.resolve(
            global.elixir.rootPath,
            this.prefix,
            fileName
        ));
        moduleRecipe(this);
        const name = this.prefix
            .split(path.sep)
            .filter(s => s !== "")
            .filter(s => s !== folderName)
            .join(path.sep);
        this.mergeConfig({
            resolve: {
                alias: {
                    [`@${name}`]: path.resolve(
                        global.elixir.rootPath,
                        `./${this.prefix}/resources/assets/js`
                    )
                }
            },
            plugins: [
                new CleanWebpackPlugin(
                    [`${this.prefix}includes/js`, `${this.prefix}includes/css`],
                    { root: global.elixir.rootPath, verbose: false }
                )
            ]
        });
        this.prefix = oldPrefix;
        return this;
    }

    modules({
        includes = ["modules_app"],
        excludes = [],
        fileName = "elixir-module.js"
    } = {}) {
        if (!Array.isArray(includes)) {
            includes = [includes];
        }

        if (!Array.isArray(excludes)) {
            excludes = [excludes];
        }

        includes.forEach(baseDir => {
            // needs to handle recursive searching
            let modules = fs
                .readdirSync(path.resolve(this.prefix, baseDir))
                .filter(file =>
                    fs
                        .statSync(path.resolve(this.prefix, baseDir, file))
                        .isDirectory()
                )
                .filter(dir => excludes.indexOf(dir) < 0)
                .filter(dir =>
                    fs.existsSync(
                        path.join(this.prefix, baseDir, dir, fileName)
                    )
                );

            modules.forEach(module => {
                this.module(module, {
                    folderName: baseDir,
                    fileName: this.withoutExtension(fileName)
                });
            });
        });
    }

    themes() {
        return this.modules({
            includes: ["modules_app/contentbox-custom/_themes"],
            fileName: "elixir-theme.js"
        });
    }

    contentbox() {
        return this.modules({
            includes: ["modules_app/contentbox-custom/_modules"]
        });
    }

    mergeConfig(config) {
        this.config = webpackMerge.smart(this.config, config);
        return this;
    }

    recursiveIssuer(m) {
        if (m.issuer) {
            return this.recursiveIssuer(m.issuer);
        } else if (m.name) {
            return m.name;
        } else {
            return m.nameForCondition();
        }
    }

    generateFrom(config) {
        return webpackMerge.smart(config, this.config);
    }

    dependencies(deps) {
        let anyMissing = false;
        deps.forEach(dep => {
            // account for package names that start with an `@`
            const packageParts = dep.split("@");
            let packageName = packageParts[0];
            if (dep.startsWith("@")) {
                packageName = "@" + packageParts[1];
            }
            const moduleFound = detectInstalled.sync(packageName, {
                local: true
            });
            if (!moduleFound) {
                anyMissing = true;
                this.missingDependencies.add(dep);
            }
        });
        return anyMissing;
    }

    installMissingDependencies() {
        if (this.missingDependencies.size !== 0) {
            console.log(
                "Installing missing dependencies.  This will only happen once."
            );
            console.log(
                [...this.missingDependencies].map(dep => "+ " + dep).join("\n")
            );

            const dependencies = [...this.missingDependencies].join(" ");
            let command = `npm install ${dependencies} --save-dev`;

            if (fs.existsSync("yarn.lock")) {
                command = `yarn add ${dependencies} --dev`;
            }

            exec(command);

            console.log(
                "Dependencies installed.  Please run ColdBox Elixir again."
            );
            process.exit(1);
        }
        return this;
    }

    mergeBabelOptions(options) {
        this.babelOptions = webpackMerge(this.babelOptions, options);
        return this;
    }

    withoutExtension(name) {
        return name
            .split(".")
            .slice(0, -1)
            .join(".");
    }

    once(key, callback) {
        if (!this.onces.has(key)) {
            this.onces.add(key);
            callback();
        }
    }

    reset() {
        this.config = {};
        this.missingDependencies.clear();
        this.prefix = "";
        this.onces = new Set();
        return this;
    }
}

module.exports = ElixirConfig;
