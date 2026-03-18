const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 使用 process.cwd() 确保路径相对于项目根目录，无论是源码还是打包后的 dist
const configDir = path.join(process.cwd(), 'config');
const privateKeyPath = path.join(configDir, 'private_key.pem');
const publicKeyPath = path.join(configDir, 'public_key.pem');

/**
 * 确保配置目录存在
 */
function ensureConfigDir() {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
}

/**
 * 生成并保存 RSA 密钥对
 */
function generateRSAKeys() {
  console.log('Generating new RSA key pair...');
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  fs.writeFileSync(privateKeyPath, privateKey);
  fs.writeFileSync(publicKeyPath, publicKey);
  console.log('RSA keys generated and saved to config directory.');
}

/**
 * 初始化密钥
 */
function initKeys() {
  ensureConfigDir();

  const hasPrivateKey = fs.existsSync(privateKeyPath);
  const hasPublicKey = fs.existsSync(publicKeyPath);

  if (!hasPrivateKey || !hasPublicKey) {
    generateRSAKeys();
  } else {
    console.log('RSA keys already exist, skipping generation.');
  }
}

/**
 * 获取公钥内容
 */
function getPublicKey() {
  if (fs.existsSync(publicKeyPath)) {
    return fs.readFileSync(publicKeyPath, 'utf8');
  }
  return null;
}

module.exports = {
  initKeys,
  getPublicKey
};
