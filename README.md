# Lottie Mini

一个用于压缩和预览 Lottie JSON 动画文件的命令行工具。

## 功能特点

- 提取 Lottie JSON 中的图片资源
- 压缩 Lottie 动画中的图片
- 提供 Web 界面预览动画效果
- 支持在线压缩服务

## 安装

确保你的 Node.js 版本 >= 18.17.0，然后执行：

```bash
npm install -g lottie-mini
```

## 使用方法

### 命令行工具

1. 提取图片资源

```bash
lottie extract <input_file> <output_dir>
```

2. 压缩动画

```bash
lottie compress <input_file> <output_file>
```

### Web 界面

启动后可以通过浏览器访问 http://localhost:3000 使用 Web 界面。

```bash
lottie server
```

#### Web 界面功能

- 文件上传：支持上传 Lottie JSON 文件
- 在线压缩：自动压缩动画中的图片资源
- 动画预览：支持预览上传的动画文件
- 播放控制：支持动画的播放/暂停

## 技术栈

- Node.js
- Express.js (Web 服务器)
- Commander.js (命令行工具)
- Sharp (图片压缩处理)
- Multer (文件上传处理)
- Lottie Web (动画渲染)
