FROM docker.1ms.run/node:18.17.0-alpine

WORKDIR /app

# 使用阿里云的 Alpine 镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

COPY package*.json ./
# 使用淘宝 NPM 镜像源安装依赖
RUN npm install --cpu=x64 --os=linux --registry=https://registry.npmmirror.com sharp

COPY . .

EXPOSE 3000

CMD ["node", "cli.js", "server"]