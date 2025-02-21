#!/usr/bin/env node
const { version, description } = require("./package.json");
const { Command } = require("commander");
const program = new Command();
const extract = require("./commands/extract");
const compress = require("./commands/compress");
const server = require("./commands/server");

program.name("lottie").version(version).description(description);

program.addCommand(extract);
program.addCommand(compress);
program.addCommand(server);

program.parse();
