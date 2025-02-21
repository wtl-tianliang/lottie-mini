const { Command } = require("commander");
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const net = require("net");
const { extractImage, compressImage, imageToBase64 } = require("../lib");

const program = new Command("server");
const upload = multer({ dest: "uploads/" });

// 检查端口是否可用
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

// 查找可用端口
async function findAvailablePort(startPort) {
  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
  }
  return port;
}

program
  .description("Start a compression server from port 3000")
  .action(async () => {
    const app = express();

    // 确保上传目录存在
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }

    // 设置静态文件目录
    app.use(express.static(path.join(__dirname, "../public")));

    app.post("/compress", upload.single("file"), async (req, res) => {
      try {
        const file = req.file;

        // 读取上传的JSON文件
        const data = fs.readFileSync(file.path);
        const jsonData = JSON.parse(data);
        const assets = jsonData.assets;

        // 创建临时目录
        const tempDir = path.join(__dirname, "temp");
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir);
        }

        // 提取并压缩图片
        const images = extractImage(assets, tempDir);
        const compressTasks = images.map((image) => {
          const { id, output, ext } = image;
          const outputPath = path.join(tempDir, `compressed_${id}.${ext}`);
          return compressImage(output, outputPath, 100)
            .then(() => ({ id, outputPath }))
            .catch((err) => console.error(err));
        });

        const compressed = await Promise.all(compressTasks);

        // 更新JSON数据中的图片
        compressed.forEach((image) => {
          const { id, outputPath } = image;
          const base64 = imageToBase64(outputPath);
          const asset = assets.find((asset) => asset.id === id);
          asset.p = `data:image/png;base64,${base64}`;
        });

        // 将更新后的JSON数据作为响应返回
        res.json({ data: jsonData });

        // 删除临时目录
        fs.rmdirSync(tempDir, { recursive: true });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Compression failed" });
      }
    });

    // 重定向根路径到index.html
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    // 查找可用端口并启动服务器
    const port = await findAvailablePort(3000);
    app.listen(port, () => {
      console.log(`Compression server running at http://localhost:${port}`);
    });
  });

module.exports = program;
