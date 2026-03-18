const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 读取私钥，相对于项目根目录
const privateKey = fs.readFileSync(path.join(process.cwd(), 'config/private_key.pem'), 'utf8');

/**
 * RSA 解密
 * @param {string} encryptedData 加密后的数据（base64格式）
 * @returns {string} 解密后的明文
 */
function decrypt(encryptedData) {
  try {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
        mgf1Hash: 'sha256', // 显式指定 MGF1 哈希
      },
      buffer
    );
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new global.errs.ParameterException('密码格式不正确或解密失败');
  }
}

module.exports = {
  decrypt
};
