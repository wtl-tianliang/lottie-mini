const fs = require("fs");
const path = require("path");
const { Command } = require("commander");
const program = new Command("compress");
const { extractImage, compressImage, imageToBase64 } = require("../lib");

program
  .argument("<source>", "Source file")
  .argument("<destination>", "Destination file")
  .action(async (source, destination) => {
    // 读取文件内容
    const data = fs.readFileSync(source);
    // 解析JSON文件
    const jsonData = JSON.parse(data);
    // 获取assets数组
    const assets = jsonData.assets;

    const tempDir = path.join(__dirname, "temp");

    const images = extractImage(assets, tempDir, (path) => {
      console.log(`Extracted image to ${path}`);
    });

    const compressTasks = images.map((image) => {
      const { id, output, ext } = image;
      const outputPath = path.join(tempDir, `compressed_${id}.${ext}`);
      return compressImage(output, outputPath, 100)
        .then(() => {
          console.log(`Compressed image(${id}) to ${outputPath}`);
          return { id, outputPath };
        })
        .catch((err) => console.log(err));
    });

    const compressed = await Promise.all(compressTasks);

    compressed.forEach((image) => {
      const { id, outputPath } = image;
      // 将图片转换为base64;
      const base64 = imageToBase64(outputPath);
      // 在assets数组中找到对应的图片
      const asset = assets.find((asset) => asset.id === id);
      // 将base64赋值给图片的p属性
      asset.p = `data:image/png;base64,${base64}`;
    });

    // 将修改后的JSON数据写入文件
    const destinationPath = path.resolve(destination);
    fs.writeFileSync(destinationPath, JSON.stringify(jsonData, null, 2));

    // 比较文件大小
    const sourceSize = fs.statSync(source).size;
    const destinationSize = fs.statSync(destinationPath).size;
    console.log(`Source size: ${sourceSize} bytes`);
    console.log(`Destination size: ${destinationSize} bytes`);

    // 删除临时目录
    console.log("Deleting temp directory...");
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

module.exports = program;
