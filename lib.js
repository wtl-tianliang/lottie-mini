// 引入fs模块，用于文件操作
const fs = require("fs");
// 引入path模块，用于路径操作
const path = require("path");
// 引入sharp模块，用于图像处理
const sharp = require("sharp");
// 定义正则表达式，用于匹配base64字符串中的mimetype
const mimetypeRegx = /data:(.*?);base64/;

// 将base64字符串转换为图像文件
function base64ToImage(base64String, path) {
  // 将base64字符串转换为Buffer对象
  const buffer = Buffer.from(base64String, "base64");
  // 将Buffer对象写入文件
  fs.writeFileSync(path, buffer);
}

// 将图像文件转换为base64字符串
function imageToBase64(imagePath) {
  // 读取图像文件
  const buffer = fs.readFileSync(imagePath);
  // 将Buffer对象转换为base64字符串
  const base64String = buffer.toString("base64");
  // 返回base64字符串
  return base64String;
}

// 从assets中提取图像文件，并保存到指定目录
function extractImage(assets, dir, callback) {
  // 如果目录不存在，则创建目录
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  // 定义结果数组
  const result = [];
  // 遍历assets数组
  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    // 获取base64字符串
    const base64 = asset.p;
    // 获取id
    const id = asset.id;
    // 如果base64字符串存在
    if (base64) {
      // 将base64字符串分割为前缀和数据
      const [prefix, data] = base64.split(",");
      // 使用正则表达式匹配mimetype
      const match = mimetypeRegx.exec(prefix);
      // 如果匹配成功
      if (match) {
        const [, mimetype] = match;
        const [, ext] = mimetype.split("/");
        const fileName = `${id}.${ext}`;
        const output = path.join(dir, fileName);
        base64ToImage(data, output);
        callback && callback(output);
        result.push({ id, output, ext });
      }
    }
  }
  return result;
}

// 压缩图片函数
// 参数：imagePath：图片路径，outputPath：输出路径，quality：质量
function compressImage(imagePath, outputPath, quality) {
  // 使用sharp库压缩图片
  return sharp(imagePath)
    // 设置png格式，质量为quality，压缩级别为9
    .png({ quality: quality, compressionLevel: 9 })
    // 输出压缩后的图片到outputPath路径
    .toFile(outputPath);
}


module.exports = {
  base64ToImage,
  imageToBase64,
  extractImage,
  compressImage
}