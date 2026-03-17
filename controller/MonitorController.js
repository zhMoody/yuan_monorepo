const os = require('os');
const res = require('../core/helper');

class MonitorController {
  // 获取服务器状态
  static async getSysInfo(ctx, next) {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const uptime = os.uptime();
    
    const data = {
      // 操作系统
      platform: os.platform(),
      // CPU 架构
      arch: os.arch(),
      // CPU 核心数
      cpuCount: os.cpus().length,
      // 内存使用率
      memory: {
        total: (totalMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        free: (freeMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        usage: ((totalMem - freeMem) / totalMem * 100).toFixed(2) + '%'
      },
      // 运行时间（秒转天小时分）
      uptime: {
        days: Math.floor(uptime / 86400),
        hours: Math.floor((uptime % 86400) / 3600),
        minutes: Math.floor((uptime % 3600) / 60)
      },
      // Node 版本
      nodeVersion: process.version
    };

    ctx.body = res.json(data);
  }
}

module.exports = MonitorController;
