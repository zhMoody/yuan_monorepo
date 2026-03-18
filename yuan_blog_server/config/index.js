module.exports = {
  host: "http://127.0.0.1",
  // 服务器的端口，写在配置文件中，后面好修改
  port: 3000,
  // 基础路径，部署时请修改为实际域名或 IP
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
  // mongodb数据库相关配置
  db: {
    // 数据库的端口  mongodb默认就是27017
    port: process.env.DB_PORT || 27017,
    // 数据库的地址，支持从环境变量读取，默认为本地
    host: process.env.DB_HOST || "127.0.0.1",
    // 数据库名称，没有会自动创建
    dbName: process.env.DB_NAME || "yuanblog",
  },
  // 签证配置
  security: {
    // 密钥
    secretKey: "secretKey",
    // 过期时间
    expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  },
};
