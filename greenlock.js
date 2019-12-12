"use strict";

var pkg = require("./package.json");
module.exports = require("greenlock").create({
    packageAgent: pkg.name + "/" + pkg.version,
    maintainerEmail: pkg.author,
    packageRoot: __dirname
});