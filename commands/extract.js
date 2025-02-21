const fs = require("fs");
const path = require("path");
const { Command } = require("commander");
const program = new Command("extract");
const { extractImage } = require("../lib");

program
  .argument("<source>", "Source file")
  .argument("<destination>", "Destination directory")
  .action((source, destination) => {
    // 读取文件内容
    const data = fs.readFileSync(source);
    // 解析JSON文件
    const jsonData = JSON.parse(data);
    // 获取assets数组
    const assets = jsonData.assets;

    const destinationPath = path.resolve(destination);

    extractImage(assets, destinationPath, (path) => {
      console.log(`Extracted image to ${path}`);
    });
  });

module.exports = program;
